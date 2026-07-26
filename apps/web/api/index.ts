import 'dotenv/config';
import cors from "cors"
import express from "express";
import {tavily} from '@tavily/core';

import { PROMPT_TEMPLATE } from "./prompt";
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { SYSTEM_PROMPT } from "./prompt";
import { prisma } from './db';
import { middleware } from './middlerware';

const app=express();
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

app.use(express.json());
app.use(cors());
const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_KEY || ''
});

const mistralProvider = createMistral({
  apiKey: process.env.MISTRAL_AI_KEY || ''
});

async function generateWithFallback(promptText:string, systemText:string){
   try{
      console.log("Trying with the google api");

      if(!process.env.GOOGLE_AI_KEY){
        throw new Error("Missing Google api key"); 
      }

      return streamText({
      model: googleProvider('gemini-3.5-flash'),
      prompt: promptText,
      system: systemText
    });

   }
   catch(error){
      console.error("Google failed! Triggering failover to Mistral.", error);
    
    // The silent failover model
    return streamText({
      model: mistralProvider('mistral-large-latest'),
      prompt: promptText,
      system: systemText
    });


   }
}


 async function generateChatWithFallback(messages: any[], systemText: string) {
  try {
    console.log("Trying with the Google API");
    if (!process.env.GOOGLE_AI_KEY) throw new Error("Missing Google api key");

    return streamText({
      model: googleProvider('gemini-1.5-flash'), // Ensure you use a valid model name here!
      messages: messages, // Passing the full history here
      system: systemText
    });
  } catch (error) {
    console.error("Google failed! Triggering failover to Mistral.", error);
    
    return streamText({
      model: mistralProvider('mistral-large-latest'),
      messages: messages,
      system: systemText
    });
  }
}


app.get("/conversation",middleware,async (req,res) =>{
    res.json({
      userId:req.userId
    })

})

//get the past conversation using the id 
app.get("/conversation/:conversationId",middleware,async( req,res)=>{

  try{

  const {conversationId}=req.params;
  if (!conversationId) {
      res.status(400).json({ message: "Conversation ID is required" });
      return;
    }
    const response=await prisma.conversation.findFirst({
    where:{
      id:conversationId as string,
      userId:req.userId
    }
  })
   if(!response){
    res.status(404).json({
      message:"Conversation Not Found"
    })
   }

   res.json(response);
  

  }
  catch(e){
    console.error("Error fetching conversation:", e);
    res.status(500).json({ message: "Internal Server Error" });

  }

  
})

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Decomposes accented characters 
    .replace(/[\u0300-\u036f]/g, '') // Removes combining diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Removes remaining non-alphanumeric characters
    .replace(/[\s_-]+/g, '-'); // Collapses consecutive spaces or underscores into a single hyphen
}

app.post("/delve_Ask",middleware,async (req,res) =>{
   // STEP-1 = get the query from the user
   const query=req.body.query;

   if (!query) {
      res.status(400).json({ message: "Query is required" });
      return;
    }

   // STEP-2 =  make sure user has access/credit to hit the endpoint


   // STEP-3 =  web search to gather the resources
     const WebSearchResponse=await client.search(query,{
    searchDepth: "advanced"
})

   const WebSearchResult=WebSearchResponse.results;

   const conversation=await prisma.conversation.create({
    data:{
      title:query.slice(0,80),
      slug:slugify(query),
      userId:req.userId!,
      message:{
        create :{
          content: query,
          role:"User"
        }
      }

    }
   })

   // STEP-4 = do some sort of context engineering on the prompt  + web search response

   const promptText=PROMPT_TEMPLATE
   .replace("{{WEB_SEARCH_RESULT}}",JSON.stringify(WebSearchResult))
   .replace("{{USER_QUERY}}",query);

   // Set streaming headers for SSE / chunked responses
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

   // STEP-5 =  check if the we have the web search feat
  

 


   // STEP-6 =  hit the LLM to get back the reponse 
   
   const result =await generateWithFallback(promptText,SYSTEM_PROMPT);
    let fullAssistantText = "";
   for await (const TextPart of (await result).textStream){
    //this will stream to the llm request to the frontend
    fullAssistantText += TextPart; // 1. Collect chunk in memory
    res.write(TextPart);
  }


  

   // STEP-7 = also get back the stream and the follow up question(which we get back from another parallel LLM call)
 
    const sourcesJsonString = JSON.stringify(
  WebSearchResult.map((result) => ({
    url: result.url,
    favicon: result.favicon,
  }))
);

    const sourcesBlock = `\n\n<SOURCES>\n${sourcesJsonString}\n</SOURCES>`;

    res.write(sourcesBlock);


   
   

  //step-8 close the event stream
  res.end();

  await prisma.message.create({
      data: {
        content: fullAssistantText + sourcesBlock,
        role: "Assistant",
        conversationId: conversation.id,
      },
    });
    



});




app.post("/delve_ask/followup", middleware, async (req, res) => {
  // step:1 get the chat from the db
  const { conversationId, newMessage } = req.body; // <-- Extract newMessage here!

  if (!newMessage) {
    res.status(400).json({ message: "newMessage is required" });
    return;
  }

  const response = await prisma.conversation.findFirst({
    where: {
      id: conversationId as string,
      userId: req.userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  if (!response) {
    res.status(404).json({ message: "Conversation not found" });
    return;
  }

  // step:2 forward to the llm
  const formattedHistory: any[] = response.messages.map((msg) => ({
    // Assuming 'role' in your DB is stored as a string "user" or "assistant"
    // Adjust this logic if you use a boolean like 'isUser'
    role: msg.role === "User" ? "user" : "assistant",
    content: msg.content, 
  }));

  // Append the brand new question the user just asked
  formattedHistory.push({ role: "user", content: newMessage });

  // step:3 Do some context engineering here
  // Set up the specific headers required for streaming text over HTTP
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // step:4 stream back the response
    const result = await generateChatWithFallback(formattedHistory, SYSTEM_PROMPT);

    for await (const TextPart of result.textStream) {
      // Stream chunks back to the client as they are generated
      res.write(TextPart);
    }
    
    // Close the stream once the LLM finishes
    res.end();

  } catch (e) {
    console.error("Error streaming followup:", e);
    res.status(500).end();
  }
});


app.listen(3001,()=>{
  console.log(
    "Listening on the Port number"
  )
}

);
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

async function generateWithFallback(promptText: string, systemText: string) {
   try {
      console.log("Trying with the Google API...");

      if (!process.env.GOOGLE_AI_KEY) {
        throw new Error("Missing Google API key"); 
      }

      // FIX 1: Added 'await' so the catch block can actually trap API failures
      // FIX 2: Switched to 'gemini-flash-latest' to avoid the 404 restriction
      const result = await streamText({
        model: googleProvider('gemini-flash-latest'),
        prompt: promptText,
        system: systemText
      });

      return result;

   } catch (error) {
      console.error("Google failed! Triggering failover to Mistral.", error);
    
      // The silent failover model
      const fallbackResult = await streamText({
        model: mistralProvider('mistral-large-latest'),
        prompt: promptText,
        system: systemText
      });
      
      return fallbackResult;
   }
}


 async function generateChatWithFallback(messages: any[], systemText: string) {
  try {
    console.log("Trying with the Google API");
    if (!process.env.GOOGLE_AI_KEY) throw new Error("Missing Google api key");

    return streamText({
      model: googleProvider('gemini-flash-latest'), // Ensure you use a valid model name here!
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


app.get("/conversation", middleware, async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, createdAt: true },
    });
    res.json({ conversations });
  } catch (e) {
    console.error("Error listing conversations:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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
    },
    include: { messages: { orderBy: { createdAt: "asc" } } },
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
    searchDepth: "advanced",
    includeImages: true,
    includeFavicon: true
})

   const WebSearchResult=WebSearchResponse.results;

   const conversation=await prisma.conversation.create({
    data:{
      title:query.slice(0,80),
      slug:slugify(query),
      userId:req.userId!,
      messages:{
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
   res.setHeader("X-Conversation-Id", conversation.id);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
   
    res.setHeader("Access-Control-Expose-Headers", "X-Conversation-Id");
    res.flushHeaders();

   // STEP-5 =  check if the we have the web search feat
  

 


   // STEP-6 =  hit the LLM to get back the reponse 
   
   const result =await generateWithFallback(promptText,SYSTEM_PROMPT);
    let fullAssistantText = "";
   for await (const TextPart of result.textStream){
    //this will stream to the llm request to the frontend
    fullAssistantText += TextPart; // 1. Collect chunk in memory
    res.write(TextPart);
  }


  

   // STEP-7 = also get back the stream and the follow up question(which we get back from another parallel LLM call)
 
    const sourcesJsonString = JSON.stringify(
  WebSearchResult.map((result,index) => ({
    url: result.url,
    favicon: result.favicon,
  }))
);
const imagesJsonString = JSON.stringify(WebSearchResponse.images ?? []);

    const sourcesBlock = `\n\n<SOURCES>\n${sourcesJsonString}\n</SOURCES>\n<IMAGES>\n${imagesJsonString}\n</IMAGES>`;

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
  const { conversationId, newMessage } = req.body;

  if (!newMessage) {
    res.status(400).json({ message: "newMessage is required" });
    return;
  }

  const response = await prisma.conversation.findFirst({
    where: { id: conversationId as string, userId: req.userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!response) {
    res.status(404).json({ message: "Conversation not found" });
    return;
  }

  // 1. Perform a fresh web search for the follow-up question
  const WebSearchResponse = await client.search(newMessage, {
    searchDepth: "advanced",
    includeImages: true,
    includeFavicon: true
  });
  
  const WebSearchResult = WebSearchResponse.results;

  // 2. Format the new context using your PROMPT_TEMPLATE
  const promptText = PROMPT_TEMPLATE
    .replace("{{WEB_SEARCH_RESULT}}", JSON.stringify(WebSearchResult))
    .replace("{{USER_QUERY}}", newMessage);

  // 3. Format history, but use the enriched promptText for the latest message
  const formattedHistory: any[] = response.messages.map((msg) => ({
    role: msg.role === "User" ? "user" : "assistant",
    content: msg.content,
  }));

  formattedHistory.push({ role: "user", content: promptText });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    // 4. Hit the LLM with the full history + new search context
    const result = await generateChatWithFallback(formattedHistory, SYSTEM_PROMPT);

    let fullAssistantText = ""; 
    for await (const TextPart of result.textStream) {
      fullAssistantText += TextPart; 
      res.write(TextPart);
    }

    // 5. Append the <SOURCES> block so the UI renders the new cards
    const sourcesJsonString = JSON.stringify(
      WebSearchResult.map((result, index) => ({
        url: result.url,
        favicon: result.favicon,
        
      }))
    );
    const imagesJsonString = JSON.stringify(WebSearchResponse.images ?? []);

const sourcesBlock = `\n\n<SOURCES>\n${sourcesJsonString}\n</SOURCES>\n<IMAGES>\n${imagesJsonString}\n</IMAGES>`;

    
    res.write(sourcesBlock);
    res.end();

    // 6. Save to database (Save the original newMessage, not the massive promptText)
    await prisma.message.createMany({
      data: [
        { content: newMessage, role: "User", conversationId },
        { content: fullAssistantText + sourcesBlock, role: "Assistant", conversationId },
      ],
    });
  } catch (e) {
    console.error("Error streaming followup:", e);
    res.status(500).end();
  }
});

 app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.listen(3001,()=>{
  console.log(
    "Listening on the Port number"
  )
}

);
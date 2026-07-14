import 'dotenv/config';
import express from "express";
import {tavily} from '@tavily/core';
import { PROMPT_TEMPLATE } from "./prompt";
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { SYSTEM_PROMPT } from "./prompt";

const app=express();
const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

app.use(express.json());

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


app.post("/delve_Ask",async (req,res) =>{
   // STEP-1 = get the query from the user
   const query=req.body.query;

   // STEP-2 =  make sure user has access/credit to hit the endpoint


   // STEP-3 =  web search to gather the resources
     const WebSearchResponse=await  client.search(query,{
    searchDepth: "advanced"
})

   const WebSearchResult=WebSearchResponse.results;

   // STEP-4 = do some sort of context engineering on the prompt  + web search response

   const promptText=PROMPT_TEMPLATE
   .replace("{{WEB_SEARCH_RESULT}}",JSON.stringify(WebSearchResult))
   .replace("{{USER_QUERY}}",query);

   // STEP-5 =  check if the we have the web search feat
 

 


   // STEP-6 =  hit the LLM to get back the reponse 
   
   const result = generateWithFallback(promptText,SYSTEM_PROMPT);
   for await (const TextPart of (await result).textStream){
    //this will stream to the llm request to the frontend
    res.write(TextPart);
  }


  res.write("\n\n<SOURCES>\n");

   // STEP-7 = also get back the stream and the follow up question(which we get back from another parallel LLM call)
 
    res.write(JSON.stringify(WebSearchResult.map(result => ({url:result.url,
      favicon:result.favicon
    
    }))));


    res.write("\n\n</SOURCES>\n");
 

  //step-8 close the event stream
  res.end();



});


app.listen(3000,()=>{
  console.log(
    "Listening on the Port number"
  )
}

);


app.post("/delve_ask/followup",async (req,res) => {
  // step:1 get the chat from the db
  // step:2 forward to the llm
  // step:3 stream back the response
})
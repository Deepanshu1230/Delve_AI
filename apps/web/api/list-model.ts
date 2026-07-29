// list-models.ts
async function listAvailableModels() {
  // Make sure your API key environment variable matches what you use in your app
  const apiKey = process.env.GOOGLE_AI_KEY || "";

  if (!apiKey) {
    console.error("No API key found in environment variables.");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.models) {
      console.log("✅ Models available to your API key:\n");
      data.models.forEach((model: any) => {
        // We only care about models that support text generation
        if (model.supportedGenerationMethods.includes("generateContent")) {
          // Extract just the ID part (e.g., 'gemini-3-flash' from 'models/gemini-3-flash')
          const modelId = model.name.replace('models/', '');
          console.log(`- ${modelId}`);
        }
      });
    } else {
      console.log("No models returned. Response:", data);
    }
  } catch (error) {
    console.error("Failed to fetch models:", error);
  }
}

listAvailableModels();
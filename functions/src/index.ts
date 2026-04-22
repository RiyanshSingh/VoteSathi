import {onCall, HttpsError} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions";
import * as admin from "firebase-admin";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {defineSecret} from "firebase-functions/params";

admin.initializeApp();

// Define the secret for the Gemini API key
const geminiApiKey = defineSecret("GEMINI_API_KEY");

setGlobalOptions({maxInstances: 10});

export const chatWithAI = onCall({secrets: [geminiApiKey]}, async (request) => {
  // Check if the user is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }

  const {text, language, history} = request.data;
  const uid = request.auth.uid;

  if (!text) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'text' argument.");
  }

  try {
    const apiKey = geminiApiKey.value();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are Vote Sathi AI, an election expert. Response language: ${language}. Current language context: ${language}.`,
    });

    // Create a new message document in Firestore for the assistant's response
    const botMsgRef = admin.firestore().collection(`users/${uid}/messages`).doc();
    await botMsgRef.set({
      sender: "assistant",
      text: "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      timestamp: new Date().toLocaleTimeString(language === "Hindi" ? "hi-IN" : "en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Start chat with history
    const chat = model.startChat({history});
    const result = await chat.sendMessageStream(text);

    let fullResponse = "";
    let lastUpdate = Date.now();
    const UPDATE_INTERVAL = 400; // ms

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      
      const now = Date.now();
      if (now - lastUpdate > UPDATE_INTERVAL) {
        await botMsgRef.update({ text: fullResponse });
        lastUpdate = now;
      }
    }

    // Final update to ensure the full text is saved
    await botMsgRef.update({ text: fullResponse });

    return {success: true};
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new HttpsError("internal", "Failed to get response from AI assistant.");
  }
});

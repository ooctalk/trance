import { ITranceHiRequest } from "@/store/definition";
import * as SecureStore from "expo-secure-store";
import Storage from "expo-sqlite/kv-store";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
export async function tranceHi({
  tranceHiRequest,
}: {
  tranceHiRequest: ITranceHiRequest;
}) {
  if (!tranceHiRequest) return "!ERROR_TRANCE_HI_REQUEST_NOT_FOUND";
  if (tranceHiRequest.model === "Gemini") {
    try {
      console.log(tranceHiRequest)
      const homeKey = await SecureStore.getItem("HOME_API_GEMINI_KEY");
      const homeModel = await Storage.getItem("HOME_API_GEMINI_MODEL");

      if(!homeKey) return "!ERROR_API_GEMINI_KEY_NOT_FOUND"
      if(!homeModel || typeof homeModel !== "string") return "!ERROR_API_GEMINI_MODEL_NOT_FOUND"
      
      const openai = new OpenAI({
        apiKey: homeKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });
      const response = await openai.chat.completions.create({
        model: homeModel,
        messages: tranceHiRequest.messages
      });
      console.log(response)
      if(response.object !== "chat.completion" || response.choices[0].finish_reason !=="stop") return "!ERROR_REMOTE_API_ERROR"
      return response.choices[0].message

    } catch (e) {
      throw e;
    }

  }
}

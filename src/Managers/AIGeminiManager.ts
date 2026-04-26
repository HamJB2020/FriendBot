//GeminiManager.ts
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

export class GeminiManager {
	private genAI: GoogleGenerativeAI;
	private model: GenerativeModel;

	constructor(){
		//configurar el bot
		const apiKey = process.env.GEMINI_API_KEY || '';
		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({model: "gemini-3-flash"});
	}

	//Obtener respuesta
	async genResponse(prompt: string): Promise<string>{
		const result = await this.model.generateContent(prompt);
		const response = await result.response;
		return response.text();
	}
};


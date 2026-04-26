//AIManager.ts
import {GeminiManager} from "./AIGeminiManager.js";

export class AIManager{
	private AI: GeminiManager;

	constructor(){
		this.AI =  new GeminiManager();
	}

	async getResponse(prompt: string): Promise<string> {
		return await this.AI.genResponse(prompt);
	}
};
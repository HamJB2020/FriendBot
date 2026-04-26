import * as dotenv from 'dotenv';
import { FriendBot } from "./Dis.js";

export async function MainBot(): Promise<number> {
	
	//1.Inicializar .env
	dotenv.config();
	const tok: string = process.env.TOKEN!;
	if(!tok){
		console.error("No se encontro el TOKEN en el .env");
		return 1;
	}

	//2.Inicializar el bot
	const Bot: FriendBot = new FriendBot(tok);

	//3.Encender Bot
	try {
		await Bot.begin();
		console.log("FriendBot iniciado con exito");
	}catch(error){
		console.error("Error al conectar el bot: ", error);
		return 1;
	}
	
	return 0;
}
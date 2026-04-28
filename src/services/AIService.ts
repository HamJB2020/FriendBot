import { AIManager } from "../Managers/AIManager.js"
import { PrismaManager, db } from "../Managers/PrismaManager.js"

export class AIService {
    private dataBase: PrismaManager;
    private AI: AIManager;
    private readonly nameAI: string;

    constructor() {
        this.AI = new AIManager();
        this.dataBase = db;
        // Fallback por si la variable de entorno no existe
        this.nameAI = process.env.AINAME || "FriendBot";
    }

    async genResponse(discordId: string, username: string, msg: string): Promise<string> {
        // 1. Obtenemos o creamos al usuario para tener su contexto
        const { user } = await this.dataBase.getOrCreate(discordId, username);

        // 2. Construimos el "Contexto de Amistad"
        // Esto es lo que le dice a la IA quién es el usuario
        const context = `
            Tu nombre es ${this.nameAI}. Eres un amigo cercano y carismático.
            Estás hablando con ${user.name} (ID: ${user.discordId}).
            Tu nivel de amistad actual con él es de ${user.shipLevel} y tiene ${user.xp} puntos de experiencia.
            
            Reglas de personalidad:
            - Si el shipLevel es bajo (0-5), sé amable pero un poco más reservado.
            - Si el shipLevel es alto (10+), sé muy cercano, usa bromas internas y muéstrate muy afectuoso.
            - No actúes como un asistente formal, actúa como un amigo en un chat de Discord.
            - Reconoce que se conocen desde el ${user.shipTime.toLocaleDateString()}.
        `;

        // 3. Le pedimos a la IA que genere la respuesta usando ese contexto
        const promptFinal = `Contexto del sistema: ${context}\n\nUsuario dice: ${msg}`;
        const response = await this.AI.getResponse(promptFinal);

        // 4. Bonus: Subimos un poco de XP por cada charla
        await this.dataBase.addXp(discordId, 30);

        return response;
    }
}
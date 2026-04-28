import { Client, GatewayIntentBits, type Interaction } from 'discord.js';
import { CommandHandle } from './Managers/CommandManager.js';
import { AIService } from './services/AIService.js';
import { db }  from "./Managers/PrismaManager.js"

export class FriendBot {
    private client: Client;
    private commandHandler: CommandHandle;
    private AI: AIService;
    private readonly token: string;
    private shouldCheckActivity: boolean = false;

    constructor(tok: string) {
        this.token = tok;
        this.commandHandler = new CommandHandle();
        this.AI = new AIService(); 

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.client.on("ready", () => {
            console.log(`FriendBot en línea como: ${this.client.user?.tag}`);
            this.startCheckTimer();
        });

        this.client.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isChatInputCommand()) return;
            await this.commandHandler.executeCommand(interaction);
        });

        this.client.on("messageCreate", async (message) => {
            if (message.author.bot) return;

            if (message.mentions.has(this.client.user!)) {

                const prompt = message.content
                    .replace(/<@!?[0-9]+>/g, "")
                    .trim();

                if (!prompt) return;
            
                try {
                    await message.channel.sendTyping();

                    const response = await this.AI.genResponse(
                        message.author.id, 
                        message.author.username, 
                        prompt
                    );
                
                    await message.reply({
                        content: response,
                        allowedMentions: { repliedUser: false }
                    });

                } catch (err) {
                    console.error("Error al procesar flujo de IA + Prisma:", err);
                    await message.reply("Lo siento, me duele un poco la cabeza... (Error interno)");
                }
            }
            if (this.shouldCheckActivity) {
                await this.handleOpportunisticReminder(message);
            }
        });

    }

    private async handleOpportunisticReminder(message: any): Promise<void> {
        this.shouldCheckActivity = false;

        try {
            // 1. La IA decide si es buen momento
            const decision = await this.AI.genResponse(
                "system",
                "System",
                `Contexto: ${message.author.username} dijo "${message.content}". ¿Intervenir con un saludo/dato? Responde SI o NO.`
            );

            if (!decision.includes("SI")) return;

            // 2. LANZAMIENTO DE MONEDA (50/50)
            const sendToDM = Math.random() < 0.5;

            if (sendToDM) {
                const { user } = await db.getOrCreate(message.author.id, message.author.username);

                const privateMsg = await this.AI.genResponse(
                    user.discordId,
                    user.name,
                    "Genera un mensaje privado muy corto y amigable, como un '¿Cómo va tu día?' o un pensamiento aleatorio."
                );

                try {
                    await message.author.send(`(Psst...) ${privateMsg}`);
                    console.log(`Mensaje privado enviado a ${user.name}`);
                } catch (dmErr) {
                    await message.channel.send(privateMsg);
                }

            } else {
                // OPCIÓN B: ENVIAR AL CHAT PRINCIPAL
                await message.channel.sendTyping();
                
                const publicMsg = await this.AI.genResponse(
                    message.author.id,
                    message.author.username,
                    "Genera un comentario corto y buena onda para el canal basándote en lo que se está hablando."
                );

                await message.channel.send(publicMsg);
            }

            // Bonus: Darle un poco de XP por haber "activado" al bot
            await db.addXp(message.author.id, 5);

        } catch (err) {
            console.error("Error en flujo de recordatorio:", err);
        }
    }

    private startCheckTimer(): void {
        // 3 hrs
        const TIEMPO_REAL = 3 * 60 * 60 * 1000;

        setInterval(() => {
            this.shouldCheckActivity = true;
            console.log("--- MODO PRUEBA: Evaluando próximo mensaje ---");
        }, TIEMPO_PRUEBA);
    }

    public async begin(): Promise<void> {
        await this.client.login(this.token);
    }
}
import { Client, GatewayIntentBits, type Interaction } from 'discord.js';
import { CommandHandle } from './Managers/CommandManager.js';
import { AIManager } from './Managers/AIManager.js';

export class FriendBot {
    private client: Client;
    private commandHandler: CommandHandle;
    private AI: AIManager;
    private readonly token: string;

    constructor(tok: string) {
        this.token = tok;
        this.commandHandler = new CommandHandle();
        this.AI = new AIManager(); 

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
        });

        this.client.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isChatInputCommand()) return;
            await this.commandHandler.executeCommand(interaction);
        });

        this.client.on("messageCreate", async (message) => {
            if (message.author.bot) return;
            
            if (message.mentions.has(this.client.user!)) {
                // 4. Regex más segura para limpiar cualquier mención
                const prompt = message.content
                    .replace(/<@!?[0-9]+>/g, "")
                    .trim();
            
                try {
                    const response = await this.AI.getResponse(prompt);
                
                    await message.reply({
                        content: response,
                        allowedMentions: { repliedUser: false }
                    });
                } catch (err) {
                    console.error("Error al procesar IA:", err);
                }
            }
        });
    }

    public async begin(): Promise<void> {
        await this.client.login(this.token);
    }
}
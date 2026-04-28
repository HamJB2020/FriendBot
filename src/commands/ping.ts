import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Category } from '../interface/Command.js'
export const command: Command = {
    // 1. Definición para Discord (Lo que el usuario ve al escribir /)
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot y del sistema'),

    // 2. Metadatos
    category: Category.Utility, 
    ephemeral: false,           

    execute: async (interaction: ChatInputCommandInteraction) => {
        const wsPing = interaction.client.ws.ping;
        
        const sent = await interaction.deferReply({ fetchReply: true, ephemeral: true });
        const roundtripPing = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply({
            content: `🏓 **¡Pong!**\n> 🌐 **Latencia API:** \`${wsPing}ms\`\n> ⚡ **Latencia Bot:** \`${roundtripPing}ms\``
        });
    },
};

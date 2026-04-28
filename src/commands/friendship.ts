import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Category } from '../interface/Command.js'
import { db } from "../Managers/PrismaManager.js"

export const command: Command = {
	data: new SlashCommandBuilder()
    .setName('friendship')
    .setDescription('Muestra tu nivel de amistad con el bot'),

    category: Category.Fun,
    ephemeral: false,

	execute: async (interaction: ChatInputCommandInteraction) => {
        const discordId = interaction.user.id;
        const username = interaction.user.username;

        // Usamos el manager directamente
        const { user } = await db.getOrCreate(discordId, username);

        await interaction.reply({
            content: `✨ **Perfil de Amistad de ${user.name}** ✨\n` +
                     `❤️ Nivel: ${user.shipLevel}\n` +
                     `⭐ XP: ${user.xp}/100\n` +
                     `📅 Nos conocemos desde: ${user.shipTime.toLocaleDateString()}`,
            ephemeral: true
        });
    },

}
import {
	ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandSubcommandsOnlyBuilder
} from "discord.js"


export enum Category {
	Uknown = 0,
	Utility,
	Fun
};

export interface Command{
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | any; //Permite que discord gestione automaticamente las opciones
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;  //Permite autocompletado del mensaje
	category?: Category;
	ephemeral?: boolean;
}
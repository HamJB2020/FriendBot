import { Command } from "../interface/Command.js";
import { loadCommands } from "../interface/loadCommands.js";
import { ChatInputCommandInteraction, Collection } from "discord.js";

export class CommandHandle{
	private readonly commands: Collection<string, Command>;

	constructor(){
		this.commands = new Collection<string, Command>();
		loadCommands(this.commands);
	}

	async executeCommand(interaction: ChatInputCommandInteraction){
		const command = this.commands.get(interaction.commandName);
		if(!command) return;

		await command.execute(interaction);
	}


};
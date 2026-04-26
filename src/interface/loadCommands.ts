import * as fs from 'fs';
import * as path from 'path';
import { Collection, REST, Routes } from 'discord.js';
import { type Command } from './Command.js'; 

export async function loadCommands(commandsMap: Collection<string, Command>): Promise<void> {
    const commandsPath = path.join(import.meta.dirname, '../commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.error(`La carpeta no existe en: ${commandsPath}`);
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => 
        file.endsWith('.ts') || file.endsWith('.js')
    );

    console.log(`🔍 Escaneando comandos en: ${commandsPath}...`);

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        
        try {
            const module = await import(`file://${filePath}`);
            const command: Command = module.default || module.command;

            if (command && command.data?.name) {
                commandsMap.set(command.data.name, command);
                console.log(`Comando cargado: /${command.data.name}`);
            } else {
                console.warn(`El archivo ${file} no tiene el formato de Command correcto.`);
            }
        } catch (error) {
            console.error(`Error al cargar el comando ${file}:`, error);
        }
    }

    console.log(`Carga local completa. Total: ${commandsMap.size} comandos.`);

    // --- Lógica de Registro en Discord (Deploy) ---
    const token = process.env.TOKEN;
    const clientId = process.env.CLIENT_ID;

    if (!clientId || !token) {
        console.warn("Saltando registro en Discord: Faltan TOKEN o CLIENT_ID en el .env");
        return;
    }

    const rest = new REST({ version: '10' }).setToken(token);
    const body = Array.from(commandsMap.values()).map(c => c.data.toJSON());

    try {
        console.log(`Sincronizando comandos con la API de Discord...`);
        
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: body }
        );

        console.log('Slash Commands actualizados globalmente.');
    } catch (error) {
        console.error('Error al registrar comandos en la API:', error);
    }
}
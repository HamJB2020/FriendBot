# Documentación del Cargador de Comandos (`loadCommands`)

Este módulo se encarga de escanear el sistema de archivos para importar los comandos localmente y, posteriormente, sincronizarlos con la API de Discord mediante **REST**.

---

## 🚀 Flujo de Funcionamiento

El proceso se divide en dos fases críticas:

### 1. Carga Local (Escaneo de Archivos)
El script busca en el directorio `../commands` todos los archivos con extensión `.ts` o `.js`.

*   **Validación de Carpeta:** Comprueba si la ruta existe antes de intentar leerla.
*   **Importación Dinámica:** Utiliza `import()` para cargar los módulos en tiempo de ejecución.
*   **Detección de Exportación:** Es compatible tanto con `export default` como con el objeto exportado llamado `command`.
*   **Almacenamiento:** Los comandos válidos se guardan en una `Collection` de discord.js para su acceso rápido durante la ejecución del bot.

### 2. Registro Global (Deploy a Discord API)
Una vez cargados en memoria, el bot sincroniza los comandos con los servidores de Discord.

*   **Uso de REST:** Utiliza la versión 10 de la API de Discord.
*   **Conversión a JSON:** Transforma los objetos `SlashCommandBuilder` al formato JSON que requiere la API mediante el método `.toJSON()`.
*   **Alcance Global:** Los comandos se registran usando `Routes.applicationCommands`, lo que los hace disponibles en todos los servidores donde se encuentre el bot.

---

## ⚙️ Configuración Requerida

Para que el registro en la API funcione, el archivo `.env` debe contener:
*   `TOKEN`: El token secreto de tu bot.
*   `CLIENT_ID`: El ID de aplicación de tu bot.

---

## 🛠️ Detalles Técnicos de la Función

### Parámetros
| Parámetro | Tipo | Descripción |
| :--- | :--- | :--- |
| `commandsMap` | `Collection<string, Command>` | El mapa donde se inyectarán los comandos cargados con éxito. |

### Logs de Consola
El script proporciona feedback detallado durante el proceso:
*   `🔍 Escaneando...`: Indica el inicio del proceso.
*   `Comando cargado /x`: Confirma la carga individual de cada comando.
*   `Slash Commands actualizados`: Confirma que la API de Discord recibió los cambios.

---

## Código Fuente
```typescript
import * as fs from 'fs';
import * as path from 'path';
import { Collection, REST, Routes } from 'discord.js';
import { type Command } from './Command.js'; 

export async function loadCommands(commandsMap: Collection<string, Command>): Promise<void> {
    const commandsPath = path.join(import.meta.dirname, '../commands');
    
    // Verificación de existencia
    if (!fs.existsSync(commandsPath)) {
        console.error(`La carpeta no existe en: ${commandsPath}`);
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => 
        file.endsWith('.ts') || file.endsWith('.js')
    );

    // Carga de módulos
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            const module = await import(`file://${filePath}`);
            const command: Command = module.default || module.command;

            if (command && command.data?.name) {
                commandsMap.set(command.data.name, command);
            }
        } catch (error) {
            console.error(`Error al cargar el comando ${file}:`, error);
        }
    }

    // Registro en la API de Discord
    const token = process.env.TOKEN;
    const clientId = process.env.CLIENT_ID;

    if (!clientId || !token) return;

    const rest = new REST({ version: '10' }).setToken(token);
    const body = Array.from(commandsMap.values()).map(c => c.data.toJSON());

    await rest.put(Routes.applicationCommands(clientId), { body });
}
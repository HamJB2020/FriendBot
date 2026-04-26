# Documentación del Comando: Ping

Este comando permite a los usuarios y administradores conocer el estado de la conexión del bot, midiendo tanto la latencia del WebSocket (API de Discord) como el tiempo de respuesta del servidor (Roundtrip).

## Estructura del Código

El comando está construido utilizando `SlashCommandBuilder` de **discord.js** y sigue una interfaz personalizada de comandos TypeScript.

### 1. Definición del Comando (Data)
Utiliza el constructor de comandos de Discord para definir la presencia del comando en la interfaz del cliente.
- **Nombre:** `ping`
- **Descripción:** Muestra la latencia del bot y del sistema.

### 2. Metadatos
Información adicional utilizada por el handler de comandos:
- **Categoría:** `Category.Utility` (Utilidad).
- **Efímero:** `true` (Por defecto, las respuestas solo son visibles para quien ejecuta el comando).

### 3. Lógica de Ejecución (`execute`)
El método `execute` gestiona la interacción mediante los siguientes pasos:

1. **Obtención del WS Ping:** Accede a `interaction.client.ws.ping` para obtener el latencia del latido de corazón (heartbeat) del WebSocket.
2. **Diferimiento de Respuesta:** Utiliza `interaction.deferReply` con `fetchReply: true`. Esto permite calcular el tiempo exacto que tarda Discord en recibir y procesar la respuesta.
3. **Cálculo Roundtrip:** Se resta el timestamp de la creación de la interacción al timestamp del mensaje enviado (`sent.createdTimestamp - interaction.createdTimestamp`).
4. **Respuesta Final:** Edita la respuesta diferida para mostrar los valores finales formateados.

---

## Ejemplo de Respuesta

Cuando un usuario ejecuta `/ping`, el bot responderá con:

> 🏓 **¡Pong!**
> 🌐 **Latencia API:** `45ms`
> ⚡ **Latencia Bot:** `120ms`

---

## Snippet de Referencia

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Category } from '../interface/Command.js';

export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot y del sistema'),

    category: Category.Utility, 
    ephemeral: true,           

    execute: async (interaction: ChatInputCommandInteraction) => {
        const wsPing = interaction.client.ws.ping;
        
        const sent = await interaction.deferReply({ fetchReply: true, ephemeral: true });
        const roundtripPing = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply({
            content: `🏓 **¡Pong!**\n> 🌐 **Latencia API:** \`${wsPing}ms\`\n> ⚡ **Latencia Bot:** \`${roundtripPing}ms\``
        });
    }
};
# Documentación del Sistema de Comandos (Interfaces)

Este archivo define la estructura base y los tipos necesarios para la creación de comandos dentro del bot, asegurando consistencia y aprovechando el tipado fuerte de TypeScript.

---

## 📂 Enum: `Category`

Define las categorías disponibles para organizar los comandos. Esto es útil para sistemas de ayuda (help commands) o filtrado de logs.

| Valor | Nombre | Descripción |
| :--- | :--- | :--- |
| `0` | `Uknown` | Categoría por defecto o no especificada. |
| `1` | `Utility` | Comandos de herramientas y utilidades (ej. ping, serverinfo). |
| `2` | `Fun` | Comandos de entretenimiento y juegos. |

---

## 🛠️ Interface: `Command`

La interfaz `Command` es el contrato que todos los archivos de comandos deben cumplir para ser cargados correctamente por el handler.

### Propiedades

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `data` | `SlashCommandBuilder` \| `...` | Define la configuración del comando para la API de Discord (nombre, descripción, opciones). |
| `execute` | `Function` | La función asíncrona que contiene la lógica principal del comando. |
| `category` | `Category` | *(Opcional)* La categoría a la que pertenece el comando. |
| `ephemeral` | `boolean` | *(Opcional)* Define si la respuesta del comando será visible solo para el usuario. |

### Detalles de Propiedades

#### 1. `data`
Soporta `SlashCommandBuilder`, `SlashCommandSubcommandsOnlyBuilder` o `any`. 
> **Nota:** El uso de `any` permite flexibilidad en casos donde se construyen comandos de forma dinámica, aunque se recomienda priorizar los builders de `discord.js`.

#### 2. `execute`
Es una función que recibe una `ChatInputCommandInteraction`.
- **Retorno:** `Promise<void>`.
- **Ventaja:** Al estar tipada, ofrece autocompletado para todos los métodos de la interacción (como `.reply()`, `.editReply()`, etc.).

---

## Ejemplo de Implementación
```typescript
import { Command, Category } from './interfaces/Command';
import { SlashCommandBuilder } from 'discord.js';

export const exampleCommand: Command = {
    category: Category.Utility,
    ephemeral: false,
    data: new SlashCommandBuilder()
        .setName('hola')
        .setDescription('Saluda al bot'),
    execute: async (interaction) => {
        await interaction.reply('¡Hola mundo!');
    }
};
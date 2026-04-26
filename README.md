# Project FriendBot

**FriendBot** es un bot de Discord moderno desarrollado en TypeScript, actualmente en desarollo pero ya posee la logica lista
para una expancion profesional.

## Inicio Rápido
Para poner en marcha el bot, el sistema utiliza un flujo jerárquico que comienza desde la raíz.

### Ejecución Principal
El bot debe iniciarse llamando a la función principal en el archivo de entrada:
```typescript
import { MainBot } from "./src/index.js";

// Inicializa el entorno, valida el token y arranca los servicios
MainBot();
```
## 🏗️ Arquitectura del Sistema
El proyecto sigue un patrón de diseño basado en **Managers** para asegurar que cada componente tenga una única responsabilidad.

### Componentes Clave:
* **FriendBot (Núcleo):** Clase principal que gestiona el cliente de Discord y los eventos de red.
* **CommandManager:** Orquestador de comandos. Se encarga de cargar archivos dinámicamente y ejecutar *Slash Commands*.
* **AIManager (Wrapper):** Actúa como una capa de abstracción. Actualmente utiliza `AIGeminiManager`, pero permite cambiar el motor de IA (a Ollama, Meta, etc.) sin afectar al resto del bot.
* **Loaders:** Funciones encargadas de registrar los comandos en la API de Discord automáticamente al iniciar.

---

## 🛠️ Tecnologías Utilizadas
* **Runtime:** Node.js
* **Lenguaje:** TypeScript
* **Librería de Discord:** [Discord.js v14+](https://discord.js.org/)
* **Motor de IA:** Google Generative AI (Gemini)
* **Gestión de Entorno:** Dotenv

---

## ⚙️ Configuración (`.env`)
Crea un archivo `.env` en la raíz del proyecto y configura las siguientes claves:

```env
TOKEN=tu_discord_bot_token
CLIENT_ID=tu_client_id_de_discord
GEMINI_API_KEY=tu_clave_de_google_ai
```

## 🛠️ Instalación y Despliegue

Sigue estos pasos para configurar y ejecutar **FriendBot** en tu entorno local.

### 1. Clonar el repositorio
Primero, descarga el código a tu máquina local:
```bash
git clone [https://github.com/HamJB2020/FriendBot.git](https://github.com/HamJB2020/FriendBot.git) 
cd FriendBot
```
### 2. Instalar dependecias
Asegurate de tener Node.js instalado
```bash
npm install
```
### 3. Configuración (`.env`)
Crea un archivo `.env` en la raíz del proyecto y configura las siguientes claves:

```env
TOKEN=tu_discord_bot_token
CLIENT_ID=tu_client_id_de_discord
GEMINI_API_KEY=tu_clave_de_google_ai
```

### 4. Compilacion
Como el proyecto está escrito en TypeScript, es necesario compilarlo a JavaScript antes de correrlo:
```bash
npx tsc
```
## 5. Ejecucion
Ejecuta el proyecto de la siguiente forma
```bash
node dist/main.js
```

## Documentacion en Modulos
El proyecto esta divido en diferentes modulos documentados individualmenete para facilitar el mantenimiento de bot y al integracion y mejoras de este.
* **Comandos**: Estructura basada en la interfaz Command.
* **IA**: Implementación de Gemini con soporte para menciones directas en canales.
* **Carga**: Sistema automático de escaneo de archivos .ts / .js.

## Contribucion
Si deseas añadir añadir funcionalidades como crear un nuevo comando, sigue la siguientes instrucciones:

Para generar un nuevo comando añade el comando a la carpeta `commands`, asegurandote de seguir la estructura de interface correctamente.

---

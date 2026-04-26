# Documentación de Clase: `FriendBot`

La clase `FriendBot` es el punto de entrada y el orquestador principal de la aplicación. Su función es integrar el cliente de Discord, el sistema de comandos y el motor de IA en una única entidad funcional.

---

## 🏗️ Composición de la Clase

Esta clase utiliza **composición** para agrupar las funcionalidades clave:

*   **`client`**: La instancia de `Client` de discord.js que mantiene la conexión con los servidores.
*   **`commandHandler`**: Instancia de `CommandManager` (referenciada como `CommandHandle`) para procesar Slash Commands.
*   **`AI`**: Instancia de `AIManager` para gestionar las interacciones inteligentes.

---

## 🛠️ Métodos y Funcionalidades

### 1. `constructor(tok: string)`
Inicializa el bot y sus servicios.
- **Intents:** Configura los permisos necesarios:
    - `Guilds`: Para operar en servidores.
    - `GuildMessages`: Para leer eventos de mensajes.
    - `MessageContent`: **Crítico** para que la IA pueda leer el texto de los mensajes.
- **Instanciación:** Crea los managers de comandos e IA automáticamente.

### 2. `setupEventListeners()`
Configura los escuchadores de eventos (Event Listeners) que definen el comportamiento del bot:

#### 🔹 Evento `ready`
Confirma que el bot está en línea y muestra el tag del usuario en la consola.

#### 🔹 Evento `interactionCreate`
Filtra las interacciones de tipo **Slash Command** y las delega al `commandHandler` para su ejecución.

#### 🔹 Evento `messageCreate` (Integración con IA)
Este evento permite que el bot responda de forma inteligente cuando es mencionado:
1.  **Filtro de Bots:** Ignora mensajes enviados por otros bots.
2.  **Detección de Mención:** Solo se activa si el mensaje menciona directamente al bot.
3.  **Limpieza de Prompt:** Utiliza una expresión regular (`/<@!?[0-9]+>/g`) para eliminar el ID de la mención del texto, dejando solo la consulta limpia para la IA.
4.  **Respuesta:** Llama a `this.AI.getResponse()` y envía la respuesta de vuelta como una mención desactivada (`repliedUser: false`) para evitar notificaciones innecesarias.

### 3. `begin()`
Método asíncrono que inicia la sesión del bot utilizando el token proporcionado.

---

## 📝 Ejemplo de Flujo de IA

1.  **Usuario escribe:** "@FriendBot ¿Cómo estás hoy?"
2.  **`messageCreate` captura:** Detecta la mención.
3.  **Procesamiento:** El prompt se limpia a "¿Cómo estás hoy?".
4.  **IA:** Gemini procesa y devuelve "¡Hola! Estoy funcionando al 100%...".
5.  **Respuesta:** El bot responde al usuario en el canal de Discord.

---

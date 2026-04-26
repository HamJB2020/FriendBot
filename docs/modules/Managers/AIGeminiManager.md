# Documentación de Clase: `GeminiManager`

Esta clase encapsula la lógica para interactuar con los modelos de lenguaje de **Google Gemini**, permitiendo enviar prompts y recibir respuestas generativas de forma sencilla.

---

## 🏗️ Arquitectura de la Clase

La clase utiliza un patrón de gestión de servicios para mantener una única instancia del modelo y facilitar su uso en diferentes partes de la aplicación.

### Propiedades Privadas
*   `genAI`: Instancia principal de la conexión con Google Generative AI.
*   `model`: El modelo específico configurado para procesar las peticiones.

---

## 🛠️ Métodos

### 1. `constructor()`
Al instanciarse, la clase realiza las siguientes acciones:
- Recupera la API Key desde las variables de entorno (`GEMINI_API_KEY`).
- Inicializa el cliente de Google AI.
- Configura el modelo por defecto. Actualmente utiliza **`gemini-3-flash`**, optimizado para velocidad y eficiencia.

### 2. `genResponse(prompt: string)`
Es el método principal para la interacción con el usuario.
- **Parámetros:** `prompt` (Texto descriptivo o pregunta del usuario).
- **Proceso:** 
    1. Envía el contenido al modelo mediante `generateContent`.
    2. Espera la resolución de la promesa de respuesta.
- **Retorno:** Una `Promise<string>` con el texto generado por la IA.

---

## ⚙️ Configuración del Entorno

Para que este manager funcione correctamente, es imperativo tener configurada la clave de API en tu archivo `.env`:

```env
GEMINI_API_KEY=tu_clave_de_google_ai_aqui
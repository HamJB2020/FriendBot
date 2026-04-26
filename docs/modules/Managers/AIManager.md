# Documentación de Clase: `AIManager`

La clase `AIManager` actúa como un **Wrapper** (envoltorio) entre la lógica de negocio de tu bot y el proveedor específico de Inteligencia Artificial. 

---

## 🏗️ El Concepto de "Wrapper"

Un **Wrapper** es un patrón de diseño que permite ocultar la complejidad de una implementación específica bajo una interfaz más sencilla y genérica.

### ¿Por qué usamos un Wrapper aquí?
La principal ventaja es el **desacoplamiento**. Actualmente, el bot utiliza Google Gemini, pero si en el futuro decides cambiar el motor por otro (como **Ollama**, **OpenAI** o **Anthropic/Claude**), no tendrás que modificar cada archivo donde se use la IA.

*   **Flexibilidad:** Solo necesitas cambiar la lógica interna en el Manager.
*   **Consistencia:** Las "firmas" (los nombres de las funciones y los parámetros que reciben) se mantienen intactas en todo el proyecto.
*   **Mantenibilidad:** Centraliza la gestión de errores y la configuración de la IA en un solo punto.

---

## 🛠️ Métodos y Funciones

### 1. `constructor()`
Inicializa la instancia del motor de IA actual.
- **Implementación actual:** Crea una nueva instancia de `GeminiManager`.
- **Escalabilidad:** Si se cambia a otro motor, aquí es donde se instanciaría la nueva clase (ej. `new OllamaManager()`).

### 2. `getResponse(prompt: string)`
Es la función puente que solicitan los comandos del bot.
- **Parámetros:** `prompt` (string).
- **Retorno:** `Promise<string>`.
- **Propósito:** Llama internamente al método del proveedor actual (`this.AI.genResponse`) y devuelve el texto procesado.

---

## 📝 Ejemplo de cómo el Wrapper protege tu código

Si mañana decides dejar de usar Gemini y usar un modelo local con **Ollama**, los cambios se verían así **dentro de este archivo**, sin afectar al resto del bot:
```typescript
// Antes (Gemini)
this.AI = new GeminiManager();

// Después (Ollama - Ejemplo hipotético)
this.AI = new OllamaManager(); 

// El resto del bot sigue llamando a:
// await aiManager.getResponse("hola"); <-- Esto NO cambia.
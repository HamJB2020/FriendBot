# Documentación del Archivo de Ejecución: `main.ts`

Este es el archivo raíz del proyecto. Su única responsabilidad es invocar la lógica principal del bot y asegurar que, si algo falla a nivel crítico, el proceso de Node.js se cierre de forma controlada.

---

## 🛠️ Funcionamiento

El archivo realiza tres acciones clave:

1.  **Importación del Módulo Principal:** Importa `MainBot` desde el índice del proyecto, donde reside la lógica de inicialización y carga de variables de entorno.
2.  **Llamada Asíncrona:** Ejecuta la función `main()` que espera a que `MainBot()` termine su configuración.
3.  **Captura de Errores Globales (Top-Level Catch):** 
    -   Cualquier error que no haya sido capturado dentro de las clases `FriendBot` o `AIManager` llegará hasta aquí.
    -   **`process.exit(1)`**: Fuerza el cierre del programa con un código de salida de error. Esto es vital si usas herramientas como **PM2** o **Docker**, ya que les indica que el bot ha fallado y debe ser reiniciado automáticamente.

---

## Código Fuente (`src/main.ts`)
```typescript
import { MainBot } from "./index.js"

async function main(): Promise<void> {
    await MainBot();
}

main().catch((err) => {
    console.error("Error fatal en el sistema del bot: ", err);
    process.exit(1);
})
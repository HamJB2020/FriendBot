# Documentación del Punto de Entrada: `MainBot`

La función `MainBot` actúa como el **bootstrap** o iniciador del sistema. Su responsabilidad es preparar el entorno antes de ceder el control total a la clase `FriendBot`.

---

## 📋 Flujo de Ejecución

El proceso de arranque sigue tres pasos críticos:

### 1. Carga del Entorno (`dotenv`)
Utiliza la librería `dotenv` para leer el archivo `.env` y cargar las variables en `process.env`.
- **Validación:** Verifica que el `TOKEN` exista. Si no se encuentra, el proceso se detiene inmediatamente devolviendo un código de error `1`, evitando que el bot intente conectar con credenciales nulas.

### 2. Instanciación de `FriendBot`
Una vez obtenido el token, crea una nueva instancia de la clase principal. En este punto, se disparan internamente los constructores de los managers (Comandos e IA).

### 3. Encendido y Gestión de Errores
Ejecuta el método asíncrono `Bot.begin()`.
- Se utiliza un bloque `try...catch` para capturar errores de conexión (como un token inválido o falta de internet) y asegurar que el log muestre exactamente qué falló antes de cerrar el proceso.

---

## 🛠️ Detalles de la Función

| Especificación | Valor |
| :--- | :--- |
| **Tipo de Retorno** | `Promise<number>` |
| **Código Exito** | `0` |
| **Código Error** | `1` |

---

## Código Fuente (`main.ts`)
```typescript
import * as dotenv from 'dotenv';
import { FriendBot } from "./Dis.js";

export async function MainBot(): Promise<number> {
    
    // 1. Inicializar .env
    dotenv.config();
    const tok: string = process.env.TOKEN!;
    
    if(!tok){
        console.error("No se encontró el TOKEN en el .env");
        return 1;
    }

    // 2. Inicializar el bot
    const Bot: FriendBot = new FriendBot(tok);

    // 3. Encender Bot
    try {
        await Bot.begin();
        console.log("FriendBot iniciado con éxito");
    } catch(error) {
        console.error("Error al conectar el bot: ", error);
        return 1;
    }
    
    return 0;
}
# Documentación de Clase: `CommandManager`

El `CommandManager` actúa como el **Orquestador de Interacciones**. Su función principal es escuchar los eventos de Discord, validar si corresponden a un comando registrado y ejecutar la lógica asociada.

---

## 🏗️ Responsabilidades

1.  **Almacenamiento:** Mantiene una `Collection` (un mapa avanzado) con todos los comandos cargados en memoria.
2.  **Middleware de Ejecución:** Antes de ejecutar un comando, gestiona estados como el `ephemeral` (mensajes privados).
3.  **Gestión de Errores:** Captura fallos durante la ejecución para evitar que el bot se detenga por completo.

---

## 🛠️ Atributos y Métodos

### Propiedades
*   `commands`: Una `Collection<string, Command>` donde la llave es el nombre del comando y el valor es el objeto `Command` completo.

### Método Principal: `handleInteraction(interaction)`
Este es el punto de entrada para cada interacción de tipo `SlashCommand`.

**Flujo de ejecución:**
1.  **Filtro Inicial:** Ignora cualquier interacción que no sea un comando de chat (`isChatInputCommand`).
2.  **Búsqueda:** Localiza el comando en la colección usando `interaction.commandName`.
3.  **Configuración de Visibilidad:** Revisa la propiedad `ephemeral` del comando para decidir si la respuesta debe ser secreta o pública.
4.  **Ejecución:** Llama al método `.execute()` del comando, pasando la interacción como argumento.

---

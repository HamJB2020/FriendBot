//src/main.ts
import { MainBot } from "./index.js"


async function main(): Promise<void> {
    await MainBot();
}

main().catch((err) => {
    console.error("Error fatal en el sistema del bot: ", err);
    process.exit(1);
})

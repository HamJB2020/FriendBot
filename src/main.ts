//src/main.ts

async function main(): Promise<void> {
    //Punto de entrada no meter logica;
    // await MainBot();
}

main().catch((err) => {
    console.error("Error fatal en el sistema del bot: ", err);
    process.exit(1);
})

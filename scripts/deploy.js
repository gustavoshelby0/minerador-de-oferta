const { execSync } = require("child_process")

console.log("🚀 Iniciando deploy do Meta Ad Library...")

// Verificar variáveis de ambiente
if (!process.env.META_TOKEN) {
  console.error("❌ META_TOKEN não configurado!")
  console.log("Configure a variável META_TOKEN no seu provedor de deploy")
  process.exit(1)
}

try {
  // Build do projeto
  console.log("📦 Fazendo build...")
  execSync("npm run build", { stdio: "inherit" })

  console.log("✅ Deploy concluído!")
  console.log("🔗 Acesse: https://seu-dominio.com")
} catch (error) {
  console.error("❌ Erro no deploy:", error.message)
  process.exit(1)
}

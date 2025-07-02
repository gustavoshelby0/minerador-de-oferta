const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const path = require("path")
require("dotenv").config()

const logger = require("./utils/logger")
const { errorHandler, notFound } = require("./middleware/errorMiddleware")
const authMiddleware = require("./middleware/authMiddleware")

// Routes
const mineracaoRoutes = require("./routes/mineracaoRoutes")
const healthRoutes = require("./routes/healthRoutes")
const metaAdsRoutes = require("./routes/metaAdsRoutes") // Nova rota para Meta Ads

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (Frontend HTML)
app.use(express.static(path.join(__dirname, "../public")))

// Routes
app.use("/api/health", healthRoutes)
app.use("/api/mineracao", authMiddleware, mineracaoRoutes)
app.use("/api/meta-ads", metaAdsRoutes) // Nova rota para Meta Ads Library

// Rota principal - servir o HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`)
  logger.info(`📊 Dashboard disponível em: http://localhost:${PORT}`)
  logger.info(`🔗 API Health Check: http://localhost:${PORT}/api/health`)
  logger.info(`⚡ Mineração API: http://localhost:${PORT}/api/mineracao`)
  logger.info(`📱 Meta Ads API: http://localhost:${PORT}/api/meta-ads`)
})

module.exports = app

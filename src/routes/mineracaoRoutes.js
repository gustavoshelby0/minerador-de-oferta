const express = require("express")
const mineracaoController = require("../controllers/mineracaoController")

const router = express.Router()

// Rotas para mineração de dados
router.get("/", mineracaoController.getCampanhas)
router.post("/refresh", mineracaoController.refreshData)
router.get("/stats", mineracaoController.getStats)
router.get("/:campaignId/ads", mineracaoController.getAnuncios)

module.exports = router

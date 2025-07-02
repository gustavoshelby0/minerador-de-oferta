const logger = require("../utils/logger")

// Middleware para rotas não encontradas
const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Log do erro
  logger.error("❌ Erro na aplicação:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  })

  // Erros específicos
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Recurso não encontrado"
    statusCode = 404
  }

  if (err.code === 11000) {
    message = "Recurso duplicado"
    statusCode = 400
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((val) => val.message)
    statusCode = 400
  }

  if (err.name === "JsonWebTokenError") {
    message = "Token inválido"
    statusCode = 401
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expirado"
    statusCode = 401
  }

  // Resposta de erro
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  })
}

module.exports = {
  notFound,
  errorHandler,
}

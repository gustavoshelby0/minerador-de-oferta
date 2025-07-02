const winston = require("winston")
const chalk = require("chalk")

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "facebook-ads-miner" },
  transports: [
    // Arquivo de log para erros
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Arquivo de log combinado
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
})

// Console transport para desenvolvimento
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const ts = chalk.gray(timestamp)
          const lvl = level
          const msg = message
          const metadata = Object.keys(meta).length ? chalk.gray(JSON.stringify(meta, null, 2)) : ""

          return `${ts} ${lvl}: ${msg} ${metadata}`
        }),
      ),
    }),
  )
}

// Função para criar logs estruturados
const createLogger = (module) => {
  return {
    info: (message, meta = {}) => logger.info(message, { module, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { module, ...meta }),
    error: (message, meta = {}) => logger.error(message, { module, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { module, ...meta }),
  }
}

module.exports = logger
module.exports.createLogger = createLogger

const NodeCache = require("node-cache")
const logger = require("../utils/logger")

class CacheService {
  constructor() {
    // Cache com TTL padrão de 5 minutos (300 segundos)
    this.cache = new NodeCache({
      stdTTL: 300,
      checkperiod: 60, // Verificar itens expirados a cada 60 segundos
      useClones: false,
    })

    // Log de eventos do cache
    this.cache.on("set", (key, value) => {
      logger.info(`📦 Cache SET: ${key}`)
    })

    this.cache.on("del", (key, value) => {
      logger.info(`🗑️ Cache DEL: ${key}`)
    })

    this.cache.on("expired", (key, value) => {
      logger.info(`⏰ Cache EXPIRED: ${key}`)
    })
  }

  // Armazenar no cache
  set(key, value, ttl = null) {
    try {
      if (ttl) {
        return this.cache.set(key, value, ttl)
      }
      return this.cache.set(key, value)
    } catch (error) {
      logger.error(`Erro ao armazenar no cache (${key}):`, error.message)
      return false
    }
  }

  // Recuperar do cache
  get(key) {
    try {
      return this.cache.get(key)
    } catch (error) {
      logger.error(`Erro ao recuperar do cache (${key}):`, error.message)
      return undefined
    }
  }

  // Verificar se existe no cache
  has(key) {
    return this.cache.has(key)
  }

  // Remover do cache
  del(key) {
    try {
      return this.cache.del(key)
    } catch (error) {
      logger.error(`Erro ao remover do cache (${key}):`, error.message)
      return false
    }
  }

  // Limpar todo o cache
  clear() {
    try {
      this.cache.flushAll()
      logger.info("🧹 Cache limpo completamente")
      return true
    } catch (error) {
      logger.error("Erro ao limpar cache:", error.message)
      return false
    }
  }

  // Estatísticas do cache
  getStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      ksize: this.cache.getStats().ksize,
      vsize: this.cache.getStats().vsize,
    }
  }

  // Listar todas as chaves
  keys() {
    return this.cache.keys()
  }

  // Cache específico para Meta Ads com TTL maior
  setMetaAds(key, value) {
    return this.set(`meta_${key}`, value, 600) // 10 minutos
  }

  getMetaAds(key) {
    return this.get(`meta_${key}`)
  }

  // Cache para campanhas Facebook
  setCampanhas(value) {
    return this.set("campanhas_facebook", value, 300) // 5 minutos
  }

  getCampanhas() {
    return this.get("campanhas_facebook")
  }
}

module.exports = new CacheService()

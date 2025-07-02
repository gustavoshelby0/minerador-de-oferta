class FacebookAdsMiner {
  constructor() {
    this.apiBaseUrl = "/api"
    this.currentData = []
    this.currentTab = "dashboard"
    this.metaAds = []
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.checkApiHealth()
    this.buscarAnuncios() // Sua função integrada
    this.showTab("dashboard")
    this.testMetaConnection()
  }

  // SUA FUNÇÃO INTEGRADA - Buscar anúncios da Meta Ad Library
  async buscarAnuncios() {
    try {
      console.log("🔍 Buscando anúncios da Meta Ad Library...")

      // Faz a requisição para o backend que acessa a Meta Ad Library
      const res = await fetch("/api/meta-ads?search_terms=iphone&ad_reached_countries=BR&limit=20")

      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.status)
      }

      const data = await res.json()

      if (!data || !data.data || data.data.length === 0) {
        document.getElementById("anuncios-container").innerHTML =
          '<p class="text-center text-gray-400 col-span-full">Nenhum anúncio encontrado.</p>'
        return
      }

      console.log(`✅ ${data.data.length} anúncios encontrados`)

      // Mapeia e monta o HTML dos anúncios
      const html = data.data
        .map(
          (anuncio) => `
        <div class="card rounded-lg border border-purple-500 shadow-md p-4 bg-gray-800 cursor-pointer transition-transform hover:scale-[1.03]">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-lg font-semibold text-purple-400">${anuncio.page_name || "Anunciante não informado"}</h4>
            <span class="status-badge ${anuncio.is_active ? "bg-green-600 text-green-300" : "bg-gray-600 text-gray-300"}">
              ${anuncio.is_active ? "Ativo" : "Inativo"}
            </span>
          </div>
          
          <div class="bg-gray-700 rounded-lg p-3 mb-3">
            <p class="text-gray-300 text-sm leading-relaxed">${(anuncio.ad_creative_body || "Texto não disponível").substring(0, 150)}...</p>
          </div>
          
          <div class="space-y-1 mb-4">
            <p class="text-gray-300 text-sm"><strong>Impressões:</strong> ${this.formatImpressions(anuncio.impressions)}</p>
            <p class="text-gray-300 text-sm"><strong>Investimento:</strong> ${this.formatSpend(anuncio.spend, anuncio.currency)}</p>
            <p class="text-gray-300 text-sm"><strong>Criado:</strong> ${this.formatDate(anuncio.ad_creation_time)}</p>
          </div>
          
          <div class="flex items-center justify-between mt-auto">
            <button onclick="window.open('${anuncio.ad_snapshot_url}', '_blank')" 
                    class="bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg font-semibold text-sm transition flex-1 mr-2">
              Ver Anúncio
            </button>
            <a href="${anuncio.ad_snapshot_url}" target="_blank" 
               class="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg text-sm transition">
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      `,
        )
        .join("")

      document.getElementById("anuncios-container").innerHTML = html

      // Atualizar stats
      this.renderStatsFromMetaAds(data.data)
    } catch (error) {
      console.error("❌ Erro ao buscar anúncios:", error)
      document.getElementById("anuncios-container").innerHTML = `<div class="col-span-full text-center py-12">
          <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h3 class="text-lg font-medium text-red-300 mb-2">Erro ao carregar anúncios</h3>
          <p class="text-red-500">${error.message}</p>
          <button onclick="window.location.reload()" class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Tentar Novamente
          </button>
        </div>`
    }
  }

  // Renderizar stats baseado nos anúncios da Meta
  renderStatsFromMetaAds(ads) {
    const container = document.getElementById("stats-container")

    const totalAnuncios = ads.length
    const anunciosAtivos = ads.filter((ad) => ad.is_active).length
    const totalImpressions = ads.reduce((sum, ad) => {
      if (ad.impressions && typeof ad.impressions === "object") {
        return sum + Number.parseInt(ad.impressions.upper_bound || 0)
      }
      return sum
    }, 0)
    const totalSpend = ads.reduce((sum, ad) => {
      if (ad.spend && typeof ad.spend === "object") {
        return sum + Number.parseInt(ad.spend.upper_bound || 0)
      }
      return sum
    }, 0)

    container.innerHTML = `
      <div class="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Anúncios Encontrados</p>
            <p class="text-2xl font-bold text-white">${totalAnuncios}</p>
          </div>
          <div class="text-purple-500">
            <i class="fab fa-meta text-2xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Anúncios Ativos</p>
            <p class="text-2xl font-bold text-white">${anunciosAtivos}</p>
          </div>
          <div class="text-green-500">
            <i class="fas fa-play-circle text-2xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Impressões Totais</p>
            <p class="text-2xl font-bold text-white">${this.formatNumber(totalImpressions)}</p>
          </div>
          <div class="text-blue-500">
            <i class="fas fa-eye text-2xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Investimento Total</p>
            <p class="text-2xl font-bold text-white">$${this.formatNumber(totalSpend)}</p>
          </div>
          <div class="text-orange-500">
            <i class="fas fa-dollar-sign text-2xl"></i>
          </div>
        </div>
      </div>
    `

    // Mostrar stats
    container.classList.remove("hidden")
  }

  // Função para buscar anúncios com palavra-chave personalizada
  async buscarAnunciosPersonalizado(palavraChave = "iphone", pais = "BR") {
    try {
      const res = await fetch(`/api/meta-ads?search_terms=${palavraChave}&ad_reached_countries=${pais}&limit=20`)

      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.status)
      }

      const data = await res.json()

      if (data.success && data.data.length > 0) {
        // Atualizar container de mineração
        const html = data.data
          .map(
            (anuncio) => `
          <div class="card rounded-lg border border-orange-500 shadow-md p-4 bg-gray-800">
            <div class="flex justify-between items-center mb-2">
              <h4 class="text-lg font-semibold text-orange-400">${anuncio.page_name}</h4>
              <span class="status-badge bg-yellow-500 text-yellow-900">Minerado</span>
            </div>
            
            <div class="bg-gray-700 rounded-lg p-3 mb-3">
              <p class="text-gray-300 text-sm">${(anuncio.ad_creative_body || "Texto não disponível").substring(0, 100)}...</p>
            </div>
            
            <div class="space-y-1 mb-4">
              <p class="text-gray-300 text-sm"><strong>Impressões:</strong> ${this.formatImpressions(anuncio.impressions)}</p>
              <p class="text-gray-300 text-sm"><strong>Investimento:</strong> ${this.formatSpend(anuncio.spend, anuncio.currency)}</p>
            </div>
            
            <button onclick="window.open('${anuncio.ad_snapshot_url}', '_blank')" 
                    class="w-full bg-orange-600 hover:bg-orange-700 text-white py-1.5 px-3 rounded-lg font-semibold text-sm transition">
              Ver Detalhes
            </button>
          </div>
        `,
          )
          .join("")

        document.getElementById("mineracao-anuncios-container").innerHTML = html
      }
    } catch (error) {
      console.error("Erro ao buscar anúncios personalizados:", error)
    }
  }

  // Resto das funções originais...
  setupEventListeners() {
    // Navigation
    document.getElementById("dashboardMenuBtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.showTab("dashboard")
    })

    document.getElementById("mineracaoMenuBtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.showTab("mineracao")
      // Buscar anúncios minerados quando abrir a aba
      this.buscarAnunciosPersonalizado("curso", "BR")
    })

    document.getElementById("metaLibraryMenuBtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.showTab("metaLibrary")
    })

    document.getElementById("indiqueMenuBtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.showTab("indique")
    })

    // Buttons
    document.getElementById("refresh-btn").addEventListener("click", () => {
      this.buscarAnuncios() // Recarregar anúncios
    })

    document.getElementById("config-btn").addEventListener("click", () => {
      this.autoConfigureAccount()
    })

    // Meta Library
    document.getElementById("metaSearchBtn").addEventListener("click", () => {
      this.searchMetaAds()
    })

    document.getElementById("metaSearchInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchMetaAds()
      }
    })

    // Filters
    document.getElementById("searchInput").addEventListener("input", () => {
      this.applyFilters()
    })
  }

  showTab(tabName) {
    this.currentTab = tabName

    // Hide all tabs
    document.getElementById("adsTab").classList.add("hidden")
    document.getElementById("mineracaoTab").classList.add("hidden")
    document.getElementById("metaLibraryTab").classList.add("hidden")
    document.getElementById("indiqueTab").classList.add("hidden")
    document.getElementById("stats-container").classList.add("hidden")

    // Remove active class from all nav items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
      item.classList.add("text-gray-400")
    })

    // Show selected tab and activate nav item
    switch (tabName) {
      case "dashboard":
        document.getElementById("adsTab").classList.remove("hidden")
        document.getElementById("stats-container").classList.remove("hidden")
        document.getElementById("dashboardMenuBtn").classList.add("active")
        document.getElementById("dashboardMenuBtn").classList.remove("text-gray-400")
        break

      case "mineracao":
        document.getElementById("mineracaoTab").classList.remove("hidden")
        document.getElementById("mineracaoMenuBtn").classList.add("active")
        document.getElementById("mineracaoMenuBtn").classList.remove("text-gray-400")
        break

      case "metaLibrary":
        document.getElementById("metaLibraryTab").classList.remove("hidden")
        document.getElementById("metaLibraryMenuBtn").classList.add("active")
        document.getElementById("metaLibraryMenuBtn").classList.remove("text-gray-400")
        break

      case "indique":
        document.getElementById("indiqueTab").classList.remove("hidden")
        document.getElementById("indiqueMenuBtn").classList.add("active")
        document.getElementById("indiqueMenuBtn").classList.remove("text-gray-400")
        break
    }
  }

  // Funções de formatação
  formatImpressions(impressions) {
    if (!impressions) return "N/A"
    if (typeof impressions === "object") {
      return `${this.formatNumber(impressions.lower_bound || 0)} - ${this.formatNumber(impressions.upper_bound || 0)}`
    }
    return this.formatNumber(impressions)
  }

  formatSpend(spend, currency = "USD") {
    if (!spend) return "N/A"
    if (typeof spend === "object") {
      return `${currency} ${this.formatNumber(spend.lower_bound || 0)} - ${this.formatNumber(spend.upper_bound || 0)}`
    }
    return `${currency} ${this.formatNumber(spend)}`
  }

  formatDate(dateString) {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  formatNumber(num) {
    if (!num) return "0"
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Meta Library Functions (mantidas)
  async testMetaConnection() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/meta-ads/test`, { method: "POST" })
      const result = await response.json()

      const statusEl = document.getElementById("metaConnectionStatus")
      if (!statusEl) return

      const dot = statusEl.querySelector("div")
      const text = statusEl.querySelector("span")

      if (result.success) {
        dot.className = "w-2 h-2 bg-green-500 rounded-full"
        text.textContent = "✅ Conectado à Meta Ad Library"
        text.className = "text-sm text-green-400"
      } else {
        dot.className = "w-2 h-2 bg-red-500 rounded-full pulse"
        text.textContent = "❌ Erro na conexão: " + result.error
        text.className = "text-sm text-red-400"
      }
    } catch (error) {
      console.error("Erro ao testar Meta connection:", error)
    }
  }

  async searchMetaAds() {
    const searchTerm = document.getElementById("metaSearchInput").value.trim()
    if (!searchTerm) {
      alert("Digite uma palavra-chave para buscar")
      return
    }

    const loadingEl = document.getElementById("metaLoading")
    const emptyStateEl = document.getElementById("metaEmptyState")
    const resultsEl = document.getElementById("metaResults")
    const searchBtn = document.getElementById("metaSearchBtn")

    // Show loading
    loadingEl.classList.remove("hidden")
    emptyStateEl.classList.add("hidden")
    resultsEl.innerHTML = ""
    searchBtn.disabled = true
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Buscando...'

    try {
      const params = new URLSearchParams({
        search_terms: searchTerm,
        ad_reached_countries: "BR",
        limit: "10",
      })

      const response = await fetch(`${this.apiBaseUrl}/meta-ads?${params}`)
      const result = await response.json()

      if (result.success && result.data.length > 0) {
        this.metaAds = result.data
        this.renderMetaAds(result.data)
        emptyStateEl.classList.add("hidden")
      } else {
        resultsEl.innerHTML = `
          <div class="text-center py-12">
            <i class="fas fa-search text-6xl text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-300 mb-2">Nenhum anúncio encontrado</h3>
            <p class="text-gray-500">Tente uma palavra-chave diferente</p>
          </div>
        `
      }
    } catch (error) {
      console.error("Erro ao buscar Meta ads:", error)
      resultsEl.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
          <h3 class="text-lg font-medium text-red-300 mb-2">Erro na busca</h3>
          <p class="text-red-500">${error.message}</p>
        </div>
      `
    } finally {
      loadingEl.classList.add("hidden")
      searchBtn.disabled = false
      searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Buscar'
    }
  }

  renderMetaAds(ads) {
    const container = document.getElementById("metaResults")

    container.innerHTML = `
      <div class="mb-6">
        <h3 class="text-xl font-bold text-white mb-2">Resultados encontrados: ${ads.length}</h3>
        <p class="text-gray-400">Anúncios públicos da Meta Ad Library</p>
      </div>
    `

    ads.forEach((ad) => {
      const adCard = document.createElement("div")
      adCard.className = "meta-ad-card"

      adCard.innerHTML = `
        <div class="grid lg:grid-cols-2 gap-0">
          <div class="p-6 space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-xl font-semibold text-white">${ad.page_name}</h4>
                <div class="flex items-center space-x-2 mt-2">
                  <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    ad.is_active ? "bg-green-600 text-green-300" : "bg-gray-600 text-gray-300"
                  }">
                    ${ad.is_active ? "Ativo" : "Inativo"}
                  </span>
                  ${ad.platforms
                    .map(
                      (platform) =>
                        `<span class="px-2 py-1 rounded-full text-xs bg-blue-600 text-blue-300">${platform}</span>`,
                    )
                    .join("")}
                </div>
              </div>
              
              <a href="${ad.ad_snapshot_url}" target="_blank" 
                 class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                <i class="fas fa-external-link-alt mr-1"></i>
                Ver Original
              </a>
            </div>

            <div class="bg-gray-800 rounded-lg p-4">
              <h5 class="font-medium text-purple-400 mb-2">Texto do Anúncio:</h5>
              <p class="text-gray-300 leading-relaxed">${ad.ad_creative_body}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center space-x-2">
                <i class="fas fa-eye text-blue-400"></i>
                <div>
                  <p class="text-xs text-gray-400">Impressões</p>
                  <p class="text-sm font-semibold text-white">${this.formatImpressions(ad.impressions)}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <i class="fas fa-dollar-sign text-green-400"></i>
                <div>
                  <p class="text-xs text-gray-400">Investimento</p>
                  <p class="text-sm font-semibold text-white">${this.formatSpend(ad.spend, ad.currency)}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <i class="fas fa-calendar text-purple-400"></i>
                <div>
                  <p class="text-xs text-gray-400">Criado em</p>
                  <p class="text-sm font-semibold text-white">${this.formatDate(ad.ad_creation_time)}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <i class="fas fa-users text-orange-400"></i>
                <div>
                  <p class="text-xs text-gray-400">Público</p>
                  <p class="text-sm font-semibold text-white">${ad.estimated_audience?.lower_bound || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 p-6 flex items-center justify-center">
            <div class="w-full max-w-md">
              <h5 class="font-medium text-white mb-3 text-center">Preview do Anúncio</h5>
              <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <iframe src="${ad.ad_snapshot_url}" 
                        class="meta-ad-iframe"
                        title="Anúncio de ${ad.page_name}"
                        sandbox="allow-scripts allow-same-origin">
                </iframe>
              </div>
              <p class="text-xs text-gray-400 text-center mt-2">Snapshot oficial da Meta Ad Library</p>
            </div>
          </div>
        </div>
      `

      container.appendChild(adCard)
    })
  }

  async checkApiHealth() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`)
      const health = await response.json()

      this.updateStatusIndicator(health.status === "OK", health.facebook_api === "connected")
    } catch (error) {
      console.error("Erro no health check:", error)
      this.updateStatusIndicator(false, false)
    }
  }

  updateStatusIndicator(serverOk, facebookOk) {
    const indicator = document.getElementById("status-indicator")
    const dot = indicator.querySelector("div")
    const text = indicator.querySelector("span")

    if (serverOk && facebookOk) {
      dot.className = "w-2 h-2 bg-green-500 rounded-full"
      text.textContent = "Conectado"
      text.className = "text-sm text-green-400"
    } else if (serverOk && !facebookOk) {
      dot.className = "w-2 h-2 bg-yellow-500 rounded-full pulse"
      text.textContent = "API Facebook com erro"
      text.className = "text-sm text-yellow-400"
    } else {
      dot.className = "w-2 h-2 bg-red-500 rounded-full pulse"
      text.textContent = "Desconectado"
      text.className = "text-sm text-red-400"
    }
  }

  applyFilters() {
    // Implementar filtros se necessário
  }

  async autoConfigureAccount() {
    const configBtn = document.getElementById("config-btn")
    const originalText = configBtn.innerHTML

    configBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Configurando...'
    configBtn.disabled = true

    try {
      const response = await fetch(`${this.apiBaseUrl}/health/configure`, {
        method: "POST",
      })
      const result = await response.json()

      if (result.status === "OK") {
        alert(`✅ Conta configurada automaticamente!\nAd Account: ${result.ad_account_id}`)
        await this.buscarAnuncios()
      } else {
        throw new Error(result.error || "Erro na configuração")
      }
    } catch (error) {
      console.error("Erro na auto-configuração:", error)
      alert("❌ Erro na configuração: " + error.message)
    } finally {
      configBtn.innerHTML = originalText
      configBtn.disabled = false
    }
  }
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  new FacebookAdsMiner()
})

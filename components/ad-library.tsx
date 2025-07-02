"use client"

import { useState } from "react"
import { Header } from "./header"
import { SearchSection } from "./search-section"
import { AdResults } from "./ad-results"
import { Tools } from "./tools"

export function AdLibrary() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string, filters: any) => {
    setIsSearching(true)
    setSearchQuery(query)
    setError(null)

    try {
      // Chamar sua API Next.js que consulta a Meta Ad Library
      const params = new URLSearchParams({
        search_terms: query,
        limit: "20",
        ad_reached_countries: "BR",
        ad_active_status: "ALL",
        media_type: "ALL",
      })

      const res = await fetch(`/api/ad-library?${params.toString()}`, {
        method: "GET",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Erro ao buscar anúncios")
      }

      const data = await res.json()

      // data.data contém os anúncios reais da API
      setSearchResults(data.data || [])
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao buscar anúncios")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ad Library</h1>
          <div className="text-gray-600 space-y-2">
            <p>Search all the ads currently running across Meta technologies, as well as:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Ads about social issues, elections or politics that have run in the past seven years</li>
              <li>Ads that have run anywhere in the EU in the past year</li>
            </ul>
            <p className="mt-4">To find an ad, search for keywords or an advertiser.</p>
          </div>
        </div>

        <SearchSection onSearch={handleSearch} isSearching={isSearching} />

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {searchResults.length > 0 && <AdResults results={searchResults} searchQuery={searchQuery} />}

        {searchResults.length === 0 && !isSearching && !error && <Tools />}
      </main>
    </div>
  )
}

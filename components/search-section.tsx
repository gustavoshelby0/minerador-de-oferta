"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, HelpCircle } from "lucide-react"

interface SearchSectionProps {
  onSearch: (query: string, filters: any) => void
  isSearching: boolean
}

export function SearchSection({ onSearch, isSearching }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [country, setCountry] = useState("BR")
  const [adCategory, setAdCategory] = useState("all")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery, { country, adCategory })
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Search ads</span>
          <Button variant="ghost" size="sm" className="text-blue-600">
            <HelpCircle className="h-4 w-4 mr-1" />
            View search tips
          </Button>
        </CardTitle>
        <p className="text-sm text-gray-600">Set your location and choose an ad category to start your search.</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BR">Brasil</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="IT">Italy</SelectItem>
              <SelectItem value="ES">Spain</SelectItem>
              <SelectItem value="MX">Mexico</SelectItem>
            </SelectContent>
          </Select>

          <Select value={adCategory} onValueChange={setAdCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Ad category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ads</SelectItem>
              <SelectItem value="issues">Issues, elections or politics</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 flex space-x-2">
            <Input
              placeholder="Search by keyword or advertiser name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

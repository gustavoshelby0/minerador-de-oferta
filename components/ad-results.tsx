"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Calendar, Users, DollarSign, Eye, Filter } from "lucide-react"
import Image from "next/image"

interface AdResultsProps {
  results: any[]
  searchQuery: string
}

export function AdResults({ results, searchQuery }: AdResultsProps) {
  const [sortBy, setSortBy] = useState("relevancy")
  const [filterActive, setFilterActive] = useState("all")

  const filteredResults = results.filter((ad) => {
    if (filterActive === "all") return true
    if (filterActive === "active") return ad.is_active
    if (filterActive === "inactive") return !ad.is_active
    return true
  })

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎥"
      case "carousel":
        return "🖼️"
      default:
        return "📷"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Search results for "{searchQuery}"</h2>
          <p className="text-gray-600 mt-1">{filteredResults.length} ads found</p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={filterActive} onValueChange={setFilterActive}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ads</SelectItem>
              <SelectItem value="active">Active only</SelectItem>
              <SelectItem value="inactive">Inactive only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancy">Most relevant</SelectItem>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="impressions">Most impressions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredResults.map((ad) => (
          <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Ad Creative */}
                <div className="lg:w-1/3 p-6 bg-gray-50">
                  <div className="relative">
                    <Image
                      src={ad.image_url || "/placeholder.svg"}
                      alt="Ad creative"
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-lg">{getMediaTypeIcon(ad.media_type)}</span>
                    </div>
                    {ad.cta_text && (
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-blue-600 text-white">{ad.cta_text}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ad Details */}
                <div className="lg:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{ad.page_name}</h3>
                        <Badge variant={ad.is_active ? "default" : "secondary"}>
                          {ad.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Started {ad.ad_creation_time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{ad.impressions} impressions</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {ad.platforms.map((platform: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View in Ad Library
                    </Button>
                  </div>

                  {/* Ad Text */}
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed">{ad.ad_creative_body}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Estimated spend</p>
                        <p className="text-sm font-semibold">{ad.spend_range}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Demographics</p>
                        <p className="text-sm font-semibold">{ad.demographics}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Reach</p>
                        <p className="text-sm font-semibold">{ad.impressions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No ads found matching your search criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

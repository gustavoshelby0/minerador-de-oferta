import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, Code, ExternalLink } from "lucide-react"

export function Tools() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore other tools</h2>
        <p className="text-gray-600">
          You can also find detailed ad information by using the Ad Library Report or the Ad Library API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ad Library Report */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Download information and track spending</h3>
                <p className="text-gray-600 mb-4">
                  For ads about social issues, elections or politics, use the <strong>Ad Library Report</strong> to see
                  overall spending totals and details about spending by advertiser and location.
                </p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Who the report is for</h4>
                  <p className="text-sm text-gray-600">
                    Anyone who wants to quickly explore, filter and download data on ads about social issues, elections
                    or politics.
                  </p>
                </div>

                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Download className="h-4 w-4 mr-2" />
                  Go to Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Library API */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <Code className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customize your own search</h3>
                <p className="text-gray-600 mb-4">
                  Use the <strong>Ad Library API</strong> to build custom searches using parameters like an ad's
                  estimated audience size, country or language.
                </p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Who the API is for</h4>
                  <p className="text-sm text-gray-600">
                    People who know a little about how programming works. You'll need to complete a few steps to access
                    the API.
                  </p>
                </div>

                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn about the API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">About the Ad Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800 space-y-3">
            <p>
              The Ad Library provides advertising transparency by offering a comprehensive, searchable collection of ads
              currently running across Meta technologies.
            </p>
            <p>
              For ads about social issues, elections or politics, the Ad Library also includes ads that have run in the
              past seven years, along with information about how much was spent running each ad and demographic
              information about the audience that saw the ad.
            </p>
            <div className="flex space-x-4 mt-4">
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 bg-transparent">
                Learn more about ad transparency
              </Button>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 bg-transparent">
                Ad Library help center
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

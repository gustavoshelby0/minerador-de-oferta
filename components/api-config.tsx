"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

interface ApiConfigProps {
  onConfigured: () => void
}

export function ApiConfig({ onConfigured }: ApiConfigProps) {
  const [accessToken, setAccessToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleConnect = async () => {
    setIsConnecting(true)
    setConnectionStatus("idle")

    try {
      // Exemplo básico de chamada para validar o token
      const res = await fetch(
        `https://graph.facebook.com/v15.0/ads_archive?access_token=${accessToken}&search_terms=["test"]`
      )

      if (!res.ok) {
        throw new Error("Token inválido ou erro na API")
      }

      // Pode extrair dados reais aqui se quiser
      setConnectionStatus("success")
      setTimeout(() => {
        onConfigured()
      }, 1000)
    } catch (error) {
      setConnectionStatus("error")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Configuração da API</h2>
        <p className="text-gray-600 mt-2">Configure sua conexão com a Facebook Ad Library API</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facebook Ad Library API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="access-token">Access Token</Label>
              <Input
                id="access-token"
                type="password"
                placeholder="Seu Facebook Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">Token de acesso para a Facebook Ad Library API</p>
            </div>

            <Button onClick={handleConnect} disabled={!accessToken || isConnecting} className="w-full">
              {isConnecting ? "Conectando..." : "Conectar API"}
            </Button>
          </div>

          {connectionStatus === "success" && (
            <Alert className="border-green-200 bg-green-50 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800">
                Conexão estabelecida com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === "error" && (
            <Alert className="border-red-200 bg-red-50 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                Erro na conexão. Verifique seu Access Token.
              </AlertDescription>
            </Alert>
          )}

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Como obter seu Access Token:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Acesse o <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline">Facebook Developers</a></li>
              <li>Crie um app ou use um existente</li>
              <li>Adicione o produto "Marketing API"</li>
              <li>Gere um Access Token com permissões de <code>ads_read</code></li>
              <li>Cole o token no campo acima</li>
            </ol>
            <Button
              as="a"
              href="https://developers.facebook.com/"
              target="_blank"
              rel="noreferrer"
              variant="outline"
              className="mt-3 bg-transparent"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Facebook Developers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

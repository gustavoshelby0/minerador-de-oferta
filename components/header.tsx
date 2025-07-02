"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Evita hidratação incorreta do tema

  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 bg-white dark:bg-black">
      <div className="flex justify-between items-center">
        <div></div>

        <div className="flex gap-3 items-center">
          {/* Botão alternar tema */}
          <Button
            size="icon"
            variant="ghost"
            className="p-2 rounded-full bg-muted text-[#A259FF] hover:bg-muted/80 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notificações */}
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="p-2 rounded-full bg-muted text-[#A259FF] hover:bg-muted/80 transition-colors relative"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                3
              </span>
            </Button>
          </div>

          {/* Perfil do usuário com dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#A259FF] hover:border-[#8A3FFF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A259FF] focus:ring-offset-2"
                aria-label="Perfil"
              >
                <div className="w-full h-full flex items-center justify-center bg-[#2A2A2A] text-[#A259FF]">
                  <User className="h-6 w-6" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

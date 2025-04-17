"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins } from "lucide-react"
import Countdown from "@/components/countdown"
import { useMobile } from "@/hooks/use-mobile"

export default function TokenClaimPage() {
  const [lastClaim, setLastClaim] = useState<number | null>(null)
  const [canClaim, setCanClaim] = useState(true)
  const [loading, setLoading] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const isMobile = useMobile()

  // Comprobar si ya se ha reclamado en las últimas 24 horas
  useEffect(() => {
    const storedLastClaim = localStorage.getItem("lastHatClaim")

    if (storedLastClaim) {
      const lastClaimTime = Number.parseInt(storedLastClaim)
      setLastClaim(lastClaimTime)

      const now = Date.now()
      const timeElapsed = now - lastClaimTime
      const cooldownPeriod = 24 * 60 * 60 * 1000 // 24 horas en milisegundos

      if (timeElapsed < cooldownPeriod) {
        setCanClaim(false)
      }
    }
  }, [])

  // Función para reclamar tokens
  const claimTokens = () => {
    setLoading(true)

    // Simulación de una petición a la API
    setTimeout(() => {
      const now = Date.now()
      localStorage.setItem("lastHatClaim", now.toString())
      setLastClaim(now)
      setCanClaim(false)
      setClaimed(true)
      setLoading(false)

      // Resetear el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setClaimed(false)
      }, 3000)
    }, 1500)
  }

  // Función para actualizar el estado cuando finaliza el cooldown
  const handleCooldownComplete = () => {
    setCanClaim(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FEED86]">
      <Card className="w-full max-w-md bg-[#2C2C5A] text-black shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#F9D649] border-2 border-black">
            <img src="https://hat.ow.academy/assets/icon.png" alt="HAT Icon" className="h-24 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#F5AD00] ">Claim HAT Tokens</CardTitle>
          <CardDescription className="text-white">Claim your daily HAT tokens</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {!canClaim && lastClaim && (
            <div className="mb-6">
              <p className="mb-2 text-[#F5AD00]">Time left to claim:</p>
              <Countdown targetDate={lastClaim + 24 * 60 * 60 * 1000} onComplete={handleCooldownComplete} />
            </div>
          )}

          {claimed && (
            <div className="mb-4 rounded-md bg-[#F9D649]/30 p-3 text-[#2C2C5A] font-bold border border-[#F9D649]">HAT tokens claimed successfully!</div>
          )}

          <div className="mt-4 rounded-lg bg-[#FFF3A3]/60 p-4 border border-[#F9D649]">
            <p className="text-lg text-black font-bold">Information:</p>
            <p className="mt-2 text-sm text-white">
              You can claim HAT tokens once every 24 hours. The tokens will be automatically sent to your connected wallet.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className={`w-full ${canClaim ? "bg-[#F9D649] hover:bg-[#FFE066] text-black" : "bg-gray-400 cursor-not-allowed text-gray-600"}`}
            disabled={!canClaim || loading}
            onClick={claimTokens}
            size={isMobile ? "lg" : "default"}
          >
            {loading ? "Claiming..." : canClaim ? "Claim HAT Tokens" : "On Cooldown"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

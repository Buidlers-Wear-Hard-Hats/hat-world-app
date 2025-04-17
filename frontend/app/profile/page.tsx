"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { CheckCircle2, Github, Linkedin, Globe, Twitter } from "lucide-react"

export default function ProfilePage() {
  const isMobile = useMobile()
  const userAddress = "0x1234...5678" // Dirección de ejemplo
  const userScore = 1250

  const verificationMethods = [
    {
      name: "GitHub",
      icon: Github,
      points: 100,
      verified: true,
      description: "Connect your GitHub account"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      points: 150,
      verified: false,
      description: "Connect your LinkedIn profile"
    },
    {
      name: "Website",
      icon: Globe,
      points: 75,
      verified: false,
      description: "Verify your personal website"
    },
    {
      name: "Twitter",
      icon: Twitter,
      points: 50,
      verified: true,
      description: "Connect your Twitter account"
    }
  ]

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-[#FEED86]">
      <Card className="w-full max-w-md bg-[#2C2C5A] text-black shadow-xl border-0 mb-6">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#F9D649] border-2 border-black">
            <span className="text-2xl font-bold">👤</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#F5AD00]">User Profile</CardTitle>
          <CardDescription className="text-white">{userAddress}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <p className="text-lg text-[#F5AD00] font-bold">Total Score</p>
            <p className="text-3xl font-bold text-white">{userScore} pts</p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-[#2C2C5A] mb-4">Verification Methods</h2>
        <div className="grid gap-4">
          {verificationMethods.map((method) => (
            <Card key={method.name} className="bg-[#2C2C5A] text-black shadow-xl border-0 h-[100px]">
              <CardContent className="p-4 h-full">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center space-x-3 flex-1">
                    <method.icon className="h-6 w-6 text-[#F5AD00]" />
                    <div>
                      <h3 className="text-lg font-bold text-[#F5AD00]">{method.name}</h3>
                      <p className="text-sm text-white">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 min-w-[120px] justify-end">
                    <span className="text-[#F5AD00] font-bold whitespace-nowrap">{method.points} pts</span>
                    {method.verified ? (
                      <div className="flex items-center text-green-500 w-[90px]">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="ml-1 text-sm">Verified</span>
                      </div>
                    ) : (
                      <Button
                        size={isMobile ? "lg" : "default"}
                        className="bg-[#F9D649] hover:bg-[#FFE066] text-black w-[90px]"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
} 
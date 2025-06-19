"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { CheckCircle2, Github, Hash, Globe, Twitter, CloudDownload, CircleHelp, HandCoins } from "lucide-react"
import { motion } from "framer-motion";

export default function ProfilePage() {
  const isMobile = useMobile()
  const userAddress = "0x1234...5678" // Dirección de ejemplo
  const userScore = 5;

  const verificationMethods = [
    {
      name: "Daily Claim",
      icon: HandCoins,
      points: 1,
      verified: false,
      description: "Claim HAT tokens once every 24 hours"
    },
    {
      name: "GitHub",
      icon: Github,
      points: 5,
      verified: false,
      description: "Connect your GitHub account"
    },
    {
      name: "Clone Repository",
      icon: CloudDownload,
      points: 10,
      verified: false,
      description: "Clone a World repository"
    },
    {
      name: "X Post",
      icon: Hash,
      points: 10,
      verified: false,
      description: "Make a build in public post with #BuidlersWearHardHat #WorldCh"
    },
    {
      name: "Quiz",
      icon: CircleHelp,
      points: 10,
      verified: false,
      description: "Complete the quiz"
    }
  ]

  return (
    <motion.main
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FEED86]" style={{
        backgroundImage: 'url(/hat_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat'
      }}>
      <div
        className="w-full max-w-md bg-[#2C2C5A] text-black shadow-xl border-0"
        style={{ borderRadius: "10px" }}>
        <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#F5AD00]">Builder Leaderboard</CardTitle>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F9D649] border-2 border-black">
            <img
              src="https://hat.ow.academy/assets/icon.png"
              alt="HAT Icon"
              className="h-20 object-contain"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-start text-white text-sm sm:text-base">
            <div className="text-center">
              <p className="text-[#F5AD00] font-semibold">Address</p>
              <p className="text-lg font-bold">{userAddress}</p>
            </div>
            <div className="text-center">
              <p className="text-[#F5AD00] font-semibold">Total Tokens</p>
              <p className="text-xl font-bold">{userScore} HAT</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className={`w-full bg-[#F9D649] hover:bg-[#FFE066] text-black text-lg`}
            size={isMobile ? "lg" : "default"}
          >
            View leaderboard
          </Button>
        </CardFooter>
      </div>


      <div className="w-full max-w-md space-y-4">
        <div className="text-2xl text-[#2C2C5A] my-4">
          <span className="font-bold">Task Center</span><br />
          <span>Complete tasks to earn HAT</span>
        </div>
        <div className="grid gap-4">
          {verificationMethods.map((method) => (
            <Card key={method.name} className="bg-[#2C2C5A] text-black shadow-xl border-0 h-[100px]">
              <CardContent className="p-4 h-full">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center space-x-3 flex-1">
                    <method.icon className="h-6 w-6 text-[#F5AD00]" />
                    <div>
                      <p className="text-sm text-white">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-end">
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
                        {method.points} HAT
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.main>
  )
} 
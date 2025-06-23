"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { CheckCircle2, Github, Hash, Globe, Twitter, CloudDownload, CircleHelp, HandCoins } from "lucide-react"
import { motion } from "framer-motion";
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { useCallback, useEffect, useState } from "react";
import { HAT_ABI } from "@/abi/hatAbi";
import { getPublicClient } from '@wagmi/core';
import { config } from '@/wagmi-config';
import { formatUnits } from 'viem';
import Countdown from "@/components/countdown";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: "This is my statement and here is a link https://worldcoin.com/apps",
  };
};

export default function ProfilePage() {
  const isMobile = useMobile()

  const [user, setUser] = useState<any | null>(null);
  const [userBalance, setUserBalance] = useState<any | null>(0);
  const [isValidate, setIsValidate] = useState<any | null>(false);

  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [canClaim, setCanClaim] = useState(true);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [debbug, setDebbug] = useState<any | null>(null);

  const HAT_CONTRACT_ADDRESS = '0xbA494aEa8295B5640Efb4FF9252df8D388e655dc';

  useEffect(() => {
    const loginUser = localStorage.getItem("userWalletAddress");
    if (loginUser) {
      setUser(loginUser);
      getHatBalance(loginUser);
      getTimeToClaim();
    }
  }, [user]);

  const handleLogin = async () => {
    if (!MiniKit.isInstalled()) {
      return
    }

    setLoading(true);
    const res = await fetch(`/api/nonce`)
    const { nonce } = await res.json()

    const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: nonce,
      requestId: '0', // Optional
      expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      statement: 'This is my statement and here is a link https://worldcoin.com/apps',
    })

    if (finalPayload.status === 'error') {
      setLoading(false);
      return
    } else {
      const response = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });

      if (response.status === 200) {
        const user = MiniKit.user;
        localStorage.setItem("userWalletAddress", user.walletAddress as string);
        setUser(user.walletAddress as string);
        await getHatBalance(user.walletAddress as string);
      }
      setLoading(false);
      await getHatBalance(user.walletAddress as string);

    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setUser(null);
      setUserBalance(0);
      localStorage.removeItem("userWalletAddress");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getHatBalance = async (address: string) => {
    try {
      if (!address) return

      const userAddress = address || user?.address;
      if (!userAddress) return;

      const publicClient = getPublicClient(config);

      const balance = await publicClient.readContract({
        abi: HAT_ABI,
        address: HAT_CONTRACT_ADDRESS,
        functionName: "getHatBalance",
        args: [userAddress],
      });

      const verifyAccount = await publicClient.readContract({
        abi: HAT_ABI,
        address: HAT_CONTRACT_ADDRESS,
        functionName: "getAddressVerification",
        args: [userAddress],
      });

      const validateAccount = verifyAccount as number > 0 ? true : false;

      setIsValidate(validateAccount);

      const tokenAmount = Number(formatUnits(balance as bigint, 18))

      const formattedBalance = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(tokenAmount);

      setUserBalance(formattedBalance);

    } catch (error) {
      console.error("Error getting HAT balance:", error);
    }
  }

  const getTimeToClaim = async () => {
    if (!user) return

    const userAddress = user;
    if (!userAddress) return;

    const publicClient = getPublicClient(config);

    const lastClaim = await publicClient.readContract({
      abi: HAT_ABI,
      address: HAT_CONTRACT_ADDRESS,
      functionName: "lastClaim",
      args: [userAddress],
    });

    const lastClaimTime = Number.parseInt(lastClaim as string) * 1000;
    setLastClaim(lastClaimTime);

    const now = Date.now();
    const timeElapsed = now - lastClaimTime;
    const cooldownPeriod = 24 * 60 * 60 * 1000;

    if (timeElapsed < cooldownPeriod) {
      setCanClaim(false);
    } else {
      setCanClaim(true);
    }
  }

  const handleCooldownComplete = () => {
    setCanClaim(true);
  };

  const verificationMethods = [
    {
      id: 1,
      name: "GitHub",
      icon: Github,
      points: 5,
      verified: false,
      description: "Connect your GitHub account"
    },
    {
      id: 2,
      name: "Fork Repository",
      icon: CloudDownload,
      points: 10,
      verified: false,
      description: "Fork a World repository"
    },
    {
      id: 3,
      name: "X Post",
      icon: Hash,
      points: 10,
      verified: false,
      description: "Make a build in public post with #BuidlersWearHardHat #WorldCh"
    },
    // {
    //   id: 4,
    //   name: "Quiz",
    //   icon: CircleHelp,
    //   points: 10,
    //   verified: false,
    //   description: "Complete the quiz"
    // }
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
              <p className="text-lg font-bold">{user ? `${user.slice(0, 6)}...${user.slice(-4)}` : ''}</p>
            </div>
            <div className="text-center">
              <p className="text-[#F5AD00] font-semibold">Total Tokens</p>
              <p className="text-xl font-bold">{userBalance} HAT</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {user ? (
            <>
              <Button
                className={`w-full bg-[#F9D649] hover:bg-[#FFE066] text-black text-lg`}
                size={isMobile ? "lg" : "default"}
              >
                View leaderboard
              </Button>
            </>

          ) : (
            <>
              <div className="rounded-lg bg-[#FFF3A3]/60 p-4 border border-[#F9D649] w-full">
                <p className="mt-2 text-sm text-white text-center">
                  Please login to complete tasks.
                </p>
                <div className="flex flex-col items-center space-y-2 w-full mt-2">
                  <Button
                    onClick={handleLogin}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardFooter>
      </div>
      {
        user && <div className="w-full max-w-md space-y-4">
          <div className="text-2xl text-[#2C2C5A] my-4">
            <span>{debbug}</span>
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
                        <>
                          {
                            <Button
                              size={isMobile ? "lg" : "default"}
                              className="bg-[#F9D649] hover:bg-[#FFE066] text-black w-[90px] ml-2"
                            >
                              {method.points} HAT
                            </Button>
                          }
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-col items-center space-y-2 w-full mt-2">
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="default"
            >
              {"Sign Out"}
            </Button>
          </div>
        </div>
      }
    </motion.main>
  )
} 
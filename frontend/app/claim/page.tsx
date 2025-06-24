"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Countdown from "@/components/countdown";
import { useMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { HAT_ABI } from "@/abi/hatAbi";

import { getPublicClient } from '@wagmi/core';
import { config } from '@/wagmi-config';
import { formatUnits } from 'viem';

import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: "This is my statement and here is a link https://worldcoin.com/apps",
  };
};

export default function TokenClaimPage() {
  const [user, setUser] = useState<any | null>(null);
  const [userBalance, setUserBalance] = useState<any | null>(null);
  const [isValidate, setIsValidate] = useState<any | null>(0);

  const [debbug, setDebbug] = useState<any | null>(null);

  const [lastClaim, setLastClaim] = useState<number | null>(null);
  const [canClaim, setCanClaim] = useState(true);
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const isMobile = useMobile();

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

  const getAddressVerification = async () => {
    //const loginUser = localStorage.getItem("userWalletAddress");
    const loginUser = "0x34149390029Bbf4f4D9E7AdEa715D7055e145C05";
    console.log("loginUser: " + loginUser);
    if (!loginUser) return;

    const publicClient = getPublicClient(config);

    const verifyAccount = await publicClient.readContract({
      abi: HAT_ABI,
      address: HAT_CONTRACT_ADDRESS,
      functionName: "getAddressVerification",
      args: [loginUser],
    });

    const validateAccount = verifyAccount as number > 0 ? 2 : 1;

    setIsValidate(validateAccount);
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

  const claimTokens = async () => {
    const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: HAT_CONTRACT_ADDRESS,
          abi: HAT_ABI,
          functionName: 'claim',
          args: [],
        },
      ],
    })

    setDebbug(finalPayload);

    if (finalPayload.status != "error") {
      setLoading(true);
      setTimeout(() => {
        const now = Date.now();
        localStorage.setItem("lastHatClaim", now.toString());
        setLastClaim(now);
        setCanClaim(false);
        setClaimed(true);
        setLoading(false);

        setTimeout(() => {
          setClaimed(false);
          const loginUser = localStorage.getItem("userWalletAddress");
          getHatBalance(loginUser as string);
        }, 3000);
      }, 1500);
    }
  };

  const handleCooldownComplete = () => {
    setCanClaim(true);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#FEED86]" style={{
        backgroundImage: 'url(/hat_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat'
      }}>
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md bg-[#2C2C5A] text-black shadow-xl border-0"
            style={{ borderRadius: "10px" }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#F9D649] border-2 border-black">
                <img
                  src="https://hat.ow.academy/assets/icon.png"
                  alt="HAT Icon"
                  className="h-24 object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-[#F5AD00] ">
                Claim HAT Tokens
              </CardTitle>
              <CardDescription className="text-white">
                Claim your daily HAT tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {!canClaim && lastClaim && (
                <div className="mb-6">
                  <p className="mb-2 text-[#F5AD00]">Time left to claim:</p>
                  <Countdown
                    targetDate={lastClaim + 24 * 60 * 60 * 1000}
                    onComplete={handleCooldownComplete}
                  />
                </div>
              )}

              {claimed && (
                <div className="mb-4 rounded-md bg-[#F9D649]/30 p-3 text-[#2C2C5A] font-bold border border-[#F9D649]">
                  HAT tokens claimed successfully!
                </div>
              )}

              <div className="mt-4 rounded-lg bg-[#FFF3A3]/60 p-4 border border-[#F9D649]">
                <p className="text-lg text-black font-bold">Information:</p>
                <p className="mt-2 text-sm text-white">
                  You can claim HAT tokens once every 24 hours. The tokens will be
                  automatically sent to your connected wallet.
                </p>
              </div>
            </CardContent>
            {!user ?
              <CardFooter>
                <div className="flex flex-col items-center space-y-2 w-full mt-2">
                  <Button
                    onClick={handleLogin}
                  >
                    Sign In
                  </Button>
                </div>
              </CardFooter>
              :
              <CardFooter>
                {user && (
                  <>
                    {isValidate == 2 ?
                      <Button
                        className={`w-full ${canClaim
                          ? "bg-[#F9D649] hover:bg-[#FFE066] text-black"
                          : "bg-gray-400 cursor-not-allowed text-gray-600"
                          }`}
                        disabled={!canClaim || loading}
                        onClick={claimTokens}
                        size={isMobile ? "lg" : "default"}
                      >
                        {loading
                          ? "Claiming..."
                          : canClaim
                            ? "Claim HAT Tokens"
                            : "On Cooldown"}
                      </Button>
                      :
                      isValidate == 1 ?
                        <Button
                          className={`w-full bg-[#F9D649] hover:bg-[#FFE066] text-black`}
                          disabled={isValidate == 1}
                          size={isMobile ? "lg" : "default"}
                        >
                          You need verify your World Id to claim HAT
                        </Button>
                        :
                        <Button
                          className={`w-full bg-[#F9D649] hover:bg-[#FFE066] text-black`}
                          onClick={getAddressVerification}
                          size={isMobile ? "lg" : "default"}
                        >
                          Verify your account
                        </Button>
                    }
                  </>
                )}
              </CardFooter>
            }
          </motion.div>
        </>
      </main>
    </>
  );
}
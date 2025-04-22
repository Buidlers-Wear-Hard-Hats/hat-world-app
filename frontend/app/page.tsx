"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins } from "lucide-react";
import Countdown from "@/components/countdown";
import { useMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface DexScreenerData {
  pair: {
    priceUsd: string;
    priceNative: string;
    priceChange: {
      h24: number;
      h6: number;
    };
    volume: {
      h24: number;
      h6: number;
    };
  };
}

export default function HomeHatApp() {
  const [dexData, setDexData] = useState<DexScreenerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDexData = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/worldchain/0xfe7a514022a58a8a4956d77b0aac0b7486f7ba8a');
        const data = await response.json();
        setDexData(data);
      } catch (error) {
        console.error('Error fetching DexScreener data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDexData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4" style={{ 
      backgroundImage: 'url(/hat_background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mt-4 mb-4 p-4 text-center text-4xl font-bold font-pixel"
        style={{ 
          backgroundImage: 'url(https://hat.ow.academy/8621a4b4a0bb087aad56.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '130px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        HAT <br/> Token
      </motion.div>

      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        src="https://raw.githubusercontent.com/open-web-academy/hat-landing/refs/heads/master/public/assets/logo-hat.png"
        alt="HAT Logo"
        className="w-48 mb-4"
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="w-full max-w-md mb-4 p-4 text-center text-xs font-pixel text-white"
        style={{ 
          backgroundImage: 'url(https://hat.ow.academy/8621a4b4a0bb087aad56.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {!loading && dexData && (
          <div className="space-y-4 bg-black/30 p-4 rounded-lg">
            <div className="space-y-2">
              <p className="text-lg font-bold text-yellow-300">Price USD:<br/>${parseFloat(dexData.pair.priceUsd).toFixed(6)}</p>
              <p className="text-lg font-bold text-yellow-300">Price:<br/>${parseFloat(dexData.pair.priceNative).toFixed(6)} WLD</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="text-sm font-bold text-yellow-300 mb-2">Last 24h</p>
                <p className="text-sm text-white">
                  Change: <span className={dexData.pair.priceChange.h24 > 0 ? "text-green-400" : "text-red-400"}>
                    {dexData.pair.priceChange.h24 > 0 ? '↑' : '↓'} {Math.abs(dexData.pair.priceChange.h24).toFixed(2)}%
                  </span>
                </p>
                <p className="text-sm text-white">
                  Volume: <span className="text-yellow-300">${dexData.pair.volume.h24.toFixed(2)}</span>
                </p>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <p className="text-sm font-bold text-yellow-300 mb-2">Last 6h</p>
                <p className="text-sm text-white">
                  Change: <span className={dexData.pair.priceChange.h6 > 0 ? "text-green-400" : "text-red-400"}>
                    {dexData.pair.priceChange.h6 > 0 ? '↑' : '↓'} {Math.abs(dexData.pair.priceChange.h6).toFixed(2)}%
                  </span>
                </p>
                <p className="text-sm text-white">
                  Volume: <span className="text-yellow-300">${dexData.pair.volume.h6.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md mb-4 p-4 mt-6 text-center text-md font-pixel text-white"
        style={{ 
          backgroundImage: 'url(https://raw.githubusercontent.com/open-web-academy/hat-landing/refs/heads/master/public/assets/back-text.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        Every builder needs a Hard $HAT, right?
      </motion.div>
            
    </main>
  );
}

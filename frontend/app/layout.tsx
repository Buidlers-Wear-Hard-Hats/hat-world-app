'use client'

import type { Metadata } from 'next'
import './globals.css'
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { Navbar } from '@/components/navbar'
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { useCallback, useEffect, useState } from "react";

const [loading, setLoading] = useState(false);
const [user, setUser] = useState<any | null>(null);

export const metadata: Metadata = {
  title: 'Hat App',
  description: 'Hat Token App',
  generator: 'Open Web Academy',
}

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: "This is my statement and here is a link https://worldcoin.com/apps",
  };
};

const refreshUserData = useCallback(async () => {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}, []);

useEffect(() => {
  refreshUserData();
}, [refreshUserData]);

const handleLogin = async () => {
  try {
    setLoading(true);
    const res = await fetch(`/api/nonce`);
    const { nonce } = await res.json();

    const { finalPayload } = await MiniKit.commandsAsync.walletAuth(walletAuthInput(nonce));

    if (finalPayload.status === 'error') {
      setLoading(false);
      return;
    } else {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
        credentials: 'include',
      });

      if (response.status === 200) {
        const user = MiniKit.user;
        setUser(user);
      }
      setLoading(false);
    }
  } catch (error) {
    console.error("Login error:", error);
    setLoading(false);
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body>
          <main className="pb-16">
            <button onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : user ? `Welcome, ${user.name || 'User'}` : 'Login'}
            </button>
            {children}
          </main>
          <Navbar />
        </body>
      </MiniKitProvider>
    </html>
  )
}

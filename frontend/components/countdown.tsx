"use client"

import { useEffect, useState } from "react"

interface CountdownProps {
  targetDate: number
  onComplete: () => void
}

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const difference = targetDate - now

      if (difference <= 0) {
        clearInterval(interval)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        onComplete()
        return
      }

      // Calcular horas, minutos y segundos restantes
      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  return (
    <div className="flex justify-center gap-2 text-center">
      <div className="flex flex-col items-center rounded-md bg-gray-700 p-2 min-w-16">
        <span className="text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, "0")}</span>
        <span className="text-xs text-gray-400">Horas</span>
      </div>
      <div className="flex flex-col items-center rounded-md bg-gray-700 p-2 min-w-16">
        <span className="text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, "0")}</span>
        <span className="text-xs text-gray-400">Minutos</span>
      </div>
      <div className="flex flex-col items-center rounded-md bg-gray-700 p-2 min-w-16">
        <span className="text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, "0")}</span>
        <span className="text-xs text-gray-400">Segundos</span>
      </div>
    </div>
  )
}

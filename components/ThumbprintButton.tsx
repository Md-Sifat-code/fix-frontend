"use client"

import { useId } from "react"

interface ThumbprintButtonProps {
  onClick: () => void
  text: string
  isSubmitButton?: boolean
}

export function ThumbprintButton({ onClick, text, isSubmitButton = false }: ThumbprintButtonProps) {
  const uniqueId = useId()
  const buttonClasses =
    "w-20 h-28 sm:w-24 sm:h-32 bg-black rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out hover:scale-105 relative overflow-hidden"

  const gridBackground = (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`whiteGrid-${uniqueId}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255, 255, 255, 1)" strokeWidth="0.3" />
            <circle cx="4" cy="4" r="0.5" fill="rgba(255, 255, 255, 1)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#whiteGrid-${uniqueId})`} />
      </svg>
    </div>
  )

  if (isSubmitButton) {
    return (
      <button onClick={onClick} className={buttonClasses}>
        {gridBackground}
        <div className="relative z-10">
          <svg viewBox="0 0 100 140" className="w-20 h-28 sm:w-24 sm:h-32 fill-none" strokeWidth="1.5">
            <text
              x="50"
              y="60"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-[12px] sm:text-[14px] font-light tracking-[0.2em]"
            >
              SUBMIT
            </text>
            <text
              x="50"
              y="80"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-[12px] sm:text-[14px] font-light tracking-[0.2em]"
            >
              PROJECT
            </text>
          </svg>
        </div>
      </button>
    )
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {gridBackground}
      <div className="relative z-10">
        <svg viewBox="0 0 100 140" className="w-20 h-28 sm:w-24 sm:h-32 fill-none" strokeWidth="1.5">
          {text.split(" ").map((word, i) => (
            <text
              key={i}
              x="50"
              y={text.split(" ").length === 1 ? "70" : i === 0 ? "60" : "80"}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-[12px] sm:text-[14px] font-light tracking-[0.2em] uppercase"
            >
              {word}
            </text>
          ))}
        </svg>
      </div>
    </button>
  )
}

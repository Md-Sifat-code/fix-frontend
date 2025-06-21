export function NegativeGrid() {
  const gridSize = 8 // 1/8 inch = 8 pixels (assuming 96 DPI)
  const dotSize = 1

  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="negativeGrid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.5"
            />
            <circle cx={gridSize / 2} cy={gridSize / 2} r={dotSize / 2} fill="rgba(255, 255, 255, 0.3)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#negativeGrid)" />
      </svg>
    </div>
  )
}

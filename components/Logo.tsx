"use client"



interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={className}>
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TxkXFdGIO4zSEa6yNCbzGZ3WICOLs2.png"
        alt="Architecture Simple Logo"
        width={32}
        height={32}
        className="object-contain"
      />
    </div>
  )
}

export default Logo

import Image from "next/image";

export function BrandLogo({ size = 40, className = "", preload = false, alt = "Oila-Uchun logotipi" }: { size?: number; className?: string; preload?: boolean; alt?: string }) {
  return <Image src="/brand/logo.png" alt={alt} width={size} height={size} sizes={`${size}px`} preload={preload} className={className} style={{ objectFit: "cover", flexShrink: 0 }} />;
}

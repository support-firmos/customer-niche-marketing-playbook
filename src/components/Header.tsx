// src/components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-background py-5">
      <div className="container mx-auto flex flex-col items-center">
        <Link href="/">
          <div className="relative w-50 h-50">
            <Image 
              src="https://storage.googleapis.com/firmos-pics/FirmOS%20Logo%20-%20White.png"
              alt="FirmOS Logo" 
              width={200}
              height={200}
              className="object-contain"
              unoptimized={true}
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
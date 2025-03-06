// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background py-6 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-titleColor text-sm mb-4 md:mb-0">
            © 2025 FirmOS. All rights reserved.
          </div>
          
          <div className="flex gap-4">
            <Link href="https://www.linkedin.com/company/firmos/" target="_blank" rel="noopener noreferrer" 
              className="social-icon" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </Link>
            <Link href="https://x.com/FirmOS_AI" target="_blank" rel="noopener noreferrer" 
              className="social-icon" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </Link>
            <Link href="https://www.youtube.com/@Firm-OS" target="_blank" rel="noopener noreferrer" 
              className="social-icon" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </Link>
            <Link href="https://www.instagram.com/firmos.ai/" target="_blank" rel="noopener noreferrer" 
              className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link href="https://www.facebook.com/FirmOSAI" target="_blank" rel="noopener noreferrer" 
              className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
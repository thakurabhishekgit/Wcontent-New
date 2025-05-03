
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/generate', label: 'Generate' },
  { href: '/predict', label: 'Predict' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/collabs', label: 'Collabs' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="text-sm font-semibold">WContent Lite</p>
          <p className="text-xs text-foreground/60">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
          {navLinks.slice(0, 4).map((link) => ( // Show limited links in footer
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-foreground/60 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex space-x-4">
          {/* Placeholder Social Links */}
          <Link href="#" aria-label="Twitter" className="text-foreground/60 hover:text-primary transition-colors">
            <Twitter className="h-4 w-4" />
          </Link>
          <Link href="#" aria-label="GitHub" className="text-foreground/60 hover:text-primary transition-colors">
            <Github className="h-4 w-4" />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="text-foreground/60 hover:text-primary transition-colors">
            <Linkedin className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

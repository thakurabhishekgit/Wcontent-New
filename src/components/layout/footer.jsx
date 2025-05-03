
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react'; // Removed Feather
import WcontentLogo from '@/components/icons/wcontent-logo'; // Import the new logo

const primaryLinks = [
  { href: '/generate', label: 'Generate' },
  { href: '/predict', label: 'Predict' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/collabs', label: 'Collabs' },
];

const secondaryLinks = [
   // Add more relevant links like About, Contact, Privacy Policy later
  { href: '/dashboard', label: 'Dashboard' },
   { href: '/auth', label: 'Login/Sign Up' },
   // { href: '/about', label: 'About Us' },
   // { href: '/contact', label: 'Contact' },
   // { href: '/privacy', label: 'Privacy Policy' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="container py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Copyright */}
        <div className="col-span-1 flex flex-col items-center md:items-start">
           <Link href="/" className="flex items-center space-x-2 mb-3">
             <WcontentLogo className="h-6 w-6" /> {/* Use new logo */}
             <span className="font-bold">Wcontent</span> {/* Use new name */}
           </Link>
           <p className="text-xs text-foreground/60 text-center md:text-left">
             © {new Date().getFullYear()} Wcontent. <br className="hidden md:inline"/>All rights reserved. {/* Updated copyright */}
           </p>
            <div className="flex space-x-4 mt-4">
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

         {/* Primary Links */}
         <div className="col-span-1 text-center md:text-left">
           <h4 className="font-semibold mb-3">Features</h4>
           <nav className="flex flex-col space-y-2">
             {primaryLinks.map((link) => (
               <Link
                 key={link.href}
                 href={link.href}
                 className="text-sm text-foreground/60 hover:text-primary transition-colors"
               >
                 {link.label}
               </Link>
             ))}
           </nav>
         </div>

          {/* Secondary Links */}
         <div className="col-span-1 text-center md:text-left">
           <h4 className="font-semibold mb-3">Account</h4>
           <nav className="flex flex-col space-y-2">
             {secondaryLinks.map((link) => (
               <Link
                 key={link.href}
                 href={link.href}
                 className="text-sm text-foreground/60 hover:text-primary transition-colors"
               >
                 {link.label}
               </Link>
             ))}
           </nav>
         </div>

         {/* Placeholder/Contact Info */}
         <div className="col-span-1 text-center md:text-left">
            <h4 className="font-semibold mb-3">Legal</h4>
             {/* Add legal links later */}
            <p className="text-sm text-foreground/60 hover:text-primary transition-colors cursor-pointer">Terms of Service</p>
            <p className="text-sm text-foreground/60 hover:text-primary transition-colors cursor-pointer">Privacy Policy</p>
         </div>

      </div>
    </footer>
  );
}

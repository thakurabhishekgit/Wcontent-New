
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, User as UserIcon } from 'lucide-react';
import WcontentLogo from '@/components/icons/wcontent-logo';

const primaryLinks = [
  { href: '/generate', label: 'Generate' },
  { href: '/predict', label: 'Predict' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/collabs', label: 'Collabs' },
];

const secondaryLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/auth', label: 'Login/Sign Up' },
];

const developerInfo = {
  name: "Thakur Abhishek Singh",
  email: "thakur.abhisheksinght97@gmail.com",
  github: "https://github.com/thakurabhishekgit",
  linkedin: "https://linkedin.com/in/thakurabhisheksingh31305/",
};

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="container py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Adjusted grid for developer info */}
        {/* Logo and Copyright */}
        <div className="col-span-1 flex flex-col items-center md:items-start">
           <Link href="/" className="flex items-center space-x-2 mb-3">
             <WcontentLogo className="h-6 w-6" />
             <span className="font-bold">Wcontent</span>
           </Link>
           <p className="text-xs text-foreground/60 text-center md:text-left">
             © {new Date().getFullYear()} Wcontent. <br className="hidden md:inline"/>All rights reserved.
           </p>
            <div className="flex space-x-4 mt-4">
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
        
        {/* Developer Info */}
        <div className="col-span-1 text-center md:text-left">
            <h4 className="font-semibold mb-3">Developed By</h4>
            <div className="flex flex-col space-y-2 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{developerInfo.name}</span>
                </div>
                <a href={`mailto:${developerInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                </a>
                <a href={developerInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                </a>
                <a href={developerInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                </a>
            </div>
         </div>

      </div>
    </footer>
  );
}

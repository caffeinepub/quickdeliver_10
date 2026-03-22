import { type ReactNode } from 'react';
import AppHeader from './AppHeader';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              © 2026. Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <ProfileSetupModal />
    </div>
  );
}

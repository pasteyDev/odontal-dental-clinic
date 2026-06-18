import { Toaster } from "sonner";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import CookieConsent from "./CookieConsent";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster position="top-center" richColors />
      <CookieConsent />
    </div>
  );
}

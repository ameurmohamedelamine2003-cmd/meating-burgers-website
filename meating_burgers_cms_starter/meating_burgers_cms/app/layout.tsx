import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meating Burgers | Miami",
  description: "Burgers, sides and good times in Downtown Miami."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

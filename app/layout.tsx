import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "JobConnect - Connect Workers with Dream Jobs",
  description: "Comprehensive job recruitment platform connecting workers with recruiters across various industries",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <ToastContainer position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}

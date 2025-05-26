import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "JobConnect - A modern job recruitment platform",
  description: "JobConnect connects workers with recruiters",
};

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
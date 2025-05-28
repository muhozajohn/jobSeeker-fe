import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

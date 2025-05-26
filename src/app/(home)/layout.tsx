import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <Navbar />
      <main className="py-8">{children}</main>
      <Footer />
    </div>
  );
}
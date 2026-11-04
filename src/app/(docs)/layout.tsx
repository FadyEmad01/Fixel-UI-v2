import Footer from "@/components/site/layout/Footer";
import Navbar from "@/components/site/layout/Navbar";


export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

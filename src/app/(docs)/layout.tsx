import Navbar from "@/components/site/layout/Navbar";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}

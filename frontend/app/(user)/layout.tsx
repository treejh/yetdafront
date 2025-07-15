import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <SubHeader />
      <main className="w-full md:px-10 lg:px-20 xl:px-32 xxl:px-40 xxxl:px-[320px] max-w-screen-2xl mx-auto">
        {children}
      </main>
      <Footer />
    </>
  );
}

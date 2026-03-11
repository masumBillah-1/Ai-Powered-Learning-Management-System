import Navbar from "@/components/layout/Navbar";
import Myprofilenavbar from "@/components/layout/Myprofilenavbar";
import Footer from "@/components/layout/Footer";

export default function ViewProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#07030e] p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10">

          <aside className="w-full lg:w-80 lg:sticky lg:top-8 h-fit">
            <Myprofilenavbar />
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>

      <Footer />
    </>
  );
}
import BlogNavbar from "@/components/BlogNavbar";
import Footer from "@/components/layout/Footer";



export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fdf2ff]"> {/* Blog er background color */}
      <BlogNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
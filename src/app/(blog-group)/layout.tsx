import BlogNavbar from "@/components/BlogNavbar";
import Footer from "@/components/layout/Footer";
import PopularBlogs from "./PopularBlogs";
import BootcampBanner from "./BootcamtBanner";
import BlogSection from "./BlogSection";



export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#fdf2ff]"> {/* Blog er background color */}
      <BlogNavbar />
       {/* PopularBlogs component ke BlogNavbar er niche rakhbo */}
      <main className="min-h-screen">{children}</main>
      <PopularBlogs />
      <BootcampBanner />
      <BlogSection/>
      <Footer />
    </div>
  );
}
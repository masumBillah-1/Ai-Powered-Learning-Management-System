import React from "react";
import FeaturedBlog from "@/components/Blog/FeaturedBlog";
import PopularBlogs from "@/components/Blog/PopularBlogs";
import BootcampBanner from "@/components/Blog/BootcampBanner";
import BlogSection from "@/components/Blog/BlogSection";
import CareerSection from "@/components/Blog/CareerSection";
import TechUpdateSection from "@/components/Blog/TechUpdateSection";
import NewsletterSection from "@/components/Blog/NewsletterSection";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120]">
      <FeaturedBlog />
      <PopularBlogs />
      <BootcampBanner />
      <BlogSection />
      <CareerSection />
      <TechUpdateSection />
      <NewsletterSection />
    </div>
  );
}

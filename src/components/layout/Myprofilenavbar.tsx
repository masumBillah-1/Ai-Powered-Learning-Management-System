"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, Info, MapPin, GraduationCap, Link as LinkIcon, 
  CheckCircle2, Lightbulb, Briefcase, Info as InfoCircle 
} from "lucide-react";

const Myprofilenavbar = () => {
  const pathname = usePathname();

  // আপনার ইমেজ (image_1a3636.png) অনুযায়ী মেনু আইটেমগুলো
  const menuItems = [
    { name: "My Profile", href: "/viewprofile/myprofile", icon: User },
    { name: "Additional Info", href: "/viewprofile/additional", icon: InfoCircle },
    { name: "Address", href: "/viewprofile/address", icon: MapPin },
    { name: "Education", href: "/viewprofile/education", icon: GraduationCap },
    { name: "Important Links", href: "/viewprofile/links", icon: LinkIcon },
    { name: "Skill Set", href: "/viewprofile/skills", icon: Lightbulb },
    { name: "Job Profile", href: "/viewprofile/job", icon: Briefcase },
  ];

  return (
    <div className="bg-[#11081a] text-white p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl">
      {/* Profile Info Section */}
      <div className="flex flex-col items-center text-center pb-8 border-b border-gray-800 border-dashed relative">
        {/* Top Right Info Icon */}
        <div className="absolute top-0 right-0 text-purple-500 cursor-pointer">
          <InfoCircle size={20} />
        </div>

        {/* Profile Image with Arc */}
        <div className="relative w-28 h-28 rounded-full border-4 border-blue-500/20 p-1 mb-4">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image 
              src="/profile.jpg" // আপনার পাবলিক ফোল্ডারে ইমেজটি রাখুন
              alt="Sakib Al Hasan" 
              fill 
              className="object-cover" 
            />
          </div>
          {/* Blue decorative arc */}
          <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full -m-1"></div>
        </div>
        
        <h2 className="text-xl font-bold tracking-tight text-gray-100">Sakib Al Hasan</h2>
        <div className="text-[13px] text-gray-400 space-y-1 mt-2 font-light">
          <p>WEB12-5243</p>
          <p className="break-all">sadmansakib8530@gmail.com</p>
          <p>+8801937636760</p>
        </div>
      </div>

      {/* Navigation Links Section */}
      <nav className="mt-8 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={index} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-purple-600/10 text-purple-400 border-l-4 border-purple-600" 
                  : "hover:bg-white/5 text-gray-400"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon 
                  size={20} 
                  className={isActive ? "text-purple-500" : "text-gray-500 group-hover:text-gray-300"} 
                />
                <span className="text-[15px] font-medium tracking-wide">{item.name}</span>
              </div>
              
             
              <CheckCircle2 
                size={18} 
                className={isActive ? "text-green-500" : "text-gray-800 opacity-40"} 
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Myprofilenavbar;
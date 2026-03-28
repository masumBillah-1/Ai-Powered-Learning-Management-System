"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "default";
}

interface LogoSettings {
  logoImage: string;
  logoName: string;
  logoNameSecondary: string;
  tagline1: string;
  tagline2: string;
}

const defaultSettings: LogoSettings = {
  logoImage: "/mortarboard.png",
  logoName: "Career",
  logoNameSecondary: "Canvas",
  tagline1: "ELEVATE",
  tagline2: "SKILLS"
};

const Logo = ({ size = "default" }: LogoProps) => {
  const isSm = size === "sm";
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage cache first
    const cached = localStorage.getItem("logoSettings");
    if (cached) {
      try {
        setSettings(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error("Failed to parse cached logo settings:", e);
      }
    }

    // Fetch from API
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings?keys=logoImage,logoName,logoNameSecondary,tagline1,tagline2");
        const data = await res.json();

        if (data.success && data.settings) {
          const newSettings = {
            logoImage: data.settings.logoImage || defaultSettings.logoImage,
            logoName: data.settings.logoName || defaultSettings.logoName,
            logoNameSecondary: data.settings.logoNameSecondary || defaultSettings.logoNameSecondary,
            tagline1: data.settings.tagline1 || defaultSettings.tagline1,
            tagline2: data.settings.tagline2 || defaultSettings.tagline2,
          };
          setSettings(newSettings);
          localStorage.setItem("logoSettings", JSON.stringify(newSettings));
        }
      } catch (error) {
        console.error("Failed to fetch logo settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Listen for storage events (when settings are updated)
    const handleStorageChange = () => {
      fetchSettings();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`rounded-full bg-base-300 animate-pulse ${isSm ? "w-9 h-9" : "w-12 h-12"}`} />
          <div className="flex flex-col gap-1">
            <div className={`bg-base-300 rounded animate-pulse ${isSm ? "h-4 w-24" : "h-6 w-32"}`} />
            {!isSm && <div className="bg-base-300 rounded animate-pulse h-2 w-20" />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      <Link href="/" className="flex items-center gap-2 group no-underline">

        {/* Icon */}
        <div className="relative flex-shrink-0">
          <img
            src={settings.logoImage}
            alt={`${settings.logoName}${settings.logoNameSecondary} Logo`}
            className={`relative select-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ${isSm ? "w-9 h-9" : "w-12 h-12"}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultSettings.logoImage;
            }}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col leading-none min-w-0">
          <div className="flex items-center">
            <span className={`font-[1000] tracking-tighter text-gray-900 dark:text-white transition-colors duration-300 ${isSm ? "text-[18px]" : "text-2xl"}`}>
              {settings.logoName}
            </span>
            <span className={`font-[1000] tracking-tighter bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent ${isSm ? "text-[18px]" : "text-2xl"}`}>
              {settings.logoNameSecondary}
            </span>
          </div>

          {!isSm && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">{settings.tagline1}</span>
              <div className="w-1 h-1 rounded-full bg-gradient-to-r from-[#FF0F7B] to-[#F89B29]" />
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">{settings.tagline2}</span>
            </div>
          )}
        </div>

      </Link>
    </div>
  );
};

export default Logo;
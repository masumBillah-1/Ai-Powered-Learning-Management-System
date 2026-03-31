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

// --- GLOBAL REQUEST REUSE ---
// multiple Logo instances mount at once (Header, Footer, etc.)
// deduplicate fetches using a global promise & memory cache.
let globalLogoSettings: LogoSettings | null = null;
let globalLogoSettings_timestamp: number = 0;
let inflightPromise: Promise<LogoSettings | null> | null = null;

const Logo = ({ size = "default" }: LogoProps) => {
  const isSm = size === "sm";
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const now = Date.now();
    const CACHE_LIMIT = 24 * 60 * 60_000; // 24 hours (persistent)
    const SILENT_REFRESH_LIMIT = 60 * 60_000; // 1 hour (background refresh)

    const handleData = (data: LogoSettings, skipLoading = false) => {
      if (isMounted) {
        setSettings(data);
        if (!skipLoading) setLoading(false);
      }
    };

    const runFetch = async (isSilent = false) => {
      try {
        if (!inflightPromise) {
          inflightPromise = (async () => {
            try {
              const res = await fetch("/api/admin/settings?keys=logoImage,logoName,logoNameSecondary,tagline1,tagline2");
              if (!res.ok) return null;
              
              const data = await res.json();
              if (data.success && data.settings) {
                const fresh = {
                  logoImage: data.settings.logoImage || defaultSettings.logoImage,
                  logoName: data.settings.logoName || defaultSettings.logoName,
                  logoNameSecondary: data.settings.logoNameSecondary || defaultSettings.logoNameSecondary,
                  tagline1: data.settings.tagline1 || defaultSettings.tagline1,
                  tagline2: data.settings.tagline2 || defaultSettings.tagline2,
                };
                localStorage.setItem("logoSettings", JSON.stringify(fresh));
                localStorage.setItem("logoSettings_timestamp", Date.now().toString());
                globalLogoSettings = fresh;
                globalLogoSettings_timestamp = Date.now();
                return fresh;
              }
              return null;
            } catch (err) {
              console.warn("Logo settings fetch failed (network error). Using defaults.");
              return null;
            }
          })();
        }
        const result = await inflightPromise;
        if (result && isMounted) {
          setSettings(result);
          setLoading(false);
        }
      } catch (error) {
        console.error("Logo fetch error:", error);
      } finally {
        inflightPromise = null;
        if (isMounted) setLoading(false);
      }
    };

    // 1. Check in-memory global cache first
    if (globalLogoSettings) {
      handleData(globalLogoSettings);
      // Background refresh only if stale (> 1hr)
      if ((now - globalLogoSettings_timestamp) > SILENT_REFRESH_LIMIT) runFetch(true);
      return;
    }

    // 2. Check localStorage
    const cached = localStorage.getItem("logoSettings");
    const cacheTs = localStorage.getItem("logoSettings_timestamp");
    if (cached && cacheTs) {
      const ts = parseInt(cacheTs);
      const isExpired = (now - ts) > CACHE_LIMIT;
      const isStale = (now - ts) > SILENT_REFRESH_LIMIT;

      if (!isExpired) {
        try {
          const parsed = JSON.parse(cached);
          globalLogoSettings = parsed;
          globalLogoSettings_timestamp = ts;
          handleData(parsed); 
          if (isStale) runFetch(true); // Background update if stale
          return;
        } catch (e) { console.error("Cache error:", e); }
      }
    }

    // 3. Forced fetch (no cache or expired)
    runFetch();
    return () => { isMounted = false; };
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
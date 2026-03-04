"use client";

import { useState } from "react";
import AIChat from "./AIChat";
import LiveChat from "./LiveChat";

type Props = {
  userId: string;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
};

type ActivePanel = null | "ai" | "live";
type PanelSize = "normal" | "large" | "fullscreen";

export default function FloatingChat({
  userId,
  userName = "আপনি",
  userRole = "student",
  userAvatar,
}: Props) {
  const [fabOpen, setFabOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [panelSize, setPanelSize] = useState<PanelSize>("normal");

  const openPanel = (panel: ActivePanel) => {
    setActivePanel(panel);
    setFabOpen(false);
    setPanelSize("normal");
  };

  const closePanel = () => {
    setActivePanel(null);
    setPanelSize("normal");
  };

  const toggleSize = () => {
    setPanelSize((prev) =>
      prev === "normal" ? "large" : prev === "large" ? "fullscreen" : "normal"
    );
  };

  const panelPositionClass = () => {
    if (panelSize === "fullscreen") return "inset-0";
    if (panelSize === "large")
      return "top-[72px] right-0 bottom-0 w-full sm:inset-auto sm:top-auto sm:bottom-20 sm:right-10 sm:w-[480px] sm:h-[680px] md:w-[560px] md:h-[440px]";
    return "top-[72px] right-0 bottom-0 w-full sm:inset-auto sm:top-auto sm:bottom-20 sm:right-6 sm:w-[90vw] sm:max-w-[400px] sm:h-[460px] md:max-w-[440px] md:h-[400px]";
  };

  const roundedClass =
    panelSize === "fullscreen"
      ? "rounded-none"
      : "rounded-none sm:rounded-2xl";

  const SizeIcon = () => {
    if (panelSize === "fullscreen") {
      return (
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
      );
    }
    return (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    );
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed z-[9999] transition-all duration-300 ease-out
          ${panelPositionClass()}
          ${activePanel
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-5 scale-95 pointer-events-none"
          }`}
      >
        <div className={`w-full h-full bg-base-200 shadow-2xl border border-base-300 flex flex-col overflow-hidden ${roundedClass}`}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-b border-base-300 flex-shrink-0">
            <div className="flex items-center gap-2">
              {activePanel === "ai" ? (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content leading-tight">AI Assistant</p>
                    <p className="text-[10px] text-violet-500">MCQ • Code • Q&A</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content leading-tight">Live Support</p>
                    <p className="text-[10px] text-emerald-500">Admin • Instructor</p>
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => openPanel(activePanel === "ai" ? "live" : "ai")}
                className="btn btn-ghost btn-xs gap-1 text-[10px] normal-case hidden sm:flex"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                </svg>
                {activePanel === "ai" ? "Live" : "AI"}
              </button>

              <button
                onClick={() => openPanel(activePanel === "ai" ? "live" : "ai")}
                className="btn btn-ghost btn-xs btn-circle sm:hidden"
                title="Switch"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
                </svg>
              </button>

              <button
                onClick={toggleSize}
                className="btn btn-ghost btn-xs btn-circle"
                title={panelSize === "normal" ? "বড় করুন" : panelSize === "large" ? "Fullscreen" : "ছোট করুন"}
              >
                <SizeIcon />
              </button>

              <button onClick={closePanel} className="btn btn-ghost btn-xs btn-circle">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 min-h-0 ${
            panelSize === "fullscreen"
              ? "text-base [&_textarea]:text-base [&_.chat-bubble]:text-base [&_.text-sm]:text-base [&_.text-xs]:text-sm"
              : panelSize === "large"
              ? "text-sm [&_textarea]:text-sm [&_.chat-bubble]:text-sm"
              : ""
          }`}>
            {activePanel === "ai" && (
              <AIChat userId={userId} userName={userName} userAvatar={userAvatar} />
            )}
            {activePanel === "live" && (
              <LiveChat
                userId={userId}
                userName={userName}
                userRole={userRole}
              />
            )}
          </div>
        </div>
      </div>

      {/* FAB — fullscreen এ লুকায় */}
      {panelSize !== "fullscreen" && (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

          {/* Expanded buttons */}
          <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${
            fabOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
          }`}>
            <div className="flex items-center gap-2">
              <span className="bg-neutral text-neutral-content text-xs px-3 py-1.5 rounded-full shadow font-medium whitespace-nowrap">
                AI Assistant
              </span>
              <button
                onClick={() => openPanel("ai")}
                className="btn btn-circle btn-md shadow-lg border-0 bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-neutral text-neutral-content text-xs px-3 py-1.5 rounded-full shadow font-medium whitespace-nowrap">
                Live Support
              </span>
              <button
                onClick={() => openPanel("live")}
                className="btn btn-circle btn-md shadow-lg border-0 bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Main FAB */}
          <div className="relative">
            {!fabOpen && !activePanel && (
              <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-25 animate-ping pointer-events-none" />
            )}
            <button
              onClick={() => {
                if (activePanel) {
                  closePanel();
                  setFabOpen(false);
                } else {
                  setFabOpen((prev) => !prev);
                }
              }}
              className={`btn btn-lg btn-circle shadow-xl border-0 transition-all duration-300
                ${fabOpen || activePanel
                  ? "bg-base-300 hover:bg-base-400 rotate-45"
                  : "bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
                }`}
            >
              {fabOpen || activePanel ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
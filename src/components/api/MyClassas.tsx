"use client";

import React, { useState } from "react";
import { FaPlay, FaCheckCircle, FaBookOpen, FaGift, FaBell, FaUser } from "react-icons/fa";

// Video data based on user request
const videos = [
  {
    id: "WTmXc2xGwY4",
    title: "1. HTML Crash Course",
    duration: "10:00",
    type: "HTML",
    thumbnail: "https://i.ytimg.com/vi/WTmXc2xGwY4/hqdefault.jpg"
  },
  {
    id: "iWuEpnTTD3k",
    title: "2. JavaScript Fundamentals",
    duration: "15:30",
    type: "JavaScript",
    thumbnail: "https://i.ytimg.com/vi/iWuEpnTTD3k/hqdefault.jpg"
  },
  {
    id: "Z-EkslDJTJI",
    title: "3. React JS Bangla Tutorial Part 1",
    duration: "20:45",
    type: "React",
    thumbnail: "https://i.ytimg.com/vi/Z-EkslDJTJI/hqdefault.jpg"
  },
  {
    id: "ljfh0dtEAjg",
    title: "4. React JS Bangla Tutorial Part 2",
    duration: "18:20",
    type: "React",
    thumbnail: "https://i.ytimg.com/vi/ljfh0dtEAjg/hqdefault.jpg"
  },
];

export default function MyClassas() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Calculate progress
  const progress = Math.round((completedVideos.length / videos.length) * 100);

  const handleVideoComplete = (videoId: string) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos(prev => [...prev, videoId]);
    }
  };

  const handleContinueCourse = () => {
    // Find first uncompleted video
    const nextVideo = videos.find((v) => !completedVideos.includes(v.id)) || videos[0];
    if (nextVideo) {
      setActiveVideo(nextVideo.id);
      setShowVideoPlayer(true);
    }
  };

  const closePlayer = () => {
    setShowVideoPlayer(false);
    setActiveVideo(null);
  };

  // Helper function to safely get current video object
  const getCurrentVideo = () => videos.find(v => v.id === activeVideo);

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white font-sans pb-20">
      {/* Top Navigation Bar Simulation */}
      {/* Top Navigation Bar Removed - Using Global Navbar */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome Back <span className="text-transparent bg-clip-text
             bg-gradient-to-r from-[#C81D77] to-[#6710C2]"></span>, Ready For Your Next Lesson?
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
          <button className="px-6 py-3 text-[#E3436B] border-b-2 border-[#E3436B] font-medium flex items-center gap-2 whitespace-nowrap">
            <FaBookOpen className="w-4 h-4" /> Level 1 Course
          </button>
          <button className="px-6 py-3 text-gray-400 hover:text-white font-medium flex items-center gap-2 transition whitespace-nowrap">
            <FaPlay className="w-4 h-4" /> Conceptual Session
          </button>
        </div>


        {/* Main Course Card */}
        <div className="bg-[#151521] rounded-2xl overflow-hidden border border-gray-800 shadow-xl
         shadow-purple-900/10 hover:shadow-purple-900/20 transition-all duration-300 relative group">
          <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8">
            {/* Left: Thumbnail/Banner */}
            <div className="md:col-span-12 lg:col-span-5 relative cursor-pointer overflow-hidden rounded-xl h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <img
                src="https://i.ytimg.com/vi/pJQXGmMofro/maxresdefault.jpg"
                alt="Course Banner"
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-2xl font-black italic uppercase tracking-wider text-white drop-shadow-lg leading-tight">
                  Complete Web <br />Development
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded shadow-lg">Batch 12</span>
                </div>
              </div>

              {/* Play Overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center 
              opacity-0 group-hover:opacity-100 transition duration-300 bg-black/20 backdrop-blur-[2px]">
                <div onClick={handleContinueCourse} className="w-16 h-16 bg-white/20 rounded-full 
                flex items-center justify-center backdrop-blur-md hover:scale-110 transition cursor-pointer">
                  <FaPlay className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">Complete Web Development Course With Creative Coders</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>Instructor:</span>
                  <span className="text-white font-medium">Jhankar Mahbub</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-[#1E1E2D] p-4 rounded-xl border border-gray-800">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-gray-300 flex items-center gap-2">
                    {progress === 100 ? <FaCheckCircle className="w-4 h-4 text-green-500" /> : <FaBookOpen className="w-4 h-4 text-[#C81D77]" />}
                    Course Progress
                  </span>
                  <span className={progress === 100 ? "text-green-400" : "text-[#C81D77]"}>{progress}% Completed</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? '#10B981' : 'linear-gradient(90deg, #C81D77, #6710C2)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleContinueCourse}
                  className="px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-purple-600/30
                   hover:shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                  style={{ background: 'linear-gradient(90deg, #C81D77, #6710C2)' }}
                >
                  <FaPlay className="w-4 h-4 fill-current" />
                  {progress === 100 ? 'Course Completed' : progress > 0 ? 'Continue Course' : 'Start Course'}
                </button>
                <button className="px-8 py-3 rounded-full font-bold text-gray-300 border border-gray-700
                 hover:bg-white/5 hover:border-gray-500 active:scale-95 transition-all text-sm">
                  Course Outline
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Recommended Course Card (Secondary) */}
        <div className="mt-8 bg-[#151521] rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row items-center
         gap-6 opacity-80 hover:opacity-100 transition duration-300 hover:border-gray-700">
          <div className="w-full md:w-1/3 h-48 rounded-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#832388] to-[#E3436B] opacity-20 group-hover:opacity-10 transition"></div>
            <img src="https://i.ytimg.com/vi/Z-EkslDJTJI/maxresdefault.jpg" className="w-full h-full object-cover" alt="Recommended" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-[#F89B29] text-black font-bold px-3 py-1 rounded text-sm shadow-xl">Recommended Bootcamp</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-xl font-bold text-white mb-2">Recommended for Complete Web Development Course</h3>
            <p className="text-gray-400 mb-4 text-sm">Creative Coders • Web Development</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div className="h-full w-[27%] bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] rounded-full relative">
                  <div className="absolute inset-0 bg-white/10"></div>
                </div>
              </div>
              <span className="font-bold text-gray-400 text-sm">27%</span>
            </div>
            <button
              className="px-8 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-orange-500/30
               transform hover:-translate-y-0.5 active:translate-y-0 transition text-sm flex items-center gap-2"
              style={{ background: 'linear-gradient(90deg, #FF0F7B, #F89B29)' }}
            >
              <FaPlay className="w-4 h-4 fill-current" />
              Continue Course
            </button>
          </div>
        </div>
      </div>

      {/* Video Player Modal/Overlay */}
      {showVideoPlayer && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-7xl h-full md:h-[90vh] bg-[#0F0F1A] md:rounded-2xl overflow-hidden
           border-0 md:border border-gray-800 shadow-2xl flex flex-col lg:flex-row relative">

            {/* Close Button Mobile */}
            <button
              onClick={closePlayer}
              className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Video Area */}
            <div className="flex-1 bg-black relative flex flex-col justify-center">
              <div className="relative pt-[56.25%] bg-black w-full">
                {activeVideo ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
                    title="Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
                    <FaPlay className="w-12 h-12 opacity-20" />
                    <p>Select a video to play</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#151521] gap-4">
                <div>
                  <h3 className="text-lg font-bold truncate text-white mb-1">
                    {getCurrentVideo()?.title}
                  </h3>
                  <p className="text-sm text-gray-400">{getCurrentVideo()?.type} • {getCurrentVideo()?.duration}</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => activeVideo && handleVideoComplete(activeVideo)}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold text-sm
                       flex items-center justify-center gap-2 transition ${completedVideos.includes(activeVideo || '')
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-[#C81D77] hover:bg-[#b01968] text-white shadow-lg shadow-pink-500/20'}`}
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    {completedVideos.includes(activeVideo || '') ? 'Completed' : 'Mark as Complete'}
                  </button>
                  <button
                    onClick={closePlayer}
                    className="hidden lg:block px-6 py-2.5 rounded-lg font-bold text-sm bg-gray-800
                     text-gray-300 hover:bg-gray-700 transition border border-gray-700"
                  >
                    Close Player
                  </button>
                </div>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="w-full lg:w-96 border-l border-gray-800 bg-[#151521] flex flex-col h-1/3 lg:h-auto">
              <div className="p-5 border-b border-gray-800 bg-[#151521] shadow-sm relative z-10">
                <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                  <FaBookOpen className="w-4 h-4 text-[#C81D77]" /> Course Content
                </h3>
                <div className="flex justify-between text-xs text-gray-400 mt-2 mb-1">
                  <span>{completedVideos.length} / {videos.length} Lectures Completed</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#C81D77] to-[#6710C2]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {videos.map((video, idx) => {
                  const isActive = activeVideo === video.id;
                  const isCompleted = completedVideos.includes(video.id);
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveVideo(video.id)}
                      className={`w-full text-left p-2 rounded-xl transition-all duration-200 group border 
                        border-transparent ${isActive ? 'bg-[#1E1E2D] border-gray-700 shadow-lg' : 'hover:bg-[#1E1E2D] hover:border-gray-800'}`}
                    >
                      <div className="flex gap-3">
                        <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                          <img src={video.thumbnail} alt="" className={`w-full h-full 
                            object-cover transition ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />

                          {/* Status overlay on thumbnail */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {isActive ? (
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <FaPlay className="w-4 h-4 text-white fill-current" />
                              </div>
                            ) : isCompleted ? (
                              <div className="absolute top-1 right-1 bg-green-500 rounded p-0.5">
                                <FaCheckCircle className="w-3 h-3 text-white" />
                              </div>
                            ) : null}
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                            {video.duration}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className={`text-sm font-semibold line-clamp-2 leading-snug mb-1 ${isActive ? 'text-[#C81D77]' : 'text-gray-200'}`}>
                            {video.title}
                          </h4>
                          <p className="text-xs text-gray-500">{video.type}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

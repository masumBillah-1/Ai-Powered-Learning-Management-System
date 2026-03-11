
import React from "react";
import { BiMessageSquareDetail } from "react-icons/bi";
import { CiGlobe } from "react-icons/ci";
import { MdOutlineSmartphone } from "react-icons/md";
import { LuMonitor } from "react-icons/lu";
import { FaHeadphonesAlt } from "react-icons/fa";

const FeatureBoard = () => {
  interface FeatureRequest {
    id: string;
    user: {
      name: string;
      image: string;
    };
    timeAgo: string;
    title: string;
    comments: number;
    platform: "Desktop App" | "Android App" | "Website";
    status: "Acknowledged" | "Planned" | "In Progress";
    votes: number;
  }

  const requests: FeatureRequest[] = [
    {
      id: "1",
      user: { name: "Shajjad Khan", image: "https://i.pravatar.cc/150?u=1" },
      timeAgo: "8 days ago",
      title: "Reset Progress Without Any Points.",
      comments: 0,
      platform: "Desktop App",
      status: "Acknowledged",
      votes: 0,
    },
    {
      id: "2",
      user: {
        name: "Shanto Chandra Dey",
        image: "https://i.pravatar.cc/150?u=2",
      },
      timeAgo: "8 days ago",
      title: "Offline Download Restriction Issue",
      comments: 1,
      platform: "Android App",
      status: "Acknowledged",
      votes: 0,
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-base-100 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Requested Features
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Here is a list of all the features that many of you asked for.
          </p>
        </div>

        <button className="btn btn-secondary bg-gradient-to-r from-fuchsia-600 to-orange-400 text-white normal-case rounded-xl shadow-lg">
          + Share New Idea
        </button>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        {requests.map((item) => (
          <div
            key={item.id}
            className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="card-body p-5 flex-row items-start gap-4">
              {/* User Avatar */}
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={item.user.image} alt={item.user.name} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 dark:text-white leading-tight">
                    {item.user.name}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <FaHeadphonesAlt /> {item.timeAgo}
                  </span>
                </div>

                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100 mt-2">
                  {item.title}
                </h2>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="badge border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 py-3 px-3 gap-2 rounded-lg">
                    <BiMessageSquareDetail /> {item.comments} Comments
                  </div>

                  <div className="badge border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 py-3 px-3 gap-2 rounded-lg">
                    {item.platform === "Website" ? (
                      <CiGlobe />
                    ) : item.platform === "Android App" ? (
                      <MdOutlineSmartphone />
                    ) : (
                      <LuMonitor />
                    )}
                    {item.platform}
                  </div>

                  <div className="badge border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 py-3 px-3 gap-2 rounded-lg">
                    <FaHeadphonesAlt /> {item.status}
                  </div>
                </div>
              </div>

              {/* Vote Counter */}
              <div className="flex flex-col items-center">
                <button className="btn btn-ghost btn-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 px-4">
                  <span className="text-xs">▲</span> {item.votes} Votes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureBoard;

// import React from "react";

// const ReleaseNotesPage = () => {
//   type ReleaseNote = {
//     id: string;
//     date: string;
//     title: string;
//     version: string;
//     tag: string;
//     description: string;
//   };

//   const notes: ReleaseNote[] = [
//     {
//       id: "1",
//       date: "NOV 9, 2025",
//       title: "Fixed Leader board assignment filtering issue",
//       version: "v2083",
//       tag: "Hotfix for Website",
//       description:
//         "Leaderboard services - updated aggregation logic for serial number and leaderboard retrieval",
//     },
//     {
//       id: "2",
//       date: "OCT 30, 2025",
//       title: "Updated Course Content and UI Enhancements",
//       version: "v2082",
//       tag: "Website Update",
//       description:
//         "Updated course content and improved UI for better user experience.",
//     },
//     {
//       id: "3",
//       date: "OCT 30, 2025",
//       title: "Updated Course Content and UI Enhancements",
//       version: "v2082",
//       tag: "Website Update",
//       description:
//         "Updated course content and improved UI for better user experience.",
//     },
//     {
//       id: "4",
//       date: "OCT 30, 2025",
//       title: "Updated Course Content and UI Enhancements",
//       version: "v2082",
//       tag: "Website Update",
//       description:
//         "Updated course content and improved UI for better user experience.",
//     },
//   ];
//   const stats = [
//     { label: "Courses Topics", count: 36, icon: "🎯", color: "text-red-500" },
//     { label: "Bugs", count: 2, icon: "🪲", color: "text-orange-500" },
//     { label: "Feature Requests", count: 1, icon: "📊", color: "text-pink-500" },
//     { label: "Others", count: 12, icon: "📂", color: "text-purple-500" },
//     { label: "Announcements", count: 114, icon: "📢", color: "text-blue-500" },
//     { label: "Resolved", count: 54, icon: "✅", color: "text-green-500" },
//   ];

//   return (
//     <div className="h-screen bg-slate-50 p-8 font-sans overflow-hidden">
//       <div className="container mx-auto flex flex-col lg:flex-row gap-8 h-full">
//         {/* Main Content: Release Notes */}
//         <div className="flex-1 space-y-12 lg:overflow-y-auto lg:h-full pr-2">
//           {notes.map((note) => (
//             <div
//               key={note.id}
//               className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100"
//             >
//               <div className="bg-slate-50 py-6 text-center">
//                 <h2 className="text-xl font-bold text-secondary uppercase tracking-wider">
//                   RELEASE NOTE : {note.date}
//                 </h2>
//               </div>

//               <div className="p-8 space-y-4">
//                 <div className="border-b border-slate-100 pb-4">
//                   <h3 className="text-xl font-bold text-slate-800">
//                     {note.title} -{" "}
//                     <span className="text-slate-500">{note.version}</span>
//                   </h3>
//                   <p className="text-sm text-slate-400 mt-1">
//                     Web Course • {note.date}
//                   </p>
//                 </div>

//                 <div className="py-2">
//                   <p className="text-sm font-semibold text-slate-700 italic">
//                     {note.tag}
//                   </p>
//                 </div>

//                 <div className="border-t border-slate-100 pt-4">
//                   <div className="badge badge-secondary badge-lg rounded-md font-semibold px-4">
//                     Published
//                   </div>

//                   <div className="pt-4">
//                     <p className="text-slate-600 leading-relaxed">
//                       {note.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Sidebar: Stats */}
//         <aside className="hidden lg:block w-80 sticky top-8 self-start">
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <ul className="space-y-6">
//               {stats.map((stat, idx) => (
//                 <li
//                   key={idx}
//                   className="flex items-center justify-between group cursor-pointer"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-xl">{stat.icon}</span>
//                     <span className="text-slate-600 font-medium group-hover:text-primary transition-colors">
//                       {stat.label}
//                     </span>
//                   </div>
//                   <span className="font-bold text-slate-700">{stat.count}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default ReleaseNotesPage;
import React from "react";

const ReleaseNotesPage = () => {
  type ReleaseNote = {
    id: string;
    date: string;
    title: string;
    version: string;
    tag: string;
    description: string;
  };

  const notes: ReleaseNote[] = [
    {
      id: "1",
      date: "NOV 9, 2025",
      title: "Fixed Leader board assignment filtering issue",
      version: "v2083",
      tag: "Hotfix for Website",
      description:
        "Leaderboard services - updated aggregation logic for serial number and leaderboard retrieval",
    },
    {
      id: "2",
      date: "OCT 30, 2025",
      title: "Updated Course Content and UI Enhancements",
      version: "v2082",
      tag: "Website Update",
      description:
        "Updated course content and improved UI for better user experience.",
    },
  ];

  const stats = [
    { label: "Courses Topics", count: 36, icon: "🎯" },
    { label: "Bugs", count: 2, icon: "🪲" },
    { label: "Feature Requests", count: 1, icon: "📊" },
    { label: "Others", count: 12, icon: "📂" },
    { label: "Announcements", count: 114, icon: "📢" },
    { label: "Resolved", count: 54, icon: "✅" },
  ];

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#0f172a] p-8 font-sans overflow-hidden transition-colors duration-300">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 h-full">
        {/* Main Content */}
        <div className="flex-1 space-y-12 lg:overflow-y-auto lg:h-full pr-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300"
            >
              {/* Header */}
              <div className="bg-slate-50 dark:bg-slate-900 py-6 text-center">
                <h2 className="text-xl font-bold text-secondary dark:text-white uppercase tracking-wider">
                  RELEASE NOTE : {note.date}
                </h2>
              </div>

              {/* Body */}
              <div className="p-8 space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {note.title}{" "}
                    <span className="text-slate-500 dark:text-slate-400">
                      - {note.version}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Web Course • {note.date}
                  </p>
                </div>

                <div className="py-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic">
                    {note.tag}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <div className="badge badge-secondary badge-lg rounded-md font-semibold px-4">
                    Published
                  </div>

                  <div className="pt-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {note.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-80 sticky top-8 self-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
            <ul className="space-y-6">
              {stats.map((stat, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">
                      {stat.label}
                    </span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-white">
                    {stat.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReleaseNotesPage;

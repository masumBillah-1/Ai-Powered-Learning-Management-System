import React from 'react';
import { FaSearch, FaSyncAlt, FaCheckCircle } from 'react-icons/fa';

// Define types for our card data
interface Ticket {
  id: number;
  user: string;
  avatar: string;
  title: string;
  tags: string[];
  category: string;
}

const Roadmap = () => {
  // Mock data based on your image
  const tickets: Record<string, Ticket[]> = {
    investigating: [
      { id: 1, user: "Md. Shafin Ahmed", avatar: "https://i.pravatar.cc/150?u=1", title: "Video Playing issues", tags: ["Bugs"], category: "Website" },
      { id: 2, user: "Hamza Ariyen", avatar: "https://i.pravatar.cc/150?u=2", title: "Support session and job placement feedback", tags: ["Improvements"], category: "Website" },
    ],
    inProgress: [
      { id: 3, user: "Md Al Fahad", avatar: "https://i.pravatar.cc/150?u=3", title: "Quiz mark issue", tags: ["Bugs"], category: "Android App" },
      { id: 4, user: "Kamrul Hasan", avatar: "https://i.pravatar.cc/150?u=4", title: "Support modal problem.", tags: ["Bugs"], category: "Website" },
    ],
    resolved: [
      { id: 5, user: "Maliha Tabassum", avatar: "https://i.pravatar.cc/150?u=5", title: "Academic pressure running milestone issue", tags: ["Others"], category: "Website" },
      { id: 6, user: "Tariqul Islam", avatar: "https://i.pravatar.cc/150?u=6", title: "needed payoo Github Code", tags: ["Courses Help"], category: "" },
    ]
  };

  return (
    <div className="min-h-screen p-8 text-gray-200 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Column: Investigating */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-purple-400 font-medium bg-purple-900/20 w-fit px-3 py-1 rounded-md">
            <FaSearch size={14} /> Investigating (2)
          </div>
          <div className="space-y-4">
            {tickets.investigating.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} borderColor="border-purple-900/30" />
            ))}
          </div>
        </section>

        {/* Column: Dev In-Progress */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-blue-400 font-medium bg-blue-900/20 w-fit px-3 py-1 rounded-md">
            <FaSyncAlt size={14} className="animate-spin-slow" /> Dev In-Progress (16)
          </div>
          <div className="space-y-4">
            {tickets.inProgress.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} borderColor="border-blue-900/30" />
            ))}
          </div>
        </section>

        {/* Column: Resolved */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-medium bg-emerald-900/20 w-fit px-3 py-1 rounded-md">
            <FaCheckCircle size={14} /> Resolved (20637)
          </div>
          <div className="space-y-4">
            {tickets.resolved.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} borderColor="border-emerald-900/30" />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

// Reusable Card Component
const TicketCard = ({ ticket, borderColor }: { ticket: Ticket; borderColor: string }) => (
  <div className={` p-5 rounded-xl border ${borderColor}  transition-colors`}>
    <div className="flex items-center gap-3 mb-3">
      <img src={ticket.avatar} alt={ticket.user} className="w-8 h-8 rounded-full border border-gray-600" />
      <span className="text-sm font-bold text-black dark:text-white ">{ticket.user}</span>
    </div>
    <h3 className=" font-bold text-black dark:text-white  mb-4 leading-tight">{ticket.title}</h3>
    <div className="flex gap-2">
      {ticket.tags.map(tag => (
        <span key={tag} className="text-[10px] text-black dark:text-white px-2 py-1 rounded uppercase tracking-wider ">
          {tag}
        </span>
      ))}
      {ticket.category && (
        <span className="text-[10px] text-black dark:text-white  px-2 py-1 rounded uppercase tracking-wider font-bold">
          {ticket.category}
        </span>
      )}
    </div>
  </div>
);

export default Roadmap;
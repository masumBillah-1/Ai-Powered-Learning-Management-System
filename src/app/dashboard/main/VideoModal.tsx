"use client";

interface Props {
  videoId: string;
  title: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function VideoModal({
  videoId,
  title,
  onClose,
  onComplete,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="w-[800px] relative">
        <h2 className="text-white text-xl mb-4 text-center">
          {title}
        </h2>

        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="video"
          allowFullScreen
          className="rounded-lg"
        ></iframe>


        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl"
        >
          ✕
        </button>
      </div>
    </div >
  );
}

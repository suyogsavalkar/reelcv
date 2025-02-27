'use client';

export default function Video({ videoUrl }) {
  if (!videoUrl) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-500">No video available</h1>
      </div>
    );
  }

  return (
    <div className="relative w-full h-0 pb-[56.25%]">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={videoUrl}
        title="Resume Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

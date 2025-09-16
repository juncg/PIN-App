"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function FunnyPage() {
  const [videoId, setVideoId] = useState<string>("dQw4w9WgXcQ"); // default video
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // You could later swap videos dynamically
  const changeVideo = () => {
    setVideoId("9bZkp7q19f0"); // Example: Gangnam Style
  };

  return (
    <div className="flex flex-col justify-center items-center h-svh gap-6 bg-black">
      <h1 className="text-3xl text-white">Funny Page 🎥</h1>

      <div className="aspect-video w-full max-w-3xl">
        <iframe
          className="w-full h-full rounded-2xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${
            autoPlay ? 1 : 0
          }&mute=1`}
          title="Funny Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>

      <div className="flex gap-4">
        <Button
          variant="default"
          onClick={changeVideo}
          className="hover:scale-105 transition"
        >
          Load Another Video
        </Button>

        <Button
          variant="outline"
          onClick={() => setAutoPlay(!autoPlay)}
          className="hover:scale-105 transition"
        >
          Toggle Autoplay ({autoPlay ? "On" : "Off"})
        </Button>
      </div>
    </div>
  );
}

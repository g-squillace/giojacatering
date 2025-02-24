"use client";
import { VideoField } from "@/graphql/generated";

import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useEffect } from "react";

const VideoEmbedded = ({ video }: { video: VideoField }) => {
  let thumb: string;
  useEffect(() => {
    thumb = video.thumbnailUrl;
  }, [video]);

  return (
    <MediaPlayer title={video.title} src={video.url}>
      <MediaProvider>
        <Poster className="vds-poster" src={thumb} alt={video.title} />
      </MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoEmbedded;

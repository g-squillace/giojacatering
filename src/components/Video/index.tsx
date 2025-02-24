"use client";

import VideoEmbedded from "@/components/Video/VideoEmbedded";
import VideoInternal from "@/components/Video/VideoInternal";
import { motion, Variants } from "framer-motion";
import { VideoField, VideoFileField } from "@/graphql/generated";

import React from "react";

type PropsVideo = {
  videoHeader?: string;
  videoSubheader?: string;
  internalVideo?: VideoFileField | undefined;
  externalVideo?: VideoField | undefined;
};

const variants: Variants = {
  offscreen: {
    opacity: 0,
    y: 100,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
    },
  },
};

const Video = ({
  videoHeader,
  videoSubheader,
  internalVideo,
  externalVideo,
}: PropsVideo) => {
  return (
    <div className="container">
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {videoHeader && <h2 className="title">{videoHeader}</h2>}
        {videoSubheader && (
          <div
            className=""
            dangerouslySetInnerHTML={{ __html: videoSubheader }}
          />
        )}
      </motion.div>

      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
      >
        {externalVideo && (
          <div className="aspect-video mt-12">
            <VideoEmbedded video={externalVideo} />
          </div>
        )}
        {internalVideo && (
          <div className="aspect-video mt-12">
            <VideoInternal video={internalVideo} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Video;

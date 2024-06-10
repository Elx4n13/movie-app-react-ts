import React, { useRef, useState } from 'react';
import "./VideoHeader.scss"
import { CiVolumeHigh } from "react-icons/ci";
import { CiVolumeMute } from "react-icons/ci";
import { SlLike } from "react-icons/sl";
import { FaPlus } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
interface HoverVideoProps {
  src: string;
  poster: string;
  width?: number;
  height?: number;
}

const HoverVideo: React.FC<HoverVideoProps> = ({ src, poster, width, height }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className='videoCont'
      style={{ width, height, position: 'relative', overflow: 'hidden' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="videoHeader">
        {!isHovered && (
          <img
            src={poster}
            alt="Video thumbnail"
          />
        )}
        <video
          ref={videoRef}
          src={src}
          width={width}
          height={height}
          style={{ display: isHovered ? 'block' : 'none' }}
          muted={isMuted}
          controls={false}
        />
      </div>
      <div className="videoFooter">
        <h1>Avengers : Endgame</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, aspernatur. Consectetur molestias voluptatem alias pariatur.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, aspernatur. Consectetur molestias voluptatem alias pariatur.</p>
        <div className="videoBtns">
          <h4 className="play" onClick={togglePlayPause}>
             <FaPlay /> {isPlaying ? 'Pause now' : 'Play now'}
          </h4>
          <button className='videoPlus'>
            <FaPlus />
          </button>
          <button className="videoLike">
            <SlLike />
          </button>
          <button
            onClick={() => {
                setIsMuted(!isMuted)
            }}
          >
            {!isMuted ? <CiVolumeHigh /> : <CiVolumeMute />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoverVideo;

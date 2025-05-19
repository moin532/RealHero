import React, { useEffect, useRef } from "react";
import VideoCard from "./VideoCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUserAction } from "../../redux/action/UserAction";
import { GetVideosAction } from "../../redux/action/VideosAction";
import ImageCard from "./ImageCard";

const VideoFeed = ({ myvideos }) => {
  const videoRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.User);
  // const { myvideos } = useSelector((state) => state.videos);

  // 👇 Create a flat list of slides from videos and images
  const slides = [];
  myvideos?.forEach((product) => {
    if (product.video?.url) {
      slides.push({ type: "video", data: product });
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        slides.push({ type: "image", data: img });
      });
    }
  });

  useEffect(() => {
    dispatch(loadUserAction());
    // dispatch(GetVideosAction());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [slides]);

  return (
    <div className="flex flex-col items-center overflow-y-scroll h-screen snap-y snap-mandatory">
      {slides.map((slide, index) => (
        <div key={index} className="snap-start w-full ">
          {slide.type === "video" ? (
            <VideoCard
              video={slide.data}
              ref={(el) => (videoRefs.current[index] = el)}
            />
          ) : (
            <ImageCard img={slide.data.url} />
            // <img
            //   src={slide.data.url}
            //   alt="slide"
            //   className="w-full h-screen object-cover"
            // />
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;

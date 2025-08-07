import React, { useEffect, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUserAction } from "../../redux/action/UserAction";
import { GetVideosAction } from "../../redux/action/VideosAction";
import ImageCard from "./ImageCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

// TODO: "Already Seen" functionality is prepared but currently disabled
// This will be enabled when more videos are available (currently only 5 videos)
// The backend endpoints and frontend logic are ready for implementation

const VideoFeed = ({ myvideos, emergency }) => {
  const videoRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [viewedVideos, setViewedVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const containerRef = useRef(null);

  const { user } = useSelector((state) => state.User);
  // const { myvideos } = useSelector((state) => state.videos);

  // Load viewed videos from localStorage on component mount
  useEffect(() => {
    const savedViewedVideos = localStorage.getItem('viewedVideos');
    if (savedViewedVideos) {
      setViewedVideos(JSON.parse(savedViewedVideos));
    }
  }, []);

  // TODO: Filter out already viewed videos - Will be implemented when more videos are available
  // Currently commented out because there are only 5 videos, so filtering would leave no content
  // useEffect(() => {
  //   if (myvideos && myvideos.length > 0) {
  //     const filtered = myvideos.filter(video => !viewedVideos.includes(video._id));
  //     setFilteredVideos(filtered);
  //   }
  // }, [myvideos, viewedVideos]);

  // For now, use all videos without filtering
  useEffect(() => {
    if (myvideos && myvideos.length > 0) {
      setFilteredVideos(myvideos);
    }
  }, [myvideos]);
  // 👇 Create a flat list of slides from videos and images
  const slides = [];
  filteredVideos?.forEach((product) => {
    if (product.video?.url) {
      slides.push({ type: "video", data: product });
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        slides.push({ type: "image", data: img });
      });
    }
  });

  // Mark video as viewed when it becomes current
  const markVideoAsViewed = async (videoId) => {
    if (!videoId || viewedVideos.includes(videoId)) return;
    
    // Add to local state
    const newViewedVideos = [...viewedVideos, videoId];
    setViewedVideos(newViewedVideos);
    
    // Save to localStorage
    localStorage.setItem('viewedVideos', JSON.stringify(newViewedVideos));
    
    // Send to backend (optional)
    try {
      const token = Cookies.get("Token");
      if (token) {
        await axios.post(
          'https://api.realhero.in/api/v1/video/mark-viewed',
          { videoId, userId: user?.user?._id || user?._id },
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Error marking video as viewed:", error);
    }
  };

  // TODO: Mark video as viewed when it becomes current - Will be implemented when filtering is enabled
  // Currently commented out because we're not filtering videos yet
  // useEffect(() => {
  //   if (slides[currentSlideIndex] && slides[currentSlideIndex].type === "video") {
  //     const videoId = slides[currentSlideIndex].data._id;
  //     markVideoAsViewed(videoId);
  //   }
  // }, [currentSlideIndex, slides]);

  // Function to clear viewed videos history (for testing)
  const clearViewedVideos = () => {
    setViewedVideos([]);
    localStorage.removeItem('viewedVideos');
    // Reload the page to refresh the video list
    window.location.reload();
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 80;

  const onTouchStart = (e) => {
    // Don't interfere with video controls
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
      return;
    }
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    // Don't interfere with video controls
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    // Don't interfere with video controls
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlideIndex < slides.length - 1) {
      // Swipe left - go to next slide
      setCurrentSlideIndex(prev => prev + 1);
      showNavigationHint();
    } else if (isRightSwipe && currentSlideIndex > 0) {
      // Swipe right - go to previous slide
      setCurrentSlideIndex(prev => prev - 1);
      showNavigationHint();
    }
  };

  const showNavigationHint = () => {
    setShowNavigationButtons(true);
    setTimeout(() => setShowNavigationButtons(false), 2000);
  };

  const goToNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      showNavigationHint();
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      showNavigationHint();
    }
  };

  // Auto-hide navigation buttons after 3 seconds
  useEffect(() => {
    if (showNavigationButtons) {
      const timer = setTimeout(() => {
        setShowNavigationButtons(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNavigationButtons]);

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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

  // Scroll to current slide when index changes
  useEffect(() => {
    if (containerRef.current) {
      const slideElement = containerRef.current.children[currentSlideIndex];
      if (slideElement) {
        slideElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentSlideIndex]);

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex flex-col items-center overflow-y-scroll h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] snap-y snap-mandatory"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, index) => ( 
          <div key={index} className="snap-start w-full">
            {slide.type === "video" ? (
              <VideoCard
                video={slide.data}
                ref={(el) => (videoRefs.current[index] = el)}
              />
            ) : (
              <ImageCard img={slide.data.url} />
            )}

            {/* Donate Now Button */}
            {emergency && (
              <div className="absolute bottom-20 left-5">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded animate-bounce transition duration-300"
                  onClick={() => alert("Thank you for your donation!")}
                >
                  Donate Now 🫴
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Navigation Buttons - Only show on mobile */}
      <div className="md:hidden">
        {/* Previous Button */}
        {currentSlideIndex > 0 && (
          <>
            <button
              onClick={goToPreviousSlide}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-black bg-opacity-50 text-white p-3 rounded-full transition-all duration-300 ${
                showNavigationButtons ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <FaChevronLeft className="text-xl" />
            </button>
            {/* Top Previous Button for thumb access */}
            <button
              onClick={goToPreviousSlide}
              className={`absolute left-4 top-16 z-40 bg-black bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 ${
                showNavigationButtons ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <FaChevronLeft className="text-lg" />
            </button>
          </>
        )}

        {/* Next Button */}
        {currentSlideIndex < slides.length - 1 && (
          <>
            <button
              onClick={goToNextSlide}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-black bg-opacity-50 text-white p-3 rounded-full transition-all duration-300 ${
                showNavigationButtons ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <FaChevronRight className="text-xl" />
            </button>
            {/* Top Next Button for thumb access */}
            <button
              onClick={goToNextSlide}
              className={`absolute right-4 top-16 z-40 bg-black bg-opacity-50 text-white p-2 rounded-full transition-all duration-300 ${
                showNavigationButtons ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <FaChevronRight className="text-lg" />
            </button>
          </>
        )}
      </div>

      {/* Swipe Hint - Show briefly on first load */}
      <div className="md:hidden">
        {showSwipeHint && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-40 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm animate-pulse">
            Swipe to navigate
          </div>
        )}
      </div>

      {/* Video Counter and Reset Button - Only show on mobile */}
      <div className="md:hidden">
        <div className="absolute top-4 left-4 z-40 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
          {slides.length} videos total
        </div>
        
        {/* TODO: Reset button for testing - Will be enabled when filtering is implemented */}
        {/* <button
          onClick={clearViewedVideos}
          className="absolute top-4 right-4 z-40 bg-red-500 bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm"
        >
          Reset History
        </button> */}
      </div>
    </div>
  );
};

export default VideoFeed;

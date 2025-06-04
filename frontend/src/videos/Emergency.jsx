import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetVideosAction } from "../../redux/action/VideosAction";
import VideoFeed from "./videosFeed";

const Emergency = () => {
  const dispatch = useDispatch();

  const { myvideos } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(GetVideosAction());
  }, [dispatch]);

  // ✅ Filter only emergency videos
  const emergencyVideos = myvideos?.filter((video) => video.emergency === true);

  console.log(emergencyVideos);
  return (
    <div>
      <h1>This video will Show Only in An Emergency</h1>
      <VideoFeed myvideos={emergencyVideos} emergency="true" />
    </div>
  );
};

export default Emergency;

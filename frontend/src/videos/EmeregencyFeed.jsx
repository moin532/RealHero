import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetVideosAction } from "../../redux/action/VideosAction";
import VideoFeed from "./videosFeed";
const EmeregencyFeed = () => {
  const dispatch = useDispatch();

  const { myvideos } = useSelector((state) => state.videos);
  useEffect(() => {
    dispatch(GetVideosAction());
  }, [dispatch]);
  return (
    <div>
      <VideoFeed myvideos={myvideos} />
    </div>
  );
};

export default EmeregencyFeed;

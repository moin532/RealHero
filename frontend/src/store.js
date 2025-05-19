import { configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "../redux/reducer/userReducer";
import { VideoReducer } from "../redux/reducer/videoReducer";

// Store
const store = configureStore({
  reducer: {
    User: UserReducer,
    videos: VideoReducer,
  },
});

// export const url = "https://drivers-hub-eight.vercel.app";
export const url = "https://drivers-jw1mdkejt-moin532s-projects.vercel.app";

export default store;

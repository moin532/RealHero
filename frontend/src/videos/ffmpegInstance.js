let ffmpegInstance = null;
let fetchFileInstance = null;

export const loadFFmpeg = async () => {
  if (!ffmpegInstance) {
    const ffmpegModule = await import("@ffmpeg/ffmpeg"); // ✅ direct import
    const createFFmpeg = ffmpegModule.createFFmpeg;
    const fetchFile = ffmpegModule.fetchFile;

    ffmpegInstance = createFFmpeg({ log: true });
    fetchFileInstance = fetchFile;

    await ffmpegInstance.load();
  } else if (!ffmpegInstance.isLoaded) {
    await ffmpegInstance.load();
  }
};

export const getFFmpeg = () => ffmpegInstance;
export const getFetchFile = () => fetchFileInstance;

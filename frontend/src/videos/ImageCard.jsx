import React from "react";

const ImageCard = ({ img }) => {
  console.log(`  http://localhost:4000${img}`);
  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <img
        src={`  http://localhost:4000${img}`}
        alt="Product"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default ImageCard;

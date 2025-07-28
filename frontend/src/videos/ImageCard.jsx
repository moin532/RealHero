import React from "react";

const ImageCard = ({ img }) => {
  console.log(`  https://api.realhero.in${img}`);
  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <img
        src={`  https://api.realhero.in${img}`}
        alt="Product"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default ImageCard;

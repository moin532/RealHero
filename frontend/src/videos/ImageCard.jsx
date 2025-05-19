import React from "react";

const ImageCard = ({ img }) => {
  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <img
        src={img}
        alt="Product"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default ImageCard;

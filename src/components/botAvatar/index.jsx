import React from "react";

const BotAvatar = () => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        overflow: "hidden", // This ensures the image stays within the rounded container
      }}
    >
      <img
        src={"/GeoST4R_logo_png.png"}
        alt="bot image"
        style={{
          width: "100%", // Ensure the image fills the container width
          height: "100%", // Ensure the image fills the container height
          objectFit: "cover", // Maintain aspect ratio and cover the entire container
        }}
      />
    </div>
  );
};

export default BotAvatar;

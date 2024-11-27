import React from 'react';

const ImgWidget = (prop) => {
    let image;

    if (prop.type === "catchment area map") {
        image = (
          <img src={prop.src} alt={prop.alt} />
        );
      }
    
      return image;
    };
    
export default ImgWidget;
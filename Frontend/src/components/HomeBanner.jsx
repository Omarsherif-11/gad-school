import React from "react";
import Slider from "react-slick";
import "./HomeBanner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TextTypewriter from "./TextTypewriter";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const HomeBanner = () => {
  const images = [
    "/images/1.jpg",
    "/images/2.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
    "/images/5.jpg",
  ];

  return (
    <div className="wrapper">
      <div className="right-part">
        <TextTypewriter />
      </div>
      <div className="left-part">
        <Slider {...sliderSettings}>
          {images.map((src, index) => (
            <div key={index}>
              <img
                src={src}
                alt={`Slide ${index}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg"; // Ensure a placeholder image exists
                  console.error(`Error loading image at ${src}`);
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomeBanner;

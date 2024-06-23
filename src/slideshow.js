import React, { useState, useImperativeHandle, forwardRef } from 'react';

const Slideshow = forwardRef(({ mediaSrcs, projectName, isProjectOpen, onTransitionComplete }, ref) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useImperativeHandle(ref, () => ({
    resetSlideIndex: () => {
      if (slideIndex !== 0) {
        setIsFading(true);
        setTimeout(() => {
          setSlideIndex(0);
          setIsFading(false);
          if (onTransitionComplete) {
            onTransitionComplete();
          }
        }, 500); // Duration should match the CSS transition duration
      } else {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }
    }
  }));

  const plusDivs = (n) => {
    let newIndex = slideIndex + n;
    if (newIndex >= mediaSrcs.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = mediaSrcs.length - 1;
    }
    setSlideIndex(newIndex);
  };

  const getMediaType = (src) => {
    const extension = src.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    }
    return 'unknown';
  };

  return (
    <div className="slideshow-container">
      {mediaSrcs.map((src, index) => {
        const mediaType = getMediaType(src);
        return mediaType === 'image' ? (
          <img
            key={index}
            className={`mySlides ${index === slideIndex ? (isFading ? 'fade-out' : 'fade-in') : ''}`}
            src={src}
            alt={projectName}
          />
        ) : mediaType === 'video' ? (
          <video
            key={index}
            className={`mySlides ${index === slideIndex ? (isFading ? 'fade-out' : 'fade-in') : ''}`}
            controls
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null;
      })}

      {isProjectOpen && mediaSrcs.length > 1 && (
        <>
          {slideIndex > 0 && (
            <button className="slideshow-button display-left" onClick={() => plusDivs(-1)}>
              &#10094;
            </button>
          )}
          {slideIndex < mediaSrcs.length - 1 && (
            <button className="slideshow-button display-right" onClick={() => plusDivs(1)}>
              &#10095;
            </button>
          )}
        </>
      )}
    </div>
  );
});

export default Slideshow;

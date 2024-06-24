import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';

const Slideshow = forwardRef(({ mediaSrcs, projectName, isProjectOpen, onTransitionComplete }, ref) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const videoRefs = useRef([]);

  useImperativeHandle(ref, () => ({
    resetSlideIndex: () => { setSlideIndex(0); }
  }));

  useEffect(() => {
    // Pause and reset videos when they are not the active slide
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === slideIndex) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [slideIndex]);

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
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      return 'youtube';
    }
    const extension = src.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    }
    return 'unknown';
  };

  const getYouTubeEmbedUrl = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
  };

  return (
    <div className="slideshow-container">
      {mediaSrcs.map((src, index) => {
        const mediaType = getMediaType(src);
        return mediaType === 'image' ? (
          <img
            key={index}
            className={`mySlides ${index === slideIndex ? 'fade-in' : 'fade-out'}`}
            src={src}
            alt={projectName}
          />
        ) : mediaType === 'video' ? (
          <video
            key={index}
            ref={(el) => videoRefs.current[index] = el}
            className={`mySlides ${index === slideIndex ? 'fade-in' : 'fade-out'}`}
            controls
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : mediaType === 'youtube' ? (
          <iframe
            key={index}
            className={`mySlides ${index === slideIndex ? 'fade-in' : 'fade-out'}`}
            src={src}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={projectName}
          ></iframe>
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

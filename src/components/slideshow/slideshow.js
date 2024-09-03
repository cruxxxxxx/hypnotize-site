import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Slideshow = forwardRef(({ mediaSrcs, projectName, isProjectOpen, onMediaLoaded }, ref) => {
  const [loaded, setLoaded] = useState(new Array(mediaSrcs.length).fill(false));
  const [slideIndex, setSlideIndex] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const videoRefs = useRef([]);
  const carousel = useRef();

  useImperativeHandle(ref, () => ({
    resetSlideIndex: () => carousel.current.goToSlide(0, true)
  }));

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === slideIndex) {
        } else {
          video.pause();
          video.currentTime = 0;
        }

        if (!isProjectOpen) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [slideIndex, isProjectOpen]);

  useEffect(() => {
    if (loaded[0]) {
      onMediaLoaded();
    }
  }, [loaded]);

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

  const handleLoad = (index) => {
    setLoaded(prevLoaded => {
      const newLoaded = [...prevLoaded];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  const handleSlideChange = (newIndex) => {
    setShowStatic(true);
    setTimeout(() => {
      setShowStatic(false);
      setSlideIndex(newIndex);
    }, 200);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  return (
    <div style={{ position: 'relative'}}>
      {showStatic && (
        <img
          src="static.webp"
          alt="Static"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
          }}
        />
      )}
      <Carousel ref={carousel}
        responsive={responsive}
        arrows={isProjectOpen && mediaSrcs.length > 1 }
        showDots={isProjectOpen && mediaSrcs.length > 1}
        removeArrowOnDeviceType={[]}
        renderDotsOutside={true}
        draggable={false}
        swipeable={false}
        customTransition="all"
        beforeChange={(nextSlide, { currentSlide, onMove }) => handleSlideChange(nextSlide)}
        dotListClass="custom-dot-list-style">
        {mediaSrcs.map((src, index) => {
          const mediaType = getMediaType(src);
          return (
            <div key={index}>
              {mediaType === 'image' ? (
                <img
                  className={`mySlides ${loaded[index] ? 'fade-in' : 'fade-out'}`}
                  src={src}
                  alt={projectName}
                  onLoad={() => handleLoad(index)}
                  style={{ display: loaded[index] ? 'block' : 'none' }}
                />
              ) : mediaType === 'video' ? (
                <video
                  controls
                  playsInline
                  preload={`${isProjectOpen ? 'auto' : 'none'}`}
                  onClick={(e) => e.target.play()} 
                  onLoadedData={() => {
                    if (videoRefs.current[index]) {
                      videoRefs.current[index].volume = 0.2;
                    }
                    handleLoad(index)}}
                  autobuffer={true}
                  ref={(el) => videoRefs.current[index] = el}
                >
                  <source src={`${src}${isProjectOpen ? '#t=0.1' : ''}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ): null}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
});

export default Slideshow;

import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const Slideshow = forwardRef(({ mediaSrcs, projectName, isProjectOpen, onMediaLoaded }, ref) => {
  const [loaded, setLoaded] = useState(new Array(mediaSrcs.length).fill(false));
  const [slideIndex, setSlideIndex] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const videoRefs = useRef([]);

  useImperativeHandle(ref, () => ({
    resetSlideIndex: () => setSlideIndex(0)
  }));

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === slideIndex) {
          //video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [slideIndex]);

  useEffect(() => {
    if (loaded.every(item => item)) {
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

  const getYouTubeEmbedUrl = (url) => {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
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

  return (
    <CarouselProvider
      isIntrinsicHeight={true}
      totalSlides={mediaSrcs.length}
      currentSlide={slideIndex}
    >
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
        <Slider classNameAnimation="foo">
          {mediaSrcs.map((src, index) => {
            const mediaType = getMediaType(src);
            return (
              <Slide index={index} key={index}>
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
                    ref={(el) => videoRefs.current[index] = el}
                    className={`mySlides ${loaded[index] ? 'fade-in' : 'fade-out'}`}
                    controls
                    onLoadedData={() => handleLoad(index)}
                    style={{ display: loaded[index] ? 'block' : 'none' }}
                  >
                    <source src={src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : mediaType === 'youtube' ? (
                  <iframe
                    className={`mySlides ${loaded[index] ? 'fade-in' : 'fade-out'}`}
                    src={getYouTubeEmbedUrl(src)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={projectName}
                    onLoad={() => handleLoad(index)}
                    style={{ display: loaded[index] ? 'block' : 'none' }}
                  ></iframe>
                ) : null}
              </Slide>
            );
          })}
        </Slider>
      </div>
      {isProjectOpen && mediaSrcs.length > 1 && (
        <>
            <button className="slideshow-button display-left" onClick={() => handleSlideChange((slideIndex - 1 + mediaSrcs.length) % mediaSrcs.length)}>&#10094;</button>
            <button className="slideshow-button display-right" onClick={() => handleSlideChange((slideIndex + 1) % mediaSrcs.length)}>&#10095;</button>
          <DotGroup showAsSelectedForCurrentSlideOnly='true' />
        </>
      )}
    </CarouselProvider>
  );
});

export default Slideshow;

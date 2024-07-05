import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './project.css';
import './circleCursor.css';
import './marquee.css';
import './slideshow.css';
import './openmark.css';

import SiteData from './sitedata.json';
import { ProjectStates } from './projectStatesHandler.js';
import { Project } from './project.js';
import { CircleCursor } from './circleCursor.js';
import { Pressable } from 'react-native';

const projectData = SiteData['projects'];

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [loaded, setLoaded] = useState(new Array(projectData.length).fill(false));
  const [startAnimation, setStartAnimation] = useState(null);
  const [projectStates, setProjectStates] = useState(
    projectData.map(() => ProjectStates.LOADING)
  );

  const circleCursorRef = useRef();
  const columnRef = useRef();
  const headerImgRef = useRef();
  const touchStartRef = useRef(null);

  useEffect(() => {
    setProjectStates(projectData.map(() => ProjectStates.CLOSED));
  }, []);

  const onMediaLoaded = (index) => {
    setLoaded(prevLoaded => {
      const newLoaded = [...prevLoaded];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  useEffect(() => {
    if (loaded.every(item => item)) {
      setStartAnimation(1);
    }
  }, [loaded]);

  useEffect(() => {
    const allClosed = projectStates.every(state => state === ProjectStates.CLOSED);
    if (headerImgRef.current) {
      if (allClosed) {
        headerImgRef.current.classList.add('strobing');
      } else {
        headerImgRef.current.classList.remove('strobing');
      }
    }
  }, [projectStates]);

  const onClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index ? (state === ProjectStates.OPEN ? ProjectStates.CLOSED : ProjectStates.OPEN) : ProjectStates.CLOSED
      )
    );
  };

  const onClose = (index) => {
    setActiveIndex(null);
    setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index ? ProjectStates.CLOSED : state
      )
    );
  };

  const onPressIn = (e, index) => {
    if (index !== activeIndex) {
      // Record touch start coordinates
      touchStartRef.current = e.nativeEvent.locationY; // You might need to adjust how you get coordinates depending on your specific needs
    }
  };

  const onPressOut = (e, index) => {
    if (index !== activeIndex) {
      // Calculate the difference between start and end coordinates
      const touchEnd = e.nativeEvent.locationY; // Again, adjust as needed
      const swipeDistance = Math.abs(touchEnd - touchStartRef.current);
      
      // If swipe distance is greater than a threshold (e.g., 10 pixels), treat it as a swipe
      if (swipeDistance > 10) {
        // Do not trigger onClick
      } else {
        onClick(index); // Trigger onClick if not considered a swipe
      }

      touchStartRef.current = null; // Reset touch start reference
    }
  };

  const onLongPress = (e, index) => {
    // Handle long press event if needed
  };

  return (
    <React.StrictMode>
      <div id="header">
        <img ref={headerImgRef} className="strobing" src="logo.png" alt="Logo" />
      </div>
      <div id="main">
        <CircleCursor ref={circleCursorRef} />
        <div className="row">
          <div className="column" ref={columnRef}>
            {projectData.map((project, index) => (
              <Pressable
                key={project.name}
                onPressIn={(event) => onPressIn(event, index)}
                onPressOut={(event) => onPressOut(event, index)}
                onLongPress={(event) => onLongPress(event, index)}
                delayLongPress={100}
                disabled={projectStates[index] === ProjectStates.OPEN}>
                <Project 
                  project={project} 
                  state={projectStates[index]} 
                  onClose={() => onClose(index)}
                  onMediaLoaded={() => onMediaLoaded(index)}
                  startAnimationTime={startAnimation ? startAnimation * index * 150 : null}/>
              </Pressable>
            ))}
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

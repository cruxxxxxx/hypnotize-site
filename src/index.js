import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './project.css';
import './circleCursor.css';
import './marquee.css';
import './slideshow.css';
import './openmark.css';
import './svg.css'

import SiteData from './sitedata.json';
import { ProjectStates } from './projectStatesHandler.js';
import { Project } from './project.js';
import { CircleCursor } from './circleCursor.js';
import { Pressable } from 'react-native';
import WebGLCanvas from './webglCanvas.js';

const projectData = SiteData['projects'];
const texture1 = 'tex1_med.png';
const texture2 = 'tex2_low.png';

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
  const [filterCriteria, setFilterCriteria] = useState('');

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

    const loadedItems = loaded.filter(item => item).length;
    const totalItems = loaded.length;
    const percentageLoaded = (loadedItems / totalItems) * 100;

    //console.log(`Percentage loaded: ${percentageLoaded}%`);
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
      touchStartRef.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
    }
  };

  const onPressOut = (e, index) => {
    if (index !== activeIndex) {
      const touchEnd = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
      const swipeDistanceX = Math.abs(touchEnd.x - touchStartRef.current.x);
      const swipeDistanceY = Math.abs(touchEnd.y - touchStartRef.current.y);
      
      const threshold = 20;
      if (swipeDistanceX > threshold || swipeDistanceY > threshold) {

      } 
      else if(!touchEnd.x || !touchEnd.y) {

      }
      else {
        onClick(index);
      }

      touchStartRef.current = null; 
    }
  };

  const onLongPress = (e, index) => {
    // Handle long press event if needed
  };

  const handleFilterChange = (type) => {
    setFilterCriteria(type);
  };

  const filteredProjectData = projectData.filter(project => {
    return filterCriteria === '' || project.group === filterCriteria;
  });

  console.log(filteredProjectData);

  return (
    <React.StrictMode>
      <WebGLCanvas texture1={texture1} texture2={texture2} />
      <div id="header">
        <img ref={headerImgRef} className="strobing" src="logo.png" alt="Logo" />
      </div>
      <div id="main">
        <CircleCursor ref={circleCursorRef} />
        <div className="row">
          <div id="projects" className="column" ref={columnRef}>
            <div id="projectMask"></div>
            {filteredProjectData.map((project, index) => (
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
                        <span>.</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
            <div id="footer">
              <button onClick={() => handleFilterChange("")}>all</button>
              <button onClick={() => handleFilterChange("other")}>other</button>
              <button onClick={() => handleFilterChange("media")}>media</button>
            </div> 
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

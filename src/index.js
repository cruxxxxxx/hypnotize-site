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
  const [filtering, setFiltering] = useState(false);
  const [projectStates, setProjectStates] = useState(
    projectData.map(() => ProjectStates.LOADING)
  );

  const circleCursorRef = useRef();
  const columnRef = useRef();
  const headerImgRef = useRef();
  const touchStartRef = useRef(null);
  const [filterCriteria, setFilterCriteria] = useState('');
  const projectMaskRef = useRef();

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

    console.log(`Percentage loaded: ${percentageLoaded}%`);
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
      console.log(touchStartRef.current);
          setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index && state !== ProjectStates.OPEN ? ProjectStates.HOVER_IN : state
      )
    );
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

  const onHoverIn = (e, index) => {
    console.log('hover in')
    /*setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index && state !== ProjectStates.OPEN ? ProjectStates.HOVER_IN : state
      )
    );*/
  };

  const onHoverOut = (e, index) => {
    console.log('hover out')
      /*setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index && state !== ProjectStates.OPEN ? ProjectStates.CLOSED : state
      )
    );*/
  };

  const closeAll = () => {
    setActiveIndex(null);
    setProjectStates((prev) =>prev.map((state, i) => ProjectStates.CLOSED));
  }

  const wipeScreen = () => {
      projectMaskRef.current.style.background_position_y = '-100vh';
      projectMaskRef.current.style.display = 'block';
      projectMaskRef.current.classList.remove('wipe');
      projectMaskRef.current.classList.add('wipe');
  }

  const handleFilterChange = (type) => {
    if(!filtering) {
      setFiltering(true);
      closeAll();

      document.documentElement.scrollTop = 0;

      setTimeout(() => {
        wipeScreen();
      }, 400)

      setTimeout(() => {
        setFilterCriteria(type);
        setTimeout(() => {
          projectMaskRef.current.style.display = 'none';
          setFiltering(false);
          document.documentElement.scrollTop = 0;
          }, 1000);
        }, 600);
    }

  };

  const filteredProjectData = projectData.filter(project => {
    return filterCriteria === '' || project.group === filterCriteria;
  });

  const getAnimationStartTime = (startAnimationBool, index) => {
    var startTimeRate = 150;
    var startTimeBase = 10;
    var startTime = startAnimationBool ? (startAnimationBool * index * startTimeRate) + startTimeBase : null
    return startTime;
  }
  //console.log(filteredProjectData);

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
            <div ref={projectMaskRef} id="projectMask"></div>
            {filteredProjectData.map((project, index) => (
              <Pressable
                key={project.name}
                onPressIn={(event) => onPressIn(event, index)}
                onPressOut={(event) => onPressOut(event, index)}
                onHoverIn={(event) => onHoverIn(event, index)}
                onHoverOut={(event) => onHoverOut(event, index)}
                onLongPress={(event) => onLongPress(event, index)}
                delayLongPress={100}
                disabled={projectStates[index] === ProjectStates.OPEN}>
                <Project 
                  project={project} 
                  state={projectStates[index]} 
                  onClose={() => onClose(index)}
                  onMediaLoaded={() => onMediaLoaded(index)}
                  startAnimationTime={getAnimationStartTime(startAnimation, index)}/>
              </Pressable>
            ))}
            <div class="trail">
              <span>.</span><br/>
              <span>.</span><br/>
              <span>.</span><br/>
              <span>.</span><br/>
            </div>
            <div id="footer">
              <div class="button-container">
                <button class="filter-button" onClick={() => handleFilterChange("")}></button>
                <br/>
                <span class="filter-button-label">all</span>
              </div>


              <div class="button-container">
                <button class="filter-button" onClick={() => handleFilterChange("other")}></button>
                <br/>
                <span class="filter-button-label" style={{'margin-left': '0.1em'}}>other</span>
              </div>

              <div class="button-container">
                <button class="filter-button" onClick={() => handleFilterChange("media")}></button>
                <br/>
                <span class="filter-button-label">media</span>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

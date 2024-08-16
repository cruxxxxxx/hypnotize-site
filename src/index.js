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

import { didUserSwipe, 
strobeLogo, 
wipeScreen, 
closeAll, 
getAnimationStartTime, 
calculatePercentageLoaded,
mapProjectStates,
getTouchData,
filterProjectData,
getIsThis } from './homepage_utils.js';

import { scrollToTop } from './util.js';

const projectData = SiteData['projects'];
const texture1 = 'tex1_med.png';
const texture2 = 'tex2_low.png';

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const resetActiveIndex = () => setActiveIndex(null);
  const isActive = (index) => index === activeIndex;
  const isNotActive = (index) => index !== activeIndex;
  const [loaded, setLoaded] = useState(new Array(projectData.length).fill(false));
  const [startAnimation, setStartAnimation] = useState(null);
  const [filtering, setFiltering] = useState(false);
  const [hovering, setHovering] = useState(false);
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
    calculatePercentageLoaded(loaded);
  }, [loaded]);


  useEffect(() => {
    strobeLogo(projectStates, headerImgRef.current);
  }, [projectStates]);

  /** Touch Callbacks **/

  const onPressIn = (e, index) => {
    if (isNotActive(index) && !hovering) {
      touchStartRef.current = getTouchData(e);
      setHover(index);
    }
  };

  const onPressOut = (e, index) => {
    if (isNotActive(index) && !hovering) {
      const touchStart = touchStartRef.current;
      const touchEnd = getTouchData(e);

      if(didUserSwipe(touchStart, touchEnd)){
        resetHover();
      } else {
        openProject(index);
      }

      touchStartRef.current = null; 
    }
  };

  const onLongPress = (e, index) => {

  };

  const onHoverIn = (e, index) => {
    if(!hovering) {
      setHovering(true);
      setHover(index);
    }
  };

  const onHoverOut = (e, index) => {
    setHovering(false);
    resetHover();
  };

  /** Logic for Touching Projects **/

  const openProject = (index) => {
    setActiveIndex(isActive(index) ? null : index);
    const isThis = getIsThis(index);
    mapProjectStates(setProjectStates, 
      (state, i) => isThis(i) ? (state === ProjectStates.OPEN ? ProjectStates.CLOSED : ProjectStates.OPEN) : ProjectStates.CLOSED);
  };

  const closeProject = (index) => {
    resetActiveIndex();
    const isThis = getIsThis(index);
    mapProjectStates(setProjectStates, 
      (state, i) => isThis(i) ? ProjectStates.CLOSED : state);
  };

  const setHover = (index) => {
    const isThis = getIsThis(index);
    mapProjectStates(setProjectStates, 
      (state, i) => isThis(i) && state !== ProjectStates.OPEN ? ProjectStates.HOVER_IN : state);
  }

  const resetHover = () => {
    mapProjectStates(setProjectStates, 
      (state, i) => state !== ProjectStates.OPEN ? ProjectStates.CLOSED : state);
  };

  /** Filter **/

  const handleFilterChange = (type) => {
    if(!filtering) {
      setFiltering(true);
      closeAll(setActiveIndex, setProjectStates);
      scrollToTop();

      setTimeout(() => {
        wipeScreen(projectMaskRef.current);
      }, 400)

      setTimeout(() => {
        setFilterCriteria(type);
        setTimeout(() => {
          projectMaskRef.current.style.display = 'none';
          setFiltering(false);
          scrollToTop();
          }, 1000);
        }, 600);
    }
  };

  const filteredProjectData = filterProjectData(projectData, filterCriteria);

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
                  onClose={() => closeProject(index)}
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

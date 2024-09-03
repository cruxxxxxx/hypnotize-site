import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/project/project.css';
import './components/cursor/circleCursor.css';
import './components/slideshow/slideshow.css';
import './components/openmark/openmark.css';
import './svg.css';
import './components/footer/footer.css';

import SiteData from './data/sitedata.json';
import Experiments from './data/experiments.json';

import { ProjectStates } from './components/project/projectStatesHandler.js';
import { Project } from './components/project/project.js';
import { Header } from './components/header/header.js';
import { CircleCursor } from './components/cursor/circleCursor.js';
import { Footer } from './components/footer/footer.js';
import { Pressable } from 'react-native';
import LoadingBar from 'react-top-loading-bar'
import WebGLCanvas from './components/moire/moire.js';

import { useProjectState, useLoadingState } from './hooks/index_hooks.js';
import { usePressableCallbacks } from './hooks/project_pressable_hooks.js';

import { 
getAnimationStartTime, 
calculatePercentageLoaded,
mapProjectStates,
getIsThis } from './homepage_utils.js';

const projectData = [...SiteData['projects'], ...Experiments['projects']];
const texture1 = 'tex1_med.png';
const texture2 = 'tex2_low.png';

function App() {
  const { projectStates, setProjectStates, activeIndex, setActiveIndex, resetActiveIndex, isActive, isNotActive } = useProjectState(projectData);
  const { loaded, setLoaded, progress, setProgress, startAnimation, setStartAnimation } = useLoadingState(projectData);
  const [filteredProjects, setFilteredProjects] = useState(projectData);

  const [hovering, setHovering] = useState(false);

  const circleCursorRef = useRef();
  const columnRef = useRef();
  const touchStartRef = useRef(null);
  const projectMaskRef = useRef();

  useEffect(() => {
    setProjectStates(projectData.map(() => ProjectStates.CLOSED));
  }, []);

  const onMediaLoaded = useCallback((index) => {
    setLoaded(prevLoaded => {
      const newLoaded = [...prevLoaded];
      newLoaded[index] = true;
      return newLoaded;
    });
  }, [setLoaded]);

  useEffect(() => {
    const percentage = calculatePercentageLoaded(loaded);
    setProgress(percentage);
  }, [loaded]);

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

  const { onPressIn, onPressOut, onLongPress, onHoverIn, onHoverOut } = usePressableCallbacks({
    isNotActive,
    hovering,
    setHover,
    openProject,
    resetHover,
    setHovering,
    touchStartRef
  });

  const finishedLoading = () => {
    setProgress(0);
    projectMaskRef.current.style.display = 'none';
    projectMaskRef.current.classList.remove('white-background');
    projectMaskRef.current.classList.add('gradient-background');
    setStartAnimation(1);
  }

  return (
    <React.StrictMode>
      <LoadingBar color="#85ab54" progress={progress} onLoaderFinished={() => finishedLoading()} />
      <WebGLCanvas texture1={texture1} texture2={texture2} />
      <Header />
      <div id="main">
        <CircleCursor ref={circleCursorRef} />
        <div className="row">
          <div id="projects" className="column" ref={columnRef}>
            <div ref={projectMaskRef} id="projectMask" className="white-background"></div>
            {filteredProjects.map((project, index) => (
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
            <Footer 
              projectData={projectData}
              setActiveIndex={setActiveIndex}
              setProjectStates={setProjectStates}
              projectMaskRef={projectMaskRef}
              onFilterChange={setFilteredProjects}
            />
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
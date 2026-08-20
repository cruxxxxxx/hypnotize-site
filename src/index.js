import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/project/project.css';
import './components/slideshow/slideshow.css';
import './components/openmark/openmark.css';
import './svg.css';
import './components/footer/footer.css';

import SiteData from './data/sitedata.json';
import Experiments from './data/experiments.json';

import { ProjectStates } from './components/project/projectStatesHandler.js';
import { Project } from './components/project/project.js';
import { Header } from './components/header/header.js';
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
// Default view is the "projects" group. Render only these on first load so the
// browser doesn't download the (hidden) experiment covers up front.
const defaultProjects = projectData.filter((p) => p.group === 'projects');
const texture1 = 'tex1_med.png';
const texture2 = 'tex2_low.png';

function App() {
  const { projectStates, setProjectStates, activeIndex, setActiveIndex, resetActiveIndex, isActive, isNotActive } = useProjectState(projectData);
  const { loaded, setLoaded, progress, setProgress, startAnimation, setStartAnimation } = useLoadingState(defaultProjects);
  const [filteredProjects, setFilteredProjects] = useState(defaultProjects);
  // the initial loading bar / mask only gates the first paint; filter changes
  // afterward must not re-trigger it.
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  const [hovering, setHovering] = useState(false);

  const columnRef = useRef();
  const touchStartRef = useRef(null);
  const projectMaskRef = useRef();

  useEffect(() => {
    setProjectStates(projectData.map(() => ProjectStates.CLOSED));
  }, [setProjectStates]);

  const onMediaLoaded = useCallback((index) => {
    setLoaded(prevLoaded => {
      const newLoaded = [...prevLoaded];
      newLoaded[index] = true;
      return newLoaded;
    });
  }, [setLoaded]);

  useEffect(() => {
    if (firstLoadComplete) {
      return; // gate only the first paint; later filter changes use the wipe
    }
    const percentage = calculatePercentageLoaded(loaded);
    setProgress(percentage);
  }, [loaded, setProgress, firstLoadComplete]);

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

  const { onPressIn, onPressOut, onHoverIn, onHoverOut } = usePressableCallbacks({
    isNotActive,
    hovering,
    setHover,
    openProject,
    resetHover,
    setHovering,
    touchStartRef
  });

  const finishedLoading = () => {
    setFirstLoadComplete(true);
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
                disabled={projectStates[index] === ProjectStates.OPEN}>
                <Project 
                  project={project} 
                  state={projectStates[index]} 
                  onClose={() => closeProject(index)}
                  onMediaLoaded={() => onMediaLoaded(index)}
                  startAnimationTime={getAnimationStartTime(startAnimation, index)}/>
              </Pressable>
            ))}
            <div className="trail">
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
              loaded={loaded}
            />
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
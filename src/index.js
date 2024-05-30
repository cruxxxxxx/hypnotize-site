import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SiteData from './sitedata.json';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const projectData = SiteData['projects'];

// Define the enum-like object for project states
const ProjectStates = {
  LOADING: 'LOADING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

function Project(props) {
  const { project, state } = props;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();

  useEffect(() => {
    const projectInfoElem = projectInfo.current;
    const innerProjectElem = innerProject.current;

    if (state === ProjectStates.LOADING) {
      // Directly set CSS values without animation for the loading state
      projectInfoElem.style.opacity = '0%';
      innerProjectElem.style.marginTop = project.marginTopClose;
      innerProjectElem.style.marginBottom = project.marginBottomClose;
    } else if (state === ProjectStates.OPEN) {
      projectInfoElem.classList.remove('fade-out');
      projectInfoElem.classList.add('fade-in');
      innerProjectElem.classList.remove('margin-revert');
      innerProjectElem.classList.add('margin-change');
    } else if (state === ProjectStates.CLOSED) {
      projectInfoElem.classList.remove('fade-in');
      projectInfoElem.classList.add('fade-out');
      innerProjectElem.classList.remove('margin-change');
      innerProjectElem.classList.add('margin-revert');
    }
  }, [state]);

  return (
    <div className="outer-project" ref={outerProject}>
      <div
        className="inner-project"
        ref={innerProject}
        style={{
          '--margin-top-open': project.marginTopOpen,
          '--margin-bottom-open': project.marginBottomOpen,
          '--margin-top-close': project.marginTopClose,
          '--margin-bottom-close': project.marginBottomClose,
        }}
      >
        <img src={project.imgSrc} alt={project.name} />
        <br />
        <div className="project-info" ref={projectInfo}>
          <div className="project-info-text">
            title: {project.name} <br />
            category: {project.category} <br />
            date: {project.endDate} <br />
            description: {project.description} <br />
            for fans of: {project.forFansOf} <br />
            <a href="http://www.google.com">fuckyea</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const CircleCursor = forwardRef((props, ref) => {
  const svgContainerRef = useRef();
  const cursorCircleRef = useRef();

  useImperativeHandle(ref, () => ({
    enable() {
      svgContainerRef.current.classList.add('active');
      cursorCircleRef.current.style.animation = `wipe ${props.duration || '1.5s'} linear`;
    },
    disable() {
      svgContainerRef.current.classList.remove('active');
      cursorCircleRef.current.style.animation = '';
    },
    updateCursorPosition(e) {
      svgContainerRef.current.style.left = `${e.nativeEvent.pageX - 50}px`;
      svgContainerRef.current.style.top = `${e.nativeEvent.pageY - 50}px`;
    },
  }));

  return (
    <div ref={svgContainerRef} className="svg-container">
      <svg ref={cursorCircleRef} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
  );
});

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [projectStates, setProjectStates] = useState(
    projectData.map(() => ProjectStates.LOADING)
  );

  const circleCursorRef = useRef();

  useEffect(() => {
    // Set all projects to CLOSED after initial loading
    setProjectStates(projectData.map(() => ProjectStates.CLOSED));
  }, []);

  const onClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index ? (state === ProjectStates.OPEN ? ProjectStates.CLOSED : ProjectStates.OPEN) : ProjectStates.CLOSED
      )
    );
  };

  const onPressIn = (e) => {
    circleCursorRef.current.enable();
    circleCursorRef.current.updateCursorPosition(e);
  };

  const onPressOut = (e) => {
    circleCursorRef.current.disable();
  };

  const onLongPress = (e, index) => {
    circleCursorRef.current.enable();
    onClick(index);
  };

  return (
    <React.StrictMode>
      <div id="header">hypnotize inc.</div>
      <div id="main">
        <CircleCursor ref={circleCursorRef} />

        <div className="row">
          <div className="column">
            {projectData.map((project, index) => (
              <Pressable
                key={project.name}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onLongPress={(event) => onLongPress(event, index)}
              >
                <Project
                  project={project}
                  state={projectStates[index]}
                />
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

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './project.css';
import './circleCursor.css';
import './marquee.css';
import SiteData from './sitedata.json';
import { ProjectStates, Project } from './project.js';
import { CircleCursor } from './circleCursor.js';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const projectData = SiteData['projects'];

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const [projectStates, setProjectStates] = useState(
    projectData.map(() => ProjectStates.LOADING)
  );

  const [columnWidth, setColumnWidth] = useState(0);
  const [maxColumnWidth, setMaxColumnWidth] = useState(0);

  const circleCursorRef = useRef();
  const columnRef = useRef();

  useEffect(() => {
    setProjectStates(projectData.map(() => ProjectStates.CLOSED));
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      const computedStyle = window.getComputedStyle(columnRef.current);
      const maxWidth = parseFloat(computedStyle.maxWidth); 
      const minWidth = parseFloat(computedStyle.minWidth);
      const width = parseFloat(computedStyle.width);
      const p = (width - minWidth) / (maxWidth - minWidth);
      //console.log(p);
      setColumnWidth(1-p);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index ? (state === ProjectStates.OPEN ? ProjectStates.CLOSED : ProjectStates.OPEN) : ProjectStates.CLOSED
      )
    );
  };

  const onPressIn = (e, index) => {
    onClick(index);
  };

  const onPressOut = (e) => {};

  const onLongPress = (e, index) => {};

  return (
    <React.StrictMode>
      <div id="header">hypnotize inc.</div>
      <div id="main">
        <CircleCursor ref={circleCursorRef} />
        <div className="row">
          <div className="column" ref={columnRef}>
            {projectData.map((project, index) => (
              <Pressable
                key={project.name}
                onPressIn={(event) => onPressIn(event, index)}
                onPressOut={onPressOut}
                onLongPress={(event) => onLongPress(event, index)}
              >
                <Project project={project} state={projectStates[index]} columnWidth={columnWidth} maxColumnWidth={maxColumnWidth}/>
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

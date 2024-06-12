import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SiteData from './sitedata.json';
import {ProjectStates, Project} from './project.js';
import {CircleCursor} from './circleCursor.js';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const projectData = SiteData['projects'];

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [projectStates, setProjectStates] = useState(
    projectData.map(() => ProjectStates.LOADING)
  );

  const circleCursorRef = useRef();

  useEffect(() => {
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

  const onPressIn = (e, index) => {
    console.log(index);
    if(index === activeIndex) {
      circleCursorRef.current.enable();
      circleCursorRef.current.updateCursorPosition(e);
    } else {
      onClick(index);
    }
  };

  const onPressOut = (e) => {
    circleCursorRef.current.disable();
  };

  const onLongPress = (e, index) => {
    if(index === activeIndex) {
      onClick(index);
    }
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
                onPressIn={(event) => onPressIn(event, index)}
                onPressOut={onPressOut}
                onLongPress={(event) => onLongPress(event, index)}>
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

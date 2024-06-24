import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './project.css';
import './circleCursor.css';
import './marquee.css';
import './slideshow.css';
import SiteData from './sitedata.json';
import {ProjectStates} from './projectStatesHandler.js';
import { Project } from './project.js';
import { CircleCursor } from './circleCursor.js';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const projectData = SiteData['projects'];

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const [projectStates, setProjectStates] = useState(
    projectData.map(() => ProjectStates.LOADING)
  );

  const [columnWidth, setColumnWidth] = useState(0);

  const circleCursorRef = useRef();
  const columnRef = useRef();

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

  const onClose = (index) => {
    setActiveIndex(null);
    setProjectStates((prev) =>
      prev.map((state, i) =>
        i === index ? ProjectStates.CLOSED : state
      )
    );
  };

  const onPressIn = (e, index) => {
    /*if(index === activeIndex) {
      circleCursorRef.current.enable();
      circleCursorRef.current.updateCursorPosition(e);
    } else {
      onClick(index);
    }*/

    if(index !== activeIndex) {
      onClick(index);
    } 
  };

  const onPressOut = (e) => {
    //circleCursorRef.current.disable();
  };

  const onLongPress = (e, index) => {
    /*if(index === activeIndex) {
      onClick(index);
    }*/
    //onClick(index);
  };

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
                delayLongPress={100}
              >
                <Project project={project} state={projectStates[index]} onClose={() => onClose(index)}/>
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

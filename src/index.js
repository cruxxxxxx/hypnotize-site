import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SiteData from './sitedata.json';
import {Pressable, StyleSheet, Text, View} from 'react-native';

const projectData = SiteData['projects'];

gsap.registerPlugin(useGSAP);

function Project(props) {
  const project = props.project;
  const isActive = props.isActive;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();

  const { contextSafe } = useGSAP({ scope: outerProject });

  useEffect(() => {
    if (isActive) {
      const marginTop = project.marginTopOpen;
      const marginBottom = project.marginBottomOpen;

      gsap.to(projectInfo.current, { opacity: '100%' });

      gsap.to(innerProject.current, { marginTop: marginTop });
      gsap.to(innerProject.current, {
        marginBottom: marginBottom,
        onComplete: () => innerProject.current.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      });
    } else {
      const marginTop = project.marginTopClose;
      const marginBottom = project.marginBottomClose;

      gsap.to(projectInfo.current, { opacity: '0%' });

      gsap.to(innerProject.current, { marginTop: marginTop });
      gsap.to(innerProject.current, { marginBottom: marginBottom });
    }
  });

  return (
    <div className="outer-project" ref={outerProject}>
      <div className="inner-project" ref={innerProject}>
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
        cursorCircleRef.current.style.display = 'block';
        cursorCircleRef.current.style.animation = `wipe ${props.duration || '1.5s'} linear`;
      },
      disable() {
        cursorCircleRef.current.style.display = 'none';
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

  const circleCursorRef = useRef();

  const onClick = (index) => {
    console.log(activeIndex === index ? null : index);
    setActiveIndex(activeIndex === index ? null : index);
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

      <CircleCursor ref={circleCursorRef}/>

        <div className="row">
          <div className="column">
            {projectData.map((project, index) => (
              <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onLongPress={(event) => onLongPress(event, index)}>
                <Project
                  key={project.name}
                  project={project}
                  isActive={activeIndex === index}/> 
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

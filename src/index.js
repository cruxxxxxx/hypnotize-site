import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SiteData from './sitedata.json';
import useMouseEvents from './mouseEvents'

const projectData = SiteData['projects'];

gsap.registerPlugin(useGSAP);

function Project(props) {
  const project = props.project;
  const isActive = props.isActive;
  const onClick = props.onClick;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();

  const { contextSafe } = useGSAP({ scope: outerProject });

  const [countdown, setCountdown] = useState(5);

  const { onMouseDown, onMouseUp, onMouseLeave, onMouseMove, cursorCircleRef } = useMouseEvents(onClick);

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
    <div
      className="outer-project"
      ref={outerProject}
      onDoubleClick={onClick}
    >
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
      <div ref={cursorCircleRef} className="cursor-circle"></div>
    </div>
  );
}

function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  const onClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <React.StrictMode>
      <div id="header">hypnotize inc.</div>
      <div id="main">
        <div className="row">
          <div className="column">
            {projectData.map((project, index) => (
              <Project
                key={project.name}
                project={project}
                isActive={activeIndex === index}
                onClick={() => onClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

import React, { useEffect, useRef } from 'react';
import { ProjectStates, ProjectStateHandler } from './projectStatesHandler';
import { scrollToElementWithPadding } from './util.js';
import Slideshow from './slideshow';
import { StyleSheet, Text, View } from 'react-native';
import { OpenMark } from './openmark';

const scrollToPadding = 100;

export function Project(props) {
  const { project, state, onClose, onMediaLoaded, startAnimationTime } = props;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();
  const slideshowRef = useRef();
  const prevState = useRef(state);
  const projectTitle = useRef();
  const lineContainerRef = useRef();
  const projectLineRef = useRef();
  const projectDescriptionRef = useRef();
  const innerInfoRef = useRef();

  useEffect(() => {
    const projectInfoElem = projectInfo.current;
    const innerProjectElem = innerProject.current;
    const projectDescriptionElem = projectDescriptionRef.current;

    const scrollToCallback = () => {
      //scrollToElementWithPadding(outerProject.current, scrollToPadding);
    };

    const stateHandler = new ProjectStateHandler(projectInfoElem, innerProjectElem, projectDescriptionElem, project);


    if(project.mediaSrcs.length > 1) {
      projectDescriptionRef.current.style.marginTop = '4em';
    }
    
    console.log('prev: ' + prevState.current + ' next: ' + state);

    const prevClosed = (prevState.current === ProjectStates.CLOSED) && (state === ProjectStates.CLOSED);

    if ((prevState.current === ProjectStates.LOADING && state === ProjectStates.CLOSED)) {
    } else if(prevClosed) {
      stateHandler.onStateChange(ProjectStates.LOADING, scrollToCallback);
    }
    else {
      stateHandler.onStateChange(state, scrollToCallback);
    }

    if (prevState.current === ProjectStates.OPEN && state === ProjectStates.CLOSED && slideshowRef.current) {
      slideshowRef.current.resetSlideIndex();
      innerProjectElem.classList.add('closing-animation');
    }

    prevState.current = state;

    return () => {
      innerProjectElem.removeEventListener('animationend', scrollToCallback);
    };
  }, [state]);

  useEffect(() => {
    const lineContainer = lineContainerRef.current;
    const projectLine = projectLineRef.current;
    const innerInfo = innerInfoRef.current;

    if (state === ProjectStates.OPEN) {
      if (lineContainer) {
        projectLine.classList.add('project-line', 'animation');
      }
      if(innerInfo) {
        innerInfo.classList.add('open');
      }
    }
  }, [state]);

  useEffect(() => {
    if (innerProject.current && startAnimationTime > 0) {
      innerProject.current.style.opacity = 0;
      innerProject.current.style.display = 'block';
      innerProject.current.style.animationDelay = `${startAnimationTime*1.5}ms`;
      innerProject.current.classList.add('fade-in');
    }

    const handleAnimationEnd = () => {
        innerProject.current.style.opacity = 1;
        innerProject.current.classList.remove('fade-in');
        innerProject.current.style.animationDelay = null
        innerProject.current.removeEventListener('animationend', handleAnimationEnd);
      };

      innerProject.current.addEventListener('animationend', handleAnimationEnd);


  }, [startAnimationTime]);

  return (
    <div className="outer-project" 
    ref={outerProject}>
      <div
        className="inner-project"
        ref={innerProject}
        style={{
          '--margin-top-open': project.marginTopOpen,
          '--margin-bottom-open': project.marginBottomOpen,
          '--margin-top-close': project.marginTopClose,
          '--margin-bottom-close': project.marginBottomClose,
          '--margin-top-hover': project.marginTopHover,
          '--margin-bottom-hover': project.marginBottomHover
        }}
      >
        <div className="project-info" ref={projectInfo}>
          <div className="project-title">
            <span ref={projectTitle}>{project.name} </span>
          </div>

          <OpenMark state={state} onClose={onClose} />

          <div className="line-container" ref={lineContainerRef}>
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <path ref={projectLineRef} d="M0,1h240.07c3.12,0,6.03,1.55,7.78,4.14l64.64,95.88"/>
            </svg>
          </div>

          <div className="project-info-text-container">
            <table ref={innerInfoRef} className="project-info-table">
              <tbody>
                <tr className="project-info-row">
                  <td className="project-info-label-cell">type</td>
                  <td className="project-info-value-cell">{project.category}</td>
                </tr>
                <tr>
                  <td className="project-info-label-cell">foo</td>
                  <td className="project-info-value-cell">{project.category}</td>
                </tr>
              </tbody>
            </table>
            <div className="project-info-text-year-column">
              {project.year}
            </div>
          </div>

        </div>

        <Slideshow
          ref={slideshowRef}
          mediaSrcs={project.mediaSrcs}
          projectName={project.name}
          isProjectOpen={state === ProjectStates.OPEN}
          onMediaLoaded={onMediaLoaded}
        />
      </div>
      <div ref={projectDescriptionRef} class="project-description">
        {project.description}
      </div>

    </div>
  );
}

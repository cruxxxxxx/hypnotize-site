import React, { useEffect, useRef } from 'react';
import { ProjectStates, ProjectStateHandler } from './projectStatesHandler';
import { scrollToElementWithPadding } from './util.js';
import Slideshow from './slideshow';
import { StyleSheet, Text, View } from 'react-native';
import { OpenMark } from './openmark';

const scrollToPadding = 100;

export function Project(props) {
  const { project, state, onClose, onMediaLoaded, startAnimationTime } = props;

  //console.log(startAnimationTime);

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();
  const slideshowRef = useRef();
  const prevState = useRef(state);
  const projectTitle = useRef();
  const lineContainerRef = useRef();
  const lineHorizontalRef = useRef();
  const lineVerticalRef = useRef();

  useEffect(() => {
    const projectInfoElem = projectInfo.current;
    const innerProjectElem = innerProject.current;

    const scrollToCallback = () => {
      //scrollToElementWithPadding(outerProject.current, scrollToPadding);
    };

    const stateHandler = new ProjectStateHandler(projectInfoElem, innerProjectElem, project);

    if (prevState.current === ProjectStates.LOADING && state === ProjectStates.CLOSED) {
    } else {
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
    const lineHorizontal = lineHorizontalRef.current;
    const lineVertical = lineVerticalRef.current;

    if (lineContainer) {
      if (state === ProjectStates.OPEN) {
        lineHorizontal.classList.add('line-horizontal', 'animation');
        lineVertical.classList.add('line-vertical', 'animation');
      } else {
        // lineHorizontal.classList.remove('line-horizontal', 'animation');
        // lineVertical.classList.remove('line-vertical', 'animation');
      }
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
          display: startAnimationTime >= 0 ? 'block' : 'none',
        }}
      >
        <div className="project-info" ref={projectInfo}>
          <div className="project-title">
            <span ref={projectTitle}>{project.name} </span>
          </div>

          <OpenMark state={state} onClose={onClose} />

          <div className="line-container" ref={lineContainerRef}>
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <line
                ref={lineHorizontalRef}
                className="line-horizontal"
                x1="0"
                y1="0"
                x2="240"
                y2="0"
                stroke="black"
              />
              <line
                ref={lineVerticalRef}
                className="line-diagonal"
                x1="240"
                y1="0"
                x2="290"
                y2="60"
                stroke="black"
              />
            </svg>
          </div>

          <div className="project-info-text-container">
            <span className="project-info-text left">{project.category} </span>
            <span className="project-info-text right">{project.year} </span> <br />
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
    </div>
  );
}

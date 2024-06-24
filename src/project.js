import React, { useEffect, useRef } from 'react';
import { ProjectStates, ProjectStateHandler } from './projectStatesHandler';
import { scrollToElementWithPadding } from './util.js';
import Slideshow from './slideshow';

const scrollToPadding = 60;

export function Project(props) {
  const { project, state } = props;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();
  const slideshowRef = useRef();
  const prevState = useRef(state);

  useEffect(() => {
    const projectInfoElem = projectInfo.current;
    const innerProjectElem = innerProject.current;

    const scrollToCallback = () => {
      scrollToElementWithPadding(innerProjectElem, scrollToPadding);
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
        <div className="project-info" ref={projectInfo}>
          <div className="project-info-text left">
            <span className="label">title: </span> <span>{project.name}</span><br />
            <span className="label">category: </span> <span>{project.category}</span>
          </div>
          <div className="project-info-text right">
            <span className="label">date: </span> <span>{project.endDate}</span><br />
            <span className="label">description: </span> <span>{project.description}</span>
          </div>
        </div>

        <Slideshow 
          ref={slideshowRef}
          mediaSrcs={project.mediaSrcs} 
          projectName={project.name} 
          isProjectOpen={state === ProjectStates.OPEN}
        />
      </div>
    </div>
  );
}

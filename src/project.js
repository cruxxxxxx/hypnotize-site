import React, { useState, useRef, useEffect } from 'react';

export const ProjectStates = {
  LOADING: 'LOADING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export function Project(props) {
  const { project, state } = props;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();
  const prevState = useRef(state);

  useEffect(() => {
    const projectInfoElem = projectInfo.current;
    const innerProjectElem = innerProject.current;

    if (state === ProjectStates.LOADING) {
      projectInfoElem.style.opacity = '0%';
      innerProjectElem.style.marginTop = project.marginTopClose;
      innerProjectElem.style.marginBottom = project.marginBottomClose;
    } else if (state === ProjectStates.OPEN && prevState.current !== ProjectStates.OPEN) {
      projectInfoElem.classList.remove('fade-out');
      projectInfoElem.classList.add('fade-in');
      innerProjectElem.classList.remove('margin-revert');
      innerProjectElem.classList.add('margin-change');
    } else if (state === ProjectStates.CLOSED && prevState.current !== ProjectStates.LOADING) {
      projectInfoElem.classList.remove('fade-in');
      projectInfoElem.classList.add('fade-out');
      innerProjectElem.classList.remove('margin-change');
      innerProjectElem.classList.add('margin-revert');
    }

    // Update the previous state
    prevState.current = state;
  }, [state, project.marginTopClose, project.marginBottomClose]);

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

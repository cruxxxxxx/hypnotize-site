import React, { useEffect, useRef, useLayoutEffect } from 'react';

export const ProjectStates = {
  LOADING: 'LOADING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

function scrollToElementWithPadding(element, paddingTop) {
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const offsetPosition = absoluteElementTop - paddingTop;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

export function Project(props) {
  const { project, state, columnWidth } = props;

  const outerProject = useRef();
  const innerProject = useRef();
  const projectInfo = useRef();
  const prevState = useRef(state);

const updateMargins = () => {
    const innerProjectElem = innerProject.current;

    const marginTopClose = parseFloat(project.marginTopClose);
    const marginBottomClose = parseFloat(project.marginBottomClose);

    const diff = marginTopClose - marginBottomClose;
    const adjustedMarginTop = marginTopClose + (diff * columnWidth);
    const adjustedMarginBottom = marginBottomClose + (diff * columnWidth);

    console.log(columnWidth);

    console.log(adjustedMarginTop);
    if (state === ProjectStates.CLOSED) {
      innerProjectElem.style.marginTop = adjustedMarginTop + '%';
      //innerProjectElem.style.marginBottom = adjustedMarginBottom + '%';
    } else if (state === ProjectStates.OPEN) {
      innerProjectElem.style.marginTop = project.marginTopOpen;
      innerProjectElem.style.marginBottom = project.marginBottomOpen;
    }
  };

  useEffect(() => {
    //updateMargins();
  }, [columnWidth, state]);

  useEffect(() => {
    const projectInfoElem = projectInfo.current;
    const innerProjectElem = innerProject.current;
    
    const myCallback = () => {
      scrollToElementWithPadding(innerProjectElem, 60);
      innerProjectElem.removeEventListener('animationend', myCallback);
    };

    if (state === ProjectStates.LOADING) {
      projectInfoElem.style.opacity = '0%';
      innerProjectElem.style.marginTop = project.marginTopClose;
      innerProjectElem.style.marginBottom = project.marginBottomClose;
    } else if (state === ProjectStates.OPEN && prevState.current !== ProjectStates.OPEN) {
      innerProjectElem.addEventListener('animationend', myCallback);
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

    prevState.current = state;

    return () => {
      innerProjectElem.removeEventListener('animationend', myCallback);
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

        <img src={project.imgSrc} alt={project.name} />
      </div>
    </div>
  );
}

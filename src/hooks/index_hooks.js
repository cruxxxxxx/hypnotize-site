import { ProjectStates } from "../components/project/projectStatesHandler";
import React, { useState, useRef, useEffect } from 'react';

export function useProjectState(projectData) {
    const [projectStates, setProjectStates] = useState(
        projectData.map(() => ProjectStates.LOADING)
    );

    const [activeIndex, setActiveIndex] = useState(null);
    const resetActiveIndex = () => setActiveIndex(null);
    const isActive = (index) => index === activeIndex;
    const isNotActive = (index) => index !== activeIndex;

  return {
    projectStates,
    setProjectStates,
    activeIndex,
    setActiveIndex,
    resetActiveIndex,
    isActive,
    isNotActive
  };
}

export function useLoadingState(projectData) {
    const [loaded, setLoaded] = useState(new Array(projectData.length).fill(false));
    const [progress,setProgress] = useState(0);
    const [startAnimation, setStartAnimation] = useState(null);

    return {
        loaded,
        setLoaded,
        progress,
        setProgress,
        startAnimation,
        setStartAnimation
    };
}
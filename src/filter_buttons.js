import React, { useState, useEffect } from 'react';
import { scrollToTop } from './util.js';
import { ProjectStates } from './projectStatesHandler.js';

const wipeScreen = (projectMask) => {
    projectMask.style.background_position_y = '-100vh';
    projectMask.style.display = 'block';
    projectMask.classList.remove('wipe');
    projectMask.classList.add('wipe');
}

const closeAll = (setActiveIndex, setProjectStates) => {
    setActiveIndex(null);
    setProjectStates((prev) => prev.map((state, i) => ProjectStates.CLOSED));
  }

function filterProjectData(projectData, filterCriteria) {
	return projectData.filter(project => {
    	return filterCriteria === '' || project.group === filterCriteria;
  	}); 
}

export function FilterButtons({ projectData, setActiveIndex, setProjectStates, projectMaskRef, onFilterChange }) {
  const [filtering, setFiltering] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState('');

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const filteredData = filterProjectData(projectData, filterCriteria);
    onFilterChange(filteredData);
  }, [filterCriteria, projectData, onFilterChange]);

  const handleFilterChange = async (type) => {
    if (filtering) return;

    setFiltering(true);
    closeAll(setActiveIndex, setProjectStates);
    scrollToTop();

    await delay(400);
    wipeScreen(projectMaskRef.current);

    await delay(200);
    setFilterCriteria(type);

    await delay(1000);
    projectMaskRef.current.style.display = 'none';
    setFiltering(false);
    scrollToTop();
  };

  return (
    <div id="footer">
      <div className="button-container">
        <button className="filter-button" onClick={() => handleFilterChange("")}></button>
        <br/>
        <span className="filter-button-label">all</span>
      </div>

      <div className="button-container">
        <button className="filter-button" onClick={() => handleFilterChange("other")}></button>
        <br/>
        <span className="filter-button-label" style={{'marginLeft': '0.1em'}}>other</span>
      </div>

      <div className="button-container">
        <button className="filter-button" onClick={() => handleFilterChange("media")}></button>
        <br/>
        <span className="filter-button-label">media</span>
      </div>
    </div>
  );
}
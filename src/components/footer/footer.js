import React, { useState, useEffect, useRef } from 'react';
import { scrollToTop } from '../../util.js';
import { ProjectStates } from '../project/projectStatesHandler.js';
import { Pressable } from 'react-native';

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

export function Footer({ projectData, setActiveIndex, setProjectStates, projectMaskRef, onFilterChange, loaded }) {
  const [filtering, setFiltering] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [footerOpen, setFooterOpen] = useState(true);
  const prevFooterOpen = useRef(false);
  const footerRef = useRef();
  const arrowRef = useRef();
  const plusVerticalRef = useRef();
  const [firstLoad, setFirstLoad] = useState(true);

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

  const toggleFooter = () => {
    setFooterOpen(prevFooterOpen => {
      if(prevFooterOpen === null) {
        return true;
      } else {
        return !prevFooterOpen;
      }
    });
  }


  useEffect(() => {
    if(loaded.every(loaded => loaded) && firstLoad) {
      setFilterCriteria('projects');
      setFirstLoad(false);
    }
  }, [loaded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target) && footerOpen) {
        setFooterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [footerOpen]);

  useEffect(() => {
    if (footerOpen === prevFooterOpen.current) {
      prevFooterOpen.current = footerOpen;
      return;
    }

    if (footerRef.current && plusVerticalRef.current && footerOpen !== null) {
      const handleFooterAnimationEnd = (event) => {
        const footerStyle = window.getComputedStyle(footerRef.current);
        footerRef.current.style.transform = footerStyle.transform;
        footerRef.current.style.background = footerStyle.background;
        footerRef.current.classList.remove('open');
        footerRef.current.classList.remove('close');
        footerRef.current.removeEventListener('animationend', handleFooterAnimationEnd);
      };

      const handleArrowAnimationEnd = (event) => {
        const plusVerticalStyle = window.getComputedStyle(plusVerticalRef.current);
        plusVerticalRef.current.style.transform = plusVerticalStyle.transform;
        plusVerticalRef.current.classList.remove('open');
        plusVerticalRef.current.classList.remove('close');
        plusVerticalRef.current.removeEventListener('animationend', handleArrowAnimationEnd);
      };

      if (footerOpen === true) {
        footerRef.current.classList.remove('close');
        plusVerticalRef.current.classList.remove('close');

        footerRef.current.classList.add('open');
        plusVerticalRef.current.classList.add('open');
      } else if (footerOpen === false) {
        footerRef.current.classList.remove('open');
        plusVerticalRef.current.classList.remove('open');

        footerRef.current.classList.add('close');
        plusVerticalRef.current.classList.add('close');
      }

      footerRef.current.addEventListener('animationend', handleFooterAnimationEnd);
      plusVerticalRef.current.addEventListener('animationend', handleArrowAnimationEnd);
    }

    prevFooterOpen.current = footerOpen;

  }, [footerOpen]);

  return (
    <div ref={footerRef} className="outside-footer">
      <div className="footer-arrow-container">
        <Pressable onPress={toggleFooter}>
          <div class="line horizontal"></div>
          <div ref={plusVerticalRef} class="line vertical"></div>
          <img ref={arrowRef} className="footer-arrow" src="arrow.svg" alt="Toggle footer" />
        </Pressable>
      </div>

      <div className="footer-line"></div>

      <div className="inside-footer">
          <div className="buttons-container">
            <div id="first-button" className="button-container">
              <button className="filter-button" onClick={() => handleFilterChange("projects")}>
                <img className="filter-button-image" src="project1.svg" alt="projects" />
              </button>
              <br/>
              <span className="filter-button-label">projects</span>
            </div>

            <div id="third-button" className="button-container">
              <button className="filter-button" onClick={() => handleFilterChange("experiments")}>
                <img className="filter-button-image" src="experiment1.svg" alt="experiments" />
              </button>
              <br/>
              <span className="filter-button-label">experiments</span>
            </div>
          </div>

          <div className="footer-line"></div>


          <span> <a className="urls" href="mailto:info@hypnotize.inc">contact</a> </span>
        </div>
    </div>
  );
}
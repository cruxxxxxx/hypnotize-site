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

export function Footer({ projectData, setActiveIndex, setProjectStates, projectMaskRef, onFilterChange }) {
  const [filtering, setFiltering] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [footerOpen, setFooterOpen] = useState(false);
  const prevFooterOpen = useRef(footerOpen);
  const footerRef = useRef();
  const arrowRef = useRef();

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

    if (footerRef.current && arrowRef.current && footerOpen !== null) {
      const handleFooterAnimationEnd = (event) => {
        const footerStyle = window.getComputedStyle(footerRef.current);
        footerRef.current.style.transform = footerStyle.transform;
        footerRef.current.classList.remove('open');
        footerRef.current.classList.remove('close');
        footerRef.current.removeEventListener('animationend', handleFooterAnimationEnd);
      };

      const handleArrowAnimationEnd = (event) => {
        const arrowStyle = window.getComputedStyle(arrowRef.current);
        arrowRef.current.style.transform = arrowStyle.transform;
        arrowRef.current.classList.remove('open');
        arrowRef.current.classList.remove('close');
        arrowRef.current.removeEventListener('animationend', handleArrowAnimationEnd);
      };

      if (footerOpen === true) {
        footerRef.current.classList.remove('close');
        arrowRef.current.classList.remove('close');

        footerRef.current.classList.add('open');
        arrowRef.current.classList.add('open');
      } else if (footerOpen === false) {
        footerRef.current.classList.remove('open');
        arrowRef.current.classList.remove('open');

        footerRef.current.classList.add('close');
        arrowRef.current.classList.add('close');
      }

      footerRef.current.addEventListener('animationend', handleFooterAnimationEnd);
      arrowRef.current.addEventListener('animationend', handleArrowAnimationEnd);
    }

    prevFooterOpen.current = footerOpen;

  }, [footerOpen]);

  return (
    <div ref={footerRef} className="outside-footer">
      <div className="footer-arrow-container">
        <Pressable onPress={toggleFooter}>
          <img ref={arrowRef} className="footer-arrow" src="arrow.svg" alt="Toggle footer" />
        </Pressable>
      </div>

      <div className="footer-line"></div>

      <div className="inside-footer">
          <div className="buttons-container">
            <div id="first-button" className="button-container">
              <button className="filter-button" onClick={() => handleFilterChange("projects")}></button>
              <br/>
              <span className="filter-button-label">projects</span>
            </div>

            <div id="third-button" className="button-container">
              <button className="filter-button" onClick={() => handleFilterChange("experiments")}></button>
              <br/>
              <span className="filter-button-label">experiments</span>
            </div>
          </div>

          <div className="footer-line"></div>


          <span> <a className="contact" href="mailto:info@hypnotize.inc">contact</a> </span>
        </div>
    </div>
  );
}
import { ProjectStates } from './projectStatesHandler.js';

export function strobeLogo(projectStates, headerImg) {
	const allClosed = projectStates.every(state => state === ProjectStates.CLOSED);
    if (headerImg) {
      if (allClosed) {
        headerImg.classList.add('strobing');
      } else {
        headerImg.classList.remove('strobing');
      }
    }
}

export function didUserSwipe(touchStart, touchEnd) {
  if(touchStart == null || touchEnd == null) {
    return true;
  }

  const swipeDistanceX = Math.abs(touchEnd.x - touchStart.x);
  const swipeDistanceY = Math.abs(touchEnd.y - touchStart.y);
      
  const threshold = 20;
  const isOverSwipeThreshold = swipeDistanceX > threshold || swipeDistanceY > threshold;
  const isTouchEndNull = !touchEnd.x || !touchEnd.y;
  return isOverSwipeThreshold || isTouchEndNull;
}

export const wipeScreen = (projectMask) => {
      projectMask.style.background_position_y = '-100vh';
      projectMask.style.display = 'block';
      projectMask.classList.remove('wipe');
      projectMask.classList.add('wipe');
}

export const closeAll = (setActiveIndex, setProjectStates) => {
    setActiveIndex(null);
    setProjectStates((prev) => prev.map((state, i) => ProjectStates.CLOSED));
  }

export const getAnimationStartTime = (startAnimationBool, index) => {
    var startTimeRate = 150;
    var startTimeBase = 10;
    var startTime = startAnimationBool ? (startAnimationBool * index * startTimeRate) + startTimeBase : null
    return startTime;
  }

export function calculatePercentageLoaded (loaded) {
	const loadedItems = loaded.filter(item => item).length;
    const totalItems = loaded.length;
    const percentageLoaded = (loadedItems / totalItems) * 100;

    console.log(`Percentage loaded: ${percentageLoaded}%`);
}

export function mapProjectStates(setProjectStates, getState) {
	setProjectStates((prev) => prev.map((state, i) => getState(state, i)));
}

export function getTouchData(e) {
	return { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
}

export function filterProjectData(projectData, filterCriteria) {
	return projectData.filter(project => {
    	return filterCriteria === '' || project.group === filterCriteria;
  	}); 
}

export function getIsThis(index) {
  return (i) => i === index;
}
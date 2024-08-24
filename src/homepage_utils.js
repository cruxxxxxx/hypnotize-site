import { ProjectStates } from './projectStatesHandler.js';

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
    return percentageLoaded;
}

export function mapProjectStates(setProjectStates, getState) {
	setProjectStates((prev) => prev.map((state, i) => getState(state, i)));
}

export function getIsThis(index) {
  return (i) => i === index;
}
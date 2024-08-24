import { useCallback } from 'react';

function didUserSwipe(touchStart, touchEnd) {
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

function getTouchData(e) {
	return { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
}

export function usePressableCallbacks({
  isNotActive,
  hovering,
  setHover,
  openProject,
  resetHover,
  setHovering,
  touchStartRef
}) {
  const onPressIn = useCallback((e, index) => {
    if (isNotActive(index) && !hovering) {
      touchStartRef.current = getTouchData(e);
      setHover(index);
    } else if (isNotActive(index)) {
      openProject(index);
    }
  }, [isNotActive, hovering, setHover, openProject, touchStartRef]);

  const onPressOut = useCallback((e, index) => {
    if (isNotActive(index) && !hovering) {
      const touchStart = touchStartRef.current;
      const touchEnd = getTouchData(e);

      if(didUserSwipe(touchStart, touchEnd)){
        resetHover();
      } else {
        openProject(index);
      }

      touchStartRef.current = null; 
    }
  }, [isNotActive, hovering, resetHover, openProject, touchStartRef]);

  const onLongPress = useCallback((e, index) => {
    // Implement long press logic if needed
  }, []);

  const onHoverIn = useCallback((e, index) => {
    setHovering(true);
    setHover(index);
  }, [setHovering, setHover]);

  const onHoverOut = useCallback((e, index) => {
    resetHover();
  }, [resetHover]);

  return { onPressIn, onPressOut, onLongPress, onHoverIn, onHoverOut };
}

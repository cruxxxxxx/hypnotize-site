import { useRef } from 'react';

const useMouseEvents = (onClick) => {
  const holdTimeoutRef = useRef(null);
  const cursorCircleRef = useRef(null);
  const mouseDragging = useRef(null);

  const onMouseDown = (e) => {
    console.log('mouse down!');

    holdTimeoutRef.current = setTimeout(() => {

      console.log('mouse held down');
      cursorCircleRef.current.style.display = 'block';

      updateCursorPosition(e);

      holdTimeoutRef.current = setTimeout(() => { onClick() }, 200);

  }, 100);

  };

  const onMouseUp = () => {
    clearTimeout(holdTimeoutRef.current);
    cursorCircleRef.current.style.display = 'none';
  };

  const onMouseLeave = () => {
    clearTimeout(holdTimeoutRef.current);
    cursorCircleRef.current.style.display = 'none';
  };

  const onMouseMove = (e) => {
    if (mouseDragging.current) {
      const currentX = e.clientX;
      const currentY = e.clientY;

      const dx = currentX - mouseDragging.current.startX;
      const dy = currentY - mouseDragging.current.startY;

      const change = Math.sqrt(dx * dx + dy * dy) ;
      console.log('change ' + change);
      if (change > 0.1) {
        clearTimeout(holdTimeoutRef.current);
        cursorCircleRef.current.style.display = 'none';
        mouseDragging.current = null;
      }

    } else {
      mouseDragging.current = { startX: e.clientX, startY: e.clientY };
    }
  };

  const updateCursorPosition = (e) => {
    const cursorCircle = cursorCircleRef.current;
    cursorCircle.style.left = `${e.pageX - cursorCircle.offsetWidth / 2}px`;
    cursorCircle.style.top = `${e.pageY - cursorCircle.offsetHeight / 2}px`;
  };

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onMouseMove,
    cursorCircleRef
  };
};

export default useMouseEvents;

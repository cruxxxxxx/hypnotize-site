import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom/client';

export const CircleCursor = forwardRef((props, ref) => {
  const svgContainerRef = useRef();
  const cursorCircleRef = useRef();

  useImperativeHandle(ref, () => ({
      enable() {
        cursorCircleRef.current.style.display = 'block';
        cursorCircleRef.current.style.animation = `wipe ${props.duration || '1.5s'} linear`;
      },
      disable() {
        cursorCircleRef.current.style.display = 'none';
        cursorCircleRef.current.style.animation = '';
      },
      updateCursorPosition(e) {
        svgContainerRef.current.style.left = `${e.nativeEvent.pageX - 50}px`;
        svgContainerRef.current.style.top = `${e.nativeEvent.pageY - 50}px`;
      },
    }));

  return (
    <div ref={svgContainerRef} className="svg-container">
      <svg ref={cursorCircleRef} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
  );
});
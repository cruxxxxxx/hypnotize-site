import React, { useRef, forwardRef, useImperativeHandle } from 'react';

export const CircleCursor = forwardRef((props, ref) => {
  const svgContainerRef = useRef();
  const cursorCircleRef = useRef();
  const smallCircleRef = useRef();
  const mediumCircleRef = useRef();
  const largeCircleRef = useRef();

  useImperativeHandle(ref, () => ({
    enable() {
      cursorCircleRef.current.style.display = 'block';
      if (smallCircleRef.current) {
        smallCircleRef.current.style.animation = `wipe ${props.smallDuration || '2.5s'} linear infinite`;
        smallCircleRef.current.style.fill = 'white';
      }
      if (mediumCircleRef.current) {
        mediumCircleRef.current.style.animation = `wipe ${props.mediumDuration || '2s'} linear infinite`;
      }
      if (largeCircleRef.current) {
        largeCircleRef.current.style.animation = `wipe ${props.largeDuration || '1.5s'} linear infinite`;
      }
    },
    disable() {
      cursorCircleRef.current.style.display = 'none';
      if (smallCircleRef.current) smallCircleRef.current.style.animation = '';
      if (mediumCircleRef.current) mediumCircleRef.current.style.animation = '';
      if (largeCircleRef.current) largeCircleRef.current.style.animation = '';
    },
    updateCursorPosition(e) {
      svgContainerRef.current.style.left = `${e.nativeEvent.pageX - 70}px`;
      svgContainerRef.current.style.top = `${e.nativeEvent.pageY - 70}px`;
    },
  }));

  return (
    <div ref={svgContainerRef} className="svg-container">
      <svg ref={cursorCircleRef} viewBox="0 0 140 140">
        <circle id="smallCircleRef" ref={smallCircleRef} cx="70" cy="70" r="20" />
        <text x="70" y="70" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="black">close</text>

            <circle ref={mediumCircleRef} cx="70" cy="70" r="40" />
        <circle ref={largeCircleRef} cx="70" cy="70" r="50"/>

      </svg>
    </div>
  );
});

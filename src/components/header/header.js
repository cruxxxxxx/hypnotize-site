import React, { useState, useEffect, useRef } from 'react';

function strobeLogo(headerImg) {
    headerImg.classList.add('strobing');
}

export function Header() {
  const [playedLogo, setPlayedLogo] = useState(false);
  const headerImgRef = useRef(null);

  useEffect(() => {
    if (!playedLogo) {
      strobeLogo(headerImgRef.current);
      setPlayedLogo(true);
    }
  }, []);

  return (
    <div id="header">
      <img ref={headerImgRef} className="strobing" src="logo.png" alt="Logo" />
    </div>
  );
}
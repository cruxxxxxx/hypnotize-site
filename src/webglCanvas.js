import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MoirePattern = ({ bottomTexturePath, topTexturePath, onLoadComplete }) => {
  const bottomMeshRef = useRef();
  const topMeshRef = useRef();
  const [texture, setTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(bottomTexturePath, (bottomTexture) => {
      if (bottomMeshRef.current) {
        bottomMeshRef.current.material = new THREE.MeshBasicMaterial({
          map: bottomTexture,
          color: new THREE.Color('white').multiplyScalar(20),
        });
      }

      textureLoader.load(topTexturePath, (topTexture) => {
        topTexture.wrapS = THREE.RepeatWrapping;
        topTexture.wrapT = THREE.RepeatWrapping;
        setTexture(topTexture);

        if (topMeshRef.current) {
          topMeshRef.current.material = new THREE.MeshBasicMaterial({
            map: topTexture,
            transparent: true,
            color: new THREE.Color('white').multiplyScalar(20),
          });
        }

        // Notify that textures have been loaded
        if (onLoadComplete) {
          onLoadComplete();
        }
      });
    });
  }, [bottomTexturePath, topTexturePath, onLoadComplete]);

  useFrame(() => {
    if (texture) {
      texture.offset.y += 0.00006;
    }
  });

  return (
    <>
      <mesh ref={bottomMeshRef} position={[0, 0, 0]}>
        <planeGeometry args={[15, 10]} />
      </mesh>
      <mesh ref={topMeshRef} position={[0, 0, 0]}>
        <planeGeometry args={[15, 10]} />
      </mesh>
    </>
  );
};

const WebGLCanvas = ({ texture1, texture2 }) => {
  const [loading, setLoading] = useState(true);
  const coverDivRef = useRef();

  const handleLoadComplete = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!loading && coverDivRef.current) {
      coverDivRef.current.style.display = 'none';
    }
  }, [loading]);

  return (
    <div id="canvasDiv">
      <div ref={coverDivRef} className="cover-div" style={{ display: loading ? 'block' : 'none' }}></div>
      <Canvas>
        <MoirePattern bottomTexturePath={texture1} topTexturePath={texture2} onLoadComplete={handleLoadComplete} />
      </Canvas>
    </div>
  );
};

export default WebGLCanvas;

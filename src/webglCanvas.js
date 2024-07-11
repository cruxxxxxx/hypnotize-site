import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const StaticTexture = ({ texturePath }) => {
  const meshRef = useRef();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader().load(texturePath);
    meshRef.current.material = new THREE.MeshBasicMaterial({
      map: textureLoader,
            color: new THREE.Color('white').multiplyScalar(20), // Adjust brightness
    });
  }, [texturePath]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[15, 10]} />
    </mesh>
  );
};

const ScrollingTexture = ({ texturePath }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader().load(texturePath, (loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;
      setTexture(loadedTexture);
    });
  }, [texturePath]);

  useFrame(() => {
    if (texture) {
      texture.offset.y += 0.00006;
    }
  });

  useEffect(() => {
    if (texture && meshRef.current) {
      meshRef.current.material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
              color: new THREE.Color('white').multiplyScalar(20), // Adjust brightness
      });
    }
  }, [texture]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[15, 10]} />
    </mesh>
  );
};

const WebGLCanvas = ({ texture1, texture2 }) => {
  return (
    <Canvas>
      <StaticTexture texturePath={texture1} />
      <ScrollingTexture texturePath={texture2} />
    </Canvas>
  );
};

export default WebGLCanvas;

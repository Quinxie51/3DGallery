import { useState, useEffect, useRef } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { CanvasTexture } from 'three';
import * as THREE from 'three';

interface PhotoFrameProps {
  imageUrl: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}

export function PhotoFrame({ imageUrl, position, rotation, onClick }: PhotoFrameProps) {
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const [dimensions, setDimensions] = useState({ width: 2, height: 1.3 });
  const [isEmpty, setIsEmpty] = useState(!imageUrl);
  
  useEffect(() => {
    if (!imageUrl) {
      setIsEmpty(true);
      setTexture(null);
      return;
    }

    setIsEmpty(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const canvasTexture = new CanvasTexture(canvas);
        setTexture(canvasTexture);
        
        // Calculate aspect ratio and frame dimensions
        const aspectRatio = img.width / img.height;
        const maxHeight = 1.5; // Maximum frame height
        const maxWidth = 2.2; // Maximum frame width
        
        let frameWidth, frameHeight;
        
        if (aspectRatio > 1) {
          // Landscape orientation
          frameWidth = Math.min(maxWidth, maxHeight * aspectRatio);
          frameHeight = frameWidth / aspectRatio;
        } else {
          // Portrait orientation
          frameHeight = Math.min(maxHeight, maxWidth / aspectRatio);
          frameWidth = frameHeight * aspectRatio;
        }
        
        setDimensions({ width: frameWidth, height: frameHeight });
      }
    };
    
    img.src = imageUrl;
    
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl]);
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };
  
  // Frame border dimensions (slightly larger than photo)
  const borderWidth = dimensions.width + 0.2;
  const borderHeight = dimensions.height + 0.2;
  
  return (
    <group position={position} rotation={rotation}>
      {/* Frame border */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[borderWidth, borderHeight]} />
        <meshStandardMaterial 
          color={hovered ? '#d4af37' : '#2a2a2a'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {isEmpty ? (
        // Empty frame with upload placeholder
        <>
          {/* Background */}
          <mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
            castShadow
          >
            <planeGeometry args={[dimensions.width, dimensions.height]} />
            <meshStandardMaterial 
              color={hovered ? '#3a3a3a' : '#1a1a1a'}
              roughness={0.5}
            />
          </mesh>
          
          {/* Upload icon - simple plus sign */}
          <mesh position={[0, 0.15, 0.01]}>
            <planeGeometry args={[0.5, 0.08]} />
            <meshStandardMaterial 
              color={hovered ? '#d4af37' : '#666666'}
              emissive={hovered ? '#d4af37' : '#000000'}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, 0.15, 0.01]}>
            <planeGeometry args={[0.08, 0.5]} />
            <meshStandardMaterial 
              color={hovered ? '#d4af37' : '#666666'}
              emissive={hovered ? '#d4af37' : '#000000'}
              emissiveIntensity={0.3}
            />
          </mesh>
          
          {/* Text hint */}
          <mesh position={[0, -0.3, 0.01]}>
            <planeGeometry args={[1.2, 0.15]} />
            <meshStandardMaterial 
              color={hovered ? '#555555' : '#333333'}
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      ) : texture ? (
        // Photo with texture
        <>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        castShadow
      >
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshStandardMaterial 
          map={texture}
          roughness={0.5}
        />
      </mesh>
      
      {/* Glass effect */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <meshStandardMaterial 
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
        </>
      ) : null}
    </group>
  );
}

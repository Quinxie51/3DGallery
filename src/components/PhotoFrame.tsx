import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PhotoFrameProps {
  imageUrl: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}

export function PhotoFrame({ imageUrl, position, rotation, onClick }: PhotoFrameProps) {
  const [hovered, setHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 2, height: 1.3 });
  const [status, setStatus] = useState<'empty' | 'loading' | 'loaded' | 'error'>(
    imageUrl ? 'loading' : 'empty'
  );

  // Pre-create a material that lives for the entire component lifetime.
  // This avoids the race condition where the material doesn't exist yet
  // when the texture finishes loading (conditional JSX rendering).
  const photoMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x202020,
      toneMapped: false,
    });
    return mat;
  }, []);

  // Keep a ref to the latest texture for cleanup
  const textureRef = useRef<THREE.Texture | null>(null);

  // Dispose material on unmount
  useEffect(() => {
    return () => {
      photoMaterial.dispose();
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [photoMaterial]);

  // ── Load the image and assign it to the material imperatively ──
  useEffect(() => {
    if (!imageUrl) {
      setStatus('empty');
      photoMaterial.map = null;
      photoMaterial.color.set(0x202020);
      photoMaterial.needsUpdate = true;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      return;
    }

    setStatus('loading');
    photoMaterial.map = null;
    photoMaterial.color.set(0x202020);
    photoMaterial.needsUpdate = true;

    let cancelled = false;

    const img = new Image();
    if (/^https?:\/\//i.test(imageUrl)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (cancelled) return;

      // Dispose previous
      if (textureRef.current) { textureRef.current.dispose(); }

      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      textureRef.current = tex;

      // Assign directly — photoMaterial always exists
      photoMaterial.map = tex;
      photoMaterial.color.set(0xffffff);
      photoMaterial.needsUpdate = true;

      setStatus('loaded');

      // Calculate aspect ratio and frame dimensions
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const maxHeight = 1.5;
      const maxWidth = 2.2;
      let frameWidth: number;
      let frameHeight: number;

      if (aspectRatio > 1) {
        frameWidth = Math.min(maxWidth, maxHeight * aspectRatio);
        frameHeight = frameWidth / aspectRatio;
      } else {
        frameHeight = Math.min(maxHeight, maxWidth / aspectRatio);
        frameWidth = frameHeight * aspectRatio;
      }
      setDimensions({ width: frameWidth, height: frameHeight });
    };

    img.onerror = () => {
      if (cancelled) return;
      console.error('PhotoFrame: failed to load image:', imageUrl.slice(0, 100));
      setStatus('error');
    };

    img.src = imageUrl;

    return () => { cancelled = true; };
  }, [imageUrl, photoMaterial]);

  // Safety net: keep flushing needsUpdate for a few frames after texture assignment
  // in case the renderer missed it on the first pass.
  const flushCountdown = useRef(0);
  useEffect(() => {
    if (status === 'loaded') {
      flushCountdown.current = 15;
    }
  }, [status]);

  useFrame(() => {
    if (flushCountdown.current > 0 && textureRef.current) {
      textureRef.current.needsUpdate = true;
      photoMaterial.needsUpdate = true;
      flushCountdown.current -= 1;
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  }, [onClick]);

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

      {/* ── Photo plane — always rendered, texture assigned imperatively ── */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        castShadow
      >
        <planeGeometry args={[dimensions.width, dimensions.height]} />
        <primitive object={photoMaterial} attach="material" />
      </mesh>

      {/* ── Overlays (upload icon for empty, error X, glass for loaded) ── */}
      {status === 'empty' && (
        <>
          {/* Plus icon */}
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
          <mesh position={[0, -0.3, 0.01]}>
            <planeGeometry args={[1.2, 0.15]} />
            <meshStandardMaterial
              color={hovered ? '#555555' : '#333333'}
              transparent
              opacity={0.8}
            />
          </mesh>
        </>
      )}

      {status === 'error' && (
        <>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[Math.min(0.8, dimensions.width * 0.5), 0.06]} />
            <meshStandardMaterial color="#8b2a2a" emissive="#8b2a2a" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[Math.min(0.8, dimensions.width * 0.5), 0.06]} />
            <meshStandardMaterial color="#8b2a2a" emissive="#8b2a2a" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {status === 'loaded' && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[dimensions.width, dimensions.height]} />
          <meshStandardMaterial
            transparent
            opacity={0.08}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      )}
    </group>
  );
}

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Gallery } from './components/Gallery';
import { PhotoInfo } from './components/PhotoInfo';
import { BackgroundMusic } from './components/BackgroundMusic';

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    title: string;
    description: string;
    artist: string;
    year: string;
    imageUrl: string;
  } | null>(null);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 1.6, 8], fov: 75 }}
        shadows
      >
        <color attach="background" args={['#0a0a1f']} />
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 3, -2.5]} intensity={1.5} color="#9370db" castShadow />
        <pointLight position={[5, 3, 0]} intensity={1} color="#4b0082" />
        <pointLight position={[-5, 3, 0]} intensity={1} color="#4b0082" />
        
        <Gallery onPhotoClick={setSelectedPhoto} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.6, -2.5]}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 text-purple-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        <p className="text-base mb-1" style={{ fontWeight: 400, letterSpacing: '0.5px' }}>Drag to look around</p>
        <p className="text-base mb-1" style={{ fontWeight: 400, letterSpacing: '0.5px' }}>Scroll to zoom</p>
        <p className="text-base" style={{ fontWeight: 400, letterSpacing: '0.5px' }}>Click photos for details</p>
      </div>

      {selectedPhoto && (
        <PhotoInfo 
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
      
      <BackgroundMusic />
    </div>
  );
}
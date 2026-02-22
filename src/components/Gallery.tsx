import { useEffect } from 'react';
import { Floor } from './Floor';
import { Wall } from './Wall';
import { PhotoFrame } from './PhotoFrame';
import { Stars, SkyMode } from './Stars';
import { CeilingLight } from './CeilingLight';
import { WallLight } from './WallLight';
import { FloorText } from './FloorText';

interface Photo {
  url: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  artist: string;
  year: string;
}

// Frame positions without photos
const initialFrames: Photo[] = [
  // Back wall photos (3 frames)
  {
    url: null,
    position: [0, 1.6, -12.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [-3, 1.6, -12.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [3, 1.6, -12.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  
  // Left wall frames (5 frames) - Front to back: 1, 3, 5, 7, 9
  {
    url: null,
    position: [-4.9, 1.6, 5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [-4.9, 1.6, 1.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [-4.9, 1.6, -2] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [-4.9, 1.6, -5.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [-4.9, 1.6, -9] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  
  // Right wall frames (5 frames) - Front to back: 2, 4, 6, 8, 10
  {
    url: null,
    position: [4.9, 1.6, 5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [4.9, 1.6, 1.5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [4.9, 1.6, -2] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [4.9, 1.6, -5.5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
  {
    url: null,
    position: [4.9, 1.6, -9] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: '',
    description: '',
    artist: '',
    year: '',
  },
];

interface GalleryProps {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  onPhotoClick: (photo: {
    title: string;
    description: string;
    artist: string;
    year: string;
    imageUrl: string;
    index: number;
  }) => void;
  onUploadRequest: (index: number) => void;
  skyMode: SkyMode;
  floorPoem: {
    enabled: boolean;
    lines: string[];
    baseTriggerDistance: number;
    triggerStep: number;
    fadeRange: number;
  };
}

export function Gallery({ photos, setPhotos, onPhotoClick, onUploadRequest, skyMode, floorPoem }: GalleryProps) {
  // Initialize photos if empty
  useEffect(() => {
    if (photos.length === 0) {
      setPhotos(initialFrames);
    }
  }, [photos.length, setPhotos]);

  const handleFrameClick = (index: number) => {
    const photo = photos[index];
    
    if (photo.url) {
      // Photo exists, show info
      onPhotoClick({
        title: photo.title,
        description: photo.description,
        artist: photo.artist,
        year: photo.year,
        imageUrl: photo.url,
        index: index,
      });
    } else {
      // Empty frame, trigger file upload
      onUploadRequest(index);
    }
  };

  return (
    <group>
      <Stars mode={skyMode} />
      <Floor />
      <FloorText
        messages={floorPoem.lines}
        enabled={floorPoem.enabled}
        baseTriggerDistance={floorPoem.baseTriggerDistance}
        triggerStep={floorPoem.triggerStep}
        fadeRange={floorPoem.fadeRange}
      />
      
      {/* Back wall - moved further back */}
      <Wall position={[0, 2.5, -12.5]} rotation={[0, 0, 0]} width={10} height={5} color="#1a0f2e" />
      
      {/* Left wall - extended along z-axis */}
      <Wall position={[-5, 2.5, -2.5]} rotation={[0, Math.PI / 2, 0]} width={20} height={5} color="#1a0f2e" />
      
      {/* Right wall - extended along z-axis */}
      <Wall position={[5, 2.5, -2.5]} rotation={[0, -Math.PI / 2, 0]} width={20} height={5} color="#1a0f2e" />
      
      {/* Ceiling lights distributed along the hall */}
      <CeilingLight position={[-4, 4.8, -10]} />
      <CeilingLight position={[4, 4.8, -10]} />
      <CeilingLight position={[-4, 4.8, -5]} />
      <CeilingLight position={[4, 4.8, -5]} />
      <CeilingLight position={[-4, 4.8, 0]} />
      <CeilingLight position={[4, 4.8, 0]} />
      <CeilingLight position={[-4, 4.8, 5]} />
      <CeilingLight position={[4, 4.8, 5]} />
      
      {/* Wall lights for illumination */}
      {/* Back wall lights */}
      <WallLight position={[-3.5, 3.5, -12.3]} rotation={[0, 0, 0]} />
      <WallLight position={[3.5, 3.5, -12.3]} rotation={[0, 0, 0]} />
      
      {/* Left wall lights - distributed along the wall */}
      <WallLight position={[-4.8, 3.5, -10]} rotation={[0, Math.PI / 2, 0]} />
      <WallLight position={[-4.8, 3.5, -6.5]} rotation={[0, Math.PI / 2, 0]} />
      <WallLight position={[-4.8, 3.5, -3]} rotation={[0, Math.PI / 2, 0]} />
      <WallLight position={[-4.8, 3.5, 0.5]} rotation={[0, Math.PI / 2, 0]} />
      <WallLight position={[-4.8, 3.5, 4]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Right wall lights - distributed along the wall */}
      <WallLight position={[4.8, 3.5, -10]} rotation={[0, -Math.PI / 2, 0]} />
      <WallLight position={[4.8, 3.5, -6.5]} rotation={[0, -Math.PI / 2, 0]} />
      <WallLight position={[4.8, 3.5, -3]} rotation={[0, -Math.PI / 2, 0]} />
      <WallLight position={[4.8, 3.5, 0.5]} rotation={[0, -Math.PI / 2, 0]} />
      <WallLight position={[4.8, 3.5, 4]} rotation={[0, -Math.PI / 2, 0]} />
      
      {/* Photo frames */}
      {photos.map((photo, index) => (
        <PhotoFrame
          key={index}
          imageUrl={photo.url}
          position={photo.position}
          rotation={photo.rotation}
          onClick={() => handleFrameClick(index)}
        />
      ))}
    </group>
  );
}

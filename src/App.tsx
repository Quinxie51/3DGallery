import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Gallery } from './components/Gallery';
import { PhotoInfo } from './components/PhotoInfo';
import { BackgroundMusic } from './components/BackgroundMusic';
import { SkyMode } from './components/Stars';

interface Photo {
  url: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  artist: string;
  year: string;
}

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    title: string;
    description: string;
    artist: string;
    year: string;
    imageUrl: string;
    index: number;
  } | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);
  const [skyMode, setSkyMode] = useState<SkyMode>('starry-night');
  const [wallColor, setWallColor] = useState<string>('#1a0f2e');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [skyModeOpen, setSkyModeOpen] = useState(false);
  const [wallColorOpen, setWallColorOpen] = useState(false);

  // Load photos from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('galleryPhotos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error('Failed to load saved photos:', e);
      }
    }
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('galleryPhotos', JSON.stringify(photos));
    }
  }, [photos]);

  const handleFileUploadRequest = (index: number) => {
    setSelectedFrameIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || selectedFrameIndex === null) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      setPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[selectedFrameIndex] = {
          ...newPhotos[selectedFrameIndex],
          url: imageUrl,
          title: 'Uploaded Photo',
          description: 'Click to add description',
          artist: 'You',
          year: new Date().getFullYear().toString(),
        };
        return newPhotos;
      });
      
      setSelectedFrameIndex(null);
    };
    
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoSave = (updatedPhoto: {
    title: string;
    description: string;
    artist: string;
    year: string;
  }) => {
    if (selectedPhoto) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[selectedPhoto.index] = {
          ...newPhotos[selectedPhoto.index],
          title: updatedPhoto.title,
          description: updatedPhoto.description,
          artist: updatedPhoto.artist,
          year: updatedPhoto.year,
        };
        return newPhotos;
      });

      // Update the selected photo display
      setSelectedPhoto({
        ...selectedPhoto,
        title: updatedPhoto.title,
        description: updatedPhoto.description,
        artist: updatedPhoto.artist,
        year: updatedPhoto.year,
      });
    }
  };

  return (
    <div className="w-full h-screen bg-black">
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Canvas
        camera={{ position: [0, 1.6, 8], fov: 75 }}
        shadows
      >
        <color attach="background" args={['#0a0a1f']} />
        <ambientLight intensity={skyMode === 'snow' ? 0.8 : 0.7} />
        <pointLight 
          position={[0, 3, -2.5]} 
          intensity={1.5} 
          color="#9370db" 
          castShadow 
        />
        <pointLight 
          position={[5, 3, 0]} 
          intensity={skyMode === 'snow' ? 1.1 : 1} 
          color={skyMode === 'snow' ? '#b8c5d6' : '#4b0082'} 
        />
        <pointLight 
          position={[-5, 3, 0]} 
          intensity={skyMode === 'snow' ? 1.1 : 1} 
          color={skyMode === 'snow' ? '#b8c5d6' : '#4b0082'} 
        />
        
        <Gallery 
          photos={photos} 
          setPhotos={setPhotos}
          onPhotoClick={setSelectedPhoto}
          onUploadRequest={handleFileUploadRequest}
          skyMode={skyMode}
          wallColor={wallColor}
        />
        
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

      {/* Settings Panel Container */}
      <div className="absolute top-4 right-4">
        {/* Settings Toggle Button */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all w-full"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: '0.5px' }}
        >
          ⚙️ Gallery Settings {settingsOpen ? '▲' : '▼'}
        </button>

         {/* Collapsible Settings Panel */}
         {settingsOpen && (
           <div 
             className="mt-2 bg-black/70 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white/20 w-64 max-h-[80vh] overflow-y-auto"
             style={{ fontFamily: "'Cormorant Garamond', serif" }}
           >
           {/* Sky Mode Collapsible Section */}
           <div className="mb-4">
             <button
               onClick={() => setSkyModeOpen(!skyModeOpen)}
               className="w-full flex items-center justify-between text-white text-sm font-medium py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
               style={{ letterSpacing: '0.5px' }}
             >
               <span>Sky Mode</span>
               <span>{skyModeOpen ? '▲' : '▼'}</span>
             </button>
             
             {skyModeOpen && (
               <div className="mt-2">
                 <select
                   value={skyMode}
                   onChange={(e) => setSkyMode(e.target.value as SkyMode)}
                   className="w-full bg-black/50 text-white border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:border-white/50 cursor-pointer"
                   style={{ 
                     fontWeight: 400, 
                     letterSpacing: '0.5px',
                     colorScheme: 'dark'
                   }}
                 >
                   <option value="starry-night" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>⭐ Starry Night</option>
                   <option value="snow" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>❄️ Snow</option>
                   <option value="shooting-stars" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>💫 Shooting Stars</option>
                 </select>
               </div>
             )}
           </div>

           {/* Wall Color Collapsible Section */}
           <div>
             <button
               onClick={() => setWallColorOpen(!wallColorOpen)}
               className="w-full flex items-center justify-between text-white text-sm font-medium py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
               style={{ letterSpacing: '0.5px' }}
             >
               <span>Wall Color</span>
               <span>{wallColorOpen ? '▲' : '▼'}</span>
             </button>
             
             {wallColorOpen && (
               <div className="grid grid-cols-4 gap-2 mt-2 px-1">
              <button
                onClick={() => setWallColor('#1a0f2e')}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  wallColor === '#1a0f2e' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: '#1a0f2e' }}
                title="Deep Purple"
              />
              <button
                onClick={() => setWallColor('#2a2a2a')}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  wallColor === '#2a2a2a' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: '#2a2a2a' }}
                title="Charcoal Gray"
              />
              <button
                onClick={() => setWallColor('#1a1a1a')}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  wallColor === '#1a1a1a' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: '#1a1a1a' }}
                title="Black"
              />
              <button
                onClick={() => setWallColor('#0f1a2e')}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  wallColor === '#0f1a2e' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: '#0f1a2e' }}
                title="Midnight Blue"
              />
              <button
                onClick={() => setWallColor('#2e1a1a')}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  wallColor === '#2e1a1a' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: '#2e1a1a' }}
                title="Dark Burgundy"
              />
              <button
                onClick={() => setWallColor('#1a2e1a')}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  wallColor === '#1a2e1a' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                }`}
                style={{ backgroundColor: '#1a2e1a' }}
                title="Dark Forest"
              />
               <button
                 onClick={() => setWallColor('#3a3a3a')}
                 className={`w-12 h-12 rounded-lg border-2 transition-all ${
                   wallColor === '#3a3a3a' ? 'border-white scale-110 shadow-lg shadow-purple-500' : 'border-white/30 hover:border-white/60'
                 }`}
                 style={{ backgroundColor: '#3a3a3a' }}
                 title="Warm Gray"
               />
             </div>
             )}
           </div>
           </div>
         )}
       </div>

       {selectedPhoto && (
        <PhotoInfo 
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onSave={handlePhotoSave}
        />
      )}
      
      <BackgroundMusic />
    </div>
  );
}

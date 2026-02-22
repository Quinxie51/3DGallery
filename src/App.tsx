import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Gallery } from './components/Gallery';
import { PhotoInfo } from './components/PhotoInfo';
import { BackgroundMusic } from './components/BackgroundMusic';
import { SkyMode } from './components/Stars';
import { saveGallery, loadGallery, generateGalleryId } from './services/galleryService';

const defaultFloorPoemLines = [
  'Welcome to The Blue Memory Hall',
  "with you, I've found my forever place",
  'Every moment with you feels like home',
  'A year of love, gently unfolding.',
  '365 days since you walked into my world.',
];

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
  const didWarnLocalStorageQuotaRef = useRef(false);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);
  const [skyMode, setSkyMode] = useState<SkyMode>('starry-night');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [skyModeOpen, setSkyModeOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [poemOpen, setPoemOpen] = useState(false);
  const [customYouTubeUrl, setCustomYouTubeUrl] = useState('');
  const [youTubeVideoId, setYouTubeVideoId] = useState('4adZ7AguVcw');
  const [poemEnabled, setPoemEnabled] = useState(true);
  const [poemLinesText, setPoemLinesText] = useState(defaultFloorPoemLines.join('\n'));
  const [poemBaseTriggerDistance, setPoemBaseTriggerDistance] = useState(10);
  const [poemTriggerStep, setPoemTriggerStep] = useState(1.5);
  const [poemFadeRange, setPoemFadeRange] = useState(2);
  const [currentGalleryId, setCurrentGalleryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareCopied, setShareCopied] = useState(false);

  // Check URL for gallery ID and load it
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = urlParams.get('g');
    
    if (galleryId) {
      // Load gallery from Supabase
      loadGalleryFromSupabase(galleryId);
    } else {
      // Load photos from localStorage on mount (fallback)
      const savedPhotos = localStorage.getItem('galleryPhotos');
      if (savedPhotos) {
        try {
          setPhotos(JSON.parse(savedPhotos));
        } catch (e) {
          console.error('Failed to load saved photos:', e);
        }
      }
    }
  }, []);

  // Load gallery from Supabase
  const loadGalleryFromSupabase = async (galleryId: string) => {
    const result = await loadGallery(galleryId);
    if (result.success && result.data) {
      setPhotos(result.data.photos);
      setSkyMode(result.data.sky_mode as SkyMode);
      if (result.data.youtube_url) {
        setCustomYouTubeUrl(result.data.youtube_url);
        const id = extractYouTubeId(result.data.youtube_url);
        if (id) {
          setYouTubeVideoId(id);
        }
      }
      setCurrentGalleryId(galleryId);
    } else {
      alert('Failed to load gallery: ' + (result.error || 'Unknown error'));
    }
  };

  // Save photos to localStorage whenever they change
  useEffect(() => {
    if (photos.length > 0) {
      // Storing uploaded images as base64 data URLs can easily exceed localStorage's ~5-10MB quota.
      // To avoid crashing the app, we cache only lightweight data and skip data URLs.
      try {
        const photosForCache = photos.map((p) => {
          // Skip blob URLs and data URLs – they can't survive a page reload
          // and data URLs can blow past the localStorage quota.
          const isTransientUrl =
            typeof p.url === 'string' &&
            (p.url.startsWith('data:') || p.url.startsWith('blob:'));
          return isTransientUrl ? { ...p, url: null } : p;
        });

        localStorage.setItem('galleryPhotos', JSON.stringify(photosForCache));
      } catch (e) {
        // QuotaExceededError (or similar) can happen depending on browser/storage settings.
        if (!didWarnLocalStorageQuotaRef.current) {
          didWarnLocalStorageQuotaRef.current = true;
          alert(
            "Your browser storage is full, so uploaded photos can't be cached locally. Your gallery will still work for this session—use Save & Share to persist it."
          );
        }

        // Best-effort cleanup so subsequent writes have a chance to succeed.
        try {
          localStorage.removeItem('galleryPhotos');
        } catch {
          // ignore
        }
      }
    }
  }, [photos]);

  // Load custom YouTube URL from localStorage
  useEffect(() => {
    const savedUrl = localStorage.getItem('customYouTubeUrl');
    if (savedUrl) {
      const id = extractYouTubeId(savedUrl);
      if (id) {
        setCustomYouTubeUrl(savedUrl);
        setYouTubeVideoId(id);
      }
    }
  }, []);

  // Load floor poem settings from localStorage
  useEffect(() => {
    const savedPoemSettings = localStorage.getItem('floorPoemSettings');
    if (!savedPoemSettings) return;

    try {
      const parsed = JSON.parse(savedPoemSettings);
      if (typeof parsed.enabled === 'boolean') {
        setPoemEnabled(parsed.enabled);
      }
      if (typeof parsed.linesText === 'string') {
        setPoemLinesText(parsed.linesText);
      }
      if (typeof parsed.baseTriggerDistance === 'number') {
        setPoemBaseTriggerDistance(parsed.baseTriggerDistance);
      }
      if (typeof parsed.triggerStep === 'number') {
        setPoemTriggerStep(parsed.triggerStep);
      }
      if (typeof parsed.fadeRange === 'number') {
        setPoemFadeRange(parsed.fadeRange);
      }
    } catch (e) {
      console.error('Failed to load floor poem settings:', e);
    }
  }, []);

  // Save floor poem settings to localStorage
  useEffect(() => {
    const poemSettings = {
      enabled: poemEnabled,
      linesText: poemLinesText,
      baseTriggerDistance: poemBaseTriggerDistance,
      triggerStep: poemTriggerStep,
      fadeRange: poemFadeRange,
    };
    localStorage.setItem('floorPoemSettings', JSON.stringify(poemSettings));
  }, [poemEnabled, poemLinesText, poemBaseTriggerDistance, poemTriggerStep, poemFadeRange]);

  // Helper function to extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/  // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Handle YouTube URL submission
  const handleYouTubeUrlSubmit = () => {
    if (!customYouTubeUrl.trim()) {
      // Reset to default if empty
      setYouTubeVideoId('4adZ7AguVcw');
      localStorage.removeItem('customYouTubeUrl');
      return;
    }

    const id = extractYouTubeId(customYouTubeUrl);
    if (id) {
      setYouTubeVideoId(id);
      localStorage.setItem('customYouTubeUrl', customYouTubeUrl);
    } else {
      alert('Invalid YouTube URL. Please use a valid YouTube link (e.g., https://www.youtube.com/watch?v=...)');
    }
  };

  // Handle save and share gallery
  const handleSaveAndShare = async () => {
    setIsSaving(true);
    try {
      const result = await saveGallery(
        photos,
        skyMode,
        customYouTubeUrl,
        currentGalleryId || undefined
      );

      if (result.success) {
        setCurrentGalleryId(result.galleryId);
        const url = `${window.location.origin}${window.location.pathname}?g=${result.galleryId}`;
        setShareUrl(url);
        setShareCopied(false);
        
        // Update URL without reload
        window.history.pushState({}, '', url);
      } else {
        alert('Failed to save gallery: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('An error occurred while saving the gallery');
    } finally {
      setIsSaving(false);
    }
  };

  // Copy share URL to clipboard
  const copyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch (e) {
      // Fallback for older browsers / restricted contexts
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 1600);
      } catch (fallbackErr) {
        console.error('Failed to copy share URL:', e, fallbackErr);
        alert('Could not copy the link automatically. Please copy it from the box.');
      }
    }
  };

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

    // Use a blob URL instead of a base64 data URL.
    // Blob URLs are lightweight pointers that Three.js TextureLoader handles
    // much more reliably than multi-megabyte data-URL strings.
    const blobUrl = URL.createObjectURL(file);

    setPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[selectedFrameIndex] = {
        ...newPhotos[selectedFrameIndex],
        url: blobUrl,
        title: 'Uploaded Photo',
        description: 'Click to add description',
        artist: 'You',
        year: new Date().getFullYear().toString(),
      };
      return newPhotos;
    });

    setSelectedFrameIndex(null);
    
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

  const handleReplacePhoto = (index: number) => {
    setSelectedPhoto(null);
    handleFileUploadRequest(index);
  };

  const floorPoemLines = poemLinesText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

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
          floorPoem={{
            enabled: poemEnabled,
            lines: floorPoemLines,
            baseTriggerDistance: poemBaseTriggerDistance,
            triggerStep: poemTriggerStep,
            fadeRange: poemFadeRange,
          }}
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
          Gallery Settings {settingsOpen ? '▲' : '▼'}
        </button>

         {/* Collapsible Settings Panel */}
         {settingsOpen && (
           <div 
             className="mt-2 bg-black/80 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white/30 w-80 min-h-[400px] max-h-[85vh] overflow-y-auto"
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
                 className="w-full bg-black/50 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/50 cursor-pointer"
                 style={{ 
                   fontWeight: 400, 
                   letterSpacing: '0.5px',
                   colorScheme: 'dark'
                 }}
               >
                 <option value="starry-night" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>Starry Night</option>
                 <option value="snow" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>Snow</option>
                 <option value="shooting-stars" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', color: 'white' }}>Shooting Stars</option>
               </select>
              </div>
            )}
           </div>

          {/* Background Music Collapsible Section */}
          <div>
            <button
              onClick={() => setMusicOpen(!musicOpen)}
              className="w-full flex items-center justify-between text-white text-sm font-medium py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              style={{ letterSpacing: '0.5px' }}
            >
              <span>Background Music</span>
              <span>{musicOpen ? '▲' : '▼'}</span>
            </button>
            
            {musicOpen && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customYouTubeUrl}
                  onChange={(e) => setCustomYouTubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-black/50 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/50 mb-2"
                  style={{ letterSpacing: '0.5px' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleYouTubeUrlSubmit()}
                />
                <button
                  onClick={handleYouTubeUrlSubmit}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ letterSpacing: '0.5px' }}
                >
                  Apply
                </button>
                {youTubeVideoId !== '4adZ7AguVcw' && (
                  <p className="text-green-400 text-sm mt-2" style={{ letterSpacing: '0.5px' }}>
                    ✓ Using custom music
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Floor Poem Collapsible Section */}
          <div className="mt-4">
            <button
              onClick={() => setPoemOpen(!poemOpen)}
              className="w-full flex items-center justify-between text-white text-sm font-medium py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              style={{ letterSpacing: '0.5px' }}
            >
              <span>Floor Poem</span>
              <span>{poemOpen ? '▲' : '▼'}</span>
            </button>

            {poemOpen && (
              <div className="mt-2 space-y-3">
                <label className="flex items-center justify-between text-white text-sm">
                  <span style={{ letterSpacing: '0.5px' }}>Show hidden poem</span>
                  <input
                    type="checkbox"
                    checked={poemEnabled}
                    onChange={(e) => setPoemEnabled(e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </label>

                <div>
                  <p className="text-white/90 text-sm mb-1" style={{ letterSpacing: '0.5px' }}>
                    Poem lines (one line per message)
                  </p>
                  <textarea
                    value={poemLinesText}
                    onChange={(e) => setPoemLinesText(e.target.value)}
                    className="w-full bg-black/50 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/50 min-h-[120px]"
                    placeholder="Type poem lines here..."
                    style={{ letterSpacing: '0.3px' }}
                  />
                </div>

                <label className="block text-white text-sm" style={{ letterSpacing: '0.5px' }}>
                  First reveal distance: {poemBaseTriggerDistance.toFixed(1)}
                  <input
                    type="range"
                    min={4}
                    max={20}
                    step={0.5}
                    value={poemBaseTriggerDistance}
                    onChange={(e) => setPoemBaseTriggerDistance(Number(e.target.value))}
                    className="w-full mt-1 cursor-pointer"
                  />
                </label>

                <label className="block text-white text-sm" style={{ letterSpacing: '0.5px' }}>
                  Line stagger distance: {poemTriggerStep.toFixed(1)}
                  <input
                    type="range"
                    min={0.2}
                    max={4}
                    step={0.1}
                    value={poemTriggerStep}
                    onChange={(e) => setPoemTriggerStep(Number(e.target.value))}
                    className="w-full mt-1 cursor-pointer"
                  />
                </label>

                <label className="block text-white text-sm" style={{ letterSpacing: '0.5px' }}>
                  Fade range: {poemFadeRange.toFixed(1)}
                  <input
                    type="range"
                    min={0.5}
                    max={6}
                    step={0.1}
                    value={poemFadeRange}
                    onChange={(e) => setPoemFadeRange(Number(e.target.value))}
                    className="w-full mt-1 cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>
          </div>
         )}
       </div>

       {/* Save & Share Button */}
       <div className="absolute bottom-4 left-4 flex flex-col gap-2">
         <button
           onClick={handleSaveAndShare}
           disabled={isSaving}
           className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all flex items-center gap-2"
           style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: '0.5px' }}
         >
           {isSaving ? (
             <>
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
               Saving...
             </>
           ) : (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                 <polyline points="16 6 12 2 8 6"></polyline>
                 <line x1="12" y1="2" x2="12" y2="15"></line>
               </svg>
               Save & Share Gallery
             </>
           )}
         </button>

         {shareUrl && (
           <button
             onClick={copyShareUrl}
             className="bg-black/70 hover:bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 border border-white/25"
             style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: '0.5px' }}
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
               <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
             </svg>
             {shareCopied ? 'Copied!' : 'Copy link to share'}
           </button>
         )}
       </div>

       {shareUrl && (
         <div className="fixed top-6 left-1/2 -translate-x-1/2 transform z-50 w-[min(90vw,28rem)] bg-black/85 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/25">
           <p className="text-white text-sm mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.5px' }}>
             Your share link is ready:
           </p>
           <div className="flex gap-3 items-center">
             <input
               type="text"
               value={shareUrl}
               readOnly
               className="flex-1 bg-black/50 text-white text-sm border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:border-white/60"
               style={{ fontFamily: "'Cormorant Garamond', serif" }}
             />
             <button
               onClick={copyShareUrl}
               className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg"
               style={{ fontFamily: "'Cormorant Garamond', serif" }}
             >
               {shareCopied ? 'Copied!' : 'Copy link'}
             </button>
           </div>
         </div>
       )}

       {selectedPhoto && (
        <PhotoInfo 
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onSave={handlePhotoSave}
          onReplace={() => handleReplacePhoto(selectedPhoto.index)}
        />
      )}
      
      <BackgroundMusic videoId={youTubeVideoId} />
    </div>
  );
}

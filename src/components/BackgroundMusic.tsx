import { useState, useRef } from 'react';

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = () => {
    if (iframeRef.current) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":[${newVolume * 100}]}`,
        '*'
      );
    }
  };

  return (
    <>
      {/* Hidden YouTube iframe for background music */}
      <iframe
        ref={iframeRef}
        style={{ display: 'none' }}
        src="https://www.youtube.com/embed/4adZ7AguVcw?enablejsapi=1&loop=1&playlist=4adZ7AguVcw"
        allow="autoplay; encrypted-media"
      />

      {/* Music controls with custom spinning image */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {/* Custom spinning image - clickable to play/pause */}
        <button
          onClick={togglePlay}
          className="relative w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          <img 
            src="/photos/yung kai blue.png"
            alt="Music player"
            className={`w-full h-full object-cover rounded-full ${isPlaying ? 'animate-spin' : ''}`}
            style={{
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
              animationDuration: isPlaying ? '3s' : '0s'
            }}
          />
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 accent-white"
          title="Volume"
          style={{ height: '4px' }}
        />
      </div>
    </>
  );
}
interface PhotoInfoProps {
  photo: {
    title: string;
    description: string;
    artist: string;
    year: string;
    imageUrl: string;
  };
  onClose: () => void;
}

export function PhotoInfo({ photo, onClose }: PhotoInfoProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-purple-200 transition-colors bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm"
          style={{ 
            fontSize: '2rem', 
            fontWeight: 300, 
            lineHeight: 1,
            fontFamily: "'Cormorant Garamond', serif"
          }}
          title="Close"
        >
          ×
        </button>

        <div className="relative">
          <img 
            src={photo.imageUrl} 
            alt={photo.title}
            className="w-full h-96 object-cover"
          />
          
          {/* Dark gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent pt-32 pb-8 px-8">
            <h2 className="text-white mb-1" style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '0.5px' }}>{photo.title}</h2>
            <div className="text-white/80 mb-4" style={{ fontSize: '1rem', fontWeight: 400, letterSpacing: '1px' }}>
              {photo.artist} · {photo.year}
            </div>
            <p className="text-white leading-relaxed" style={{ fontSize: '1.125rem', fontWeight: 300, letterSpacing: '0.3px', lineHeight: '1.8' }}>
              {photo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
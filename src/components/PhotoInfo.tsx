import { useState } from 'react';

interface PhotoInfoProps {
  photo: {
    title: string;
    description: string;
    artist: string;
    year: string;
    imageUrl: string;
  };
  onClose: () => void;
  onSave?: (updatedPhoto: {
    title: string;
    description: string;
    artist: string;
    year: string;
  }) => void;
}

export function PhotoInfo({ photo, onClose, onSave }: PhotoInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState({
    title: photo.title,
    description: photo.description,
    artist: photo.artist,
    year: photo.year,
  });

  const handleSave = () => {
    if (onSave) {
      onSave(editedPhoto);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPhoto({
      title: photo.title,
      description: photo.description,
      artist: photo.artist,
      year: photo.year,
    });
    setIsEditing(false);
  };

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

        {/* Edit button - only show if onSave is provided */}
        {onSave && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-16 z-50 text-white hover:text-purple-200 transition-colors bg-black/50 hover:bg-black/70 rounded-lg px-4 py-2 backdrop-blur-sm"
            style={{ 
              fontSize: '1rem', 
              fontWeight: 400,
              fontFamily: "'Cormorant Garamond', serif"
            }}
          >
            Edit
          </button>
        )}

        <div className="relative">
          <img 
            src={photo.imageUrl} 
            alt={photo.title}
            className="w-full h-96 object-cover"
          />
          
          {/* Dark gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent pt-32 pb-8 px-8">
            {isEditing ? (
              // Edit mode
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedPhoto.title}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, title: e.target.value })}
                  className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-purple-300"
                  placeholder="Title"
                  style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '0.5px' }}
                />
                
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={editedPhoto.artist}
                    onChange={(e) => setEditedPhoto({ ...editedPhoto, artist: e.target.value })}
                    className="flex-1 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-purple-300"
                    placeholder="Artist"
                    style={{ fontSize: '1rem', fontWeight: 400, letterSpacing: '1px' }}
                  />
                  <input
                    type="text"
                    value={editedPhoto.year}
                    onChange={(e) => setEditedPhoto({ ...editedPhoto, year: e.target.value })}
                    className="w-32 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-purple-300"
                    placeholder="Year"
                    style={{ fontSize: '1rem', fontWeight: 400, letterSpacing: '1px' }}
                  />
                </div>

                <textarea
                  value={editedPhoto.description}
                  onChange={(e) => setEditedPhoto({ ...editedPhoto, description: e.target.value })}
                  className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-purple-300 min-h-[100px]"
                  placeholder="Description"
                  style={{ fontSize: '1.125rem', fontWeight: 300, letterSpacing: '0.3px', lineHeight: '1.8' }}
                />

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded transition-colors"
                    style={{ fontSize: '1rem', fontWeight: 400 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                    style={{ fontSize: '1rem', fontWeight: 400 }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <>
            <h2 className="text-white mb-1" style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '0.5px' }}>{photo.title}</h2>
            <div className="text-white/80 mb-4" style={{ fontSize: '1rem', fontWeight: 400, letterSpacing: '1px' }}>
              {photo.artist} · {photo.year}
            </div>
            <p className="text-white leading-relaxed" style={{ fontSize: '1.125rem', fontWeight: 300, letterSpacing: '0.3px', lineHeight: '1.8' }}>
              {photo.description}
            </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

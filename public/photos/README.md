# Photo Gallery Organization

This folder contains all the photos displayed in the 3D gallery.

## Folder Structure

```
photos/
├── back-wall/      (3 photos for the back wall)
├── left-wall/      (5 photos for the left wall)
└── right-wall/     (5 photos for the right wall)
```

## How to Add Your Photos

1. **Add your images** to the appropriate folder:
   - `back-wall/` - Photos displayed on the back wall (3 photos)
   - `left-wall/` - Photos displayed on the left wall (5 photos)
   - `right-wall/` - Photos displayed on the right wall (5 photos)

2. **Supported formats**: JPG, PNG, WebP, GIF

3. **Recommended naming**:
   - `photo-1.jpg`, `photo-2.jpg`, etc.
   - Or descriptive names like `landscape.jpg`, `portrait.jpg`

4. **Update Gallery.tsx**:
   - Change the `url` field in the `photos` array
   - Use the path: `/photos/back-wall/your-image.jpg`

## Example

If you add a file `sunset.jpg` to the `back-wall` folder, update Gallery.tsx:

```javascript
{
  url: '/photos/back-wall/sunset.jpg',
  position: [0, 1.6, -12.4],
  rotation: [0, 0, 0],
  title: 'Beautiful Sunset',
  description: 'My personal sunset photo',
  artist: 'Your Name',
  year: '2024',
}
```

## Tips

- Higher resolution images look better but load slower
- Recommended size: 1920x1080 or similar aspect ratio
- Keep file sizes reasonable (< 2MB per image) for faster loading


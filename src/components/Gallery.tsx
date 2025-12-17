import { Floor } from './Floor';
import { Wall } from './Wall';
import { PhotoFrame } from './PhotoFrame';
import { Stars } from './Stars';
import { CeilingLight } from './CeilingLight';
import { WallLight } from './WallLight';
import { FloorText } from './FloorText';

interface Photo {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  description: string;
  artist: string;
  year: string;
}

const photos: Photo[] = [
  // Back wall photos (3 photos)
  {
    url: '/photos/back-wall/middle.jpg',
    position: [0, 1.6, -12.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    title: 'I love you 365 days',
    description: 'I felt like I have lived a life time with you in just a year. Can we make it forever?',
    artist: 'Steven and Quinxie',
    year: '2025',
  },
  {
    url: '/photos/back-wall/left.jpg',
    position: [-3, 1.6, -12.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    title: 'I love little things you do for me everyday',
    description: 'You are the most loving baby in the world. Bbi is so consitent showing love and care. Bbi draws me flower and writes me notes everyday. Bbi always brought flowers on your flight to meet me, bbi took care of me when I was sick, bbi never missed an opportunity to surprise me.',
    artist: 'Steven and Quinxie',
    year: '2025',
  },
  {
    url: '/photos/back-wall/righ.jpg',
    position: [3, 1.6, -12.4] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    title: 'You made love so easy',
    description: 'I never thought love can be so easy and natural. Like a breath of fresh air, I cant wait to make so many more memories with you.',
    artist: 'Steven and Quinxie',
    year: '2025',
  },
  
  // Left wall photos (5 photos) - Front to back: 1, 3, 5, 7, 9
  {
    url: '/photos/left-wall/1.jpg',
    position: [-4.9, 1.6, 5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: 'You walked into my world',
    description: 'Dear baby, the day you walked into my world, everything changed. I was having a tough time back then but you came like a light to my dark.',
    artist: 'Steven and Quinxie',
    year: 'November 2024',
  },
  {
    url: '/photos/left-wall/3.jpg',
    position: [-4.9, 1.6, 1.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: 'Pisa Trip - where I felt in love with you',
    description: 'You saw you with a whole new perspective :) It was the happiest day of my life and I never felt love that strong after such a long time.',
    artist: 'Steven and Quinxie',
    year: 'March 2025',
  },
  {
    url: '/photos/left-wall/5.jpg',
    position: [-4.9, 1.6, -2] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: 'You became mine and I became yours',
    description: 'The day you took me on Chicago sky deck and said "Would you be my girlfriend?", we finally became a couple.',
    artist: 'Steven and Quinxie',
    year: 'July 2025',
  },
  {
    url: '/photos/left-wall/7.jpg',
    position: [-4.9, 1.6, -5.5] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: 'You made me became the happiest Disney Princess',
    description: 'You never failed to make the promise come true. You remember every single detail of me, surprises me with everything I like, and protect me like I was your princess.',
    artist: 'Steven and Quinxie',
    year: 'August 2025',
  },
  {
    url: '/photos/left-wall/9.jpg',
    position: [-4.9, 1.6, -9] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    title: 'CalHack trip',
    description: 'Bbi cared about me so much, bbi encouraged me to go to CalHack, you were not just my boyfriend, you were my mentor, my friend, my partner, my everything.',
    artist: 'Steven and Quinxie',
    year: 'Oct 2025',
  },
  
  // Right wall photos (5 photos) - Front to back: 2, 4, 6, 8, 10
  {
    url: '/photos/right-wall/2.jpg',
    position: [4.9, 1.6, 5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: 'Our first meet in person',
    description: 'Hanging out with you was so fun, even as a friend, we always come up with something fun, laugh, and enjoy the moment together. It was so easy to be around you and I never felt so comfortable with someone before.',
    artist: 'Steven and Quinxie',
    year: 'January 2025',
  },
  {
    url: '/photos/right-wall/4.jpg',
    position: [4.9, 1.6, 1.5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: 'Our first kiss under the twinkling Eiffel Tower',
    description: 'Even when we are in trouble, we always find a way to make it work, even when we have to be partners in crime :).',
    artist: 'Steven and Quinxie',
    year: 'March 2025',
  },
  {
    url: '/photos/right-wall/6.jpg',
    position: [4.9, 1.6, -2] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: 'My bbi graduation day',
    description: 'I got to know more your little life, your family, your friends, your life at Stanford. Im so proud of you for eveerything you have done and achieved.',
    artist: 'Steven and Quinxie',
    year: 'June 2025',
  },
  {
    url: '/photos/right-wall/8.jpg',
    position: [4.9, 1.6, -5.5] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: 'Our first hackathon in Michigan',
    description: 'You made me became a better person everyday. You taught me so much about communication, about being patient, about work style, about everything. Im so happy when we grow together.',
    artist: 'Steven and Quinxie',
    year: 'September 2025',
  },
  {
    url: '/photos/right-wall/10.jpg',
    position: [4.9, 1.6, -9] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    title: 'Immerse The Bay trip',
    description: 'Your community is so fun and made me feel like a family. Thank to you I got to know so many cool people and made so many memories.',
    artist: 'Steven and Quinxie',
    year: 'November 2025',
  },
];

interface GalleryProps {
  onPhotoClick: (photo: {
    title: string;
    description: string;
    artist: string;
    year: string;
    imageUrl: string;
  }) => void;
}

export function Gallery({ onPhotoClick }: GalleryProps) {
  return (
    <group>
      <Stars />
      <Floor />
      <FloorText />
      
      {/* Back wall - moved further back */}
      <Wall position={[0, 2.5, -12.5]} rotation={[0, 0, 0]} width={10} height={5} />
      
      {/* Left wall - extended along z-axis */}
      <Wall position={[-5, 2.5, -2.5]} rotation={[0, Math.PI / 2, 0]} width={20} height={5} />
      
      {/* Right wall - extended along z-axis */}
      <Wall position={[5, 2.5, -2.5]} rotation={[0, -Math.PI / 2, 0]} width={20} height={5} />
      
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
          onClick={() => onPhotoClick({
            title: photo.title,
            description: photo.description,
            artist: photo.artist,
            year: photo.year,
            imageUrl: photo.url,
          })}
        />
      ))}
    </group>
  );
}
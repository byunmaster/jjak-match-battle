import { useEffect, useState } from 'react';
import './Profile.scss';

const images = ['🙍‍♂️', '🙍‍♀️', '🧑‍🎓', '🧑‍🚀', '👩‍💻', '🧑‍🍳', '🧑‍🌾', '🥷', '👷', '🧙', '🧟‍♀️', '🦹‍♂️', '🤶'];
const imageMap: { [key: string]: string } = {};

export default function Profile({ name, score, active }: { name: string; score: number; active: boolean }) {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!imageMap[name]) {
      imageMap[name] = images[Math.floor(Math.random() * images.length)];
    }
    setImage(imageMap[name]);
  }, [name]);

  return (
    <div className={`profile ${active && 'active'}`.trimEnd()}>
      <h1>{image}</h1>
      <div className="container">
        <h4>
          <b>{name}</b>
        </h4>
        <p>{score}</p>
      </div>
    </div>
  );
}

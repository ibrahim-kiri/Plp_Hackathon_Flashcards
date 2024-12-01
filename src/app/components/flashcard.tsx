'use client';

import { useState } from 'react';
import { addDoc } from 'firebase/firestore';
import flashcardsSetRef from '@/firebase/firebase';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

type FlashcardProps = {
  flashcard: {
    front: string;
    back: string;
  };
};

export default function Flashcard({ flashcard }: FlashcardProps) {
  const { user } = useUser();
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState<boolean>(false);

  const path = usePathname();

  const flashcardData = {
    userId: user?.id,
    front: flashcard.front,
    back: flashcard.back,
    date: new Date(),
  };

  const handleClick = async () => {
    try {
      await addDoc(flashcardsSetRef, { ...flashcardData });
      setAdded(true);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-64 h-40 cursor-pointer [perspective:1000px]"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          {/* Front of the card */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-lg border border-gray-300 shadow-lg flex items-center justify-center p-4">
            <p className="text-lg font-semibold text-center">{flashcard.front}</p>
          </div>

          {/* Back of the card */}
          <div className="absolute w-full h-full backface-hidden bg-blue-100 rounded-lg border border-gray-300 shadow-lg flex items-center justify-center p-4 [transform:rotateY(180deg)]">
            <p className="text-lg font-semibold text-center">{flashcard.back}</p>
          </div>
        </div>
      </div>
      {path === '/dashboard/generate' && (<button
        type="button"
        className={`mt-4 px-4 py-2 rounded transition-colors duration-300 ${
          added
            ? 'bg-green-500 text-white cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-700'
        }`}
        onClick={handleClick}
        disabled={added}
      >
        {added ? 'Added' : 'Add to Flashcard Set'}
      </button> )}
    </div>
  );
}

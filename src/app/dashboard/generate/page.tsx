'use client';

import { useState } from 'react';
import Flashcard from '@/app/components/flashcard';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { FaArrowLeft, FaBook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type flashcard = {
  userId: string;
  front: string;
  back: string;
  timestamp: Date;
}[];

export default function Generate() {
  const [text, setText] = useState<string>('');
  const [flashcards, setFlashcards] = useState<flashcard | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setFlashcards(null);
    const response = await fetch('/api/generate', {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({ prompt: text?.trim() }),
    });

    const { flashcards, error } = await response.json();
    if (response.status === 201) {
      console.log(flashcards);
      setFlashcards(flashcards);
    } else {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SignedIn>
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <FaBook className="text-indigo-600 text-2xl mr-2" />
                <span className="font-bold text-xl text-gray-800">Flashcards</span>
              </div>
              <UserButton />
            </div>
          </div>
        </nav>
      </SignedIn>

      <div className="bg-gray-50 flex flex-col items-center py-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="text-2xl" />Back
        </button>

        {/* Flashcard Generator Input */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-8">
          <p className="text-xl font-semibold text-gray-700 mb-4">Generate Flashcards</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Enter text to generate flashcards..."
            required
            className="border border-gray-300 rounded w-full p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 w-full"
          >
            Generate Flashcards
          </button>
        </div>

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {flashcards?.map((flashcard, idx) => (
            <Flashcard flashcard={flashcard} key={idx} />
          ))}
        </div>
      </div>
    </div>  

  );
}

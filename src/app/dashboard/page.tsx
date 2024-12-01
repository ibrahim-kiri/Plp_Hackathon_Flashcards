'use client';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import flashcardsSetRef from '@/firebase/firebase';
import Flashcard from '../components/flashcard';
import { query, where, orderBy, getDocs } from 'firebase/firestore';
import { FaPlus, FaBook } from 'react-icons/fa';

type FlashcardList = {
  userId: string;
  front: string;
  back: string;
  timestamp: Date;
}[];

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardList, setFlashCardList] = useState<FlashcardList | null>(null);

  useEffect(() => {
  async function getFlashcards() {
    if (user) {
      try {
        console.log("Fetching flashcards for user:", user.id);
        const q = query(
          flashcardsSetRef,
          where('userId', '==', user.id),
          orderBy('date')
        );
        console.log("Query created:", q);
        const querySnapshot = await getDocs(q);
        console.log("Query executed, document count:", querySnapshot.size);
        const fetchedFlashcardList: FlashcardList = querySnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            console.log("Document data:", data);
            return {
              userId: data.userId,
              front: data.front,
              back: data.back,
              timestamp: data.date.toDate(),
            };
          }
        );
        console.log("Fetched flashcard list:", fetchedFlashcardList);
        setFlashCardList(fetchedFlashcardList);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }
  }
  getFlashcards();
}, [user]);

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center mb-8">
          <Link 
            href="/dashboard/generate" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center transition duration-300"
          >
            <FaPlus className="mr-2" /> Generate New Set
          </Link>
        </div>

        {flashcardList && flashcardList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardList.map((flashcard, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <Flashcard flashcard={flashcard} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">You dont have any flashcards yet.</p>
            <p className="mt-2 text-indigo-600">Create your first set to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
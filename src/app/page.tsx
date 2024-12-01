'use client';

import { useRouter } from 'next/navigation';
import getStripe from './utils/get-stripe';

export default function Home() {
  const router = useRouter();

  const handleCheckout =  async () => {
    try {
      //Fetching the checkout session
      const response = await fetch('/api/checkout/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json();
      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Stripe.js failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error in handleCheckout:', error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to FlashCard
          </h1>
          <p className="text-xl mb-6">
            Transform your text into interactive flashcards with ease. Boost your learning with our intuitive platform.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => router.push('/sign-up')}
              className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push('/sign-in')}
              className="border border-white text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-white hover:text-indigo-600"
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80">
              <h3 className="text-2xl font-semibold mb-2">Easy to Use</h3>
              <p>Convert any text into flashcards quickly and easily with our user-friendly interface.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80">
              <h3 className="text-2xl font-semibold mb-2">Customizable</h3>
              <p>Customize your flashcards to fit your learning style and preferences.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80">
              <h3 className="text-2xl font-semibold mb-2">Accessible Anywhere</h3>
              <p>Access your flashcards from any device, anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Pricing Plans</h2>
          <p className="text-lg mb-12">Choose the plan that best fits your needs. No hidden fees or surprises.</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80">
              <h3 className="text-2xl font-semibold mb-2">Free Plan</h3>
              <p className="text-xl font-semibold mb-4">$0/month</p>
              <p>Access to basic features. Perfect for casual learners.</p>
              <button
                onClick={() => router.push('/sign-up')}
                className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 mt-4"
              >
                Get Started
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 border border-indigo-300">
              <h3 className="text-2xl font-semibold mb-2">Pro Plan</h3>
              <p className="text-xl font-semibold mb-4">$25/month</p>
              <p>Advanced features and customization options. Ideal for serious learners.</p>
              <button
                onClick={handleCheckout}
                className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 mt-4"
              >
                Get Started
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80">
              <h3 className="text-2xl font-semibold mb-2">Enterprise Plan</h3>
              <p className="text-xl font-semibold mb-4">$100/month</p>
              <p>Tailored solutions for teams and organizations.</p>
              <button
                onClick={() => router.push('/contact')}
                className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 mt-4"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

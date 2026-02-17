'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Turnstile from 'react-turnstile';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function VerifyHuman() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAACd0Za_7gH1ybOU2';

  const handleVerify = async (token: string) => {
    setLoading(true);
    try {
      // First, detect country from the frontend (uses VPN if enabled)
      console.log('Detecting country from frontend...');
      let detectedCountry = null;
      let detectedIP = null;

      try {
        const geoResponse = await axios.get('http://ip-api.com/json/');
        if (geoResponse.data) {
          detectedCountry = geoResponse.data.countryCode;
          detectedIP = geoResponse.data.query;
          console.log('Frontend detected IP:', detectedIP);
          console.log('Frontend detected Country:', detectedCountry);
          console.log('Full GeoIP data:', geoResponse.data);
        }
      } catch (geoError) {
        console.error('Frontend GeoIP detection failed:', geoError);
      }

      // Then verify the Turnstile token with backend
      console.log('Verifying Turnstile token:', token);
      const response = await axios.post('http://localhost:5000/verify-turnstile', {
        token,
        country: detectedCountry,
        ip: detectedIP
      });

      console.log('Backend response:', response.data);

      if (response.data.success) {
        const country = detectedCountry || response.data.country;
        console.log('Final Country for redirect:', country);
        console.log('Client IP Address:', detectedIP || response.data.ip);

        if (country) {
          redirectToCountry(country);
        } else {
          console.warn('Country detection failed (null returned). Showing modal.');
          setShowModal(true);
        }
      } else {
        console.error('Verification failed:', response.data.error);
      }
    } catch (error) {
      console.error('API Error:', error);
      setShowModal(true); // Fallback to manual selection on error
    } finally {
      setLoading(false);
    }
  };

  const redirectToCountry = (countryCode: string) => {
    // Map country codes to user's specified paths
    // India -> in
    // Abu Dhabi (UAE) -> ae
    // USA -> us
    // Default -> us? Or show modal if unknown?

    const code = countryCode.toLowerCase();

    if (code === 'in' || code === 'india') {
      router.push('/in');
    } else if (code === 'ae' || code === 'uae' || code === 'united arab emirates') {
      router.push('/ae');
    } else if (code === 'us' || code === 'usa' || code === 'united states') {
      router.push('/us');
    } else {
      // Supported countries only? Or default to modal if from unsupported region?
      // User said "im focussing for 3 countries". Maybe redirect others to a default or show modal.
      console.warn('Country not in focus list, showing modal:', code);
      setShowModal(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl">
        {/* Helper text for "Verify Human" */}
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={150}
            height={50}
            priority
          />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gray-800">Verify you are human</h1>
        <p className="text-gray-600 mb-6">Please complete the challenge below to access the site.</p>

        <div className="flex justify-center mb-6">
          <Turnstile
            sitekey={siteKey}
            onVerify={handleVerify}
          />
        </div>

        {loading && (
          <div className="flex items-center text-gray-500 gap-2">
            <Loader2 className="animate-spin h-4 w-4" />
            <span>Verifying...</span>
          </div>
        )}

        <div className="mt-8 text-xs text-gray-400">
          <p>Protected by Cloudflare Turnstile</p>
        </div>
      </div>

      {/* Country Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center">Select Your Region</h2>
            <p className="text-gray-600 mb-6 text-center text-sm">We couldn't detect your location automatically.</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/in')}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-between transition-colors"
              >
                <span className="font-medium">India</span>
                <span className="text-xl">🇮🇳</span>
              </button>

              <button
                onClick={() => router.push('/ae')}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-between transition-colors"
              >
                <span className="font-medium">United Arab Emirates (Abu Dhabi)</span>
                <span className="text-xl">🇦🇪</span>
              </button>

              <button
                onClick={() => router.push('/us')}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-between transition-colors"
              >
                <span className="font-medium">USA</span>
                <span className="text-xl">🇺🇸</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  interests: string[];
  platformPreference: string;
}

export default function OnboardPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    interests: [],
    platformPreference: 'all'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(interest => interest !== value)
      }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save onboarding data to user profile
    console.log('Submitting onboarding data:', formData);
    
    // Redirect to dashboard after completion
    window.location.href = '/dashboard';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to Neothink+</h1>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex justify-between">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-200 mt-4">
            <div 
              className="h-full bg-blue-600" 
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Interests</h2>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="business"
                      onChange={handleCheckboxChange}
                      checked={formData.interests.includes('business')}
                      className="mr-2"
                    />
                    Business Growth (Ascenders)
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="personal"
                      onChange={handleCheckboxChange}
                      checked={formData.interests.includes('personal')}
                      className="mr-2"
                    />
                    Personal Development (Neothinkers)
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value="health"
                      onChange={handleCheckboxChange}
                      checked={formData.interests.includes('health')}
                      className="mr-2"
                    />
                    Health & Longevity (Immortals)
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Platform Preference</h2>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="platformPreference"
                      value="all"
                      checked={formData.platformPreference === 'all'}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    Show all platforms
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="platformPreference"
                      value="ascenders"
                      checked={formData.platformPreference === 'ascenders'}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    Focus on Ascenders (Business Growth)
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="platformPreference"
                      value="neothinkers"
                      checked={formData.platformPreference === 'neothinkers'}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    Focus on Neothinkers (Personal Development)
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="platformPreference"
                      value="immortals"
                      checked={formData.platformPreference === 'immortals'}
                      onChange={handleRadioChange}
                      className="mr-2"
                    />
                    Focus on Immortals (Health & Longevity)
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Complete
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 

import React, { useState } from 'react';

interface ModelConfigProps {
  temperature: number;
  onTemperatureChange: (value: number) => void;
  topK: number;
  onTopKChange: (value: number) => void;
}

const ModelConfig: React.FC<ModelConfigProps> = ({
  temperature,
  onTemperatureChange,
  topK,
  onTopKChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-300 hover:bg-gray-700/50 rounded-lg"
        aria-expanded={isOpen}
      >
        <span>۳. تنظیمات پیشرفته (اختیاری)</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-700 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-400">
                دما (Temperature)
              </label>
              <span className="text-sm font-mono text-indigo-400">{temperature.toFixed(1)}</span>
            </div>
            <input
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>دقیق</span>
              <span>خلاقانه</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="topK" className="block text-sm font-medium text-gray-400">
                Top-K
              </label>
              <span className="text-sm font-mono text-indigo-400">{topK}</span>
            </div>
            <input
              id="topK"
              type="range"
              min="1"
              max="100"
              step="1"
              value={topK}
              onChange={(e) => onTopKChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
             <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>محدود</span>
              <span>متنوع</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelConfig;

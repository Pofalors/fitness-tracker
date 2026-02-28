import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../store/languageStore';

interface StopwatchProps {
  onTimeUpdate: (seconds: number) => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          onTimeUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onTimeUpdate]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    onTimeUpdate(0);
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="text-center">
        <div className="text-5xl font-mono font-bold text-gray-800 mb-4">
          {formatTime(seconds)}
        </div>
        
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isActive 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? t('stop') : t('start')}
          </button>
          
          <button
            type="button"
            onClick={resetTimer}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('reset')}
          </button>
        </div>
      </div>
    </div>
  );
};
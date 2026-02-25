import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
  emoji?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonText,
  buttonLink,
  emoji = '📝'
}) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16 px-4">
      <div className="text-8xl mb-6 animate-bounce-slow">{emoji}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">{message}</p>
      {buttonText && buttonLink && (
        <button
          onClick={() => navigate(buttonLink)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <span>✨</span>
          {buttonText}
        </button>
      )}
    </div>
  );
};
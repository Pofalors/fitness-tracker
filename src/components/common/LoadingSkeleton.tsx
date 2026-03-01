import React from 'react';

export const WorkoutSkeleton = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div>
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
};
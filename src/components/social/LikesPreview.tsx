import React, { useState } from 'react';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';

interface LikesPreviewProps {
  workoutId: string;
}

export const LikesPreview: React.FC<LikesPreviewProps> = ({ workoutId }) => {
  const { likes } = useSocialStore();
  const { user } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  
  const workoutLikes = likes.filter(l => l.workoutId === workoutId);
  const hasLiked = workoutLikes.some(l => l.userId === user?.uid);
  
  // Πάρε τα πρώτα 3 likes (εκτός από τον current user αν θέλεις)
  const previewLikes = workoutLikes.slice(0, 3);
  const remainingCount = workoutLikes.length - 3;
  
  if (workoutLikes.length === 0) return null;
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowAll(!showAll)}
        className="flex items-center gap-1 text-sm text-gray-600  hover:text-gray-900 "
      >
        {/* Sneak peek avatars/names */}
        <div className="flex -space-x-2">
          {previewLikes.map((like, index) => (
            <div
              key={like.id}
              className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white  flex items-center justify-center text-xs text-white font-medium"
              style={{ zIndex: previewLikes.length - index }}
            >
              {like.userId.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
        
        <span>
          {hasLiked ? 'Εσύ' : ''}
          {hasLiked && workoutLikes.length > 1 && ` και ${workoutLikes.length - 1} ${workoutLikes.length - 1 === 1 ? 'άλλος' : 'άλλοι'}`}
          {!hasLiked && workoutLikes.length === 1 && '1 άτομο'}
          {!hasLiked && workoutLikes.length > 1 && `${workoutLikes.length} άτομα`}
        </span>
      </button>
      
      {/* Popup με όλα τα likes */}
      {showAll && (
        <div className="absolute bottom-full mb-2 left-0 bg-white  rounded-lg shadow-xl border border-gray-200  p-3 min-w-[200px] z-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800 ">Likes</h4>
            <button
              onClick={() => setShowAll(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {workoutLikes.map(like => (
              <div key={like.id} className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium">
                  {like.userId.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-gray-700 ">
                  {like.userId === user?.uid ? 'Εσύ' : `Χρήστης ${like.userId.slice(0, 6)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
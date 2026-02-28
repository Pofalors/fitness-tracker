import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { useTranslation } from '../../store/languageStore';
import toast from 'react-hot-toast';

interface SuggestedUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  workoutCount?: number;
}

export const SuggestedUsers = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { following, followUser } = useSocialStore();
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    if (!user) return;
    
    try {
      const followingIds = following.map(f => f.userId);
      followingIds.push(user.uid);
      
      const usersQuery = query(
        collection(db, 'users'),
        limit(10)
      );
      
      const usersSnap = await getDocs(usersQuery);
      const allUsers = usersSnap.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as SuggestedUser[];
      
      const filtered = allUsers
        .filter(u => !followingIds.includes(u.uid))
        .slice(0, 5);
      
      setSuggestions(filtered);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <p className="text-center text-gray-500 dark:text-gray-400">Loading suggestions...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white  rounded-xl p-4">
        <p className="text-center text-gray-500 dark:text-gray-400">{t('noSuggestions')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white  rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800  mb-4">
        🔍 {t('suggestedForYou')}
      </h3>
      
      <div className="space-y-3">
        {suggestions.map(suggested => (
          <div key={suggested.uid} className="flex items-center justify-between p-3 bg-gray-50  rounded-lg">
            <div 
              onClick={() => navigate(`/profile/${suggested.uid}`)}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
                {suggested.photoURL ? (
                  <img src={suggested.photoURL} alt={suggested.displayName} className="w-full h-full object-cover" />
                ) : (
                  suggested.displayName?.slice(0, 2).toUpperCase() || '??'
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800 ">{suggested.displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{suggested.email}</p>
              </div>
            </div>
            
            <button
              onClick={async () => {
                await followUser(suggested.uid);
                setSuggestions(prev => prev.filter(s => s.uid !== suggested.uid));
                toast.success(t('followed'));
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              {t('follow')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
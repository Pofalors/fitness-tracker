import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { useTranslation } from '../../store/languageStore';
import toast from 'react-hot-toast';

interface UserSearchResult {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export const UserSearch = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { followUser, following } = useSocialStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '>=', searchTerm),
        where('email', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );
      
      const nameQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );
      
      const [emailSnap, nameSnap] = await Promise.all([
        getDocs(emailQuery),
        getDocs(nameQuery)
      ]);
      
      const usersMap = new Map();
      
      emailSnap.docs.forEach(doc => {
        if (doc.id !== user?.uid) {
          usersMap.set(doc.id, { uid: doc.id, ...doc.data() });
        }
      });
      
      nameSnap.docs.forEach(doc => {
        if (doc.id !== user?.uid && !usersMap.has(doc.id)) {
          usersMap.set(doc.id, { uid: doc.id, ...doc.data() });
        }
      });
      
      setResults(Array.from(usersMap.values()) as UserSearchResult[]);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error(t('searchError'));
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = (userId: string) => {
    return following.some(f => f.userId === userId);
  };

  return (
    <div className="card p-6">
      <h3 className="section-title !mb-4">🔍 {t('findFriends')}</h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
          placeholder={t('searchPlaceholder')}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          onClick={searchUsers}
          disabled={loading}
          className="btn-primary !px-6 !py-3"
        >
          {loading ? '...' : t('search')}
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {results.map(user => (
            <div key={user.uid} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div 
                onClick={() => navigate(`/profile/${user.uid}`)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    user.displayName?.slice(0, 2).toUpperCase() || '??'
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{user.displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  if (isFollowing(user.uid)) {
                    await useSocialStore.getState().unfollowUser(user.uid);
                  } else {
                    await followUser(user.uid);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all touch-feedback ${
                  isFollowing(user.uid)
                    ? 'btn-secondary !px-3 !py-1'
                    : 'btn-primary !px-3 !py-1'
                }`}
              >
                {isFollowing(user.uid) ? t('unfollow') : t('follow')}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {results.length === 0 && searchTerm && !loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          {t('noUsersFound')}
        </p>
      )}
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../store/languageStore';

interface FollowListProps {
  type: 'followers' | 'following';
  userId: string;
  onClose: () => void;
}

export const FollowList: React.FC<FollowListProps> = ({ type, userId, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { followers, following } = useSocialStore();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [type]);

  const loadUsers = async () => {
    const list = type === 'followers' ? followers : following;
    const userIds = list
      .filter(item => type === 'followers' ? item.userId === userId : item.followerId === userId)
      .map(item => type === 'followers' ? item.followerId : item.userId);
    
    const userPromises = userIds.map(async (uid) => {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return { uid, ...userDoc.data() };
    });
    
    const usersData = await Promise.all(userPromises);
    setUsers(usersData);
    setLoading(false);
  };

  const isFollowing = (targetUserId: string) => {
    return following.some(f => f.userId === targetUserId);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white  rounded-xl p-6">
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200  flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 ">
            {type === 'followers' ? t('followers') : t('following')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              {type === 'followers' ? t('noFollowers') : t('noFollowing')}
            </p>
          ) : (
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.uid} className="flex items-center justify-between">
                  <div 
                    onClick={() => {
                      navigate(`/profile/${user.uid}`);
                      onClose();
                    }}
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
                      <p className="font-medium text-gray-800 ">{user.displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  
                  {currentUser?.uid !== user.uid && (
                    <button
                      onClick={async () => {
                        if (isFollowing(user.uid)) {
                          await useSocialStore.getState().unfollowUser(user.uid);
                          await loadUsers(); // Refresh
                        } else {
                          await useSocialStore.getState().followUser(user.uid);
                          await loadUsers();
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        isFollowing(user.uid)
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isFollowing(user.uid) ? t('unfollow') : t('follow')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
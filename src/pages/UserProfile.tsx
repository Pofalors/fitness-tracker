import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useTranslation } from '../store/languageStore';
import toast from 'react-hot-toast';

export const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { followUser, unfollowUser, following } = useSocialStore();
  const { workouts } = useWorkoutStore();
  const { t } = useTranslation();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userWorkouts, setUserWorkouts] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        
        // Φόρτωσε τα workouts του χρήστη
        const userWorkouts = workouts.filter(w => w.userId === userId);
        setUserWorkouts(userWorkouts);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = () => {
    return following.some(f => f.userId === userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💪</div>
          <div className="text-gray-600">{t('loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← {t('back')}
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {userData?.displayName || t('profile')}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white  rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl overflow-hidden">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt={userData.displayName} className="w-full h-full object-cover" />
              ) : (
                userData?.displayName?.slice(0, 2).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 ">
                {userData?.displayName}
              </h2>
              <p className="text-gray-600 ">{userData?.email}</p>
              {userData?.bio && (
                <p className="text-sm text-gray-600  mt-2">{userData.bio}</p>
              )}
            </div>
            
            {currentUser?.uid !== userId && (
              <button
                onClick={() => {
                  if (isFollowing()) {
                    unfollowUser(userId!);
                  } else {
                    followUser(userId!);
                  }
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing()
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing() ? t('unfollow') : t('follow')}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white  rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 ">
              {userWorkouts.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalWorkouts')}</p>
          </div>
          <div className="bg-white  rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 ">
              {Math.floor(userWorkouts.reduce((acc, w) => acc + w.duration, 0) / 60)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalMinutes')}</p>
          </div>
          <div className="bg-white  rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-800 ">
              {userWorkouts.reduce((acc, w) => acc + (w.distance || 0), 0).toFixed(1)} km
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalDistance')}</p>
          </div>
        </div>

        {/* Recent Workouts */}
        <h3 className="text-lg font-semibold text-gray-800  mb-4">
          {t('recentActivity')}
        </h3>
        <div className="space-y-3">
          {userWorkouts.slice(0, 5).map(workout => (
            <div key={workout.id} className="bg-white  rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {workout.type === 'running' && '🏃'}
                    {workout.type === 'gym' && '💪'}
                    {workout.type === 'yoga' && '🧘'}
                    {workout.type === 'walking' && '🚶'}
                    {workout.type === 'other' && '📝'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 ">
                      {workout.type === 'running' && t('running')}
                      {workout.type === 'gym' && t('gym')}
                      {workout.type === 'yoga' && t('yoga')}
                      {workout.type === 'walking' && t('walking')}
                      {workout.type === 'other' && t('other')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(workout.date.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800 ">
                  {Math.floor(workout.duration / 60)} {t('minutes')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
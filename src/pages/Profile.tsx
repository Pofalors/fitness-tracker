import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import { trackAchievement } from '../services/analytics';
import { ThemeToggle } from '../components/settings/ThemeToggle';
import { LanguageToggle } from '../components/settings/LanguageToggle';
import { useTranslation } from '../store/languageStore';
import { useSocialStore } from '../store/socialStore';
import { auth } from '../config/firebase';
import { useCallback } from 'react';

interface UserGoals {
  weeklyWorkouts: number;
  weeklyMinutes: number;
  targetWeight?: number;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { workouts } = useWorkoutStore();
  const { t } = useTranslation();
  const { followers, following, fetchSocialData } = useSocialStore();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [tempBio, setTempBio] = useState('');
  
  const [goals, setGoals] = useState<UserGoals>({
    weeklyWorkouts: 3,
    weeklyMinutes: 150,
    targetWeight: undefined
  });
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Υπολογισμός στατιστικών για streaks
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    loadUserGoals();
    calculateStreak();
    calculateBadges();
    loadUserProfile();
  }, [workouts]);

  useEffect(() => {
    if (user && streak > 0) {
      const saveStreak = async () => {
        await setDoc(doc(db, 'users', user.uid), {
          streak: streak,
          lastStreakUpdate: new Date()
        }, { merge: true });
      };
      saveStreak();
    }
  }, [streak, user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.bio) {
          setBio(userData.bio);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveBio = async () => {
    if (!user) return;
    
    try {
      // Χρησιμοποίησε το db από το config, όχι νέα αναφορά
      await setDoc(doc(db, 'users', user.uid), {
        bio: tempBio,
        updatedAt: new Date()
      }, { merge: true });
      
      setBio(tempBio);
      setIsEditingBio(false);
      toast.success(t('bioUpdated'));
    } catch (error) {
      console.error('Error saving bio:', error);
      toast.error(t('saveError'));
    }
  };

  const loadUserGoals = async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.goals) {
          setGoals(userData.goals);
        }
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        goals: goals,
        updatedAt: new Date()
      }, { merge: true });
      
      toast.success('Οι στόχοι αποθηκεύτηκαν!');
      setEditing(false);
    } catch (error) {
      toast.error('Σφάλμα κατά την αποθήκευση');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = () => {
    if (workouts.length === 0) {
      setStreak(0);
      return;
    }

    // Απλός υπολογισμός streak (θα το κάνουμε πιο σύνθετο μετά)
    const today = new Date();
    const lastWorkout = new Date(workouts[0].date);
    const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const calculateBadges = () => {
    const oldBadgesCount = badges.length;
    const newBadges: string[] = [];
    
    // Badge για πρώτη προπόνηση
    if (workouts.length >= 1) newBadges.push('Πρωτάρης 🎯');
    
    // Badge για 5 προπονήσεις
    if (workouts.length >= 5) newBadges.push('Αθλητής 💪');
    
    // Badge για 10 προπονήσεις
    if (workouts.length >= 10) newBadges.push('Πρωταθλητής 🏆');
    
    // Badge για τρέξιμο
    const hasRunning = workouts.some(w => w.type === 'running');
    if (hasRunning) newBadges.push('Δρομέας 🏃');
    
    // Badge για γιόγκα
    const hasYoga = workouts.some(w => w.type === 'yoga');
    if (hasYoga) newBadges.push('Γιόγκι 🧘');
    
    if (newBadges.length > oldBadgesCount) {
      const newBadge = newBadges.find(badge => !badges.includes(badge));
      if (newBadge) {
        trackAchievement(newBadge);
      }
    }
    setBadges(newBadges);
  };

  // Υπολογισμός προόδου για την εβδομάδα
  const getWeekWorkouts = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return workouts.filter(w => new Date(w.date) >= weekAgo).length;
  };

  const getWeekMinutes = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo);
    return Math.floor(weekWorkouts.reduce((acc, w) => acc + w.duration, 0) / 60);
  };

  const weekWorkouts = getWeekWorkouts();
  const weekMinutes = getWeekMinutes();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← {t('back')}
            </button>
            <h1 className="text-xl font-bold text-gray-800">{t('myProfile')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white  rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=3b82f6&color=fff&size=128`}
                alt={user?.displayName || ''} 
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 ">{user?.displayName}</h2>
              <p className="text-gray-600 ">{user?.email}</p>
              
              {/* Bio Section */}
              <div className="mt-3">
                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      placeholder={t('bioPlaceholder')}
                      className="w-full p-2 border border-gray-300  rounded-lg bg-white  text-gray-800  text-sm"
                      rows={3}
                      maxLength={200}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveBio}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                      >
                        ✓ {t('save')}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingBio(false);
                          setTempBio(bio);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                      >
                        ✗ {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="text-gray-600  text-sm flex-1">
                      {bio || t('noBio')}
                    </p>
                    <button
                      onClick={() => {
                        setIsEditingBio(true);
                        setTempBio(bio);
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="bg-white  rounded-xl shadow-sm p-4 mb-6">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 ">{followers.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('followers')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 ">{following.length}</p>
              <p className="text-sm text-gray-500 ">{t('following')}</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 mb-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{workouts.length}</p>
              <p className="text-sm opacity-90">{t('totalWorkouts')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-sm opacity-90">{t('streak')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{badges.length}</p>
              <p className="text-sm opacity-90">{t('badges')}</p>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('weeklyGoals')}</h3>
            <button
              onClick={() => setEditing(!editing)}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              {editing ? t('cancel') : t('edit')}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t('workoutsPerWeek')}
                </label>
                <input
                  type="number"
                  value={goals.weeklyWorkouts}
                  onChange={(e) => setGoals({...goals, weeklyWorkouts: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="1"
                  max="7"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t('minutesPerWeek')}
                </label>
                <input
                  type="number"
                  value={goals.weeklyMinutes}
                  onChange={(e) => setGoals({...goals, weeklyMinutes: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="30"
                  step="10"
                />
              </div>

              <button
                onClick={saveGoals}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading ? 'Αποθήκευση...' : 'Αποθήκευση Στόχων'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{t('workoutsPerWeek')}</span>
                  <span className="font-medium">{weekWorkouts} / {goals.weeklyWorkouts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((weekWorkouts / goals.weeklyWorkouts) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{t('minutesPerWeek')}</span>
                  <span className="font-medium">{weekMinutes} / {goals.weeklyMinutes}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((weekMinutes / goals.weeklyMinutes) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">🏆 {t('badges')}</h3>
          
          {badges.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              {t('badgesMessage')}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg text-center">
                  <span className="text-2xl mb-1 block">
                    {badge.split(' ')[1]}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="mt-6 bg-white  rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800  mb-4">
            ⚙️ {t('settings')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 ">{t('theme')}</span>
              <ThemeToggle />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-800 ">{t('language')}</span>
              <LanguageToggle />
            </div>
            
            <div className="pt-4 border-t border-gray-200 ">
              <button
                onClick={() => {
                  if (window.confirm(t('confirmLogout'))) {
                    useAuthStore.getState().logout();
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
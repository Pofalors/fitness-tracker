import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useChallengeStore } from '../store/challengeStore';
import { useSocialStore } from '../store/socialStore';
import { useTranslation } from '../store/languageStore';
import { useTheme } from '../store/themeStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { workouts, fetchUserWorkouts } = useWorkoutStore();
  const { challenges, fetchChallenges } = useChallengeStore();
  const { followers, following, fetchSocialData } = useSocialStore();
  const { t, language } = useTranslation();
  const { theme, applyTheme } = useTheme();
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    fetchUserWorkouts();
    if (user) {
      fetchChallenges();
      fetchSocialData(user.uid);
      loadUserGoal();
      loadFriendsActivity();
    }
    applyTheme();
  }, [user, theme]);

  const loadUserGoal = async () => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().goals) {
      setWeeklyGoal(docSnap.data().goals.weeklyWorkouts || 5);
    }
  };

  const loadFriendsActivity = async () => {
    if (!user || following.length === 0) return;
    
    const friendsActivity = await Promise.all(
      following.map(async (follow) => {
        const userDoc = await getDoc(doc(db, 'users', follow.userId));
        const userData = userDoc.data();
        return {
          userId: follow.userId,
          name: userData?.displayName || 'Φίλος',
          photoURL: userData?.photoURL,
          lastWorkout: workouts.find(w => w.userId === follow.userId) // Απλοποίηση
        };
      })
    );
    setFriends(friendsActivity);
  };

  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    let streak = 1;
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (let i = 0; i < sortedWorkouts.length - 1; i++) {
      const current = new Date(sortedWorkouts[i].date);
      const next = new Date(sortedWorkouts[i + 1].date);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getWeekWorkouts = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workouts.filter(w => new Date(w.date) >= weekAgo).length;
  };

  const getChallengeProgress = (challenge: any) => {
    if (challenge.type === 'yoga_30_days') {
      const daysSinceStart = Math.floor((new Date().getTime() - challenge.startDate.toDate().getTime()) / (1000 * 60 * 60 * 24));
      return Math.min(daysSinceStart, challenge.goal);
    }
    if (challenge.type === 'running_100km') {
      const runningWorkouts = workouts.filter(w => w.type === 'running');
      const totalKm = runningWorkouts.reduce((acc, w) => acc + (w.distance || 0), 0);
      return Math.min(totalKm, challenge.goal);
    }
    return challenge.progress || 0;
  };

  const getRecentAchievements = () => {
    const achievements = [];
    
    if (workouts.length >= 1) {
      achievements.push({
        id: 'first',
        name: t('firstWorkout'),
        icon: '🎯',
        unlocked: true,
        date: workouts[0]?.date
      });
    }
    
    if (workouts.length >= 5) {
      achievements.push({
        id: 'athlete',
        name: t('athlete'),
        icon: '💪',
        unlocked: true,
        date: workouts[4]?.date
      });
    }
    
    if (workouts.length >= 10) {
      achievements.push({
        id: 'champion',
        name: t('champion'),
        icon: '🏆',
        unlocked: true,
        date: workouts[9]?.date
      });
    }
    
    const hasRunning = workouts.some(w => w.type === 'running');
    if (hasRunning) {
      const runningWorkout = workouts.find(w => w.type === 'running');
      achievements.push({
        id: 'runner',
        name: t('runner'),
        icon: '🏃',
        unlocked: true,
        date: runningWorkout?.date
      });
    }
    
    const hasYoga = workouts.some(w => w.type === 'yoga');
    if (hasYoga) {
      const yogaWorkout = workouts.find(w => w.type === 'yoga');
      achievements.push({
        id: 'yogi',
        name: t('yogi'),
        icon: '🧘',
        unlocked: true,
        date: yogaWorkout?.date
      });
    }

    const validAchievements = achievements
      .filter(a => a.date != null)
      .map(a => {
        const dateValue = a.date as any;
        let dateObj: Date;
        
        if (dateValue?.seconds) {
          dateObj = new Date(dateValue.seconds * 1000);
        } else {  
          dateObj = new Date(dateValue);
        }
        
        return {
          ...a,
          dateObj,
          isValid: !isNaN(dateObj.getTime())
        };
      })
      .filter(a => a.isValid);
    
    return validAchievements
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
      .slice(0, 4);
  };

  const getWorkoutIcon = (type: string) => {
    const icons = {
      running: '🏃',
      gym: '💪',
      yoga: '🧘',
      walking: '🚶',
      other: '📝'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const quotes = [
    {
      text: "The only bad workout is the one that didn't happen.",
      author: "Unknown"
    },
    {
      text: "Your body can stand almost anything. It's your mind that you have to convince.",
      author: "Unknown"
    },
    {
      text: "The hard days are the best because that's when champions are made.",
      author: "Gabby Douglas"
    },
    {
      text: "Success is what comes after you stop making excuses.",
      author: "Luis Guzman"
    },
    {
      text: "The pain you feel today will be the strength you feel tomorrow.",
      author: "Unknown"
    },
    {
      text: "Μην περιμένεις να γίνεις τέλειος, απλά ξεκίνα.",
      author: "Ελληνική παροιμία"
    },
    {
      text: "Η αρχή είναι το ήμισυ του παντός.",
      author: "Αριστοτέλης"
    },
    {
      text: "Νους υγιής εν σώματι υγιεί.",
      author: "Αρχαίο ρητό"
    }
  ];

  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Τυχαίο quote σε κάθε refresh
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏋️</span>
              <h1 className="text-2xl font-bold">Fitness Tracker</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="flex items-center gap-3 bg-white/20 rounded-full pl-2 pr-4 py-1">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:inline">
                      {user.displayName}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {t('logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t('welcome')}, {user?.displayName?.split(' ')[0]}! 👋
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Σημερινές προπονήσεις */}
        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-800 ">
                {workouts.filter(w => {
                  const today = new Date();
                  const workoutDate = new Date(w.date);
                  return workoutDate.toDateString() === today.toDateString();
                }).length}
              </p>
              <p className="text-gray-500">{t('today')}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="h-2 bg-gray-200  rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((workouts.filter(w => {
                const today = new Date();
                const workoutDate = new Date(w.date);
                return workoutDate.toDateString() === today.toDateString();
              }).length / 3) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Streak ημερών */}
        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-800 ">
                {calculateStreak()}
              </p>
              <p className="text-gray-500">{t('streak')}</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < calculateStreak() ? 'bg-orange-400' : 'bg-gray-200 '
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Weekly Goal */}
        <div className="bg-white  rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-800 ">
                {getWeekWorkouts()} / {weeklyGoal}
              </p>
              <p className="text-gray-500 ">{t('weeklyGoal')}</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <div className="h-2 bg-gray-200  rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((getWeekWorkouts() / weeklyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

        {/* Active Challenges */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          🎯 {t('activeChallenges')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {challenges.filter(c => c.status === 'active').map(challenge => {
            const progress = getChallengeProgress(challenge);
            const percent = Math.round((progress / challenge.goal) * 100);
            
            return (
              <div key={challenge.id} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-3xl">{challenge.icon}</span>
                    <h4 className="font-bold mt-2">{challenge.title}</h4>
                    <p className="text-sm opacity-90">{progress}/{challenge.goal} {t('days')}</p>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{percent}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="mt-4 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                >
                  {t('viewProgress')} →
                </button>
              </div>
            );
          })}
          
          {challenges.filter(c => c.status === 'active').length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400 col-span-2">
              <p className="mb-2">✨ {t('noActiveChallenges')}</p>
              <button 
                onClick={() => navigate('/profile')}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                {t('browseChallenges')} →
              </button>
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800  mb-4">
            🏆 {t('recentAchievements')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getRecentAchievements().map(achievement => (
              <div 
                key={achievement.id} 
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl text-center transform hover:scale-105 transition-all duration-300"
              >
                <span className="text-3xl block mb-2">{achievement.icon}</span>
                <span className="text-sm font-medium text-gray-800 ">
                  {achievement.name}
                </span>
                {achievement.dateObj && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.dateObj.toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            
            {/*Achievements placeholder */}
            {getRecentAchievements().length === 0 && (
              <>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl text-center opacity-50">
                  <span className="text-3xl block mb-2">🎯</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('firstWorkout')}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl text-center opacity-50">
                  <span className="text-3xl block mb-2">💪</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    5 {t('workouts')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Friends Activity */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          👥 {t('friendsActivity')}
        </h3>
        <div className="space-y-3 mb-8">
          {friends.length > 0 ? (
            friends.map(friend => (
              <div key={friend.userId} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
                  {friend.photoURL ? (
                    <img src={friend.photoURL} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    friend.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{friend.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {friend.lastWorkout ? 
                      `${t('workedOut')} ${friend.lastWorkout.type}` : 
                      t('noActivity')}
                  </p>
                </div>
                <span className="text-2xl opacity-50">
                  {friend.lastWorkout ? getWorkoutIcon(friend.lastWorkout.type) : '💤'}
                </span>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              <p>{t('noFriends')}</p>
              <button
                onClick={() => navigate('/search')}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2">
                {t('findFriends')} →
              </button>
            </div>
          )}
        </div>

        {/* Motivation Quote */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
          <p className="text-lg italic">"{quote.text}"</p>
          <p className="text-sm mt-2 opacity-90">- {quote.author}</p>
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                setQuote(quotes[randomIndex]);
              }}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              🔄 {t('newQuote')}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('recentActivity')}</h3>
          
          {workouts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">📝</div>
              <p>{t('noWorkouts')}</p>
              <p className="text-sm mt-2">{t('startFirst')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.slice(0, 3).map((workout) => {
                let dateObj;
                const dateValue = workout.date as any;
                
                if (dateValue?.seconds) {
                  dateObj = new Date(dateValue.seconds * 1000);
                } else {
                  dateObj = new Date(dateValue);
                }
                
                const isValidDate = !isNaN(dateObj.getTime());
                
                const workoutTypeMap: { [key: string]: string } = {
                  running: t('running'),
                  gym: t('gym'),
                  yoga: t('yoga'),
                  walking: t('walking'),
                  other: t('other')
                };
                
                return (
                  <div key={workout.id} className="bg-white rounded-xl shadow-sm p-4">
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
                          <p className="font-medium text-gray-800">
                            {workoutTypeMap[workout.type] || t('other')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isValidDate ? dateObj.toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US') : t('unknownDate')}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {Math.floor(workout.duration / 60)} {t('minutes')}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {workouts.length > 3 && (
                <button
                  onClick={() => navigate('/history')}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  {t('viewAll')} ({workouts.length})
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
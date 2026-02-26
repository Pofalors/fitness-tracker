import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useEffect } from 'react';
import { useTranslation } from '../store/languageStore';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { workouts, fetchUserWorkouts } = useWorkoutStore();
  const { t } = useTranslation();

  useEffect(() => {  // ΠΡΟΣΘΕΣΕ ΑΥΤΟ ΤΟ useEffect
    fetchUserWorkouts();
  }, []); 

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-bg text-white shadow-lg">
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
                    Αποσύνδεση
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-800">0</p>
                <p className="text-gray-500">{t('today')}</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="stat-card transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-800">0</p>
                <p className="text-gray-500">{t('streak')}</p>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < 0 ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          </div>
          
          <div className="stat-card transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-800">0/5</p>
                <p className="text-gray-500">{t('goal')}</p>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('quickActions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/track')}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 transition-colors"
          >
            <div className="text-2xl mb-2">🏃</div>
            <div className="text-sm font-medium">{t('track')}</div>
          </button>
          
          <button
            onClick={() => navigate('/statistics')}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-4 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">{t('statistics')}</div>
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-4 transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium">{t('history')}</div>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-4 transition-colors"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium">{t('profile')}</div>
          </button>
        </div>

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
              {workouts.slice(0, 3).map((workout) => (
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
                          {workout.type === 'running' && 'Τρέξιμο'}
                          {workout.type === 'gym' && 'Γυμναστική'}
                          {workout.type === 'yoga' && 'Γιόγκα'}
                          {workout.type === 'walking' && 'Περπάτημα'}
                          {workout.type === 'other' && 'Προπόνηση'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(workout.date).toLocaleDateString('el-GR')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {Math.floor(workout.duration / 60)} λεπτά
                    </p>
                  </div>
                </div>
              ))}
              
              {workouts.length > 3 && (
                <button
                  onClick={() => navigate('/history')}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Δες όλες ({workouts.length} προπονήσεις)
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
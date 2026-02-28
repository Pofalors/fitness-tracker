import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { WorkoutSkeleton } from '../components/common/LoadingSkeleton';
import { useTranslation } from '../store/languageStore';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { LikesPreview } from '../components/social/LikesPreview';

export const History = () => {
  const navigate = useNavigate();
  const { workouts, fetchUserWorkouts, loading } = useWorkoutStore();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const { t, language } = useTranslation();
  const { likes, comments, likeWorkout, unlikeWorkout, addComment } = useSocialStore();
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const { user } = useAuthStore();

  useEffect(() => {
    fetchUserWorkouts();
    if (user) {
      useSocialStore.getState().fetchSocialData(user.uid);
    }
  }, [user]);

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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}ώ ${minutes}λ` : `${minutes}λ`;
  };

  const formatWorkoutDate = (date: any) => {
    if (!date) return t('unknownDate');
    
    try {
      if (date.seconds) {
        const dateObj = new Date(date.seconds * 1000);
        if (isNaN(dateObj.getTime())) {
          return t('unknownDate');
        }
        const locale = language === 'el' ? el : enUS;
        return format(dateObj, 'EEEE, d MMMM yyyy, HH:mm', { locale });
      }
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return t('unknownDate');
      }
      const locale = language === 'el' ? el : enUS;
      return format(dateObj, 'EEEE, d MMMM yyyy', { locale });
    } catch {
      return t('unknownDate');
    }
  };

  const filteredWorkouts = () => {
    if (filter === 'all') return workouts;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (filter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return workouts.filter(w => {
      const workoutDate = new Date(w.date);
      workoutDate.setHours(0, 0, 0, 0);
      const compareDate = new Date(filterDate);
      compareDate.setHours(0, 0, 0, 0);
      return workoutDate >= compareDate;
    });
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">...</header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <WorkoutSkeleton key={i} />)}
        </div>
      </main>
    </div>
  );
  }

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
            <h1 className="text-xl font-bold text-gray-800">{t('history')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            {[
              { value: 'all', label: t('all') },
              { value: 'week', label: t('week') },
              { value: 'month', label: t('month') }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          {filteredWorkouts().length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg mb-2">{t('noTraining')}</p>
              <p className="text-sm mb-6">{t('startTracking')}</p>
              <button
                onClick={() => navigate('/track')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('newTraining')}
              </button>
            </div>
          ) : (
            filteredWorkouts().map((workout) => (
              <div key={workout.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getWorkoutIcon(workout.type)}</div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {workout.type === 'running' && 'Τρέξιμο'}
                        {workout.type === 'gym' && 'Γυμναστική'}
                        {workout.type === 'yoga' && 'Γιόγκα'}
                        {workout.type === 'walking' && 'Περπάτημα'}
                        {workout.type === 'other' && 'Άλλη προπόνηση'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatWorkoutDate(workout.date)}
                      </p>
                      {workout.notes && (
                        <p className="text-sm text-gray-600 mt-2">{workout.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDuration(workout.duration)}
                    </p>
                    {workout.distance && (
                      <p className="text-sm text-gray-500">{workout.distance} km</p>
                    )}
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                <LikesPreview workoutId={workout.id!} />
                
                <button
                  onClick={async () => {
                    const hasLiked = likes.some(l => l.workoutId === workout.id);
                    if (hasLiked) {
                      unlikeWorkout(workout.id!);
                    } else {
                      likeWorkout(workout.id!);
                    }
                    if (user) {
                      await useSocialStore.getState().fetchSocialData(user.uid);
                    }
                  }}
                  className={`flex items-center gap-1 text-sm ${
                    likes.some(l => l.workoutId === workout.id)
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <span>❤️</span>
                </button>
                  
                  <button
                    onClick={() => setShowComments(workout.id!)}
                    className="flex items-center gap-1 text-sm text-gray-500  hover:text-blue-500"
                  >
                    <span>💬</span>
                    <span>{comments.filter(c => c.workoutId === workout.id).length}</span>
                  </button>
                </div>

                {/* Comments Section*/}
                {showComments === workout.id && (
                  <div className="mt-4 space-y-3">
                    {comments
                      .filter(c => c.workoutId === workout.id)
                      .map(comment => (
                        <div key={comment.id} className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                          <span className="font-medium text-gray-700">
                            {comment.userId === user?.uid ? 'Εσύ:' : `${comment.userId.slice(0, 6)}:`}
                          </span>
                          <span className="text-gray-600">{comment.text}</span>
                        </div>
                      ))}
                    
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newComment[workout.id!] || ''}
                        onChange={(e) => setNewComment({...newComment, [workout.id!]: e.target.value})}
                        placeholder={t('addComment')}
                        className="flex-1 p-2 text-sm border border-gray-300  rounded-lg bg-white  text-gray-800 "
                      />
                      <button
                        onClick={async () => {
                          if (newComment[workout.id!]?.trim()) {
                            addComment(workout.id!, newComment[workout.id!]);
                            setNewComment({...newComment, [workout.id!]: ''});
                            if (user) {
                              await useSocialStore.getState().fetchSocialData(user.uid);
                            }
                          }
                        }}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                      >
                        {t('post')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredWorkouts().length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">{t('summary')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('totalTrainings')}</p>
                <p className="text-2xl font-bold text-gray-800">{filteredWorkouts().length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalTime')}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.floor(filteredWorkouts().reduce((acc, w) => acc + w.duration, 0) / 3600)} {t('hours')}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
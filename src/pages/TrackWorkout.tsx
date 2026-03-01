import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { Stopwatch } from '../components/tracking/Stopwatch';
import type { WorkoutType } from '../types/workout.types';
import toast from 'react-hot-toast';
import { useTranslation } from '../store/languageStore';
import { useTheme } from '../store/themeStore';
import { useEffect } from 'react';

export const TrackWorkout = () => {
  const navigate = useNavigate();
  const { addWorkout, loading } = useWorkoutStore();
  const { t } = useTranslation();
  const { theme, applyTheme } = useTheme();

  useEffect(() => {
    applyTheme();
  }, [theme]);
  
  const [formData, setFormData] = useState({
    type: 'running' as WorkoutType,
    duration: 0,
    distance: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.duration === 0) {
      toast.error(t('errorTraining'));
      return;
    }

    try {
      const workoutData: any = {
        type: formData.type,
        duration: formData.duration,
        notes: formData.notes
      };

      if (formData.distance && formData.distance.trim() !== '') {
        const distanceValue = parseFloat(formData.distance);
        if (!isNaN(distanceValue) && distanceValue > 0) {
          workoutData.distance = distanceValue;
        }
      }

      await addWorkout(workoutData);
      
      toast.success(t('success'));
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('error'));
    }
  };

  const workoutTypes: { value: WorkoutType; label: string; icon: string }[] = [
    { value: 'running', label: t('running'), icon: '🏃' },
    { value: 'gym', label: t('gym'), icon: '💪' },
    { value: 'yoga', label: t('yoga'), icon: '🧘' },
    { value: 'walking', label: t('walking'), icon: '🚶' },
    { value: 'other', label: t('other'), icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600  hover:text-gray-900 "
            >
              ← {t('back')}
            </button>
            <h1 className="text-xl font-bold text-gray-800 ">{t('track')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Stopwatch onTimeUpdate={(seconds) => setFormData({ ...formData, duration: seconds })} />

          {/* Workout Type */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('workoutType')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-4 rounded-xl border-2 transition-all touch-feedback ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className={`text-sm font-medium ${
                    formData.type === type.value
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          {(formData.type === 'running' || formData.type === 'walking') && (
            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('distance')}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('distancePlaceholder')}
              />
            </div>
          )}

          {/* Notes */}
          <div className="card p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={t('notesPlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? t('saving') : t('savedTraining')}
          </button>
        </form>
      </main>
    </div>
  );
};
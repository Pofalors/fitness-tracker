import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { Stopwatch } from '../components/tracking/Stopwatch';
import type { WorkoutType } from '../types/workout.types';
import toast from 'react-hot-toast';
import { useTranslation } from '../store/languageStore';

export const TrackWorkout = () => {
  const navigate = useNavigate();
  const { addWorkout, loading } = useWorkoutStore();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    type: 'running' as WorkoutType,
    date: new Date().toISOString().split('T')[0],
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
      await addWorkout({
        ...formData,
        duration: formData.duration,
        distance: formData.distance ? parseFloat(formData.distance) : undefined
      });
      
      toast.success(t('success'));
      navigate('/');
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← {t('back')}
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('track')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Stopwatch onTimeUpdate={(seconds) => setFormData({ ...formData, duration: seconds })} />

          {/* Workout Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('workoutType')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
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

          {/* Date */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('date')}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Distance */}
          {(formData.type === 'running' || formData.type === 'walking') && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('distance')}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={t('distancePlaceholder')}
              />
            </div>
          )}

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={t('notesPlaceholder')}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 dark:disabled:bg-blue-800"
          >
            {loading ? t('saving') : t('savedTraining')}
          </button>
        </form>
      </main>
    </div>
  );
};
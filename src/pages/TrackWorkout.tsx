import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { Stopwatch } from '../components/tracking/Stopwatch';
import type { WorkoutType } from '../types/workout.types';
import toast from 'react-hot-toast';

export const TrackWorkout = () => {
  const navigate = useNavigate();
  const { addWorkout, loading } = useWorkoutStore();
  
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
      toast.error('Η προπόνηση πρέπει να έχει διάρκεια');
      return;
    }

    try {
      await addWorkout({
        ...formData,
        duration: formData.duration,
        distance: formData.distance ? parseFloat(formData.distance) : undefined
      });
      
      toast.success('Η προπόνηση καταγράφηκε επιτυχώς!');
      navigate('/');
    } catch (error) {
      toast.error('Υπήρξε ένα σφάλμα. Προσπάθησε ξανά.');
    }
  };

  const workoutTypes: { value: WorkoutType; label: string; icon: string }[] = [
    { value: 'running', label: 'Τρέξιμο', icon: '🏃' },
    { value: 'gym', label: 'Γυμναστική', icon: '💪' },
    { value: 'yoga', label: 'Γιόγκα', icon: '🧘' },
    { value: 'walking', label: 'Περπάτημα', icon: '🚶' },
    { value: 'other', label: 'Άλλο', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Πίσω
            </button>
            <h1 className="text-xl font-bold text-gray-800">Καταγραφή Προπόνησης</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stopwatch */}
          <Stopwatch onTimeUpdate={(seconds) => setFormData({ ...formData, duration: seconds })} />

          {/* Workout Type */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Τύπος Προπόνησης
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ημερομηνία
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Distance (optional) */}
          {(formData.type === 'running' || formData.type === 'walking') && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Απόσταση (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="π.χ. 5.2"
              />
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Σημειώσεις (προαιρετικά)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Πώς ήταν η προπόνηση σήμερα;"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Γίνεται αποθήκευση...' : 'Αποθήκευση Προπόνησης'}
          </button>
        </form>
      </main>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { WorkoutSkeleton } from '../components/common/LoadingSkeleton';

export const History = () => {
  const navigate = useNavigate();
  const { workouts, fetchUserWorkouts, loading } = useWorkoutStore();
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchUserWorkouts();
  }, []);

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

  const filteredWorkouts = () => {
    if (filter === 'all') return workouts;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (filter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return workouts.filter(w => new Date(w.date) >= filterDate);
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
              ← Πίσω
            </button>
            <h1 className="text-xl font-bold text-gray-800">Ιστορικό Προπονήσεων</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Όλες' },
              { value: 'week', label: 'Τελευταία εβδομάδα' },
              { value: 'month', label: 'Τελευταίο μήνα' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <p className="text-lg mb-2">Δεν υπάρχουν προπονήσεις</p>
              <p className="text-sm mb-6">Ξεκίνα καταγράφοντας την πρώτη σου προπόνηση!</p>
              <button
                onClick={() => navigate('/track')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                + Νέα Προπόνηση
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
                        {format(new Date(workout.date), 'EEEE, d MMMM yyyy', { locale: el })}
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
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredWorkouts().length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Σύνοψη</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Σύνολο προπονήσεων</p>
                <p className="text-2xl font-bold text-gray-800">{filteredWorkouts().length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Συνολικός χρόνος</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.floor(filteredWorkouts().reduce((acc, w) => acc + w.duration, 0) / 3600)} ώρες
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
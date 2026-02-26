import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutStore } from '../store/workoutStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { useTranslation } from '../store/languageStore';
import { useTheme } from '../store/themeStore';

export const Statistics = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const { workouts, fetchUserWorkouts } = useWorkoutStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    fetchUserWorkouts();
  }, []);

  // Επέλεξε locale based on language
  const locale = language === 'el' ? el : enUS;

  // Χρώματα για τα γραφήματα
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  const gridColor = theme === 'dark' ? '#374151' : '#E5E7EB';
  const textColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const tooltipBg = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  const tooltipText = theme === 'dark' ? '#F3F4F6' : '#1F2937';

  // Υπολογισμός στατιστικών
  const totalWorkouts = workouts.length;
  const totalMinutes = Math.floor(workouts.reduce((acc, w) => acc + w.duration, 0) / 60);
  const totalDistance = workouts.reduce((acc, w) => acc + (w.distance || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.floor(totalMinutes / totalWorkouts) : 0;

  // Προσωπικά records
  const longestWorkout = workouts.reduce((max, w) => Math.max(max, w.duration), 0);
  const longestDistance = workouts.reduce((max, w) => Math.max(max, w.distance || 0), 0);

  // Προπονήσεις ανά τύπο για το pie chart
  const workoutsByType = workouts.reduce((acc: any, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(workoutsByType).map(key => ({
    name: key === 'running' ? t('running') :
          key === 'gym' ? t('gym') :
          key === 'yoga' ? t('yoga') :
          key === 'walking' ? t('walking') : t('other'),
    value: workoutsByType[key]
  }));

  // Προπονήσεις ανά ημέρα για το bar chart
  const getWorkoutsByDay = () => {
    const now = new Date();
    let startDate;
    
    if (timeRange === 'week') startDate = subDays(now, 7);
    else if (timeRange === 'month') startDate = subDays(now, 30);
    else return [];

    const days = eachDayOfInterval({ start: startDate, end: now });
    
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayWorkouts = workouts.filter(w => 
        format(new Date(w.date), 'yyyy-MM-dd') === dayStr
      );
      
      return {
        date: format(day, 'EEE dd', { locale }),
        minutes: Math.floor(dayWorkouts.reduce((acc, w) => acc + w.duration, 0) / 60),
        workouts: dayWorkouts.length
      };
    });
  };

  const barData = getWorkoutsByDay();

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
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('statistics')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Time Range Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors duration-300">
          <div className="flex gap-2">
            {[
              { value: 'week', label: t('week') },
              { value: 'month', label: t('month') },
              { value: 'all', label: t('all') }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('total')}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalWorkouts}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('minutes')}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalMinutes}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">📏</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('kilometers')}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalDistance.toFixed(1)}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="text-3xl mb-2">⏲️</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t('avgDuration')}</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{avgDuration}{t('min')}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('workoutsPerDay')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: tooltipText,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="minutes" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors duration-300">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('workoutTypes')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBg,
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: tooltipText,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Personal Records */}
        {workouts.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-sm p-6 text-white">
            <h3 className="font-bold text-lg mb-4">🏆 {t('personalRecords')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">{t('longestDuration')}</p>
                <p className="text-2xl font-bold">{Math.floor(longestWorkout / 60)} {t('minutes')}</p>
              </div>
              {longestDistance > 0 && (
                <div>
                  <p className="text-sm opacity-90">{t('longestDistance')}</p>
                  <p className="text-2xl font-bold">{longestDistance.toFixed(1)} km</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
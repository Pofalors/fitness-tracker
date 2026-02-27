import React, { useEffect } from 'react';
import { useChallengeStore } from '../../store/challengeStore';
import { useTranslation } from '../../store/languageStore';
import type { ChallengeType } from '../../types/challenge.types';

export const ChallengesList = () => {
  const { t } = useTranslation();
  const { challenges, fetchChallenges, joinChallenge } = useChallengeStore();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const availableChallenges = [
    {
      type: 'yoga_30_days' as ChallengeType,
      title: t('yoga30Days'),
      description: t('yoga30DaysDesc'),
      goal: 30,
      icon: '🧘',
      reward: '🏆 Γιόγκι της χρονιάς',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      type: 'running_100km' as ChallengeType,
      title: t('running100km'),
      description: t('running100kmDesc'),
      goal: 100,
      icon: '🏃',
      reward: '🏃 Μαραθωνοδρόμος',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      type: 'gym_streak' as ChallengeType,
      title: t('gymStreak'),
      description: t('gymStreakDesc'),
      goal: 7,
      icon: '💪',
      reward: '💪 Σιδερένιος',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800  mb-4">
        🎯 {t('challenges')}
      </h3>

      {/* Active Challenges */}
      {challenges.filter(c => c.status === 'active').length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600  mb-3">
            {t('activeChallenges')}
          </h4>
          <div className="space-y-3">
            {challenges.filter(c => c.status === 'active').map(challenge => (
              <div key={challenge.id} className="bg-white  rounded-xl p-4 border border-gray-200 ">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{challenge.icon}</span>
                    <h5 className="font-medium text-gray-800 ">{challenge.title}</h5>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                    {Math.round((challenge.progress / challenge.goal) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200  rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-full h-2 transition-all"
                    style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500  mt-2">
                  {challenge.progress} / {challenge.goal} {t('days')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      {challenges.filter(c => c.status === 'completed').length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600  mb-3">
            {t('completedChallenges')}
          </h4>
          <div className="space-y-2">
            {challenges.filter(c => c.status === 'completed').map(challenge => (
              <div key={challenge.id} className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{challenge.icon}</span>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800 ">{challenge.title}</h5>
                  <p className="text-xs text-gray-500 ">
                    {t('completedOn')} {challenge.completedAt?.toLocaleDateString()}
                  </p>
                </div>
                <span className="text-green-500">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Challenges */}
      <div>
        <h4 className="text-sm font-medium text-gray-600  mb-3">
          {t('availableChallenges')}
        </h4>
        <div className="grid gap-3">
          {availableChallenges.map((challenge) => {
            const alreadyJoined = challenges.some(c => 
              c.type === challenge.type && c.status === 'active'
            );
            
            return (
              <div key={challenge.type} className="bg-white  rounded-xl p-4 border border-gray-200 ">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <span className="text-3xl">{challenge.icon}</span>
                    <div>
                      <h5 className="font-medium text-gray-800 ">{challenge.title}</h5>
                      <p className="text-sm text-gray-600  mt-1">{challenge.description}</p>
                      <p className="text-xs text-gray-500  mt-2">
                        🏆 {challenge.reward}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => joinChallenge(challenge)}
                    disabled={alreadyJoined}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      alreadyJoined
                        ? 'bg-gray-200  text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {alreadyJoined ? t('joined') : t('join')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
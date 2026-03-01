import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSearch } from '../components/social/UserSearch';
import { SuggestedUsers } from '../components/social/SuggestedUsers';
import { useTranslation } from '../store/languageStore';

export const Search = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            <h1 className="text-xl font-bold text-gray-800">🔍 {t('findFriends')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <UserSearch />
        <SuggestedUsers />
      </main>
    </div>
  );
};
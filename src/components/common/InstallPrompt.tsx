import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const now = Date.now();
        if (now - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
          return;
        }
      }
      
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 glass rounded-2xl shadow-2xl p-4 animate-slide-up z-50 border border-white/20 dark:border-gray-700/30">
      <div className="flex items-start gap-3">
        <div className="text-3xl">📱</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Εγκατάσταση App</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Εγκατάστησε το Fitness Tracker στην οθόνη σου για γρήγορη πρόσβαση!
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="btn-primary !px-4 !py-2 text-sm"
            >
              Εγκατάσταση
            </button>
            <button
              onClick={() => {
                setShowPrompt(false);
                localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
              }}
              className="btn-secondary !px-4 !py-2 text-sm"
            >
              Αργότερα
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors touch-feedback"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import PositiveGateway from './components/PositiveGateway';
import Feed from './pages/Feed';

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('mcc_user'));
  const userKey = (key, name = user) => `mcc_${name}_${key}`;
  const [isOnboarded, setIsOnboarded] = useState(() => !!user);
  const [hasUnlockedGateway, setHasUnlockedGateway] = useState(() => !!user);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mcc_user', user);
    } else {
      localStorage.removeItem('mcc_user');
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitePodId = params.get('invitePod');
    if (!invitePodId) return;

    localStorage.setItem('mcc_invite_pod', invitePodId);
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const content = !user ? (
    <Auth
      onLoginSuccess={(name, isNewAccount = true) => {
        localStorage.setItem('mcc_user', name);
        const thisUserKey = (key) => `mcc_${name}_${key}`;
        localStorage.setItem(thisUserKey('onboarded'), 'true');
        localStorage.setItem(thisUserKey('gateway_completed'), 'true');

        setUser(name);
        setIsOnboarded(true);
        setHasUnlockedGateway(true);
      }}
    />
  ) : !isOnboarded ? (
    <Onboarding
      pendingUser={{ firstName: user }}
      onFinish={(onboardingData) => {
        localStorage.setItem(userKey('onboarded'), 'true');
        localStorage.setItem(
          userKey('onboarding'),
          JSON.stringify({
            focus: onboardingData.focus,
            tags: onboardingData.tags,
            completedAt: new Date().toISOString(),
          })
        );
        localStorage.setItem(userKey('gateway_completed'), 'false');
        setIsOnboarded(true);
        setHasUnlockedGateway(false);
      }}
    />
  ) : !hasUnlockedGateway ? (
    <PositiveGateway
      user={user}
      onUnlock={() => {
        localStorage.setItem(userKey('gateway_completed'), 'true');
        setHasUnlockedGateway(true);
      }}
    />
  ) : (
    <Feed
      user={user}
      logOut={() => {
        localStorage.removeItem('mcc_user');
        setUser(null);
        setIsOnboarded(false);
        setHasUnlockedGateway(false);
      }}
    />
  );

  return <BrowserRouter>{content}</BrowserRouter>;
}

import { useState } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const { theme, switchTheme } = useTheme();
  return (
    <>
      <section className="page">
        <h1 className="semantic-heading">Карта привычек</h1>
        <ThemeToggle currentTheme={theme} onThemeToggle={switchTheme} />
        <div className="container">
          <div className="empty-state">
            <button className="empty-state__button">
              <h2 className="empty-state__title">НАЧНЁМ!</h2>
              <span className="empty-state__text">Добавьте свою первую привычку</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;

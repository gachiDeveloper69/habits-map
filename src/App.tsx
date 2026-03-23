import HabitsMap from '@/components/HabitsMap';
import { LanguageProvider } from '@/i18n/LanguageProvider';

function App() {
  return (
    <LanguageProvider>
      <HabitsMap />
    </LanguageProvider>
  );
}

export default App;

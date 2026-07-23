import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OceanWaveCanvas } from './components/interactive/OceanWaveCanvas';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OceanWaveCanvas />
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

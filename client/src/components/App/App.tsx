import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';

import Toolbar from '../Toolbar/Toolbar';
import SettingBar from '../SettingBar/SettingBar';
import Canvas from '../Canvas/Canvas';

const generateUniqueID = () => {
  return Math.random().toString(36).slice(2, 11);
};

const AppContent: React.FC = () => {
  return (
      <>
        <Toolbar />
        <SettingBar />
        <Canvas />
      </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/:id' element={<AppContent />} />
          <Route path="*" element={<Navigate to={`${generateUniqueID()}`} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

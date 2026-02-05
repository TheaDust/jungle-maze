import React from 'react';
import MazeGame from './components/MazeGame';

const App: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <MazeGame />
    </div>
  );
};

export default App;
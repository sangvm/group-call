import React, { useEffect } from 'react';
import './App.css';
import socketIOClient from "socket.io-client"
import { Join } from './components/CreateButton';

const WS = "http://localhost:8080";

function App() {
  useEffect (() => {
    socketIOClient(WS);
  }, []);
  return (
    <div className="App flex items-center justify-center w-screen h-screen">
      <Join />
    </div>
  );
}

export default App;

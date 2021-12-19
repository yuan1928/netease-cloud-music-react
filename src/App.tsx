import React from 'react';
import './App.css';
import MainPage from "./view/components/MainPage/MainPage";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <div className="App">
              <MainPage/>
          </div>
      </BrowserRouter>
  );
}

export default App;

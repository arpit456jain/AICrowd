import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import HomeClone from './components/HomeClone'

const App = () => {
  return <>
  {/* <Home/> */}
   <HomeClone/>
  </>;
};

export default App;

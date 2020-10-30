import React from 'react';
import './App.css';
import Tblist from './components/tab/index'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './pages/home/home'
import Cart from './pages/cart/cart'
import Category from './pages/category/category'
import Mine from './pages/mine/mine'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/home' exact component={Home}/>
          <Route path='/cart' component={Cart}/>
          <Route path='/category' component={Category}/>
          <Route path='/mine' component={Mine}/>
        </Switch>
        <Tblist />
      </BrowserRouter>
    </div>
  );
}

export default App;

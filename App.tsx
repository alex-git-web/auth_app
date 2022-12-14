import React from 'react';
import { Provider } from 'react-redux';
import Navigation from './other/navigation';
import store from './redux/store';

const App: React.FC = () => {
  return ( 
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App

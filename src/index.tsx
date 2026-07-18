import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import store from './redux/store';

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
);

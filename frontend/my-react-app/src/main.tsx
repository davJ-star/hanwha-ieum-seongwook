// 메인 파일 (+Redux Provider 설정)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <div role="application" aria-label="리액트 애플리케이션 루트">
        <App />
      </div>
    </Provider>
  </React.StrictMode>
);

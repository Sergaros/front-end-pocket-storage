import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

axios.defaults.baseURL = 'http://localhost:3001/api';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="1071954604558-mhobma50rt267gphuhm0cmhejn6iug6v.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
);

import { Layout } from 'antd';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';

import AuthProvider from './store/auth-context';
import AppProvider from './store/app-context';
import HeaderSection from './components/header/HeaderSection';
import FooterSection from './components/footer/FooterSection';
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/login/LoginPage';
import ErrorPage from './pages/error/ErrorPage';
import PocketContent from './components/content/pockets/PocketContent';
import ItemContent from './components/content/items/ItemContent';
import UploadContent from './components/upload/UploadContent';
// import LoginInterceptor from './components/login/LoginInterceptor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <PocketContent /> },
      { path: '/pocket/:pocketId', element: <ItemContent /> },
      { path: '/pocket/:pocketId/upload', element: <UploadContent /> },
      { path: '/pocket/:pocketId/:itemId', element: <ItemContent /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  // LoginInterceptor();

  return (
    <AuthProvider>
      <AppProvider>
        <Layout style={{ height: '100vh' }}>
          <HeaderSection />
          <RouterProvider router={router} />
          <FooterSection />
        </Layout>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

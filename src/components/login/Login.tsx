import { useGoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/auth-context';

export default function Login() {
  const { Login } = useContext(AuthContext);
  const navigate = useNavigate();

  const GoogleOnLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);

      const jwtAuth = await axios.post('/auth', {
        ...codeResponse,
      });
      console.log(jwtAuth.data);
      sessionStorage.setItem('user_info', jwtAuth.data);
      axios.defaults.headers.common['authorization'] = jwtAuth.data;
      Login();
      navigate('/');
    },
    onError: (error) => console.log('Login Failed:', error),
  });

  return (
    <div id="isLogin">
      <button onClick={() => GoogleOnLogin()}>Sign in with Google 🚀 </button>
    </div>
  );
}

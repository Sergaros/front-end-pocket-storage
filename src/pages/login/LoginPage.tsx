import { useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';
import { Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';

import Login from '../../components/login/Login';

export default function LoginPage() {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLogin) {
    navigate('/');
  }

  return (
    <Content>
      <Flex style={{ height: '100%' }} justify="center" align="center" vertical>
        <Flex
          justify="flex-end"
          align="center"
          style={{ width: '100%' }}
          vertical
        >
          <h1 className="welcomeMessage vt323-regular">
            Welcome to <span>"Pocket Storage"</span>
          </h1>
          <h3 className="vt323-regular">Please login using your gmail.</h3>
          <Login />
        </Flex>
      </Flex>
    </Content>
  );
}

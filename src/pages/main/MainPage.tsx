import { useContext, useEffect } from 'react';
import { AuthContext } from '../../store/auth-context';
import { Outlet, useNavigate } from 'react-router-dom';
import { Flex } from 'antd';
import { Content } from 'antd/es/layout/layout';

export default function ContentSection() {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  return (
    <Content>
      <Flex
        style={{ height: '100%' }}
        justify="flex-start"
        align="center"
        vertical
      >
        <Flex
          justify="center"
          align="flex-start"
          vertical
          style={{
            width: '50%',
          }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </Content>
  );
}

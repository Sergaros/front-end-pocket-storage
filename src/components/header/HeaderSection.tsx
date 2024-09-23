import { Flex } from 'antd';
import { useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import { Header } from 'antd/es/layout/layout';
import PocketIcon from '/pocket-icon.svg';
import Logout from './logout/Logout';

export default function HeaderSection() {
  const { isLogin } = useContext(AuthContext);

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1677ff',
        minHeight: '5em',
      }}
    >
      <Flex
        style={{ height: '100%', width: '50%' }}
        justify="flex-start"
        align="center"
      >
        <img
          src={PocketIcon}
          alt="Pocket Storage Logo"
          style={{ marginRight: '1em' }}
        />
        <p
          className="vt323-regular"
          style={{
            color: '#f9f9f9',
            fontSize: '3em',
          }}
        >
          Pocket Storage
        </p>
      </Flex>
      <Flex
        style={{ height: '100%', width: '50%' }}
        justify="flex-end"
        align="center"
      >
        {isLogin && <Logout />}
      </Flex>
    </Header>
  );
}

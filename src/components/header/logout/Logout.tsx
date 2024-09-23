import { LogoutOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useContext, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { AuthContext } from '../../../store/auth-context';
import ModalConfirmation from '../../content/common/ModalConfirmation';

export default function Logout() {
  const { Logout } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const LogoutConfirm = () => {
    setIsModalOpen(false);
    Logout();
    googleLogout();
    sessionStorage.clear();
  };

  const LogoutCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ModalConfirmation
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        isOpen={isModalOpen}
        onConfirm={LogoutConfirm}
        onCancel={LogoutCancel}
      />
      <Tooltip title="logout">
        <Button
          type="default"
          shape="circle"
          icon={<LogoutOutlined />}
          onClick={showModal}
          size="large"
        />
      </Tooltip>
    </>
  );
}

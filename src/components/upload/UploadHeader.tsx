import { useContext } from 'react';
import { Button, Flex, Tooltip } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/app-context';

export default function UploadHeader() {
  const { currentPocket } = useContext(AppContext);
  const navigate = useNavigate();

  const backHandler = () => {
    navigate(`/pocket/${currentPocket && currentPocket.id}`);
  };

  return (
    <>
      <Flex
        justify="flex-start"
        align="center"
        style={{ width: '100%', height: '5em', marginBottom: '2em' }}
      >
        <Tooltip title="back to pocket">
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={backHandler}
            size="large"
          />
        </Tooltip>
      </Flex>
    </>
  );
}

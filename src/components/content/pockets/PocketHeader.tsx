import { useContext, useState } from 'react';
import axios from 'axios';
import { Button, Flex, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { AppContext } from '../../../store/app-context';
import ModalName from '../common/ModalName';

export default function PocketHeader() {
  const { addPocket, setPocketFilter, pocketFilter } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = async (name: string) => {
    try {
      const { data } = await axios.post('/pocket', {
        name,
      });

      addPocket(data);
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchHandler = (value: string) => {
    setPocketFilter(value);
  };

  return (
    <>
      <ModalName
        title="Add Pocket"
        inputName="Pocket Name"
        nameValidateUrl="/pocket/check"
        isOpen={isModalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <Flex
        justify="flex-start"
        align="center"
        style={{ width: '100%', height: '5em', marginBottom: '2em' }}
      >
        <Tooltip title="add pocket">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showModal}
            size="large"
          />
        </Tooltip>
        <Flex justify="flex-end" align="center" style={{ width: '100%' }}>
          <Search
            placeholder="search pocket"
            allowClear
            onSearch={onSearchHandler}
            style={{
              width: 200,
            }}
            defaultValue={pocketFilter}
          />
        </Flex>
      </Flex>
    </>
  );
}

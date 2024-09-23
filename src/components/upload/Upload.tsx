import { InboxOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import { useContext, useState } from 'react';
import { AppContext } from '../../store/app-context';
import ModalItemPermissions from '../content/common/ModalItemPermissions';
import { GetParentId } from '../../utils/helper';
import { IPermission } from '../content/items/item.types';

export default function Upload() {
  const { currentPocket, currentItems } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Array<File> | null>(null);
  const pocketId = (currentPocket && currentPocket.id) || '';

  const handleModalOk = async (permissions: IPermission[]) => {
    setIsModalOpen(false);

    if (selectedFile && selectedFile.length) {
      Promise.all(
        selectedFile.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('permissions', JSON.stringify(permissions));

          const parentId = GetParentId(currentItems);
          if (parentId) {
            formData.append('parentId', parentId);
          }

          try {
            const { data } = await axios.post(
              `item/${pocketId}/upload`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );
            console.log('Upload success:', data);
          } catch (err) {
            console.error('Upload failed:', err);
          }
        }),
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const uploadConfig: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: (_file, fileList) => {
      setSelectedFile(fileList);
      setIsModalOpen(true);
      return false;
    },
  };

  return (
    <>
      <Dragger {...uploadConfig}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>

      <ModalItemPermissions
        title="Set File Premissions"
        isOpen={isModalOpen}
        onConfirm={handleModalOk}
        onCancel={handleModalCancel}
      />
    </>
  );
}

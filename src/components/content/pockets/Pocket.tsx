import { useContext, useState } from 'react';
import axios from 'axios';
import {
  EditOutlined,
  FolderOpenOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Avatar, List } from 'antd';
import { IPocket } from '../pockets/Pocket.types';

import PocketAction from './PocketAction';
import { AppContext } from '../../../store/app-context';
import ModalConfirmation from '../common/ModalConfirmation';
import { useNavigate } from 'react-router-dom';
import { AppContextType } from '../../../store/app-context.type';
import ModalName from '../common/ModalName';
import { GetValue, dateToString } from '../../../utils/helper';

export default function Pocket(props: { pocket: IPocket }) {
  const { pocket } = props;
  const { currentPocket, setCurrentPocket, deletePocket, renamePocket } =
    useContext<AppContextType>(AppContext);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isRenameOpen, setRenameOpen] = useState(false);
  const navigate = useNavigate();

  const DeleteHandler = (pocket: IPocket) => {
    setCurrentPocket(pocket);
    setDeleteOpen(true);
  };

  const DeletePocketCancel = () => {
    setCurrentPocket(null);
    setDeleteOpen(false);
  };

  const DeletePocketConfirm = async () => {
    try {
      console.log('delete pocket id - ', currentPocket);
      if (currentPocket && currentPocket.id) {
        await axios.delete(`/pocket/${currentPocket.id}`);
        deletePocket(currentPocket.id);
        setCurrentPocket(null);
      }
    } catch (err) {
      console.error(err);
      setCurrentPocket(null);
    }

    setDeleteOpen(false);
  };

  const RenameHandler = (pocket: IPocket) => {
    setCurrentPocket(pocket);
    setRenameOpen(true);
  };

  const RenamePocketConfirm = async (name: string) => {
    try {
      const id = GetValue(currentPocket, 'id');

      if (id) {
        await axios.patch(`/pocket/${id}`, {
          name,
        });

        renamePocket(id, name);
      } else {
        console.error('Error: pocket cannot be null.');
      }
    } catch (err) {
      console.error(err);
    }

    setCurrentPocket(null);
    setRenameOpen(false);
  };

  const RenamePocketCancel = () => {
    setCurrentPocket(null);
    setRenameOpen(false);
  };

  const OpenHandler = (pocket: IPocket) => {
    setCurrentPocket(pocket);
    navigate(`/pocket/${pocket.id}`);
  };

  return (
    <>
      <ModalConfirmation
        title="Pocket Delete Confirmation"
        message="Are you shure want to delete the pocket?"
        isOpen={isDeleteOpen}
        onConfirm={DeletePocketConfirm}
        onCancel={DeletePocketCancel}
      />
      <ModalName
        title="Rename Pocket"
        inputName="Rename Name"
        nameValidateUrl="/pocket/check"
        isOpen={isRenameOpen}
        onConfirm={RenamePocketConfirm}
        onCancel={RenamePocketCancel}
        name={GetValue(currentPocket, 'name')}
      />
      <List.Item
        actions={[
          <PocketAction
            Icon={FolderOpenOutlined}
            tooltip="open pocket"
            handler={() => OpenHandler(pocket)}
          />,
          <PocketAction
            Icon={EditOutlined}
            tooltip="rename pocket"
            handler={() => RenameHandler(pocket)}
          />,
          <PocketAction
            Icon={DeleteOutlined}
            tooltip="delete pocket"
            handler={() => DeleteHandler(pocket)}
          />,
        ]}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size="large"
              style={{
                backgroundColor: '#0040ff',
              }}
            >
              {pocket.name[0].toUpperCase()}
            </Avatar>
          }
          title={<a onClick={() => OpenHandler(pocket)}>{pocket.name}</a>}
          description={`Created: ${dateToString(
            pocket.createdDate,
          )}\t\tUpdated: ${dateToString(pocket.updatedDate)}`}
        />
      </List.Item>
    </>
  );
}

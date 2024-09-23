import { Button, Flex, Tooltip } from 'antd';
import download from 'downloadjs';
import {
  UploadOutlined,
  ArrowLeftOutlined,
  FolderAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  DownloadOutlined,
  SettingOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../../../store/app-context';
import ModalName from '../common/ModalName';
import axios from 'axios';
import ModalItemPermissions from '../common/ModalItemPermissions';
import { ITEM_ACTION } from '../../../store/app-context.type';
import { ITEM_TYPE, RIGHTS } from '../../../types/common.types';
import ModalConfirmation from '../common/ModalConfirmation';
import ModalCopy from '../common/ModalCopy';
import {
  GetParentId,
  GetUserEmail,
  GetValue,
  buildItemTree,
} from '../../../utils/helper';
import { IItem, IPermission, IUserRole } from './item.types';

export default function ItemHeader() {
  const navigate = useNavigate();
  const {
    currentPocket,
    currentItems,
    items,
    addItem,
    setCurrentItems,
    deleteItem,
    updateItem,
  } = useContext(AppContext);
  const [isDirectoryModalVisible, setIsDirectoryModalVisible] = useState(false);
  const [isDirectoryPermsModalVisible, setIsDirectoryPermsModalVisible] =
    useState(false);
  const [dirName, setDirName] = useState('');
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [isRenameItemOpen, setIsRenameItemOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isEditPermsModalVisible, setIsEditPermsModalVisible] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);

  const pocketId = GetValue(currentPocket, 'id');
  const itemId = GetValue(currentItems && currentItems[0], 'id');

  let checkItemNameUrl = currentPocket ? `/item/${pocketId}/check` : '';
  let itemRenameName = '';
  let itemType = 'Item';

  if (currentPocket && currentItems && currentItems.length) {
    checkItemNameUrl = `/item/${pocketId}/check?${
      currentItems[0].parent ? `parent=${currentItems[0].parent}` : ''
    }`;
    itemRenameName = currentItems[0].name;
    itemType =
      currentItems[0].type === ITEM_TYPE.DIRECTORY ? 'Directory' : 'File';
  }

  const userEmail = GetUserEmail();
  const userPermissions: RIGHTS[] = [];

  if (currentItems) {
    currentItems.forEach((item) => {
      item.permissions.forEach((pr) => {
        if (pr.userEmail === userEmail) {
          userPermissions.push(pr.role);
        }
      });
    });
  }

  const directories: IItem[] = items
    ? items.filter(
        (item) =>
          item.type === ITEM_TYPE.DIRECTORY &&
          item.permissions.find(
            (perm) =>
              perm.userEmail === userEmail &&
              (perm.role === RIGHTS.OWNER || perm.role === RIGHTS.EDITOR),
          ),
      )
    : [];

  const dirTree = buildItemTree(directories, true);

  const availabePermissions = () => {
    const result: IUserRole[] = [];
    const permissions: IPermission[] | null = GetValue(
      currentItems && currentItems[0],
      'permissions',
    );

    if (permissions && permissions.length) {
      result.push(
        ...permissions
          .filter((perm) => perm.userEmail !== userEmail)
          .map((perm: IPermission) => ({
            user: perm.userEmail,
            role: perm.role,
          })),
      );
    }

    return result;
  };

  const isActionEnable = (action: ITEM_ACTION) => {
    switch (action) {
      case ITEM_ACTION.DOWNLOAD:
        return userPermissions.length > 0;
      case ITEM_ACTION.EDIT:
      case ITEM_ACTION.RENAME:
      case ITEM_ACTION.DELETE:
        return (
          !userPermissions.includes(RIGHTS.VIEWER) &&
          (userPermissions.includes(RIGHTS.EDITOR) ||
            userPermissions.includes(RIGHTS.OWNER))
        );
      case ITEM_ACTION.UPLOAD:
        return (
          !userPermissions.includes(RIGHTS.VIEWER) &&
          !userPermissions.includes(RIGHTS.EDITOR) &&
          userPermissions.includes(RIGHTS.OWNER)
        );
      default:
        return false;
    }
  };

  const uploadItemHandler = () => {
    if (!currentPocket) {
      console.error('Pocket is undefined.');
    } else {
      navigate(`/pocket/${currentPocket.id}/upload`);
    }
  };

  const backItemHandler = () => {
    navigate('..');
  };

  const addDirectoryHandler = () => {
    setIsDirectoryModalVisible(true);
  };

  const handleDirectoryConfirm = async (dirName: string) => {
    try {
      setDirName(dirName);
      setIsDirectoryModalVisible(false);
      setIsDirectoryPermsModalVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDirectoryCancel = () => {
    setIsDirectoryModalVisible(false);
  };

  const handlePermissionModal = async (permissions: IPermission[]) => {
    setIsDirectoryPermsModalVisible(false);

    const id = GetValue(currentPocket, 'id');

    if (id) {
      const { data } = await axios.post(`/item/${id}/directory`, {
        dirName,
        permissions,
        parentId: GetParentId(currentItems),
      });

      addItem(data);
    } else {
      console.error('Error: pocket cannot be undefined.');
    }
  };

  const handlePermissionModalCancel = () => {
    setIsDirectoryPermsModalVisible(false);
    setDirName('');
  };

  const DeleteItemsHandler = () => {
    setIsDeleteItemOpen(true);
  };

  const DeleteItemsCancel = () => {
    setIsDeleteItemOpen(false);
  };

  const DeleteItemsConfirm = async () => {
    try {
      if (currentPocket && currentItems.length) {
        await Promise.all(
          currentItems.map(async (item) => {
            await axios.delete(`/item/${currentPocket.id}/${item.id}`);
            deleteItem(item.id);
          }),
        );
      }

      setCurrentItems([]);
    } catch (err) {
      console.error(err);
      setCurrentItems([]);
    }

    setIsDeleteItemOpen(false);
  };

  const RenameItemConfirm = async (name: string) => {
    try {
      if (pocketId && itemId) {
        const { data } = await axios.patch(`/item/${pocketId}/${itemId}`, {
          name,
        });
        updateItem(currentItems[0].id, data[0]);
      } else {
        console.error('Error: pocket or item are undefined.');
      }

      setIsRenameItemOpen(false);
    } catch (err) {
      console.error(err);
      setIsRenameItemOpen(false);
    }
  };

  const RenameItemCancel = () => {
    setIsRenameItemOpen(false);
  };

  const RenameItemHandler = async () => {
    setIsRenameItemOpen(true);
  };

  const handleDownloadFile = async (url: string, fileName: string) => {
    const res = await axios.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        console.log(
          'Download progress: ' +
            Math.round(
              (progressEvent.loaded / (progressEvent.total ?? 1)) * 100,
            ) +
            '%',
        );
      },
    });
    const data = res.data as Blob;
    download(data, fileName);
  };

  const DownloadFileHandler = async () => {
    setIsDownloadOpen(true);
  };

  const DownloadItemsCancel = () => {
    setIsDownloadOpen(false);
  };

  const DownloadItemsConfirm = async () => {
    try {
      if (pocketId && itemId) {
        await handleDownloadFile(
          `/item/${pocketId}/${itemId}/download`,
          currentItems[0].name,
        );
      } else {
        console.log('Error: pocket or item are undefined.');
      }
    } catch (err) {
      console.error(err);
    }

    setIsDownloadOpen(false);
  };

  const EditPermissionsHandler = () => {
    setIsEditPermsModalVisible(true);
  };

  const handleEditPermissionModal = async (permissions: IPermission[]) => {
    setIsEditPermsModalVisible(false);

    if (pocketId && itemId) {
      const { data } = await axios.patch(`/item/${pocketId}/${itemId}`, {
        permissions,
      });

      data.map((item: IItem) => updateItem(item.id, item));
      setCurrentItems(data);
    } else {
      console.log('Error: pocket or item are undefined.');
    }
  };

  const handleEditPermissionModalCancel = () => {
    setIsEditPermsModalVisible(false);
  };

  const CopyItemHandler = () => {
    setIsCopyOpen(true);
  };
  const CopyItemConfirm = async (dirId: string) => {
    setIsCopyOpen(false);

    if (pocketId && itemId) {
      const { data } = await axios.patch(`/item/${pocketId}/${itemId}`, {
        parent: dirId,
      });

      data.map((item: IItem) => updateItem(item.id, item));
      setCurrentItems([]);
    } else {
      console.log('Error: pocket or item are undefined.');
    }
  };
  const CopyItemCancel = () => {
    setIsCopyOpen(false);
  };

  const GetLinkHandler = async () => {
    try {
      if (pocketId && itemId) {
        const currentUrl = `${window.location.origin}/pocket/${pocketId}/${itemId}`;
        await navigator.clipboard.writeText(currentUrl);
      } else {
        console.log('Error: pocket or item are undefined.');
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <>
      <ModalName
        title="Add Directory"
        inputName="Directory Name"
        nameValidateUrl={checkItemNameUrl}
        isOpen={isDirectoryModalVisible}
        onConfirm={handleDirectoryConfirm}
        onCancel={handleDirectoryCancel}
      />
      <ModalName
        title={`Rename ${itemType}`}
        inputName="Name"
        nameValidateUrl={checkItemNameUrl}
        isOpen={isRenameItemOpen}
        onConfirm={RenameItemConfirm}
        onCancel={RenameItemCancel}
        name={GetValue(currentItems && currentItems[0], 'name')}
      />
      <ModalItemPermissions
        title="Set Directory Premissions"
        isOpen={isDirectoryPermsModalVisible}
        onConfirm={handlePermissionModal}
        onCancel={handlePermissionModalCancel}
      />
      <ModalItemPermissions
        title={`Edit Premissions (${itemRenameName})`}
        permissions={availabePermissions()}
        isOpen={isEditPermsModalVisible}
        onConfirm={handleEditPermissionModal}
        onCancel={handleEditPermissionModalCancel}
      />
      <ModalConfirmation
        title="Item Delete Confirmation"
        message="Are you shure want to delete the item?"
        isOpen={isDeleteItemOpen}
        onConfirm={DeleteItemsConfirm}
        onCancel={DeleteItemsCancel}
      />
      <ModalConfirmation
        title="Item Download"
        message={`Are you shure want to download ${
          currentItems && currentItems.length && currentItems[0].name
        }?`}
        isOpen={isDownloadOpen}
        onConfirm={DownloadItemsConfirm}
        onCancel={DownloadItemsCancel}
      />
      <ModalCopy
        title={`Copy (${itemRenameName}) to...`}
        isOpen={isCopyOpen}
        onConfirm={CopyItemConfirm}
        onCancel={CopyItemCancel}
        directories={dirTree}
      />
      <Flex
        justify="flex-start"
        align="center"
        style={{ width: '100%', height: '5em', marginBottom: '2em' }}
      >
        <Tooltip title="back to pockets">
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={backItemHandler}
            size="large"
          />
        </Tooltip>
        <Tooltip title="upload file">
          <Button
            disabled={!(isActionEnable(ITEM_ACTION.UPLOAD) || !!currentPocket)}
            type="default"
            shape="circle"
            icon={<UploadOutlined />}
            onClick={uploadItemHandler}
            style={{ marginLeft: '1em' }}
            size="large"
          />
        </Tooltip>
        <Tooltip title="create directory">
          <Button
            disabled={!(isActionEnable(ITEM_ACTION.UPLOAD) || !!currentPocket)}
            type="default"
            shape="circle"
            icon={<FolderAddOutlined />}
            onClick={addDirectoryHandler}
            style={{ marginLeft: '1em' }}
            size="large"
          />
        </Tooltip>
        <Flex justify="flex-end" align="center" style={{ width: '100%' }}>
          <Tooltip title="make copy">
            <Button
              disabled={
                !(
                  isActionEnable(ITEM_ACTION.EDIT) &&
                  currentItems[0].type === ITEM_TYPE.FILE
                )
              }
              type="default"
              shape="circle"
              icon={<CopyOutlined />}
              onClick={CopyItemHandler}
              style={{ marginLeft: '1em' }}
              size="large"
            />
          </Tooltip>
          <Tooltip title="rename">
            <Button
              disabled={
                !(isActionEnable(ITEM_ACTION.EDIT) && currentItems.length === 1)
              }
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              onClick={RenameItemHandler}
              style={{ marginLeft: '1em' }}
              size="large"
            />
          </Tooltip>
          <Tooltip title="delete">
            <Button
              disabled={!isActionEnable(ITEM_ACTION.DELETE)}
              type="default"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={DeleteItemsHandler}
              style={{ marginLeft: '1em' }}
              size="large"
            />
          </Tooltip>
          <Tooltip title="download">
            <Button
              disabled={
                !(
                  isActionEnable(ITEM_ACTION.DOWNLOAD) &&
                  currentItems.length === 1 &&
                  currentItems[0].type === ITEM_TYPE.FILE
                )
              }
              type="default"
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={DownloadFileHandler}
              style={{ marginLeft: '1em' }}
              size="large"
            />
          </Tooltip>
          <Tooltip title="permissions">
            <Button
              disabled={
                !(
                  isActionEnable(ITEM_ACTION.DOWNLOAD) &&
                  currentItems.length === 1
                )
              }
              type="default"
              shape="circle"
              icon={<SettingOutlined />}
              onClick={EditPermissionsHandler}
              style={{ marginLeft: '1em' }}
              size="large"
            />
          </Tooltip>
          <Tooltip title="copy link">
            <Button
              disabled={
                !(
                  isActionEnable(ITEM_ACTION.DOWNLOAD) &&
                  currentItems.length === 1
                )
              }
              type="default"
              shape="circle"
              icon={<LinkOutlined />}
              onClick={GetLinkHandler}
              style={{ marginLeft: '1em' }}
              size="large"
            />
          </Tooltip>
        </Flex>
      </Flex>
    </>
  );
}

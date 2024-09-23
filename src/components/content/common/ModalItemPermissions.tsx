import { Checkbox, Form, Modal, Radio, Select } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { RIGHTS } from '../../../types/common.types';
import { IPermission, IUserRole } from '../items/item.types';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { IModalItemPermissions } from './common.types';

const createUserItem = (userName: string, userRole: RIGHTS = RIGHTS.VIEWER) => {
  return (
    <Form.Item key={userName} name={userName} label={userName}>
      <Radio.Group
        defaultValue={
          userRole === RIGHTS.VIEWER ? RIGHTS.VIEWER : RIGHTS.EDITOR
        }
        value={userRole === RIGHTS.VIEWER ? RIGHTS.VIEWER : RIGHTS.EDITOR}
      >
        <Radio value={RIGHTS.VIEWER}>Viewer</Radio>
        <Radio value={RIGHTS.EDITOR}>Editor</Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default function ModalItemPermissions(props: IModalItemPermissions) {
  const { title, isOpen, onConfirm, onCancel, permissions } = props;

  const [form] = Form.useForm();
  const [isSubmitEnabled, SetSubmitEnabled] = useState(false);
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(
    !(permissions && permissions.length),
  );
  const [users, setUsers] = useState(
    permissions ? permissions.map((p) => p.user) : [],
  );
  const [userItems, setUserItems] = useState<JSX.Element[]>(
    permissions && permissions.length
      ? permissions.map(({ user, role }) => createUserItem(user, role))
      : [],
  );

  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await axios.get('pocket/users');
      setAllUsers(data);
      // setAllUsers(['user1@gmail.com', 'user2@gmail.com', 'user3@gmail.com']);
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    setIsPrivate(!(permissions && permissions.length));
    setUsers(permissions ? permissions.map((p) => p.user) : []);
    setUserItems(
      permissions && permissions.length
        ? permissions.map(({ user, role }) => createUserItem(user, role))
        : [],
    );
  }, [permissions]);

  const getPrevValue = (fieldValue: string | undefined, fieldName: string) => {
    if (fieldValue === undefined) {
      const prevUserPermission: IUserRole | undefined =
        permissions && permissions.find((p: IUserRole) => p.user === fieldName);
      if (prevUserPermission) {
        return prevUserPermission.role;
      } else {
        return RIGHTS.VIEWER;
      }
    }

    return fieldValue ? RIGHTS.EDITOR : RIGHTS.VIEWER;
  };

  const confirmHandler = async () => {
    try {
      const values = await form.getFieldsValue();
      console.log(values);
      const resPermissions: IPermission[] = [];
      if (values.Users) {
        for (let i = 0; i < values.Users.length; i++) {
          const fieldValue = await form.getFieldValue(values.Users[i]);
          resPermissions.push({
            userEmail: values.Users[i],
            role: getPrevValue(fieldValue, values.Users[i]),
          });
        }
      }
      await onConfirm(resPermissions);
    } catch (err) {
      console.error(err);
    }
    form.resetFields();
    setUserItems([]);
  };

  const cancelHandler = () => {
    onCancel();
    form.resetFields();
    setUserItems([]);
  };

  const onFormChange = async () => {
    try {
      await form.validateFields();
      SetSubmitEnabled(false);
    } catch (err) {
      console.error(err);
      SetSubmitEnabled(true);
    }
  };

  const onPrivateHandler = (e: CheckboxChangeEvent) => {
    setIsPrivate(e.target.checked);
    setUserItems([]);
    form.setFieldsValue({
      Users: [],
    });
  };

  const handleChange = (users: string[]) => {
    const usrItems: JSX.Element[] = [];
    users.forEach((user: string) => {
      usrItems.push(createUserItem(user));
    });

    setUserItems(() => usrItems);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={confirmHandler}
      onCancel={cancelHandler}
      okButtonProps={{ disabled: isSubmitEnabled }}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        onChange={onFormChange}
        initialValues={{
          isPrivate: isPrivate,
          Users: users,
        }}
        preserve={false}
      >
        <Form.Item name="isPrivate" valuePropName="checked">
          <Checkbox onChange={onPrivateHandler}>Is Private</Checkbox>
        </Form.Item>
        <Form.Item name="Users" label="Users">
          <Select
            mode="multiple"
            disabled={isPrivate}
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            onChange={handleChange}
            options={allUsers.map((user) => ({
              label: user,
              value: user,
            }))}
          />
        </Form.Item>
        {userItems}
      </Form>
    </Modal>
  );
}

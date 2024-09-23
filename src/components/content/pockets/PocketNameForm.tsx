import { useState } from 'react';
import axios from 'axios';
import { Form, Input, Modal } from 'antd';
import { IPocketNameForm } from './Pocket.types';

export default function PocketNameForm(props: IPocketNameForm) {
  const { title, isOpen, onConfirm, onCancel, name } = props;
  const [form] = Form.useForm();
  const [isSubmitEnabled, SetSubmitEnabled] = useState(false);

  const confirmHandler = async () => {
    try {
      const values = await form.validateFields();
      const { name } = values;
      await onConfirm(name);
    } catch (err) {
      console.error(err);
    }
    form.resetFields();
  };

  const cancelHandler = () => {
    onCancel();
    form.resetFields();
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

  const validatePocketName = async (_rule: any, value: string) => {
    const { data } = await axios.get('/pocket/check', {
      params: {
        name: value,
      },
    });

    if (data) {
      throw new Error('Name must be unique.');
    }

    return;
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
        preserve={false}
      >
        <Form.Item
          name="name"
          label="Pocket Name"
          rules={[
            { required: true, message: 'Please input pocket name!' },
            { validator: validatePocketName },
          ]}
        >
          <Input placeholder="Enter pocket name" defaultValue={name} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

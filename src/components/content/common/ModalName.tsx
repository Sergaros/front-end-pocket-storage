import axios from 'axios';
import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { IModalName } from './common.types';

export default function ModalName(props: IModalName) {
  const {
    title,
    inputName,
    nameValidateUrl,
    isOpen,
    onConfirm,
    onCancel,
    name,
  } = props;
  const [form] = Form.useForm();
  const [isSubmitEnabled, SetSubmitEnabled] = useState(false);
  const [inputField, setInpuField] = useState<JSX.Element>();

  useEffect(() => {
    setInpuField(
      <Input placeholder="Please enter the name" defaultValue={name} />,
    );
  }, [name]);

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
    const { data } = await axios.get(nameValidateUrl, {
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
          label={inputName}
          rules={[
            { required: true, message: 'Name field is required.' },
            { validator: validatePocketName },
          ]}
        >
          {inputField}
        </Form.Item>
      </Form>
    </Modal>
  );
}

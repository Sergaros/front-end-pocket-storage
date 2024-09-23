import { Form, Modal, TreeSelect } from 'antd';
import { useState } from 'react';

import { IModalCopy } from './common.types';

export default function ModalCopy(props: IModalCopy) {
  const { title, inputName, isOpen, onConfirm, onCancel, directories } = props;
  const [form] = Form.useForm();
  const [isSubmitEnabled, SetSubmitEnabled] = useState(false);

  const confirmHandler = async () => {
    try {
      const values = await form.validateFields();
      const { dir } = values;
      await onConfirm(dir);
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
          name="dir"
          label={inputName}
          rules={[{ required: true, message: 'Directory field is required.' }]}
        >
          <TreeSelect
            showSearch
            style={{
              width: '100%',
            }}
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto',
            }}
            placeholder="Select directory"
            allowClear
            treeDefaultExpandAll
            treeData={directories}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

import { Modal } from 'antd';
import { IModalConfirmation } from './common.types';

export default function ModalConfirmation(props: IModalConfirmation) {
  const { title, message, isOpen, onConfirm, onCancel } = props;

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <p>{message}</p>
    </Modal>
  );
}

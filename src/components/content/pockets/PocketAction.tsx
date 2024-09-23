import { Tooltip } from 'antd';
import { IPocketAction } from './Pocket.types';

export default function PocketAction(props: IPocketAction) {
  const { Icon, tooltip, handler } = props;
  return (
    <Tooltip title={tooltip}>
      <a onClick={handler}>
        <Icon />
      </a>
    </Tooltip>
  );
}

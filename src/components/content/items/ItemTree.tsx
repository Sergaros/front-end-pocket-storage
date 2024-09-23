import { useContext } from 'react';
import { AppContext } from '../../../store/app-context';
import DirectoryTree from 'antd/es/tree/DirectoryTree';
import { buildItemTree } from '../../../utils/helper';
import { TreeData } from './item.types';
import { EventDataNode } from 'antd/es/tree';

export default function ItemTree() {
  const { items, setCurrentItems } = useContext(AppContext);

  const treeData: TreeData[] = items ? buildItemTree(items) : [];

  const onSelect = (
    _keys: React.Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<TreeData>;
      selectedNodes: TreeData[];
      nativeEvent: MouseEvent;
    },
  ) => {
    const { selectedNodes } = info;
    setCurrentItems(selectedNodes.map((node) => node.data));
  };

  return (
    <>
      <DirectoryTree
        multiple
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
        style={{
          backgroundColor: '#f5f5f5',
          fontSize: '1.2em',
        }}
      />
    </>
  );
}

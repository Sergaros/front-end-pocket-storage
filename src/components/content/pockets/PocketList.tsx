import { List } from 'antd';
import Pocket from './Pocket';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../store/app-context';

export default function PocketList() {
  const { pockets } = useContext(AppContext);
  const [pocketsLength, setPocketsLength] = useState(pockets.length);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (pocketsLength < pockets.length) {
      setPageNumber(1);
    }
    setPocketsLength(pockets.length);
  }, [pockets.length, pocketsLength]);

  return (
    <List
      style={{
        width: '100%',
      }}
      pagination={{
        position: 'bottom',
        align: 'center',
        defaultCurrent: 1,
        current: pageNumber,
        total: pockets.length,
        pageSize: 5,
        onChange: (page) => {
          setPageNumber(page);
        },
      }}
      dataSource={pockets}
      renderItem={(item) => <Pocket pocket={item} />}
    />
  );
}

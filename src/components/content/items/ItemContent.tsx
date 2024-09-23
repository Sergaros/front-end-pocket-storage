import { useCallback, useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ItemHeader from './ItemHeader';
import ItemTree from './ItemTree';
import { AppContext } from '../../../store/app-context';
import LoginInterceptor from '../../login/LoginInterceptor';

export default function ItemContent() {
  const params = useParams();
  const { currentPocket, setCurrentPocket, setItems } = useContext(AppContext);
  LoginInterceptor();

  const getPocket = useCallback( async () => {
    const { data } = await axios.get(`/pocket/${params.pocketId}`);
    setCurrentPocket(data);
  }, [params.pocketId]);

  const getItems = useCallback(async () => {
    const { data } = await axios.get(
      `/item/${params.pocketId}${params.itemId ? `/${params.itemId}` : ''}`,
    );
    setItems(data);
  }, [params]);


  useEffect(() => {
    if (!currentPocket) {
      getPocket();
    }

    getItems();
  }, [ currentPocket, getPocket, getItems]);

  return (
    <>
      <ItemHeader />
      <ItemTree />
    </>
  );
}

import { useCallback, useContext, useEffect } from 'react';
import axios from 'axios';

import { AppContext } from '../../../store/app-context';
import LoginInterceptor from '../../login/LoginInterceptor';

import PocketHeader from './PocketHeader';
import PocketList from './PocketList';

export default function PocketContent() {
  const { setPockets, pocketFilter } = useContext(AppContext);
  LoginInterceptor();

  const getPockets = useCallback(async () => {
    try {
      const { data } = await axios.get('/pocket', {
        params: {
          name: pocketFilter,
        },
      });
      setPockets(data);
    } catch (err) {
      console.error(err);
    }
  }, [pocketFilter, setPockets]);

  useEffect(() => {
    getPockets();
  }, [getPockets]);

  return (
    <>
      <PocketHeader />
      <PocketList />
    </>
  );
}

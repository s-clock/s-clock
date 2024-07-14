import React, { useCallback, useState } from 'react';
import Tabs from '@/components/tabs';
import i18next from 'i18next';
import './App.less';
import { Lng } from './enum';

function App() {
  const [lng, setLng] = useState<Lng>(Lng.Zh);

  const changeLng = useCallback((newLng: Lng) => {
    i18next.changeLanguage(newLng).then(() => {
      setLng(newLng);
    });
  }, []);

  return (
    <div className="app">
      <Tabs>
        <Tabs.Panel title={i18next.t('Key_Alarm')}>闹钟内容</Tabs.Panel>
        <Tabs.Panel title="计时">计时内容</Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default <App />;

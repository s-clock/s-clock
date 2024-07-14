import './sw';
import '@/styles/global.less';

import { createRoot } from 'react-dom/client';
import appElem from './App';
import { initI18n } from './i18n';

initI18n().then(() => {
  const root = createRoot(document.querySelector('#app'));
  root.render(appElem);
});

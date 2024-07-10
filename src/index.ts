import './sw';

import { createRoot } from 'react-dom/client';
import appElem from './App';

const root = createRoot(document.querySelector('#app'));
root.render(appElem);

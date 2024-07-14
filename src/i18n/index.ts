import i18next from 'i18next';
import { translation } from './translate';

function getResource(translation) {
  return Object.keys(translation).reduce(
    (acc, key) => {
      const item = translation[key];

      if (item.zh) {
        acc.zh[key] = item.zh;
      }

      if (item.en) {
        acc.en[key] = item.en;
      }

      return acc;
    },
    {
      en: {},
      zh: {},
    },
  );
}

export function initI18n() {
  const _resources = getResource(translation);
  const resources = {
    en: {
      translation: _resources.en,
    },
    zh: {
      translation: _resources.zh,
    },
  };

  return i18next.init({
    lng: 'zh',
    debug: process.env.NODE_ENV === 'development',
    resources,
  });
}

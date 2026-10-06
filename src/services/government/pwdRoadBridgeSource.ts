import { GOVERNMENT_SOURCES } from './governmentSources';

export interface GovernmentSourceDocument {
  sourceId: string;
  title: string;
  url: string;
  publisher: string;
  assetCategory: 'road' | 'bridge';
  dataStatus: 'official-reference';
}

export function getPwdRoadBridgeSource(): GovernmentSourceDocument {
  const source = GOVERNMENT_SOURCES.find(
    (item) => item.id === 'mh-pwd-roads-bridges'
  );

  if (!source) {
    throw new Error('Maharashtra PWD Roads & Bridges source is not registered.');
  }

  return {
    sourceId: source.id,
    title: source.name,
    url: source.url,
    publisher: 'Government of Maharashtra - Public Works Department',
    assetCategory: 'road',
    dataStatus: 'official-reference',
  };
}

import roadStatisticsJson from './2011-12_Transports_Pune/road-statistics.json';

export interface GovernmentRoadStatistic {
  referenceYear: string;
  districtName: string;
  districtCode: number;
  talukaName: string;
  talukaCode: number;
  nationalHighwayKm: number;
  stateHighwayKm: number;
  mainDistrictHighwayKm: number;
  otherDistrictHighwayKm: number;
}

type RawRoadStatistic = {
  REFERENCE_YEAR: string;
  DISTRICT_NAME: string;
  DISTRICT_CODE: string;
  TALUKA_NAME: string;
  TALUKA_CODE: string;
  NATIONAL_HIGHWAY: string;
  STATE_HIGHWAY: string;
  MAIN_DISTRICT_HIGHWAY: string;
  OTHER_DISTRICT_HIGHWAY: string;
};

const rawRecords =
  roadStatisticsJson as unknown as RawRoadStatistic[];

export const PUNE_ROAD_STATISTICS_2011_12: GovernmentRoadStatistic[] =
  rawRecords.map((record) => ({
    referenceYear: record.REFERENCE_YEAR.trim(),
    districtName: record.DISTRICT_NAME.trim(),
    districtCode: Number(record.DISTRICT_CODE),
    talukaName: record.TALUKA_NAME.trim(),
    talukaCode: Number(record.TALUKA_CODE),
    nationalHighwayKm: Number(record.NATIONAL_HIGHWAY),
    stateHighwayKm: Number(record.STATE_HIGHWAY),
    mainDistrictHighwayKm: Number(record.MAIN_DISTRICT_HIGHWAY),
    otherDistrictHighwayKm: Number(record.OTHER_DISTRICT_HIGHWAY),
  }));

export const PUNE_ROAD_STATISTICS_SOURCE = {
  name: 'Maharashtra State Data Bank — Transport Raw Data',
  publisher:
    'Commissionerate of Economics and Statistics, Planning Department, Government of Maharashtra',
  sourceUrl:
    'https://www.mahasdb.maharashtra.gov.in/rawData.do',
  dataYear: '2011-12',
  sourceType: 'official-government' as const,
  status: 'historical-baseline' as const,
};
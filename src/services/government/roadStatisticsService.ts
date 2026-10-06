import {
  PUNE_ROAD_STATISTICS_2011_12,
  PUNE_ROAD_STATISTICS_SOURCE,
} from '../../data/government/mahasdb/governmentRoadStatistics';

export function getGovernmentRoadStatistics() {
  return {
    source: PUNE_ROAD_STATISTICS_SOURCE,
    records: PUNE_ROAD_STATISTICS_2011_12,
    recordCount: PUNE_ROAD_STATISTICS_2011_12.length,
  };
}

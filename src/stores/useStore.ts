// ============================================================
// INFRA-SIGHT — Global State Store (Zustand)
// Multi-asset architecture with evidence-first integrity
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WeatherObservation, FieldInspectionDraft, Asset, AssetComponent,
  DataSource, EngineeringSpec, AssetEvent, Inspection, MaintenanceRecord, Evidence
} from '../types';
import { ASSET_REGISTRY } from '../data/ggbAsset';

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
  55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Rain showers',
  81: 'Moderate showers', 82: 'Violent showers', 95: 'Thunderstorm',
  96: 'Thunderstorm w/ hail', 99: 'Thunderstorm w/ heavy hail',
};

export interface InfraSightStore {
  // Portal / Twin Navigation
  viewMode: 'portal' | 'twin';
  setViewMode: (mode: 'portal' | 'twin') => void;

  // Asset selection
  selectedAssetId: string;
  selectedComponentId: string | null;
  componentFilter: 'all' | 'issues' | 'operational';
  setSelectedAsset: (id: string) => void;
  selectAssetAndEnter: (id: string) => void;
  setSelectedComponent: (id: string | null) => void;
  setComponentFilter: (filter: 'all' | 'issues' | 'operational') => void;

  // Workspace Navigation
  activeTab: string;
  activeRightPanel: string;
  setActiveTab: (tab: string) => void;
  setActiveRightPanel: (panel: string) => void;

  // Weather
  weather: WeatherObservation | null;
  weatherLoading: boolean;
  weatherError: string | null;
  weatherLastFetched: string | null;
  fetchWeather: () => Promise<void>;

  // Field Inspections (offline-first)
  fieldInspections: FieldInspectionDraft[];
  addFieldInspection: (draft: Omit<FieldInspectionDraft, 'id' | 'sync_status' | 'timestamp'>) => void;
  syncInspections: () => void;
  pendingSyncCount: () => number;

  // UI state
  isOffline: boolean;
  setOffline: (v: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // AI Investigator
  aiLoading: boolean;
  aiResult: string | null;
  aiError: string | null;
  runAIInvestigation: (componentId?: string | null) => void;
  clearAI: () => void;

  // Data helpers (dynamically resolve according to selectedAssetId)
  getRegistry: () => typeof ASSET_REGISTRY[0];
  getAsset: () => Asset;
  getComponents: () => AssetComponent[];
  getSources: () => DataSource[];
  getSpecs: () => EngineeringSpec[];
  getEvents: () => AssetEvent[];
  getEvidence: () => Evidence[];
  getInspections: () => Inspection[];
  getMaintenance: () => MaintenanceRecord[];
  getSelectedComponent: () => AssetComponent | null;
  getComponentEvidence: (componentId: string) => Evidence[];
  getComponentInspections: (componentId: string) => Inspection[];
  getComponentMaintenance: (componentId: string) => MaintenanceRecord[];
}

function generateAIInvestigation(componentId: string | null | undefined, weather: WeatherObservation | null, assetId: string): string {
  const registry = ASSET_REGISTRY.find(r => r.asset.id === assetId) || ASSET_REGISTRY[0];
  const asset = registry.asset;
  const components = registry.components;
  const evidence = registry.evidence;
  const inspections = registry.inspections;
  const maintenance = registry.maintenance;
  const focus = componentId ? components.find(c => c.id === componentId) : null;

  const riskCounts = components.reduce<Record<string, number>>((acc, c) => {
    acc[c.risk] = (acc[c.risk] ?? 0) + 1;
    return acc;
  }, {});
  const conditionCounts = components.reduce<Record<string, number>>((acc, c) => {
    acc[c.condition] = (acc[c.condition] ?? 0) + 1;
    return acc;
  }, {});
  const highRisk = components.filter(c => c.risk === 'High' || c.risk === 'Critical');
  const monitored = components.filter(c => c.condition === 'Monitor' || c.risk === 'Medium');
  const avgConfidence = components.length
    ? Math.round((components.reduce((sum, c) => sum + c.confidence, 0) / components.length) * 100)
    : 0;
  const missingComponentData = components.filter(c => /not quantified|unavailable|not established/i.test(`${c.corrosion_status} ${c.condition_description}`)).length;
  const latestInspection = [...inspections].sort((a, b) => b.inspection_date.localeCompare(a.inspection_date))[0];
  const latestMaintenance = [...maintenance].sort((a, b) => b.maintenance_date.localeCompare(a.maintenance_date))[0];

  const riskSummary = Object.entries(riskCounts).map(([risk, count]) => `${count} ${risk}`).join(' · ');
  const conditionSummary = Object.entries(conditionCounts).map(([condition, count]) => `${count} ${condition}`).join(' · ');
  const focusLine = focus
    ? `Selected focus: ${focus.name} (${focus.id}) — ${focus.condition}, ${focus.risk} risk, ${Math.round(focus.confidence * 100)}% confidence.`
    : 'No single component selected — this run evaluates the complete asset prototype.';

  const evidenceLines = [
    `${evidence.length} evidence records connected across the current source registry.`,
    latestInspection ? `Latest connected inspection: ${latestInspection.inspection_date}${latestInspection.notes ? ` — ${latestInspection.notes.slice(0, 130)}` : ''}.` : 'No connected inspection record is available.',
    latestMaintenance ? `Latest connected maintenance: ${latestMaintenance.maintenance_date} — ${latestMaintenance.action.slice(0, 130)}.` : 'No connected maintenance record is available.',
    weather ? `Live environment: ${weather.weather_description}, ${weather.temperature}°C, wind ${weather.wind_speed} km/h, gust ${weather.wind_gust} km/h.` : 'Live environment data is currently unavailable.',
  ];

  const priorityLines = highRisk.length
    ? highRisk.slice(0, 4).map(c => `• ${c.name}: ${c.risk} risk (${c.risk_score}/100) — ${c.condition_description.split('.')[0]}.`)
    : monitored.slice(0, 4).map(c => `• ${c.name}: monitor — ${c.condition_description.split('.')[0]}.`);

  const missingLines = [
    `${missingComponentData} component record(s) contain unquantified or unavailable measurements.`,
    'Current safe structural capacity is not established by this prototype and requires an authorized engineering assessment.',
    'AI output is evidence-grounded decision support; it does not certify safety, approve repairs, or replace physical inspection.',
  ];

  const nextSteps = [
    highRisk.length ? 'Prioritize field verification of the highest-risk components and attach current measurements.' : 'Continue routine inspection and evidence refresh for monitored components.',
    'Resolve the highest-impact missing measurements before using the risk picture for operational decisions.',
    'Re-run the investigation after new verified field evidence is synchronized.',
  ];

  return `PROTOTYPE INTELLIGENCE SUMMARY
${asset.name.toUpperCase()} · ${asset.id}

1. EXECUTIVE READOUT
${asset.status} asset with ${components.length} tracked components. Current risk mix: ${riskSummary}. Condition mix: ${conditionSummary}. Overall component evidence confidence averages ${avgConfidence}%.
${focusLine}

2. WHAT THE PROTOTYPE KNOWS
${evidenceLines.map(line => `• ${line}`).join('\n')}

3. PRIORITY RISK / ATTENTION AREAS
${priorityLines.length ? priorityLines.join('\n') : '• No high/critical component is currently flagged in the connected registry.'}

4. DATA GAPS / LIMITATIONS
${missingLines.map(line => `• ${line}`).join('\n')}

5. RECOMMENDED NEXT ACTIONS
${nextSteps.map((line, i) => `${i + 1}. ${line}`).join('\n')}

SYSTEM BASIS
Evidence-first prototype · ${evidence.length} evidence records · ${inspections.length} inspections · ${maintenance.length} maintenance records · live weather ${weather ? 'connected' : 'unavailable'}.

Decision support only — not a substitute for authorized engineering assessment or physical inspection.`;
}

export const useStore = create<InfraSightStore>()(
  persist(
    (set, get) => ({
      // Portal / Twin Navigation
      viewMode: 'portal',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Asset selection
      selectedAssetId: 'BR-GGB-001',
      selectedComponentId: null,
      componentFilter: 'all',

      setSelectedAsset: (id) => {
        set({ selectedAssetId: id, selectedComponentId: null, weather: null });
        get().fetchWeather();
      },

      selectAssetAndEnter: (id) => {
        set({ selectedAssetId: id, selectedComponentId: null, viewMode: 'twin', weather: null, activeTab: 'brief' });
        get().fetchWeather();
      },

      setSelectedComponent: (id) => set({ selectedComponentId: id }),
      setComponentFilter: (filter) => set({ componentFilter: filter }),

      // Navigation
      activeTab: 'brief',
      activeRightPanel: 'intelligence',
      setActiveTab: (tab) => set({ activeTab: tab }),
      setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),

      // Weather
      weather: null,
      weatherLoading: false,
      weatherError: null,
      weatherLastFetched: null,
      fetchWeather: async () => {
        const asset = get().getAsset();
        set({ weatherLoading: true, weatherError: null });
        const receivedAt = new Date().toISOString();
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${asset.latitude}&longitude=${asset.longitude}&current=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m,weather_code&timezone=auto&wind_speed_unit=kmh`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          const c = json.current;
          const obs: WeatherObservation = {
            temperature: c.temperature_2m,
            wind_speed: c.wind_speed_10m,
            wind_gust: c.wind_gusts_10m,
            precipitation: c.precipitation,
            weather_code: c.weather_code,
            weather_description: WMO_CODES[c.weather_code] ?? 'Unknown',
            observed_at: c.time,
            received_at: receivedAt,
            latitude: asset.latitude,
            longitude: asset.longitude,
            source: 'Open-Meteo',
            confidence: 0.90,
          };
          set({ weather: obs, weatherLoading: false, weatherLastFetched: receivedAt });
        } catch {
          set({
            weatherLoading: false,
            weatherError: 'Live weather unavailable. Value shown as UNAVAILABLE.',
          });
        }
      },

      // Field Inspections
      fieldInspections: [],
      addFieldInspection: (draft) => {
        const newInspection: FieldInspectionDraft = {
          ...draft,
          id: `FIELD-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sync_status: navigator.onLine ? 'synced' : 'pending',
        };
        set(state => ({ fieldInspections: [newInspection, ...state.fieldInspections] }));
      },
      syncInspections: () => {
        set(state => ({
          fieldInspections: state.fieldInspections.map(i =>
            i.sync_status === 'pending' ? { ...i, sync_status: 'synced' as const } : i
          ),
        }));
      },
      pendingSyncCount: () => get().fieldInspections.filter(i => i.sync_status === 'pending').length,

      // UI
      isOffline: !navigator.onLine,
      setOffline: (v) => set({ isOffline: v }),
      sidebarCollapsed: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // AI Investigator
      aiLoading: false,
      aiResult: null,
      aiError: null,
      runAIInvestigation: (componentId) => {
        set({ aiLoading: true, aiResult: null, aiError: null });
        const weather = get().weather;
        const assetId = get().selectedAssetId;
        setTimeout(() => {
          try {
            const result = generateAIInvestigation(componentId, weather, assetId);
            set({ aiLoading: false, aiResult: result });
          } catch {
            set({ aiLoading: false, aiError: 'Investigation failed. Please retry.' });
          }
        }, 800);
      },
      clearAI: () => set({ aiResult: null, aiError: null }),

      // Dynamic data helpers
      getRegistry: () => {
        const id = get().selectedAssetId;
        return ASSET_REGISTRY.find(r => r.asset.id === id) || ASSET_REGISTRY[0];
      },
      getAsset: () => get().getRegistry().asset,
      getComponents: () => get().getRegistry().components,
      getSources: () => get().getRegistry().sources,
      getSpecs: () => get().getRegistry().specs,
      getEvents: () => get().getRegistry().events,
      getEvidence: () => get().getRegistry().evidence,
      getInspections: () => get().getRegistry().inspections,
      getMaintenance: () => get().getRegistry().maintenance,
      getSelectedComponent: () => {
        const id = get().selectedComponentId;
        if (!id) return null;
        return get().getComponents().find(c => c.id === id) ?? null;
      },
      getComponentEvidence: (componentId) =>
        get().getEvidence().filter(e => e.component_id === componentId),
      getComponentInspections: (componentId) =>
        get().getInspections().filter(i => !i.component_id || i.component_id === componentId),
      getComponentMaintenance: (componentId) =>
        get().getMaintenance().filter(m => !m.component_id || m.component_id === componentId),
    }),
    {
      name: 'infrasight-storage',
      version: 2,
      migrate: (persistedState: any) => ({
        ...persistedState,
        viewMode: 'portal',
      }),
      partialize: (state) => ({
        selectedAssetId: state.selectedAssetId,
        fieldInspections: state.fieldInspections,
        weather: state.weather,
        weatherLastFetched: state.weatherLastFetched,
      }),
    }
  )
);

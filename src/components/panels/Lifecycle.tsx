// ============================================================
// INFRA-SIGHT — Lifecycle / Historical Timeline Panel
// ============================================================

import { useState } from 'react';
import { useStore } from '../../stores/useStore';
import type { AssetEvent } from '../../types';

const EVENT_ICONS: Record<string, string> = {
  construction: '🏗',
  opening: '🎉',
  storm: '🌪',
  seismic_event: '⚡',
  maintenance_intervention: '🔧',
  retrofit: '🔩',
  inspection_finding: '🔍',
  major_project: '📐',
  closure: '⛔',
  structural_observation: '📊',
  other: '📋',
};

const EVENT_DOT_CLASS: Record<string, string> = {
  construction: 'tl-construction',
  opening: 'tl-opening',
  storm: 'tl-storm',
  seismic_event: 'tl-seismic',
  maintenance_intervention: 'tl-maintenance',
  retrofit: 'tl-retrofit',
  inspection_finding: 'tl-inspection',
  major_project: 'tl-major_project',
  closure: 'tl-closure',
  other: 'tl-other',
};

function EventDetail({ event }: { event: AssetEvent }) {
  const { getSources } = useStore();
  const sources = getSources();
  const source = sources.find(s => s.id === event.source_id);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1.5px solid var(--blue-100)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
      marginTop: 8,
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue-600)', marginBottom: 6, letterSpacing: 0.5 }}>
        EVENT DETAIL
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>WHAT happened</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{event.description}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>WHEN</div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{event.event_date}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>CONSEQUENCE / IMPACT</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{event.impact}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>ACTION TAKEN</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{event.action}</div>
        </div>
        {event.component_id && (
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>AFFECTED COMPONENT</div>
            <span className="badge badge-bridge">{event.component_id}</span>
          </div>
        )}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>SOURCE</div>
          <div style={{ fontSize: 11, color: 'var(--blue-600)' }}>
            {source ? (
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="link">
                {source.name} ↗
              </a>
            ) : event.source_id}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
            Confidence: {Math.round(event.confidence * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lifecycle() {
  const { getEvents, getSources } = useStore();
  const events = getEvents();
  const sources = getSources();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const sortedEvents = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date));

  return (
    <div>
      <div className="section-heading">
        Lifecycle Timeline
        <span className="section-heading-sub">{events.length} documented events · Click to expand</span>
      </div>

      <div className="notice-card" style={{ marginBottom: 16 }}>
        This lifecycle record uses only source-supported historical information from official authorities. Dates and events without authoritative documentation are not included. Every event answers: WHAT happened, WHEN, WHAT was affected, WHAT was the consequence, WHAT was done, and WHERE the information came from.
      </div>

      <div className="timeline">
        {sortedEvents.map(event => {
          const isSelected = selectedEventId === event.id;
          return (
            <div key={event.id} className="timeline-item">
              <div className={`timeline-dot ${EVENT_DOT_CLASS[event.event_type] ?? 'tl-other'}`} />
              <div
                className="timeline-card"
                onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                style={isSelected ? { borderColor: 'var(--blue-400)', background: 'var(--blue-50)' } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="timeline-card-date">
                    {EVENT_ICONS[event.event_type] ?? '📋'} {event.event_date}
                  </div>
                  <span className="badge" style={{
                    fontSize: 9, background: 'var(--grey-100)', color: 'var(--grey-600)',
                  }}>
                    {event.event_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="timeline-card-title">{event.title}</div>
                <div className="timeline-card-impact">{event.impact}</div>
                <div className="timeline-card-source">
                  📚 {sources.find(s => s.id === event.source_id)?.name ?? event.source_id}
                </div>
                {isSelected && <EventDetail event={event} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

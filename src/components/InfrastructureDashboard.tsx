import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../stores/useStore';
import { ASSET_REGISTRY } from '../data/ggbAsset';
import { getGovernmentRoadStatistics } from '../services/government/roadStatisticsService';

export default function InfrastructureDashboard() {
    const { selectAssetAndEnter } = useStore();
    const governmentRoadData = getGovernmentRoadStatistics();
    const governmentRoadRecordCount = governmentRoadData.recordCount;
    void governmentRoadRecordCount;

    const [search, setSearch] = useState('');
    const [type, setType] = useState('all');

    // Fix global app CSS locking body/root scrolling.
    useEffect(() => {
        const root = document.getElementById('root');

        const oldBodyOverflow = document.body.style.overflow;
        const oldRootOverflow = root?.style.overflow ?? '';
        const oldRootHeight = root?.style.height ?? '';

        document.body.style.overflow = 'auto';

        if (root) {
            root.style.overflow = 'visible';
            root.style.height = 'auto';
        }

        return () => {
            document.body.style.overflow = oldBodyOverflow;

            if (root) {
                root.style.overflow = oldRootOverflow;
                root.style.height = oldRootHeight;
            }
        };
    }, []);

    const assets = useMemo(() => {
        return ASSET_REGISTRY
            .map((entry) => {
                const highestRisk = [...entry.components].sort(
                    (a, b) => b.risk_score - a.risk_score
                )[0];

                return {
                    ...entry,
                    risk: highestRisk?.risk ?? 'Unknown',
                    riskScore: highestRisk?.risk_score ?? 0,
                };
            })
            .filter(({ asset }) => {
                const q = search.toLowerCase().trim();

                const matchesSearch =
                    !q ||
                    asset.name.toLowerCase().includes(q) ||
                    asset.id.toLowerCase().includes(q) ||
                    asset.location.toLowerCase().includes(q) ||
                    asset.asset_type.toLowerCase().includes(q);

                const matchesType =
                    type === 'all' || asset.asset_type === type;

                return matchesSearch && matchesType;
            })
            .sort((a, b) => b.riskScore - a.riskScore);
    }, [search, type]);

    const assetTypes = Array.from(
        new Set(ASSET_REGISTRY.map(({ asset }) => asset.asset_type))
    );

    const openMap = (latitude: number, longitude: number) => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    const openAsset = (assetId: string) => {
        selectAssetAndEnter(assetId);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100%',
                background: '#f7f8fa',
                color: '#0f2240',
                fontFamily: 'inherit',
                overflow: 'visible',
            }}
        >
            {/* HEADER */}
            <header
                style={{
                    minHeight: 72,
                    padding: '0 32px',
                    background: '#fff',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 28,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <div style={{ flexShrink: 0 }}>
                    <strong
                        style={{
                            fontSize: 15,
                            letterSpacing: 1.4,
                        }}
                    >
                        INFRA-SIGHT
                    </strong>

                    <div
                        style={{
                            fontSize: 9,
                            color: '#94a3b8',
                            letterSpacing: 1,
                            marginTop: 3,
                        }}
                    >
                        INFRASTRUCTURE INTELLIGENCE
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        maxWidth: 620,
                    }}
                >
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search assets by name, ID, location or type..."
                        style={{
                            width: '100%',
                            height: 42,
                            boxSizing: 'border-box',
                            border: '1px solid #dbe2ea',
                            borderRadius: 10,
                            padding: '0 15px',
                            outline: 'none',
                            fontSize: 13,
                            background: '#f8fafc',
                        }}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => {
                        const firstAsset = assets[0]?.asset;

                        if (firstAsset) {
                            openMap(firstAsset.latitude, firstAsset.longitude);
                        }
                    }}
                    style={{
                        height: 40,
                        padding: '0 15px',
                        borderRadius: 9,
                        border: '1px solid #dbe2ea',
                        background: '#fff',
                        color: '#2563eb',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    🗺️ Open Map
                </button>

                <span
                    style={{
                        padding: '7px 11px',
                        borderRadius: 999,
                        background: '#ecfdf3',
                        color: '#15803d',
                        fontSize: 10,
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                    }}
                >
                    ● SYSTEM READY
                </span>
            </header>

            {/* CONTENT */}
            <main
                style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '44px 28px 70px',
                    boxSizing: 'border-box',
                }}
            >
                <div style={{ marginBottom: 28 }}>
                    <div
                        style={{
                            color: '#2563eb',
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: 1.5,
                        }}
                    >
                        INFRASTRUCTURE COMMAND CENTER
                    </div>

                    <h1
                        style={{
                            fontSize: 36,
                            margin: '8px 0 6px',
                            letterSpacing: -1,
                        }}
                    >
                        Government Infrastructure Overview
                    </h1>

                    <p
                        style={{
                            color: '#64748b',
                            fontSize: 14,
                        }}
                    >
                        Monitor infrastructure assets, prioritize risk and access
                        detailed asset intelligence.
                    </p>
                </div>

                {/* STATS */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: 14,
                        marginBottom: 28,
                    }}
                >
                    {[
                        ['TOTAL ASSETS', ASSET_REGISTRY.length],

                        [
                            'HIGH / CRITICAL',
                            ASSET_REGISTRY.filter((entry) =>
                                entry.components.some(
                                    (component) =>
                                        component.risk === 'High' ||
                                        component.risk === 'Critical'
                                )
                            ).length,
                        ],

                        [
                            'MONITORING',
                            ASSET_REGISTRY.filter(
                                ({ asset }) => asset.status === 'Monitoring'
                            ).length,
                        ],

                        [
                            'OPERATIONAL',
                            ASSET_REGISTRY.filter(
                                ({ asset }) => asset.status === 'Operational'
                            ).length,
                        ],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            style={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: 14,
                                padding: 20,
                            }}
                        >
                            <div
                                style={{
                                    color: '#64748b',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: 0.8,
                                }}
                            >
                                {label}
                            </div>

                            <strong
                                style={{
                                    display: 'block',
                                    marginTop: 8,
                                    fontSize: 27,
                                }}
                            >
                                {value}
                            </strong>
                        </div>
                    ))}
                </div>

                {/* GOVERNMENT ROAD BASELINE */}
                <section
                    style={{
                        marginBottom: 24,
                        padding: 20,
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 12,
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <div>
                            <strong style={{ fontSize: 15 }}>Government Road Baseline</strong>
                            <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>
                                Official Maharashtra State Data Bank · {governmentRoadData.source.dataYear} · Historical baseline
                            </div>
                        </div>
                        <span style={{ fontSize: 12, color: '#475569' }}>
                            {governmentRoadData.recordCount} official records
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                        {governmentRoadData.records
                            .filter((record) => record.talukaName !== 'Districtlevel_Pune')
                            .slice(0, 4)
                            .map((record) => (
                                <div
                                    key={record.talukaCode}
                                    style={{
                                        padding: 14,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 8,
                                        background: '#f8fafc',
                                    }}
                                >
                                    <strong style={{ fontSize: 13 }}>{record.talukaName}</strong>
                                    <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
                                        NH {record.nationalHighwayKm} km · SH {record.stateHighwayKm} km
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div style={{ marginTop: 12, fontSize: 11, color: '#64748b' }}>
                        Source: {governmentRoadData.source.publisher} · Data year: {governmentRoadData.source.dataYear}
                    </div>
                </section>

                {/* FILTERS */}
                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginBottom: 18,
                    }}
                >
                    <strong
                        style={{
                            fontSize: 10,
                            color: '#64748b',
                            alignSelf: 'center',
                            marginRight: 5,
                        }}
                    >
                        ASSET TYPE
                    </strong>

                    <button
                        type="button"
                        onClick={() => setType('all')}
                        style={{
                            border: '1px solid #bfdbfe',
                            background: type === 'all' ? '#eff6ff' : '#fff',
                            color: '#2563eb',
                            borderRadius: 8,
                            padding: '8px 13px',
                            cursor: 'pointer',
                        }}
                    >
                        All
                    </button>

                    {assetTypes.map((assetType) => (
                        <button
                            type="button"
                            key={assetType}
                            onClick={() => setType(assetType)}
                            style={{
                                border: '1px solid #dbe2ea',
                                background:
                                    type === assetType ? '#eff6ff' : '#fff',
                                color: '#475569',
                                borderRadius: 8,
                                padding: '8px 13px',
                                cursor: 'pointer',
                            }}
                        >
                            {assetType.charAt(0).toUpperCase() +
                                assetType.slice(1)}
                        </button>
                    ))}
                </div>

                {/* ASSET LIST */}
                <section
                    style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 16,
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            padding: '18px 20px',
                            borderBottom: '1px solid #eef2f7',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <strong>Priority Infrastructure Assets</strong>

                        <span
                            style={{
                                color: '#94a3b8',
                                fontSize: 11,
                            }}
                        >
                            {assets.length} assets
                        </span>
                    </div>

                    {assets.length === 0 && (
                        <div
                            style={{
                                padding: 50,
                                textAlign: 'center',
                                color: '#64748b',
                            }}
                        >
                            No infrastructure assets found.
                        </div>
                    )}

                    {assets.map(({ asset, risk }) => (
                        <div
                            key={asset.id}
                            style={{
                                padding: '18px 20px',
                                borderBottom: '1px solid #eef2f7',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                cursor: 'pointer',
                            }}
                            onClick={() => openAsset(asset.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openAsset(asset.id);
                                }
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 11,
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    display: 'grid',
                                    placeItems: 'center',
                                    fontWeight: 900,
                                    fontSize: 11,
                                    flexShrink: 0,
                                }}
                            >
                                {asset.asset_type
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>

                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <strong style={{ fontSize: 14 }}>
                                    {asset.name}
                                </strong>

                                <div
                                    style={{
                                        marginTop: 4,
                                        color: '#64748b',
                                        fontSize: 11,
                                    }}
                                >
                                    {asset.location}
                                </div>

                                <div
                                    style={{
                                        marginTop: 7,
                                        display: 'flex',
                                        gap: 7,
                                        flexWrap: 'wrap',
                                        color: '#64748b',
                                        fontSize: 11,
                                    }}
                                >
                                    <span>{asset.id}</span>
                                    <span>Â·</span>
                                    <span>{asset.asset_type}</span>
                                    <span>Â·</span>
                                    <span>{asset.status}</span>
                                </div>
                            </div>

                            <strong
                                style={{
                                    minWidth: 70,
                                    textAlign: 'center',
                                    padding: '7px 10px',
                                    borderRadius: 999,
                                    background:
                                        risk === 'High' ||
                                            risk === 'Critical'
                                            ? '#fef2f2'
                                            : risk === 'Medium'
                                                ? '#fffbeb'
                                                : '#ecfdf3',
                                    color:
                                        risk === 'High' ||
                                            risk === 'Critical'
                                            ? '#b91c1c'
                                            : risk === 'Medium'
                                                ? '#a16207'
                                                : '#15803d',
                                    fontSize: 10,
                                }}
                            >
                                {risk}
                            </strong>

                            <button
                                type="button"
                                title="Open asset workspace"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openAsset(asset.id);
                                }}
                                style={{
                                    border: 0,
                                    background: 'transparent',
                                    color: '#2563eb',
                                    fontSize: 20,
                                    cursor: 'pointer',
                                    padding: 8,
                                }}
                            >
                                →
                            </button>

                            <button
                                type="button"
                                title="Open in Google Maps"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openMap(
                                        asset.latitude,
                                        asset.longitude
                                    );
                                }}
                                style={{
                                    border: 0,
                                    background: 'transparent',
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    padding: 8,
                                }}
                            >
                                📍
                            </button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

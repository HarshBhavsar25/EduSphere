import { useState } from 'react';
import { Maximize, Minimize, Building2, Info } from 'lucide-react';
import './VirtualCampus.css';

export default function VirtualCampus() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const el = document.getElementById('campus-iframe-wrapper');
        if (!document.fullscreenElement) {
            el?.requestFullscreen().catch(console.error);
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="virtual-campus-page">
            {/* Header */}
            <div className="vc-header">
                <div className="vc-header-left">
                    <div className="vc-icon-badge">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <h2 className="vc-title">Virtual Campus</h2>
                        <p className="vc-subtitle">Interactive 3D College Model — P.E.S. Modern College of Engineering</p>
                    </div>
                </div>
                <div className="vc-header-right">
                    <div className="vc-info-chip">
                        <Info size={13} />
                        <span>Drag to rotate · Scroll to zoom · Click rooms to inspect</span>
                    </div>
                    <button className="vc-fullscreen-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="vc-stats-bar">
                <div className="vc-stat">
                    <span className="vc-stat-value">G+4</span>
                    <span className="vc-stat-label">Floors</span>
                </div>
                <div className="vc-stat-divider" />
                <div className="vc-stat">
                    <span className="vc-stat-value">6</span>
                    <span className="vc-stat-label">Departments</span>
                </div>
                <div className="vc-stat-divider" />
                <div className="vc-stat">
                    <span className="vc-stat-value">100+</span>
                    <span className="vc-stat-label">Rooms</span>
                </div>
                <div className="vc-stat-divider" />
                <div className="vc-stat">
                    <span className="vc-stat-value">5000+</span>
                    <span className="vc-stat-label">Students</span>
                </div>
                <div className="vc-stat-divider" />
                <div className="vc-stat">
                    <span className="vc-stat-value live-pulse">LIVE 3D</span>
                    <span className="vc-stat-label">Rendering</span>
                </div>
            </div>

            {/* 3D Iframe */}
            <div id="campus-iframe-wrapper" className="vc-iframe-wrapper">
                <iframe
                    src="/campus3d.html"
                    title="3D Virtual Campus — P.E.S. Modern College of Engineering"
                    className="vc-iframe"
                    allow="fullscreen"
                    loading="lazy"
                />
            </div>

            {/* Legend */}
            <div className="vc-legend">
                <span className="vc-legend-title">Floor Controls:</span>
                <span className="vc-legend-chip">G — Ground Floor</span>
                <span className="vc-legend-chip">1–4 — Upper Floors</span>
                <span className="vc-legend-chip">ALL — Full View</span>
                <span className="vc-legend-chip">💥 Explode</span>
                <span className="vc-legend-chip">✂️ Cross-Section</span>
                <span className="vc-legend-chip">🌙 Night Mode</span>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
    CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Bar, Line, Scatter } from 'react-chartjs-2';
import api from '../../services/api';

ChartJS.register(ArcElement, BarElement, LineElement, PointElement,
    CategoryScale, LinearScale, Tooltip, Legend, Filler);

const CHART_DEFAULTS = {
    plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } },
    scales: {
        x: { ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
    responsive: true, maintainAspectRatio: false,
};

const PALETTE = ['#6366f1', '#14b8a6', '#8b5cf6', '#f59e0b', '#10b981', '#fb7185', '#60a5fa'];

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getStats(),
            api.getPlacementOverview(),
            api.getSalaryDistribution(),
            api.getBranchStats(),
            api.getTopCompanies(),
            api.getCgpaVsPackage(),
            api.getTopSkills(),
            api.getMonthlyTrends(),
            api.getGenderDistribution(),
        ]).then(([s, overview, salary, branch, companies, cgpa, skills, trends, gender]) => {
            setStats(s);
            setCharts({ overview, salary, branch, companies, cgpa, skills, trends, gender });
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading analytics...</span></div>;

    const STAT_CARDS = [
        { label: 'Total Students', value: (stats?.total_students || 0).toLocaleString(), icon: 'fas fa-users', c1: '#6366f1', c2: '#8b5cf6' },
        { label: 'Placed', value: (stats?.placed_students || 0).toLocaleString(), icon: 'fas fa-briefcase', c1: '#10b981', c2: '#14b8a6' },
        { label: 'Placement Rate', value: (stats?.placement_rate || 0) + '%', icon: 'fas fa-chart-line', c1: '#f59e0b', c2: '#ef4444' },
        { label: 'Avg Package', value: 'Rs. ' + (stats?.avg_package || 0).toFixed(1) + ' LPA', icon: 'fas fa-rupee-sign', c1: '#14b8a6', c2: '#10b981' },
        { label: 'Highest Pkg', value: 'Rs. ' + (stats?.highest_package || 0).toFixed(1) + ' LPA', icon: 'fas fa-trophy', c1: '#f59e0b', c2: '#f97316' },
        { label: 'Companies', value: stats?.total_companies || 0, icon: 'fas fa-building', c1: '#8b5cf6', c2: '#6366f1' },
    ];

    // Chart data builders
    const branchColors = (charts.branch || []).map((_, i) => PALETTE[i % PALETTE.length]);

    // Ensure consistent gender data order: Female, Male, Other
    const genderLabels = ['Female', 'Male', 'Other'];
    const genderRecord = {};
    (charts.gender?.labels || []).forEach((lbl, idx) => {
        genderRecord[lbl] = charts.gender?.values[idx];
    });
    const genderValues = genderLabels.map(lbl => genderRecord[lbl] || 0);

    return (
        <div>
            <div className="section-header">
                <h2 className="section-title"><i className="fas fa-chart-pie" /> Dashboard</h2>
                <p className="section-subtitle">Placement analytics overview</p>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                {STAT_CARDS.map(s => (
                    <div key={s.label} className="stat-card" style={{ '--card-color': s.c1, '--card-color2': s.c2 }}>
                        <div className="stat-icon" style={{ background: `linear-gradient(135deg,${s.c1},${s.c2})` }}>
                            <i className={s.icon} />
                        </div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-title">Placement Overview</div>
                    <div className="chart-canvas-wrap">
                        <Doughnut options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '70%',
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16 } },
                                tooltip: {
                                    callbacks: {
                                        label: (ctx) => {
                                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                                            return ` ${ctx.label}: ${ctx.parsed} students (${pct}%)`;
                                        }
                                    }
                                }
                            }
                        }} data={{
                            labels: ['Placed', 'Not Placed'],
                            datasets: [{
                                data: [
                                    stats?.placed_students ?? 0,
                                    Math.max(0, (stats?.total_students ?? 0) - (stats?.placed_students ?? 0))
                                ],
                                backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(251,113,133,0.6)'],
                                borderColor: ['#10b981', '#fb7185'], borderWidth: 2
                            }]
                        }} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Salary Distribution</div>
                    <div className="chart-canvas-wrap">
                        <Bar options={{ ...CHART_DEFAULTS, plugins: { legend: { display: false } } }} data={{
                            labels: charts.salary?.labels || [],
                            datasets: [{
                                label: 'Students', data: charts.salary?.values || [],
                                backgroundColor: 'rgba(99,102,241,0.7)', borderColor: '#6366f1', borderWidth: 1, borderRadius: 6
                            }]
                        }} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Branch-wise Placements</div>
                    <div className="chart-canvas-wrap">
                        <Bar options={CHART_DEFAULTS} data={{
                            labels: (charts.branch || []).map(b => b.branch),
                            datasets: [
                                { label: 'Placed', data: (charts.branch || []).map(b => b.placed), backgroundColor: 'rgba(45,212,191,0.7)', borderColor: '#2dd4bf', borderRadius: 4 },
                                { label: 'Not Placed', data: (charts.branch || []).map(b => b.not_placed), backgroundColor: 'rgba(251,113,133,0.5)', borderColor: '#fb7185', borderRadius: 4 },
                            ]
                        }} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Top Hiring Companies</div>
                    <div className="chart-canvas-wrap">
                        <Bar options={{ ...CHART_DEFAULTS, indexAxis: 'y', plugins: { legend: { display: false } } }} data={{
                            labels: (charts.companies || []).map(c => c.company),
                            datasets: [{
                                data: (charts.companies || []).map(c => c.hires),
                                backgroundColor: branchColors, borderRadius: 4
                            }]
                        }} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">CGPA vs Package</div>
                    <div className="chart-canvas-wrap">
                        <Scatter options={CHART_DEFAULTS} data={{
                            datasets: (() => {
                                const g = {};
                                (charts.cgpa || []).forEach(p => { if (!g[p.branch]) g[p.branch] = []; g[p.branch].push({ x: p.cgpa, y: p.package }); });
                                return Object.entries(g).map(([label, data], i) => ({
                                    label, data, backgroundColor: PALETTE[i % PALETTE.length] + '99', pointRadius: 4
                                }));
                            })()
                        }} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Top Skills in Demand</div>
                    <div className="chart-canvas-wrap">
                        <Bar options={{ ...CHART_DEFAULTS, plugins: { legend: { display: false } } }} data={{
                            labels: charts.skills?.labels || [],
                            datasets: [{
                                data: charts.skills?.values || [],
                                backgroundColor: 'rgba(139,92,246,0.7)', borderColor: '#8b5cf6', borderRadius: 4
                            }]
                        }} />
                    </div>
                </div>

                <div className="chart-card" style={{ gridColumn: 'span 2' }}>
                    <div className="chart-title">Monthly Placement Trends</div>
                    <div className="chart-canvas-wrap">
                        <Line options={{
                            ...CHART_DEFAULTS, scales: {
                                ...CHART_DEFAULTS.scales,
                                y1: { position: 'right', grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, beginAtZero: true }
                            }
                        }} data={{
                            labels: charts.trends?.labels || [],
                            datasets: [
                                { label: 'Placements', data: charts.trends?.placements || [], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', tension: 0.4, fill: true },
                                { label: 'Avg Package (LPA)', data: charts.trends?.avg_packages || [], borderColor: '#14b8a6', tension: 0.4, yAxisID: 'y1' },
                            ]
                        }} />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-title">Gender Distribution</div>
                    <div className="chart-canvas-wrap">
                        <Doughnut options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '65%',
                            plugins: {
                                legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16 } },
                                tooltip: {
                                    callbacks: {
                                        label: (ctx) => {
                                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                                            return ` ${ctx.label}: ${ctx.parsed} students (${pct}%)`;
                                        }
                                    }
                                }
                            }
                        }} data={{
                            labels: genderLabels,
                            datasets: [{
                                data: genderValues,
                                // Colors match backend's fixed order: Female=pink, Male=indigo, Other=purple
                                backgroundColor: ['rgba(251,113,133,0.8)', 'rgba(99,102,241,0.8)', 'rgba(139,92,246,0.7)'],
                                borderColor: ['#fb7185', '#6366f1', '#8b5cf6'],
                                borderWidth: 2
                            }]
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

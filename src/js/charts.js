/* ═══════════════════════════════════════════
   Chart.js Helpers — Dark Neon Green Theme
   ═══════════════════════════════════════════ */
import {
    Chart,
    LineController,
    BarController,
    LineElement,
    BarElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

Chart.register(
    LineController, BarController, LineElement, BarElement,
    PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend
);

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#505868';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.04)';

const COLORS = {
    accent: '#00E88F',
    accentLight: 'rgba(0, 232, 143, 0.08)',
    success: '#00E88F',
    successLight: 'rgba(0, 232, 143, 0.08)',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.08)',
    warning: '#F5A623',
    warningLight: 'rgba(245, 166, 35, 0.08)',
    info: '#38BDF8',
    infoLight: 'rgba(56, 189, 248, 0.08)',
    purple: '#A78BFA',
    purpleLight: 'rgba(167, 139, 250, 0.08)',
    teal: '#2DD4BF',
    grid: 'rgba(255, 255, 255, 0.04)',
    text: '#505868',
    textDark: '#7A8494',
};

export function createSparkline(canvas, data, color = COLORS.accent) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'transparent');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data,
                borderColor: color,
                borderWidth: 2,
                backgroundColor: gradient,
                fill: true,
                pointRadius: 0,
                tension: 0.4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            animation: { duration: 1000, easing: 'easeOutQuart' },
        },
    });
}

export function createBarChart(canvas, config) {
    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels: config.labels,
            datasets: config.datasets.map((ds) => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: ds.colors || ds.color || COLORS.accent,
                borderRadius: 6,
                borderSkipped: false,
                barThickness: ds.barThickness || 18,
                maxBarThickness: 24,
            })),
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1A2029',
                    titleColor: '#F0F2F5',
                    bodyColor: '#7A8494',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    boxWidth: 8,
                    boxHeight: 8,
                    usePointStyle: true,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, color: COLORS.text, padding: 4 },
                },
                y: {
                    grid: { color: COLORS.grid, drawBorder: false },
                    ticks: { font: { size: 11 }, color: COLORS.text, padding: 8 },
                    beginAtZero: true,
                },
            },
            animation: { duration: 1200, easing: 'easeOutQuart' },
        },
    });
}

export function createHorizontalBarChart(canvas, config) {
    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels: config.labels,
            datasets: [{
                data: config.data,
                backgroundColor: config.colors || [COLORS.accent, COLORS.info, COLORS.purple, COLORS.teal],
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 24,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1A2029',
                    titleColor: '#F0F2F5',
                    bodyColor: '#7A8494',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    callbacks: { label: (ctx) => `${ctx.raw}%` },
                },
            },
            scales: {
                x: {
                    grid: { color: COLORS.grid, drawBorder: false },
                    ticks: { font: { size: 11 }, color: COLORS.text, callback: (v) => `${v}%` },
                    max: 50,
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 13, weight: 500 }, color: '#F0F2F5', padding: 8 },
                },
            },
            animation: { duration: 1200, easing: 'easeOutQuart' },
        },
    });
}

export function createLineChart(canvas, config) {
    const ctx = canvas.getContext('2d');
    const datasets = config.datasets.map((ds) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, (ds.color || COLORS.accent).replace(')', ', 0.12)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');

        return {
            label: ds.label,
            data: ds.data,
            borderColor: ds.color || COLORS.accent,
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: ds.color || COLORS.accent,
            pointHoverBorderColor: '#0B0E11',
            pointHoverBorderWidth: 2,
            tension: 0.4,
        };
    });

    return new Chart(ctx, {
        type: 'line',
        data: { labels: config.labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1A2029',
                    titleColor: '#F0F2F5',
                    bodyColor: '#7A8494',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 10,
                    boxWidth: 8,
                    usePointStyle: true,
                },
            },
            scales: {
                x: {
                    grid: { color: COLORS.grid, drawBorder: false },
                    ticks: { font: { size: 11 }, color: COLORS.text, padding: 4 },
                },
                y: {
                    grid: { color: COLORS.grid, drawBorder: false },
                    ticks: { font: { size: 11 }, color: COLORS.text, padding: 8 },
                },
            },
            animation: { duration: 1200, easing: 'easeOutQuart' },
        },
    });
}

export { COLORS };

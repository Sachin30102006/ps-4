/* ═══════════════════════════════════════════
   Trends Page — Light Theme
   ═══════════════════════════════════════════ */
import { createLineChart, COLORS } from './charts.js';

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const REP_DATA = [62, 65, 68, 71, 74, 72, 76, 78];
const VOL_DATA = [18, 22, 15, 20, 25, 19, 14, 12];

export function renderTrends() {
  return `
    <div class="page-enter">
      <div class="greeting-bar">
        <div class="greeting-text">
          <h1>Trends</h1>
          <p>Historical performance analytics</p>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-5);">
        <div class="card-header">
          <span class="card-title-lg">Monthly Reputation Score</span>
          <span class="badge badge-accent">8 months</span>
        </div>
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: var(--space-4);">
          <div>
            <span style="font-size: 1.75rem; font-weight: 700; color: var(--color-text-primary);">78</span>
            <span style="font-size: 0.75rem; color: var(--color-text-muted); margin-left: 4px;">current</span>
          </div>
          <span class="trend trend-up">▲ 25.8%</span>
        </div>
        <div class="chart-container">
          <canvas id="reputationChart"></canvas>
        </div>
        <div class="chart-legend">
          <span class="chart-legend-item"><span class="chart-legend-dot" style="background:${COLORS.accent}"></span> Reputation Score</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title-lg">Revenue Volatility Index</span>
          <span class="badge badge-success">Declining ▼</span>
        </div>
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: var(--space-4);">
          <div>
            <span style="font-size: 1.75rem; font-weight: 700; color: var(--color-text-primary);">12%</span>
            <span style="font-size: 0.75rem; color: var(--color-text-muted); margin-left: 4px;">current</span>
          </div>
          <span class="trend trend-up">▼ 33.3%</span>
        </div>
        <div class="chart-container">
          <canvas id="volatilityChart"></canvas>
        </div>
        <div class="chart-legend">
          <span class="chart-legend-item"><span class="chart-legend-dot" style="background:${COLORS.warning}"></span> Revenue Volatility</span>
        </div>
      </div>
    </div>
  `;
}

export function initTrends() {
  const r = document.getElementById('reputationChart');
  if (r) createLineChart(r, { labels: MONTHS, datasets: [{ label: 'Reputation Score', data: REP_DATA, color: COLORS.accent }] });

  const v = document.getElementById('volatilityChart');
  if (v) createLineChart(v, { labels: MONTHS, datasets: [{ label: 'Revenue Volatility', data: VOL_DATA, color: COLORS.warning }] });
}

/* ═══════════════════════════════════════════
   Risk Breakdown Page — Light Theme
   ═══════════════════════════════════════════ */
import { createHorizontalBarChart, COLORS } from './charts.js';

const RISK_FACTORS = [
  { name: 'Financial Stability', weight: 40, score: 82, color: COLORS.accent, risk: 'low' },
  { name: 'Sentiment Analysis', weight: 30, score: 74, color: COLORS.info, risk: 'moderate' },
  { name: 'Behavioral Consistency', weight: 20, score: 88, color: COLORS.purple, risk: 'low' },
  { name: 'Activity Reliability', weight: 10, score: 69, color: COLORS.warning, risk: 'moderate' },
];

function riskBadge(risk) {
  const cls = risk === 'low' ? 'success' : risk === 'moderate' ? 'warning' : 'danger';
  return `<span class="badge badge-${cls}">${risk.charAt(0).toUpperCase() + risk.slice(1)}</span>`;
}

export function renderRisk() {
  return `
    <div class="page-enter">
      <div class="greeting-bar">
        <div class="greeting-text">
          <h1>Risk Breakdown</h1>
          <p>Factor contribution weights and individual risk levels</p>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-5);">
        <div class="card-header">
          <span class="card-title-lg">Contribution Weights</span>
        </div>
        <div class="chart-container">
          <canvas id="riskBarChart"></canvas>
        </div>
      </div>

      <div class="grid-2">
        ${RISK_FACTORS.map(f => `
          <div class="card">
            <div class="card-header">
              <span class="card-title-lg" style="font-size: 0.9375rem;">${f.name}</span>
              ${riskBadge(f.risk)}
            </div>
            <div style="display: flex; align-items: flex-end; justify-content: space-between;">
              <div>
                <span class="metric-score">${f.score}<span style="font-size: 0.8125rem; color: var(--color-text-muted); font-weight: 400;">/100</span></span>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.6875rem; color: var(--color-text-muted);">Weight</div>
                <div style="font-size: 1.125rem; font-weight: 700; color: ${f.color};">${f.weight}%</div>
              </div>
            </div>
            <div class="risk-bar-track" style="margin-top: 12px;">
              <div class="risk-bar-fill animated" style="width: ${f.score}%; background: ${f.color};"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function initRisk() {
  const canvas = document.getElementById('riskBarChart');
  if (canvas) {
    createHorizontalBarChart(canvas, {
      labels: RISK_FACTORS.map(f => f.name),
      data: RISK_FACTORS.map(f => f.weight),
      colors: RISK_FACTORS.map(f => f.color),
    });
  }
}

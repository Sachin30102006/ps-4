/* ═══════════════════════════════════════════
   Explainability Page — Light Theme
   ═══════════════════════════════════════════ */

const SCORE_DRIVERS = [
  { type: 'positive', icon: '✓', text: '<strong>Consistent monthly revenue growth</strong> of 4.2% over the past quarter, stabilizing the financial predictability index.' },
  { type: 'positive', icon: '✓', text: '<strong>High transaction frequency</strong> indicates sustained customer engagement, contributing +8 points to the activity score.' },
  { type: 'neutral', icon: '⚠', text: '<strong>Average review sentiment</strong> remains stable at 3.8/5, but lacks improvement trajectory compared to industry peers.' },
];

const RISK_FACTORS = [
  { type: 'negative', icon: '✕', text: '<strong>Revenue volatility increased by 18%</strong> in Q3, reducing the financial stability index by 6 points.' },
  { type: 'negative', icon: '✕', text: '<strong>Payment delay days averaged 12.4</strong>, up from 8.1 in the previous quarter. This signals cash flow strain.' },
  { type: 'neutral', icon: '⚠', text: '<strong>Customer complaint ratio</strong> rose to 2.3%, approaching the moderate-risk threshold of 3%.' },
];

const POSITIVE_INDICATORS = [
  { type: 'positive', icon: '✓', text: '<strong>Zero compliance flags</strong> detected across all monitored regulatory databases.' },
  { type: 'positive', icon: '✓', text: '<strong>Business registration active</strong> for 6+ years with no ownership disputes or liens on record.' },
  { type: 'positive', icon: '✓', text: '<strong>Diverse revenue channels</strong> reduce dependency risk. No single channel exceeds 40% of total revenue.' },
];

function renderSection(title, items, icon) {
  return `
    <div class="card" style="margin-bottom: var(--space-4);">
      <h3 class="section-heading"><span>${icon}</span> ${title}</h3>
      ${items.map((item, i) => `
        <div class="explanation-card animated ${item.type}" style="animation-delay: ${i * 80}ms;">
          <div class="explanation-icon ${item.type}">${item.icon}</div>
          <div class="explanation-text">${item.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

export function renderExplainability() {
  return `
    <div class="page-enter">
      <div class="greeting-bar">
        <div class="greeting-text">
          <h1>Explainability</h1>
          <p>Transparent breakdown of score factors and decision rationale</p>
        </div>
      </div>
      ${renderSection('Score Drivers', SCORE_DRIVERS, '📊')}
      ${renderSection('Risk Factors', RISK_FACTORS, '🔴')}
      ${renderSection('Positive Indicators', POSITIVE_INDICATORS, '🟢')}
    </div>
  `;
}

export function initExplainability() { }

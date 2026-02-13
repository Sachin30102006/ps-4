/* ═══════════════════════════════════════════
   Dashboard Page — LMS-style Layout
   ═══════════════════════════════════════════ */
import { createSparkline, createBarChart, COLORS } from './charts.js';

function animateNumber(el, target, duration = 1000) {
    let start = 0;
    const startTime = performance.now();
    const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const SCORE = { value: 78, grade: 'B+', risk: 'Low' };

const METRIC_CARDS = [
    {
        name: 'Financial Stability',
        score: 82,
        icon: '📊',
        sparkData: [65, 70, 68, 74, 78, 80, 82],
        trend: '+3.2%',
        trendDir: 'up',
        stats: [
            { icon: '📈', label: '+3.2%' },
            { icon: '💰', label: '$45K' },
        ],
    },
    {
        name: 'Sentiment Score',
        score: 74,
        icon: '💬',
        sparkData: [80, 78, 76, 73, 75, 72, 74],
        trend: '-1.8%',
        trendDir: 'down',
        stats: [
            { icon: '⭐', label: '3.8/5' },
            { icon: '📝', label: '1.2K' },
        ],
    },
    {
        name: 'Behavioral Score',
        score: 88,
        icon: '🔄',
        sparkData: [70, 74, 78, 82, 84, 86, 88],
        trend: '+5.1%',
        trendDir: 'up',
        stats: [
            { icon: '✅', label: '+5.1%' },
            { icon: '🔁', label: '22/mo' },
        ],
    },
];

const MONTHLY_DATA = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    study: [40, 55, 35, 60, 50],
    review: [20, 30, 25, 35, 28],
};

const TABLE_DATA = [
    { rank: 1, name: 'Financial Stability', category: 'Finance', weight: 40, score: 82, color: '#00E88F' },
    { rank: 2, name: 'Sentiment Analysis', category: 'NLP', weight: 30, score: 74, color: '#A78BFA' },
    { rank: 3, name: 'Behavioral Consistency', category: 'Behavior', weight: 20, score: 88, color: '#2DD4BF' },
    { rank: 4, name: 'Activity Reliability', category: 'Activity', weight: 10, score: 69, color: '#F5A623' },
];

export function renderDashboard() {
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (SCORE.value / 100) * circumference;
    const riskClass = SCORE.risk === 'Low' ? 'success' : SCORE.risk === 'Moderate' ? 'warning' : 'danger';

    return `
    <div class="page-enter">
      <!-- Greeting Bar -->
      <div class="greeting-bar">
        <div class="greeting-text">
          <h1>Hello Sachin 👋</h1>
          <p>Let's check your business reputation today!</p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="search-bar">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
            <input type="text" placeholder="Search metrics..." />
          </div>
          <button class="icon-btn" title="Search">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          </button>
          <button class="icon-btn" title="Notifications">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
          </button>
        </div>
      </div>

      <!-- Metric Cards Row -->
      <div class="grid-3" style="margin-bottom: var(--space-5);">
        ${METRIC_CARDS.map(c => `
          <div class="metric-card-colored">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div class="metric-icon">${c.icon}</div>
              <span class="trend trend-${c.trendDir}">${c.trend}</span>
            </div>
            <div class="metric-label">${c.name}</div>
            <div class="metric-bottom">
              <span class="metric-value">${c.score}<span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 400;">/100</span></span>
            </div>
            <div class="mini-stats">
              ${c.stats.map(s => `<span class="mini-stat">${s.icon} ${s.label}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <!-- Bar Chart: Score Breakdown -->
        <div class="card">
          <div class="card-header">
            <span class="card-title-lg">Score Breakdown</span>
            <div class="chart-legend">
              <span class="chart-legend-item"><span class="chart-legend-dot" style="background:${COLORS.accent}"></span> Score</span>
              <span class="chart-legend-item"><span class="chart-legend-dot" style="background:${COLORS.teal}"></span> Weight</span>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="breakdownChart"></canvas>
          </div>
        </div>

        <!-- Performance Donut -->
        <div class="card" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="card-header" style="width: 100%;">
            <span class="card-title-lg">Performance</span>
            <select class="select-pill">
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
          <div class="score-meter-container" style="margin: var(--space-4) 0;">
            <div class="score-meter">
              <svg viewBox="0 0 160 160">
                <circle class="score-meter-bg" cx="80" cy="80" r="70" />
                <circle class="score-meter-fill" cx="80" cy="80" r="70"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${circumference}"
                  data-target-offset="${offset}" />
              </svg>
              <div class="score-meter-text">
                <div class="score-number" data-target="${SCORE.value}">0</div>
                <div class="score-label">Your Score</div>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; margin-top: var(--space-2);">
            <span class="badge badge-accent">Grade ${SCORE.grade}</span>
            <span class="badge badge-${riskClass}">${SCORE.risk} Risk</span>
          </div>
        </div>
      </div>

      <!-- Leaderboard Table -->
      <div class="card" style="margin-top: var(--space-5);">
        <div class="card-header">
          <span class="card-title-lg">Factor Analysis</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Factor</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            ${TABLE_DATA.map(row => `
              <tr>
                <td class="table-rank">${row.rank}</td>
                <td>
                  <div class="table-name-cell">
                    <span class="table-avatar" style="background: ${row.color};">${row.name.charAt(0)}</span>
                    ${row.name}
                  </div>
                </td>
                <td>${row.category}</td>
                <td>${row.weight}%</td>
                <td class="table-value-highlight">${row.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function initDashboard() {
    // Animate score
    const scoreEl = document.querySelector('.score-number');
    if (scoreEl) animateNumber(scoreEl, parseInt(scoreEl.dataset.target, 10));

    // Animate ring
    const ring = document.querySelector('.score-meter-fill');
    if (ring) requestAnimationFrame(() => { ring.style.strokeDashoffset = ring.dataset.targetOffset; });

    // Bar chart
    const breakdownCanvas = document.getElementById('breakdownChart');
    if (breakdownCanvas) {
        createBarChart(breakdownCanvas, {
            labels: ['Financial', 'Sentiment', 'Behavior', 'Activity'],
            datasets: [
                { label: 'Score', data: [82, 74, 88, 69], color: COLORS.accent, barThickness: 16 },
                { label: 'Weight', data: [40, 30, 20, 10], color: COLORS.teal, barThickness: 16 },
            ],
        });
    }
}

/* ── Right Panel ── */
export function renderDashboardPanel() {
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(year, today.getMonth(), 1).getDay();

    let calDays = '';
    for (let i = 0; i < firstDay; i++) calDays += '<span class="day"></span>';
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate();
        const hasEvent = [5, 12, 18, 25].includes(d);
        calDays += `<span class="day${isToday ? ' today' : ''}${hasEvent ? ' has-event' : ''}">${d}</span>`;
    }

    return `
    <!-- Profile -->
    <div class="profile-card">
      <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-2);">
        <button class="icon-btn" style="width: 28px; height: 28px;">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
        </button>
      </div>
      <div class="profile-avatar">
        S
        <span class="online-dot"></span>
      </div>
      <div class="profile-name">Sachin</div>
      <div class="profile-role">Business Analyst</div>
    </div>

    <!-- Calendar -->
    <div class="calendar-widget">
      <div class="calendar-header">
        <span class="calendar-title">${monthName} ${year}</span>
        <div class="calendar-nav">
          <button>‹</button>
          <button>›</button>
        </div>
      </div>
      <div class="calendar-grid">
        <span class="day-label">M</span><span class="day-label">T</span><span class="day-label">W</span>
        <span class="day-label">T</span><span class="day-label">F</span><span class="day-label">S</span>
        <span class="day-label">S</span>
        ${calDays}
      </div>
    </div>

    <!-- To Do List -->
    <div>
      <div class="card-header" style="margin-bottom: var(--space-2);">
        <span class="card-title-lg" style="font-size: 0.9375rem;">To Do List</span>
      </div>
      <ul class="todo-list">
        <li class="todo-item">
          <div class="todo-check"></div>
          <div class="todo-content">
            <div class="todo-title">Review Financial Report</div>
            <div class="todo-meta">Analysis · 08:00 AM</div>
          </div>
        </li>
        <li class="todo-item">
          <div class="todo-check"></div>
          <div class="todo-content">
            <div class="todo-title">Update Sentiment API</div>
            <div class="todo-meta">Integration</div>
          </div>
        </li>
        <li class="todo-item">
          <div class="todo-check"></div>
          <div class="todo-content">
            <div class="todo-title">Check Risk Thresholds</div>
            <div class="todo-meta">Risk · Urgent</div>
          </div>
        </li>
        <li class="todo-item">
          <div class="todo-check done"></div>
          <div class="todo-content">
            <div class="todo-title done-text">Run Weekly Analysis</div>
            <div class="todo-meta">Completed · 12:40 PM</div>
          </div>
        </li>
        <li class="todo-item">
          <div class="todo-check done"></div>
          <div class="todo-content">
            <div class="todo-title done-text">Generate Monthly Report</div>
            <div class="todo-meta">Completed · 04:30 PM</div>
          </div>
        </li>
      </ul>
    </div>
  `;
}

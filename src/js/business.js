/* ═══════════════════════════════════════════
   Business Analysis — Input Form (Light)
   ═══════════════════════════════════════════ */

export function renderBusiness() {
  return `
    <div class="page-enter">
      <div class="greeting-bar">
        <div class="greeting-text">
          <h1>Business Analysis</h1>
          <p>Input business metrics to generate a reputation analysis</p>
        </div>
      </div>

      <div class="grid-2" style="align-items: start;">
        <div class="card card-lg">
          <h3 class="section-heading"><span>📋</span> Business Metrics</h3>
          <form id="analysisForm">
            <div class="form-group">
              <label class="form-label" for="revenue">Monthly Revenue ($)</label>
              <input type="number" id="revenue" class="form-input" placeholder="e.g. 45000" value="45000" />
              <span class="form-hint">Average monthly revenue over the past 3 months</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="transactions">Number of Transactions</label>
              <input type="number" id="transactions" class="form-input" placeholder="e.g. 1200" value="1200" />
              <span class="form-hint">Total monthly transaction count</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="reviewText">Average Review Text</label>
              <textarea id="reviewText" class="form-input" placeholder="Paste a representative customer review...">Great coffee and friendly staff. The ambiance is cozy and the prices are fair. Would recommend to friends.</textarea>
              <span class="form-hint">A sample review that represents typical customer feedback</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="paymentDelay">Payment Delay Days</label>
              <input type="number" id="paymentDelay" class="form-input" placeholder="e.g. 5" value="8" />
              <span class="form-hint">Average days between invoice and payment</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="activityFreq">Activity Frequency</label>
              <input type="number" id="activityFreq" class="form-input" placeholder="e.g. 22" value="22" />
              <span class="form-hint">Number of active business days per month</span>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" id="runAnalysisBtn" style="width: 100%; margin-top: var(--space-3);">
              Run Reputation Analysis
            </button>
          </form>
        </div>

        <div class="card card-lg" id="analysisResult">
          <h3 class="section-heading"><span>🧠</span> Analysis Result</h3>
          <div style="text-align: center; padding: var(--space-10) 0; color: var(--color-text-muted);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.3;">
              <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p style="font-size: 0.875rem;">Submit business metrics to<br/>generate a reputation analysis</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showResult(result, inputData) {
  const el = document.getElementById('analysisResult');
  if (!el) return;

  const score = result.score;
  const grade = result.grade;
  const risk = result.risk;
  const riskCls = risk === 'Low' ? 'success' : risk === 'Moderate' ? 'warning' : 'danger';

  el.innerHTML = `
    <h3 class="section-heading"><span>🧠</span> Analysis Result</h3>
    <div class="page-enter" style="text-align: center;">
      <div style="margin-bottom: var(--space-5);">
        <div style="font-size: 3.5rem; font-weight: 800; color: var(--color-text-primary); line-height: 1;">${score}</div>
        <div style="font-size: 0.6875rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">Reputation Score</div>
      </div>
      <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: var(--space-5);">
        <span class="badge badge-accent">Grade ${grade}</span>
        <span class="badge badge-${riskCls}">${risk} Risk</span>
      </div>
      <div class="divider"></div>
      <div style="text-align: left;">
        <div class="explanation-card positive animated">
          <div class="explanation-icon positive">✓</div>
          <div class="explanation-text"><strong>Monthly revenue of $${inputData.revenue.toLocaleString()}</strong> reflects stable income.</div>
        </div>
        <div class="explanation-card ${inputData.paymentDelay > 10 ? 'negative' : 'positive'} animated" style="animation-delay: 80ms;">
          <div class="explanation-icon ${inputData.paymentDelay > 10 ? 'negative' : 'positive'}">${inputData.paymentDelay > 10 ? '✕' : '✓'}</div>
          <div class="explanation-text"><strong>Payment delay of ${inputData.paymentDelay} days</strong> ${inputData.paymentDelay > 10 ? 'indicates concerns.' : 'is within healthy range.'}</div>
        </div>
        <div class="explanation-card positive animated" style="animation-delay: 160ms;">
          <div class="explanation-icon positive">✓</div>
          <div class="explanation-text"><strong>${inputData.transactions} transactions</strong> demonstrate consistent activity.</div>
        </div>
      </div>
    </div>
  `;
}

export function initBusiness() {
  const form = document.getElementById('analysisForm');
  const btn = document.getElementById('runAnalysisBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.classList.add('btn-loading');
    const data = {
      revenue: parseFloat(document.getElementById('revenue').value) || 0,
      transactions: parseInt(document.getElementById('transactions').value, 10) || 0,
      // reviewText is not used in backend yet, but we can pass sentiment if we had it
      paymentDelay: parseFloat(document.getElementById('paymentDelay').value) || 0,
      activityFreq: parseInt(document.getElementById('activityFreq').value, 10) || 0,
    };

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        btn.classList.remove('btn-loading');
        // Merge input data with result for display (result has 'score', 'grade', 'risk', etc.)
        // The showResult function expects the original input data for explanation text
        // We can enhance showResult to use the backend result if needed, but for now passing 'data' works for explanations
        // AND we inject the calculated score/grade/risk into the 'data' object or modify showResult to accept 'result'

        // Adaptation: modify showResult to take 'result' (from backend) AND 'data' (input)
        showResult(result, data);
      })
      .catch(err => {
        console.error(err);
        btn.classList.remove('btn-loading');
        alert('Analysis failed. See console.');
      });
  });
}

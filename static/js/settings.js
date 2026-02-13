/* ═══════════════════════════════════════════
   Settings Page — Light Theme
   ═══════════════════════════════════════════ */

export function renderSettings() {
  return `
    <div class="page-enter">
      <div class="greeting-bar">
        <div class="greeting-text">
          <h1>Settings</h1>
          <p>Configure your CredLens workspace</p>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-5);">
        <h3 class="section-heading"><span>👤</span> Profile</h3>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: var(--space-5);">
          <div style="width: 56px; height: 56px; border-radius: 14px; background: var(--color-accent); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #0B0E11;">S</div>
          <div>
            <div style="font-size: 1.125rem; font-weight: 600;">Sachin</div>
            <div style="font-size: 0.8125rem; color: var(--color-text-muted);">sachin@credlens.ai</div>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" value="Sachin" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" value="sachin@credlens.ai" />
          </div>
        </div>
        <button class="btn btn-primary">Save Changes</button>
      </div>

      <div class="card" style="margin-bottom: var(--space-5);">
        <h3 class="section-heading"><span>🔔</span> Notifications</h3>
        <div class="settings-row">
          <div class="settings-info"><div class="settings-label">Email Alerts</div><div class="settings-desc">Receive email when reputation score changes significantly</div></div>
          <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-info"><div class="settings-label">Risk Warnings</div><div class="settings-desc">Get notified when risk level increases</div></div>
          <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-info"><div class="settings-label">Weekly Reports</div><div class="settings-desc">Receive a weekly summary of business metrics</div></div>
          <label class="toggle"><input type="checkbox" /><span class="toggle-slider"></span></label>
        </div>
      </div>

      <div class="card">
        <h3 class="section-heading"><span>⚙️</span> Preferences</h3>
        <div class="settings-row">
          <div class="settings-info"><div class="settings-label">Compact View</div><div class="settings-desc">Reduce spacing for denser information display</div></div>
          <label class="toggle"><input type="checkbox" /><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <div class="settings-info"><div class="settings-label">Auto-refresh Data</div><div class="settings-desc">Automatically refresh analytics data every 30 minutes</div></div>
          <label class="toggle"><input type="checkbox" checked /><span class="toggle-slider"></span></label>
        </div>
      </div>
    </div>
  `;
}

export function initSettings() { }

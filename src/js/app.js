/* ═══════════════════════════════════════════
   App Router — 3-Column Layout
   ═══════════════════════════════════════════ */
import { renderDashboard, initDashboard, renderDashboardPanel } from './dashboard.js';
import { renderBusiness, initBusiness } from './business.js';
import { renderRisk, initRisk } from './risk.js';
import { renderTrends, initTrends } from './trends.js';
import { renderExplainability, initExplainability } from './explainability.js';
import { renderSettings, initSettings } from './settings.js';

const PAGES = {
    dashboard: { render: renderDashboard, init: initDashboard, panel: renderDashboardPanel, title: 'Overview' },
    business: { render: renderBusiness, init: initBusiness, panel: renderDashboardPanel, title: 'Analysis' },
    risk: { render: renderRisk, init: initRisk, panel: renderDashboardPanel, title: 'Risk' },
    trends: { render: renderTrends, init: initTrends, panel: renderDashboardPanel, title: 'Trends' },
    explainability: { render: renderExplainability, init: initExplainability, panel: renderDashboardPanel, title: 'Explainability' },
    settings: { render: renderSettings, init: initSettings, panel: null, title: 'Settings' },
};

const content = document.getElementById('content');
const rightPanel = document.getElementById('rightPanel');
const navItems = document.querySelectorAll('.nav-item[data-page]');
const sidebar = document.getElementById('sidebar');

console.log('App.js initialized');
console.log('Elements found:', { content, rightPanel, sidebar });

async function navigate(page) {
    try {
        const cfg = PAGES[page];
        if (!cfg) return navigate('dashboard');

        // Handle async render
        const rendered = cfg.render();
        if (rendered instanceof Promise) {
            content.innerHTML = await rendered;
        } else {
            content.innerHTML = rendered;
        }

        // Init if exists
        try {
            if (cfg.init) cfg.init();
        } catch (initErr) {
            console.error("Init error", initErr);
        }

        // Right panel
        if (rightPanel) {
            if (cfg.panel) {
                rightPanel.style.display = '';
                // Handle async panel
                const panelRendered = cfg.panel();
                if (panelRendered instanceof Promise) {
                    rightPanel.innerHTML = await panelRendered;
                } else {
                    rightPanel.innerHTML = panelRendered;
                }
            } else {
                rightPanel.style.display = 'none';
            }
        }

        // Active nav
        navItems.forEach((item) => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        sidebar.classList.remove('open');
        content.scrollTop = 0;

    } catch (e) {
        console.error("Navigation Error", e);
        content.innerHTML = `
            <div style="padding: 20px; color: #ff6b6b; font-family: monospace; background: rgba(50,0,0,0.5); border-radius: 8px;">
                <h3>⚠️ Application Error</h3>
                <p>Failed to load page: <strong>${page}</strong></p>
                <p>${e.message}</p>
                <pre>${e.stack}</pre>
            </div>
        `;
    }
}

function getPageFromHash() {
    return window.location.hash.slice(1) || 'dashboard';
}

window.addEventListener('hashchange', () => navigate(getPageFromHash()));

// Mobile menu
const mobileBtn = document.querySelector('.mobile-menu-btn');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
}

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        (!mobileBtn || !mobileBtn.contains(e.target))) {
        sidebar.classList.remove('open');
    }
});

// Init
navigate(getPageFromHash());

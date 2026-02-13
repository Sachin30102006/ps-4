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

async function navigate(page) {
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
    if (cfg.init) cfg.init();

    // Right panel
    if (rightPanel) {
        if (cfg.panel) {
            rightPanel.style.display = '';
            // Handle async panel if needed (though usually sync for now)
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

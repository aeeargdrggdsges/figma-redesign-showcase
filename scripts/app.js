// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initSlider();
});

// View Modes Switcher
function switchView(mode) {
  const proView = document.getElementById('proView');
  const compareView = document.getElementById('compareView');
  const oldView = document.getElementById('oldView');

  const viewProBtn = document.getElementById('viewProBtn');
  const viewCompareBtn = document.getElementById('viewCompareBtn');
  const viewOldBtn = document.getElementById('viewOldBtn');

  // Reset buttons
  [viewProBtn, viewCompareBtn, viewOldBtn].forEach(btn => {
    btn.className = 'px-3 py-1.5 rounded-md font-medium transition-all text-zinc-400 hover:text-white flex items-center gap-1.5';
  });

  // Hide all views
  proView.classList.add('hidden');
  compareView.classList.add('hidden');
  oldView.classList.add('hidden');

  if (mode === 'pro') {
    proView.classList.remove('hidden');
    viewProBtn.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-zinc-800 text-white shadow-sm flex items-center gap-1.5';
  } else if (mode === 'compare') {
    compareView.classList.remove('hidden');
    viewCompareBtn.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-zinc-800 text-white shadow-sm flex items-center gap-1.5';
    // re-trigger slider layout
    initSlider();
  } else if (mode === 'old') {
    oldView.classList.remove('hidden');
    viewOldBtn.className = 'px-3 py-1.5 rounded-md font-medium transition-all bg-zinc-800 text-white shadow-sm flex items-center gap-1.5';
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Dev Mode Toggle (8pt Grid & Auto-Layout Inspect)
let devModeActive = false;
function toggleDevMode() {
  devModeActive = !devModeActive;
  const statusLabel = document.getElementById('devModeStatus');
  const toggleBtn = document.getElementById('devModeToggle');

  if (devModeActive) {
    document.body.classList.add('dev-mode-active');
    statusLabel.textContent = 'ON';
    statusLabel.className = 'text-cyan-400 font-bold';
    toggleBtn.className = 'px-3 py-1.5 rounded-md text-xs font-mono border border-cyan-500/50 bg-cyan-950/30 text-cyan-200 flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20';
    showToast('Figma Dev Mode: Enabled (8pt Grid & Spec Inspection active)');
  } else {
    document.body.classList.remove('dev-mode-active');
    statusLabel.textContent = 'OFF';
    statusLabel.className = 'text-zinc-500';
    toggleBtn.className = 'px-3 py-1.5 rounded-md text-xs font-mono border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center gap-1.5 transition-colors';
    showToast('Figma Dev Mode: Disabled');
  }
}

// Interactive Before/After Split Slider
function initSlider() {
  const container = document.getElementById('sliderContainer');
  const handle = document.getElementById('sliderHandle');
  const afterSide = document.getElementById('afterSlider');

  if (!container || !handle || !afterSide) return;

  let isDragging = false;

  function moveSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 40) x = 40;
    if (x > rect.width - 40) x = rect.width - 40;

    const percentage = (x / rect.width) * 100;
    handle.style.left = `${percentage}%`;
    afterSide.style.width = `${percentage}%`;
  }

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.body.style.cursor = 'ew-resize';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });

  // Touch Support
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    moveSlider(e.touches[0].clientX);
  });
}

// Token Drawer
function openTokenDrawer() {
  document.getElementById('tokenDrawer').classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}
function closeTokenDrawer() {
  document.getElementById('tokenDrawer').classList.remove('active');
}
function closeDrawerOutside(e) {
  if (e.target.id === 'tokenDrawer') {
    closeTokenDrawer();
  }
}

// Matrix Modal
function openMatrixModal() {
  document.getElementById('matrixModal').classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}
function closeMatrixModal() {
  document.getElementById('matrixModal').classList.remove('active');
}
function closeModalOutside(e) {
  if (e.target.id === 'matrixModal') {
    closeMatrixModal();
  }
}

// Code Snippet Switcher
const snippets = {
  curl: `curl -X POST https://api.apex.cloud/v1/edge/deploy \\
  -H "Authorization: Bearer apex_live_9204bf491e0a" \\
  -H "Content-Type: application/json" \\
  -d '{"region": "global-mesh", "autoscale": {"min": 2, "max": 100}}'

# Response (200 OK in 6.2ms)
# {"status":"routed","cluster_id":"iad_e92a","nodes":8,"latency":"6.2ms"}`,

  ts: `import { ApexCluster } from '@apex/edge';

const edge = new ApexCluster({
  apiKey: process.env.APEX_SECRET_KEY,
  routing: 'nearest-region-failover',
  telemetry: true
});

// Deploy microsecond edge handler
await edge.serve({
  port: 8080,
  onMetric: (span) => console.log(\`P99 latency: \${span.latencyMs}ms\`)
});`,

  py: `from apex_edge import ApexEngine

# Initialize distributed cluster
cluster = ApexEngine(
    api_key="apex_live_9204bf491e0a",
    zero_cold_start=True
)

# Listen to regional failover heartbeats
@cluster.on_failover
def handle_migration(event):
    print(f"Traffic gracefully rerouted in {event.ms}ms with zero lost packets.")`
};

let currentSnippet = 'curl';

function setSnippet(type) {
  currentSnippet = type;
  const content = document.getElementById('codeContent');
  
  ['tabCurl', 'tabTs', 'tabPy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'px-2.5 py-1 text-xs rounded hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200';
  });

  if (type === 'curl') {
    document.getElementById('tabCurl').className = 'px-2.5 py-1 text-xs rounded bg-zinc-800 text-zinc-100 font-medium';
  } else if (type === 'ts') {
    document.getElementById('tabTs').className = 'px-2.5 py-1 text-xs rounded bg-zinc-800 text-zinc-100 font-medium';
  } else if (type === 'py') {
    document.getElementById('tabPy').className = 'px-2.5 py-1 text-xs rounded bg-zinc-800 text-zinc-100 font-medium';
  }

  content.innerHTML = `<pre><code class="text-zinc-300">${escapeHtml(snippets[type])}</code></pre>`;
}

function escapeHtml(string) {
  return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function copySnippet() {
  navigator.clipboard.writeText(snippets[currentSnippet]).then(() => {
    const btnText = document.getElementById('copySnippetBtnText');
    btnText.textContent = 'Copied!';
    setTimeout(() => {
      btnText.textContent = 'Copy';
    }, 2000);
    showToast('Code snippet copied to clipboard');
  });
}

function copyTokensCSS() {
  const cssVars = `:root {
  --color-zinc-950: #09090b;
  --color-zinc-900: #121215;
  --color-zinc-850: #18181c;
  --color-zinc-800: #222227;
  --color-accent-emerald: #10b981;
  --color-accent-indigo: #6366f1;
  --color-accent-cyan: #06b6d4;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --space-8pt: 8px;
}`;
  navigator.clipboard.writeText(cssVars).then(() => {
    showToast('CSS Design Tokens copied to clipboard!');
  });
}

// Toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

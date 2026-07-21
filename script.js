/*
   ==========================================================================
   LAKSHMANA OS - PREMIUM CYBERPUNK WORKSTATION SUITE
   Window Layout Manager, Tiling/Cascading, Kinetic Ripple Engine,
   Terminal Launcher, Dynamic Hardware Monitors, Web-Mesh Wallpaper
   ==========================================================================
*/

// Global OS States
let maxZIndex = 50;
let activeTheme = 'indigo'; // Default
let audioMuted = true; // Default muted (visual click ripples replace audio by default)
let audioContext = null;

// Track window original dimensions for layout restorations
const windowStore = {};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Original Modules (Preserved from Portfolio)
    initMouseCardGlow();
    initContactForm();
    initCertificationsFilter();

    // 2. Initialize Workstation OS Modules
    initBIOSBoot();
    initSystemClock();
    initWindowManager();
    initDesktopIcons();
    initStartMenu();
    initSystemTray();
    
    // 3. New Workstation Additions
    initHardwareMonitors();
    initWindowLayoutManager();
    initKineticRipples();
});

/* ==========================================================================
   A. WEB AUDIO API & RETRO SYNTH AUDIO
   ========================================================================== */
function playSound(type) {
    if (audioMuted) return;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;

        if (type === 'boot') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.6);
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (type === 'click' || type === 'open') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(700, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
            gainNode.gain.setValueAtTime(0.06, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'close') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(250, now + 0.1);
            gainNode.gain.setValueAtTime(0.06, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'minimize') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.22);
            gainNode.gain.setValueAtTime(0.04, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'maximize') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(580, now + 0.22);
            gainNode.gain.setValueAtTime(0.04, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'error') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.setValueAtTime(120, now + 0.08);
            gainNode.gain.setValueAtTime(0.06, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'start') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(392, now);
            osc.frequency.setValueAtTime(523, now + 0.04);
            osc.frequency.setValueAtTime(659, now + 0.08);
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    } catch (e) {
        console.warn('Audio Synth Error:', e);
    }
}

/* ==========================================================================
   B. BIOS BOOT SEQUENCE & LOADING ENGINE
   ========================================================================== */
function initBIOSBoot() {
    const startupScreen = document.getElementById('startup-screen');
    const bootTerminal = document.getElementById('boot-terminal');
    const progressBar = document.getElementById('boot-progress-bar');
    const percentageText = document.getElementById('boot-percentage');

    if (!startupScreen) return;

    const bootLogs = [
        "LAKSHMANA_WORKSTATION [Version 2.0.26] BIOS_LOAD...",
        "CPU: Quantum Core i9-2026 @ 5.80GHz ... DETECTED",
        "RAM: 64.0 GB Hyper Memory ... OK",
        "P2P Network listening on port 8000 ... OK",
        "Initializing Blockchain Module...",
        "  - Setting Solidity smart contract compiler ... OK",
        "  - Synchronizing EVM mainnet state pings ... OK",
        "Loading Developer Profile...",
        "  - Mounting Profile.exe (Primary Title: Lakshmana Perumal) ... OK",
        "  - Mounting Skills.exe (C/C++, Java, Python, Spring Boot) ... OK",
        "  - Mounting Projects.exe (Spring & OOP portfolios) ... OK",
        "  - Mounting Experience.exe (ICANIO Web Intern specs) ... OK",
        "Verifying Certifications...",
        "  - Joy of Computing Using Python (NPTEL Elite) ... MATCHED",
        "  - Cloud Computing (NPTEL Elite) ... MATCHED",
        "  - Sri Jayendra schools schooling credentials ... OK",
        "Launching Lakshmana OS...",
        "System Online. Welcome back, Admin."
    ];

    let logIndex = 0;
    let progress = 0;

    function printNextLog() {
        if (logIndex < bootLogs.length) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = `> ${bootLogs[logIndex]}`;
            bootTerminal.appendChild(line);
            bootTerminal.scrollTop = bootTerminal.scrollHeight;
            logIndex++;

            let delay = Math.random() * 100 + 30;
            if (logIndex === 4 || logIndex === 8 || logIndex === 13) delay = 350; // Pause slightly on block loads
            setTimeout(printNextLog, delay);
        }
    }

    function updateProgress() {
        if (progress < 100) {
            progress += Math.floor(Math.random() * 6) + 1;
            if (progress > 100) progress = 100;

            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${progress}%`;

            setTimeout(updateProgress, Math.random() * 70 + 20);
        } else {
            // Boot completed!
            setTimeout(() => {
                startupScreen.style.opacity = '0';
                playSound('boot');
                setTimeout(() => {
                    startupScreen.style.display = 'none';
                    // Open default workspace apps
                    openWindow('profile');
                    
                    // Start canvas blockchain nodes mesh wallpaper
                    initInteractiveCanvas();
                    
                    // Trigger first boot notifications!
                    setTimeout(() => showSystemNotification("Recruiter Connection Established", "success"), 1000);
                    setTimeout(() => showSystemNotification("Blockchain Module Updated", "info"), 3000);
                }, 600);
            }, 350);
        }
    }

    setTimeout(printNextLog, 200);
    setTimeout(updateProgress, 300);
}

/* ==========================================================================
   C. REAL-TIME SYSTEM CLOCK & DATE
   ========================================================================== */
function initSystemClock() {
    const trayClockTime = document.querySelector('#tray-clock .clock-time');
    const trayClockDate = document.querySelector('#tray-clock .clock-date');
    const widgetTime = document.getElementById('widget-time');
    const widgetDate = document.getElementById('widget-date');

    function updateClock() {
        const now = new Date();

        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const timeStrCompact = `${hours}:${minutes} ${ampm}`;
        const timeStrWidget = `${hours}:${minutes}:${seconds} ${ampm}`;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
        
        // Shift month array index to represent current time properly
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const dateNum = now.getDate();
        const year = now.getFullYear();

        const dateStrCompact = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(dateNum).padStart(2, '0')}/${year}`;
        const dateStrWidget = `${dayName}, ${monthName} ${dateNum}, ${year}`;

        if (trayClockTime) trayClockTime.textContent = timeStrCompact;
        if (trayClockDate) trayClockDate.textContent = dateStrCompact;
        if (widgetTime) widgetTime.textContent = timeStrWidget;
        if (widgetDate) widgetDate.textContent = dateStrWidget;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   D. DYNAMIC HARDWARE METERS & LOGS GENERATOR
   ========================================================================== */
function initHardwareMonitors() {
    const cpuVal = document.getElementById('cpu-value');
    const cpuBar = document.getElementById('cpu-bar');
    const memVal = document.getElementById('mem-value');
    const memBar = document.getElementById('mem-bar');
    const blockVal = document.getElementById('block-value');
    const blockBar = document.getElementById('block-bar');
    const logsStream = document.getElementById('desktop-logs-stream');

    let blockHeight = 8940195;

    // 1. Animate CPU and RAM loads
    setInterval(() => {
        const cpuLoad = Math.floor(Math.random() * 32) + 12; // 12% - 44%
        const memUsage = Math.floor(Math.random() * 12) + 38; // 38% - 50%

        if (cpuVal && cpuBar) {
            cpuVal.textContent = `${cpuLoad}%`;
            cpuBar.style.width = `${cpuLoad}%`;
        }
        if (memVal && memBar) {
            memVal.textContent = `${memUsage}%`;
            memBar.style.width = `${memUsage}%`;
        }
    }, 2500);

    // 2. Simulate Ethereum Blockchain Block Sync
    setInterval(() => {
        blockHeight++;
        if (blockVal && blockBar) {
            blockVal.textContent = `#${blockHeight.toLocaleString()}`;
            // Pulse the bar green briefly to show block sync!
            blockBar.style.filter = 'brightness(1.5)';
            setTimeout(() => {
                blockBar.style.filter = '';
            }, 500);

            // Push a log event
            pushDesktopLog(`[INFO] Block #${blockHeight} validated. EVM state matching.`);
        }
    }, 9000);

    // 3. Append scrolling system activity logs
    const mockEvents = [
        "[SECURE] Cryptographic P2P handshake successful.",
        "[INFO] Gas threshold: 24 Gwei ... NORMAL",
        "[SYSTEM] Optimizing EVM compiler stack buffers.",
        "[INFO] Solidity Smart Contract compiler loaded in sandbox.",
        "[NETWORK] Web3 RPC Endpoint ping: 38ms",
        "[SYSTEM] RAM optimization garbage sweep ... OK",
        "[INFO] Sri Jayendra credentials verified successfully."
    ];

    setInterval(() => {
        const randEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        pushDesktopLog(randEvent);
    }, 6000);

    function pushDesktopLog(text) {
        if (!logsStream) return;
        const row = document.createElement('div');
        row.className = 'log-row';
        row.textContent = text;
        logsStream.appendChild(row);
        logsStream.scrollTop = logsStream.scrollHeight;

        // Keep last 6 rows
        while (logsStream.childNodes.length > 7) {
            logsStream.removeChild(logsStream.firstChild);
        }
    }
}

/* ==========================================================================
   E. APPLICATION CARDS CONTROLLER
   ========================================================================== */
function initDesktopIcons() {
    const cards = document.querySelectorAll('.app-card');

    document.getElementById('desktop').addEventListener('click', (e) => {
        if (e.target.id === 'desktop' || e.target.id === 'hero-canvas') {
            cards.forEach(card => card.classList.remove('selected'));
        }
    });

    cards.forEach(card => {
        const appId = card.getAttribute('data-app');
        const btn = card.querySelector('.app-card-btn');

        // Card select / open behaviors
        card.addEventListener('click', (e) => {
            const isMobile = window.innerWidth <= 768;
            e.stopPropagation();

            if (isMobile) {
                openWindow(appId);
            } else {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            }
        });

        // Double click launches on desktop
        card.addEventListener('dblclick', (e) => {
            if (window.innerWidth > 768) {
                e.preventDefault();
                openWindow(appId);
                card.classList.remove('selected');
            }
        });

        // App Card Button Launch
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openWindow(appId);
                card.classList.remove('selected');
            });
        }
    });
}

/* ==========================================================================
   F. WINDOW MANAGER MODULE
   ========================================================================== */
function initWindowManager() {
    const windows = document.querySelectorAll('.window');

    windows.forEach(win => {
        const header = win.querySelector('.window-header');
        const btnClose = win.querySelector('.win-close');
        const btnMinimize = win.querySelector('.win-minimize');
        const btnMaximize = win.querySelector('.win-maximize');
        const appId = win.getAttribute('data-app');

        // Store original dimensions for tiling restorations
        windowStore[appId] = {
            width: win.style.width,
            height: win.style.height,
            left: win.style.left,
            top: win.style.top
        };

        // Bring window to front on click
        win.addEventListener('mousedown', () => {
            focusWindow(appId);
        });

        win.addEventListener('touchstart', () => {
            focusWindow(appId);
        }, { passive: true });

        if (btnClose) {
            btnClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeWindow(appId);
            });
        }

        if (btnMinimize) {
            btnMinimize.addEventListener('click', (e) => {
                e.stopPropagation();
                minimizeWindow(appId);
            });
        }

        if (btnMaximize) {
            btnMaximize.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMaximizeWindow(appId);
            });
        }

        if (header) {
            header.addEventListener('dblclick', (e) => {
                if (window.innerWidth > 768) {
                    toggleMaximizeWindow(appId);
                }
            });
        }

        makeWindowDraggable(win);
        makeWindowResizable(win);
    });
}

// 1. Open Window Action
function openWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    playSound('open');

    if (win.classList.contains('minimized-window')) {
        win.classList.remove('minimized-window');
    }

    win.style.display = 'flex';
    focusWindow(appId);

    // Create Taskbar Tab
    createTaskbarTab(appId);

    // Dynamic Notifications based on App opened!
    if (appId === 'resume') {
        setTimeout(() => showSystemNotification("Resume Ready for Download", "success"), 500);
    } else if (appId === 'projects') {
        setTimeout(() => showSystemNotification("New Project Unlocked", "info"), 500);
    } else if (appId === 'experience') {
        setTimeout(() => showSystemNotification("Internship Experience Loaded", "success"), 500);
    }

    if (window.innerWidth <= 768) {
        win.classList.add('maximized-window');
    }
}

// 2. Close Window Action
function closeWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    playSound('close');

    win.style.transform = 'scale(0.92)';
    win.style.opacity = '0';

    setTimeout(() => {
        win.style.display = 'none';
        win.style.transform = '';
        win.style.opacity = '';
        win.classList.remove('maximized-window');
        win.classList.remove('minimized-window');

        // Remove Taskbar Tab
        removeTaskbarTab(appId);
    }, 150);
}

// 3. Minimize Window Action
function minimizeWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    playSound('minimize');
    win.classList.add('minimized-window');
    win.classList.remove('active-window');

    const tab = document.getElementById(`tab-${appId}`);
    if (tab) tab.classList.remove('active-tab');
}

// 4. Toggle Maximize Window Action
function toggleMaximizeWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win) return;

    playSound('maximize');
    win.classList.toggle('maximized-window');
    focusWindow(appId);
}

// 5. Bring Window to Front Focus
function focusWindow(appId) {
    const win = document.getElementById(`win-${appId}`);
    if (!win || win.classList.contains('minimized-window')) return;

    maxZIndex++;
    win.style.zIndex = maxZIndex;

    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-window'));
    win.classList.add('active-window');

    document.querySelectorAll('.taskbar-app-tab').forEach(t => t.classList.remove('active-tab'));
    const tab = document.getElementById(`tab-${appId}`);
    if (tab) tab.classList.add('active-tab');
}

// 6. Taskbar Tab Manager
function createTaskbarTab(appId) {
    const taskbarApps = document.getElementById('taskbar-apps');
    if (!taskbarApps) return;

    let tab = document.getElementById(`tab-${appId}`);
    if (tab) {
        tab.classList.add('active-tab');
        return;
    }

    const win = document.getElementById(`win-${appId}`);
    const titleIcon = win.querySelector('.window-title-icon').textContent;
    const titleText = win.querySelector('.window-title-text').textContent;

    tab = document.createElement('button');
    tab.className = 'taskbar-app-tab active-tab';
    tab.id = `tab-${appId}`;
    tab.innerHTML = `
        <span class="window-title-icon">${titleIcon}</span>
        <span>${titleText}</span>
    `;

    tab.addEventListener('click', () => {
        if (win.classList.contains('minimized-window')) {
            openWindow(appId);
        } else if (win.classList.contains('active-window')) {
            minimizeWindow(appId);
        } else {
            focusWindow(appId);
        }
    });

    taskbarApps.appendChild(tab);
}

function removeTaskbarTab(appId) {
    const tab = document.getElementById(`tab-${appId}`);
    if (tab) tab.remove();
}

/* ==========================================================================
   G. DRAGGING AND TOUCH-SWIPING ENGINE
   ========================================================================== */
function makeWindowDraggable(win) {
    const header = win.querySelector('.window-header');
    if (!header) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;
    header.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
        if (win.classList.contains('maximized-window') || window.innerWidth <= 768) return;

        e.preventDefault();
        focusWindow(win.getAttribute('data-app'));

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function dragTouchStart(e) {
        if (win.classList.contains('maximized-window') || window.innerWidth <= 768) return;

        focusWindow(win.getAttribute('data-app'));

        const touch = e.touches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;

        document.ontouchend = closeDragElement;
        document.ontouchmove = elementTouchDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = win.offsetTop - pos2;
        let newLeft = win.offsetLeft - pos1;

        const headerHeight = 42;
        if (newTop < 0) newTop = 0;
        if (newTop > window.innerHeight - 100) newTop = window.innerHeight - 100;
        if (newLeft < -win.offsetWidth + 100) newLeft = -win.offsetWidth + 100;
        if (newLeft > window.innerWidth - 100) newLeft = window.innerWidth - 100;

        win.style.top = `${newTop}px`;
        win.style.left = `${newLeft}px`;
    }

    function elementTouchDrag(e) {
        const touch = e.touches[0];
        
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;

        let newTop = win.offsetTop - pos2;
        let newLeft = win.offsetLeft - pos1;

        if (newTop < 0) newTop = 0;
        if (newTop > window.innerHeight - 100) newTop = window.innerHeight - 100;
        if (newLeft < -win.offsetWidth + 100) newLeft = -win.offsetWidth + 100;
        if (newLeft > window.innerWidth - 100) newLeft = window.innerWidth - 100;

        win.style.top = `${newTop}px`;
        win.style.left = `${newLeft}px`;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

/* ==========================================================================
   H. WINDOW RESIZING LOGIC
   ========================================================================== */
function makeWindowResizable(win) {
    const resizers = win.querySelectorAll('.window-resizer');
    const minWidth = 350;
    const minHeight = 250;

    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', initResize);
        resizer.addEventListener('touchstart', initTouchResize, { passive: true });

        function initResize(e) {
            if (win.classList.contains('maximized-window') || window.innerWidth <= 768) return;
            e.preventDefault();
            e.stopPropagation();

            window.addEventListener('mousemove', StartResize);
            window.addEventListener('mouseup', StopResize);
        }

        function initTouchResize(e) {
            if (win.classList.contains('maximized-window') || window.innerWidth <= 768) return;
            e.stopPropagation();

            window.addEventListener('touchmove', StartTouchResize);
            window.addEventListener('touchend', StopResize);
        }

        function StartResize(e) {
            const rect = win.getBoundingClientRect();
            let newWidth = rect.width;
            let newHeight = rect.height;

            if (resizer.classList.contains('resizer-e') || resizer.classList.contains('resizer-se')) {
                newWidth = e.clientX - rect.left;
            }
            if (resizer.classList.contains('resizer-s') || resizer.classList.contains('resizer-se')) {
                newHeight = e.clientY - rect.top;
            }

            if (newWidth >= minWidth && newWidth <= window.innerWidth) {
                win.style.width = `${newWidth}px`;
            }
            if (newHeight >= minHeight && newHeight <= window.innerHeight - 50) {
                win.style.height = `${newHeight}px`;
            }
        }

        function StartTouchResize(e) {
            const touch = e.touches[0];
            const rect = win.getBoundingClientRect();
            let newWidth = rect.width;
            let newHeight = rect.height;

            if (resizer.classList.contains('resizer-e') || resizer.classList.contains('resizer-se')) {
                newWidth = touch.clientX - rect.left;
            }
            if (resizer.classList.contains('resizer-s') || resizer.classList.contains('resizer-se')) {
                newHeight = touch.clientY - rect.top;
            }

            if (newWidth >= minWidth && newWidth <= window.innerWidth) {
                win.style.width = `${newWidth}px`;
            }
            if (newHeight >= minHeight && newHeight <= window.innerHeight - 50) {
                win.style.height = `${newHeight}px`;
            }
        }

        function StopResize() {
            window.removeEventListener('mousemove', StartResize);
            window.removeEventListener('mouseup', StopResize);
            window.removeEventListener('touchmove', StartTouchResize);
            window.removeEventListener('touchend', StopResize);
        }
    });
}

/* ==========================================================================
   I. LAUNCHER START MENU DRAWER
   ========================================================================== */
function initStartMenu() {
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');
    const startItems = document.querySelectorAll('.start-item');
    const btnShutdown = document.getElementById('start-btn-shutdown');
    const btnRestart = document.getElementById('start-btn-restart');
    const shutdownScreen = document.getElementById('shutdown-screen');
    const btnReboot = document.getElementById('btn-reboot');

    if (!startBtn || !startMenu) return;

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('start');
        startMenu.classList.toggle('active-menu');
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
            startMenu.classList.remove('active-menu');
        }
    });

    startItems.forEach(item => {
        item.addEventListener('click', () => {
            const appId = item.getAttribute('data-app');
            startMenu.classList.remove('active-menu');
            openWindow(appId);
        });
    });

    if (btnShutdown && shutdownScreen) {
        btnShutdown.addEventListener('click', () => {
            startMenu.classList.remove('active-menu');
            shutdownScreen.classList.add('active-shutdown');
            playSound('close');
            document.querySelectorAll('.window').forEach(w => w.style.display = 'none');
            document.getElementById('taskbar-apps').innerHTML = '';
        });
    }

    if (btnReboot && shutdownScreen) {
        btnReboot.addEventListener('click', () => {
            shutdownScreen.classList.remove('active-shutdown');
            const startupScreen = document.getElementById('startup-screen');
            const bootTerminal = document.getElementById('boot-terminal');
            if (startupScreen && bootTerminal) {
                bootTerminal.innerHTML = '';
                startupScreen.style.display = 'flex';
                startupScreen.style.opacity = '1';
                initBIOSBoot();
            }
        });
    }

    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            startMenu.classList.remove('active-menu');
            const startupScreen = document.getElementById('startup-screen');
            const bootTerminal = document.getElementById('boot-terminal');
            if (startupScreen && bootTerminal) {
                playSound('close');
                document.querySelectorAll('.window').forEach(w => w.style.display = 'none');
                document.getElementById('taskbar-apps').innerHTML = '';
                
                bootTerminal.innerHTML = '';
                startupScreen.style.display = 'flex';
                startupScreen.style.opacity = '1';
                
                setTimeout(initBIOSBoot, 300);
            }
        });
    }
}

/* ==========================================================================
   J. SYSTEM TRAY INTERACTION (SOUNDS & ACCENT SWITCHING)
   ========================================================================== */
function initSystemTray() {
    const trayAudio = document.getElementById('tray-audio');
    const trayTheme = document.getElementById('tray-theme');

    // 1. Visual Click Ripples Mute/Unmute
    if (trayAudio) {
        trayAudio.addEventListener('click', () => {
            audioMuted = !audioMuted;

            if (audioMuted) {
                // Dim/mute style
                trayAudio.classList.remove('active-icon');
                trayAudio.setAttribute('title', 'Mute/Unmute UI visual sound feedback');
            } else {
                // Bright/active style
                trayAudio.classList.add('active-icon');
                trayAudio.setAttribute('title', 'Visual sound feedback Active');
                playSound('click');
            }
        });
    }

    // 2. Color Accent Theme Switcher
    if (trayTheme) {
        const desktop = document.getElementById('desktop');
        const popup = document.getElementById('theme-tray-popup');

        trayTheme.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.toggle('active-popup');
        });

        document.addEventListener('click', () => {
            popup.classList.remove('active-popup');
        });

        popup.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedTheme = btn.getAttribute('data-theme');
                changeTheme(selectedTheme);
                popup.classList.remove('active-popup');
            });
        });
    }
}

function changeTheme(themeName) {
    const root = document.documentElement;
    activeTheme = themeName;
    playSound('click');

    if (themeName === 'indigo') {
        root.style.setProperty('--color-primary', '#6366f1');
        root.style.setProperty('--color-secondary', '#06b6d4');
        root.style.setProperty('--color-accent', '#a855f7');
    } else if (themeName === 'cyan') {
        root.style.setProperty('--color-primary', '#00f2fe');
        root.style.setProperty('--color-secondary', '#0891b2');
        root.style.setProperty('--color-accent', '#06b6d4');
    } else if (themeName === 'purple') {
        root.style.setProperty('--color-primary', '#a855f7');
        root.style.setProperty('--color-secondary', '#d946ef');
        root.style.setProperty('--color-accent', '#c084fc');
    } else if (themeName === 'green') {
        root.style.setProperty('--color-primary', '#05ffc4');
        root.style.setProperty('--color-secondary', '#059669');
        root.style.setProperty('--color-accent', '#10b981');
    }
}

/* ==========================================================================
   K. WORKSTATION WINDOW LAYOUT MANAGER (TILE / CASCADE)
   ========================================================================== */
function initWindowLayoutManager() {
    const layoutBtn = document.getElementById('layout-btn');
    const layoutPopup = document.getElementById('layout-tray-popup');
    const btnTile = document.getElementById('layout-tile');
    const btnCascade = document.getElementById('layout-cascade');
    const btnMinAll = document.getElementById('layout-minimize-all');
    const btnRestAll = document.getElementById('layout-restore-all');

    if (!layoutBtn || !layoutPopup) return;

    // Toggle Layout manager popup
    layoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSound('start');
        layoutPopup.classList.toggle('active-popup');
    });

    document.addEventListener('click', () => {
        layoutPopup.classList.remove('active-popup');
    });

    // 1. Tile Open Windows
    if (btnTile) {
        btnTile.addEventListener('click', () => {
            layoutPopup.classList.remove('active-popup');
            tileWindows();
        });
    }

    // 2. Cascade Open Windows
    if (btnCascade) {
        btnCascade.addEventListener('click', () => {
            layoutPopup.classList.remove('active-popup');
            cascadeWindows();
        });
    }

    // 3. Minimize All
    if (btnMinAll) {
        btnMinAll.addEventListener('click', () => {
            layoutPopup.classList.remove('active-popup');
            minimizeAll();
        });
    }

    // 4. Restore All
    if (btnRestAll) {
        btnRestAll.addEventListener('click', () => {
            layoutPopup.classList.remove('active-popup');
            restoreAll();
        });
    }

    function getOpenWindows() {
        const openWins = [];
        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display === 'flex' && !win.classList.contains('minimized-window')) {
                openWins.push(win);
            }
        });
        return openWins;
    }

    // Tiling Algorithm: divides screen space into grid cells
    function tileWindows() {
        const openWins = getOpenWindows();
        if (openWins.length === 0) return;

        playSound('maximize');

        const width = window.innerWidth;
        const height = window.innerHeight - 50; // exclude bottom taskbar

        const cols = Math.ceil(Math.sqrt(openWins.length));
        const rows = Math.ceil(openWins.length / cols);

        const cellWidth = Math.floor(width / cols);
        const cellHeight = Math.floor(height / rows);

        openWins.forEach((win, index) => {
            win.classList.remove('maximized-window');
            
            const r = Math.floor(index / cols);
            const c = index % cols;

            win.style.left = `${c * cellWidth}px`;
            win.style.top = `${r * cellHeight}px`;
            win.style.width = `${cellWidth}px`;
            win.style.height = `${cellHeight}px`;
        });
        
        showSystemNotification("Windows tiled successfully.", "info");
    }

    // Cascading Algorithm: offsets windows diagonally
    function cascadeWindows() {
        const openWins = getOpenWindows();
        if (openWins.length === 0) return;

        playSound('maximize');

        let startX = 50;
        let startY = 50;
        const offset = 40;

        const width = Math.min(680, window.innerWidth - 100);
        const height = Math.min(460, window.innerHeight - 150);

        openWins.forEach((win, index) => {
            win.classList.remove('maximized-window');
            
            win.style.left = `${startX + index * offset}px`;
            win.style.top = `${startY + index * offset}px`;
            win.style.width = `${width}px`;
            win.style.height = `${height}px`;
            
            focusWindow(win.getAttribute('data-app'));
        });

        showSystemNotification("Windows cascaded successfully.", "info");
    }

    function minimizeAll() {
        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display === 'flex' && !win.classList.contains('minimized-window')) {
                minimizeWindow(win.getAttribute('data-app'));
            }
        });
    }

    function restoreAll() {
        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display === 'flex') {
                const appId = win.getAttribute('data-app');
                openWindow(appId);
                
                // Restore original sizes
                const orig = windowStore[appId];
                if (orig) {
                    win.style.width = orig.width;
                    win.style.height = orig.height;
                    win.style.left = orig.left;
                    win.style.top = orig.top;
                    win.classList.remove('maximized-window');
                }
            }
        });
    }
}

/* ==========================================================================
   L. DYNAMIC KINETIC RIPPLE SYSTEM (SOUND VISUAL FEEDBACK)
   ========================================================================== */
function initKineticRipples() {
    document.addEventListener('click', (e) => {
        // Create expanding ripple ring element
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        
        // Set coordinates based on click event
        ripple.style.left = `${e.pageX}px`;
        ripple.style.top = `${e.pageY}px`;
        
        document.body.appendChild(ripple);
        
        // Remove once animation completed
        setTimeout(() => {
            ripple.remove();
        }, 550);
    });
}

/* ==========================================================================
   M. SLIDE-IN SYSTEM NOTIFICATION TOAST SYSTEM
   ========================================================================== */
function showSystemNotification(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    // Notification classes matching cyberpunk glow styles
    toast.className = `toast toast-cyber ${type === 'success' ? 'toast-success' : 'toast-info'}`;

    let iconMarkup = '';
    if (type === 'success') {
        iconMarkup = `<span class="toast-icon glow-green" style="color: var(--color-cyber-green);">✓</span>`;
    } else {
        iconMarkup = `<span class="toast-icon glow-cyan" style="color: var(--color-cyan);">⚡</span>`;
    }

    toast.innerHTML = `
        <div class="toast-header-cyber">
            ${iconMarkup}
            <span class="toast-title-cyber">SYSTEM_ALERT</span>
        </div>
        <div class="toast-body-cyber">${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4500);
}


/* ==========================================================================
   O. INTERACTIVE BLOCKCHAIN NODE NETWORK CANVAS WALLPAPER
   ========================================================================== */
function initInteractiveCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic node parameters
    const nodes = [];
    const maxNodes = window.innerWidth < 768 ? 25 : 60;
    const connectionDist = 115;
    const mouse = { x: null, y: null, radius: 170 }; // Large mouse area for web-mesh effect

    const desktop = document.getElementById('desktop');
    desktop.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    desktop.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    desktop.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    }, { passive: true });

    desktop.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    }, { passive: true });

    // Node class with vector variables
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1.5;
            this.glowOffset = Math.random() * Math.PI; // Pulse offsets
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            this.glowOffset += 0.02;
            const sizePulse = this.radius + Math.sin(this.glowOffset) * 0.8;

            ctx.beginPath();
            ctx.arc(this.x, this.y, sizePulse, 0, Math.PI * 2);
            
            // Neon glowing particles
            ctx.fillStyle = activeTheme === 'green' ? 'rgba(5, 255, 196, 0.5)' : 
                            activeTheme === 'pink' || activeTheme === 'purple' ? 'rgba(241, 7, 163, 0.5)' : 
                            'rgba(0, 242, 254, 0.5)';
            ctx.fill();
            
            // Small border glow ring
            ctx.beginPath();
            ctx.arc(this.x, this.y, sizePulse + 2, 0, Math.PI * 2);
            ctx.strokeStyle = activeTheme === 'green' ? 'rgba(5, 255, 196, 0.15)' : 
                              activeTheme === 'pink' || activeTheme === 'purple' ? 'rgba(241, 7, 163, 0.15)' : 
                              'rgba(0, 242, 254, 0.15)';
            ctx.stroke();
        }
    }

    for (let i = 0; i < maxNodes; i++) {
        nodes.push(new Node());
    }

    // Animation Loop (Web-Mesh network connectors drawing)
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw P2P connections between nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < connectionDist) {
                    const alpha = (connectionDist - distance) / connectionDist * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    
                    // Connected lines gradient
                    ctx.strokeStyle = activeTheme === 'green' ? `rgba(5, 255, 196, ${alpha})` : 
                                      activeTheme === 'pink' || activeTheme === 'purple' ? `rgba(123, 44, 191, ${alpha})` : 
                                      `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // 2. Upgraded: Interactive Blockchain Node Wallpaper (Web-Mesh to Cursor!)
        if (mouse.x !== null && mouse.y !== null) {
            nodes.forEach(node => {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const distance = Math.hypot(dx, dy);

                if (distance < mouse.radius) {
                    // Pull nodes slightly towards cursor (gravity sync)
                    const force = (mouse.radius - distance) / mouse.radius;
                    node.x += (dx / distance) * force * 0.45;
                    node.y += (dy / distance) * force * 0.45;

                    // Draw glowing line from node directly to cursor!
                    const alpha = (mouse.radius - distance) / mouse.radius * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    
                    // Glowing cyan/magenta connections to mouse
                    ctx.strokeStyle = activeTheme === 'green' ? `rgba(5, 255, 196, ${alpha})` : 
                                      activeTheme === 'pink' || activeTheme === 'purple' ? `rgba(241, 7, 163, ${alpha})` : 
                                      `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                    
                    // Add micro-glow dot at connection point on cursor
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.fill();
                }
            });
        }

        // 3. Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
    };
}

// Preserved glow cards trackers
function initMouseCardGlow() {
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.card-glow, .app-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
}

// Preserved Form submissions
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('formName');
        const emailInput = document.getElementById('formEmail');
        const subjectInput = document.getElementById('formSubject');
        const messageInput = document.getElementById('formMessage');

        if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
            showSystemNotification("Please fill out all required fields.", "info");
            playSound('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showSystemNotification("Please enter a valid email address.", "info");
            playSound('error');
            return;
        }

        const submitBtn = contactForm.querySelector('.btn-submit');
        const submitBtnText = submitBtn.querySelector('span');
        const originalText = submitBtnText.textContent;
        
        submitBtn.disabled = true;
        submitBtnText.textContent = 'Sending Message...';

        setTimeout(() => {
            showSystemNotification(`Message sent successfully. Thank you, ${nameInput.value.trim()}!`, "success");
            
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtnText.textContent = originalText;
        }, 1500);
    });
}

// Preserved filters
function initCertificationsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    if (filterButtons.length === 0 || certCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('click');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            certCards.forEach(card => {
                const cardType = card.getAttribute('data-type');

                if (filterValue === 'all' || cardType === filterValue) {
                    card.classList.remove('hide');
                    void card.offsetHeight;
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95) translateY(10px)';
                    
                    const hideCard = (e) => {
                        if (e.propertyName === 'opacity' && card.style.opacity === '0') {
                            card.classList.add('hide');
                            card.removeEventListener('transitionend', hideCard);
                        }
                    };
                    card.addEventListener('transitionend', hideCard);
                    
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.classList.add('hide');
                        }
                    }, 400);
                }
            });
        });
    });
}

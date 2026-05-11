/**
 * Cool Features for Academic Homepage
 * 1. 3D Neural Network Background (Vanta.js)
 * 2. Terminal Easter Egg
 * 3. Interactive Skill Galaxy (TagCanvas)
 */

const scriptLoaders = new Map();
let vantaEffect = null;

function loadScriptOnce(src) {
    if (scriptLoaders.has(src)) {
        return scriptLoaders.get(src);
    }

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
        const existingPromise = Promise.resolve();
        scriptLoaders.set(src, existingPromise);
        return existingPromise;
    }

    const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });

    scriptLoaders.set(src, promise);
    return promise;
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function shouldAvoidHeavyEffects() {
    return window.innerWidth < 768 || prefersReducedMotion() || navigator.connection?.saveData;
}

function scheduleIdleTask(task, timeout = 2000) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => task(), { timeout });
        return;
    }

    setTimeout(task, 1000);
}

async function ensureVantaAssets() {
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
    await loadScriptOnce('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');
}

async function ensureSkillGalaxyAssets() {
    await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
    await loadScriptOnce('assets/js/jquery.tagcanvas.min.js');
}

function initNeuralBackground() {
    if (shouldAvoidHeavyEffects()) return;

    if (typeof VANTA === 'undefined') {
        console.warn('Vanta.js not loaded');
        return;
    }

    const isDark = document.body.classList.contains('dark-mode');
    const colors = {
        color: isDark ? 0x38bdf8 : 0x667eea,       // 连线颜色
        backgroundColor: isDark ? 0x0f172a : 0xf8f9fa // 背景颜色
    };

    try {
        vantaEffect = VANTA.NET({
            el: "#bg-animation-container",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: colors.color,
            backgroundColor: colors.backgroundColor,
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00,
            showDots: true
        });
        console.log('Neural background initialized');
    } catch (e) {
        console.error('Failed to init Vanta Net:', e);
    }
}

// 监听主题切换
function updateVantaTheme(isDark) {
    if (!vantaEffect) return;

    if (isDark) {
        vantaEffect.setOptions({
            color: 0x38bdf8,
            backgroundColor: 0x0f172a
        });
    } else {
        vantaEffect.setOptions({
            color: 0x667eea,
            backgroundColor: 0xf8f9fa
        });
    }
}

// 暴露给全局以便在 toggleDarkMode 中调用
window.updateVantaTheme = updateVantaTheme;

function initTerminal() {
    const terminalBtn = document.createElement('div');
    terminalBtn.className = 'terminal-trigger';
    terminalBtn.innerHTML = '<i class="fas fa-terminal"></i>';
    document.body.appendChild(terminalBtn);

    const terminalOverlay = document.createElement('div');
    terminalOverlay.className = 'terminal-overlay';
    terminalOverlay.style.display = 'none';
    terminalOverlay.innerHTML = `
        <div class="terminal-window">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <span class="close"></span>
                    <span class="minimize"></span>
                    <span class="maximize"></span>
                </div>
                <div class="terminal-title">wangpeng@academic: ~</div>
            </div>
            <div class="terminal-body" id="terminal-body">
                <div class="terminal-output">
                    <p>Welcome to Wang Peng's Terminal v1.0.0</p>
                    <p>Type 'help' to see available commands.</p>
                </div>
                <div class="terminal-input-line">
                    <span class="prompt">wangpeng@academic:~$</span>
                    <input type="text" id="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(terminalOverlay);

    // Event Listeners
    terminalBtn.addEventListener('click', () => {
        terminalOverlay.style.display = 'flex';
        document.getElementById('terminal-input').focus();
    });

    terminalOverlay.querySelector('.close').addEventListener('click', () => {
        terminalOverlay.style.display = 'none';
    });

    const input = document.getElementById('terminal-input');
    const output = terminalOverlay.querySelector('.terminal-output');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            handleCommand(command, output);
            input.value = '';
            // Scroll to bottom
            const body = document.getElementById('terminal-body');
            body.scrollTop = body.scrollHeight;
        }
    });
}

function handleCommand(cmd, output) {
    const append = (text, isHtml = false) => {
        const p = document.createElement('div');
        if (isHtml) p.innerHTML = text;
        else p.textContent = text;
        output.appendChild(p);
    };

    append(`wangpeng@academic:~$ ${cmd}`);

    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
        case 'help':
            append('Available commands:');
            append('  help     - Show this help message');
            append('  whoami   - Display user info');
            append('  projects - List research projects');
            append('  contact  - Show contact info');
            append('  clear    - Clear terminal');
            append('  sudo     - Try it if you dare...');
            break;
        case 'whoami':
            append('Wang Peng (王鹏) - Master Student at Shandong University');
            append('Research Interest: Computer Vision, Deep Learning');
            break;
        case 'projects':
            append('1. Fall Detection Algorithm (GLFEE)');
            append('2. Pyramid Network Feature Fusion');
            append('Type "open <id>" to view project page.');
            break;
        case 'contact':
            append('Email: wangpeng@example.com (Replace with real email)');
            append('Github: github.com/wangpeng');
            break;
        case 'clear':
            output.innerHTML = '';
            break;
        case 'sudo':
            // 只要包含 rm -rf 就触发彩蛋，不严格要求 /
            if (args.includes('rm') && args.includes('-rf')) {
                append('WARNING: DELETING SYSTEM FILES...', true);
                setTimeout(() => append('<span style="color:red">Error: Permission denied. Nice try! 😉</span>', true), 1000);
            } else {
                append('sudo: command not found or requires specific arguments');
            }
            break;
        case 'open':
            if (args[1] === '1') {
                window.open('/projects/fall-detection-glfee/', '_blank');
                append('Opening Fall Detection project...');
            } else {
                append('Project not found or ID invalid.');
            }
            break;
        case '':
            break;
        default:
            append(`Command not found: ${command}. Type 'help' for available commands.`);
    }
}

function initSkillGalaxy() {
    const container = document.getElementById('skill-galaxy-container');
    if (!container) return;

    // 显示容器
    container.style.display = 'block';

    try {
        if (!$('#skill-canvas').tagcanvas({
            textColour: '#38bdf8',
            outlineColour: 'transparent',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05,
            initial: [0.1, -0.1],
            wheelZoom: false,
            shape: 'sphere',
            shuffleTags: true,
            noSelect: true,
            textFont: 'Inter, sans-serif',
            textHeight: 20,
            weight: true,
            weightMode: 'both',
            weightSize: 1.0,
            weightGradient: {
                0: '#94a3b8', // 较小的标签颜色
                1: '#38bdf8'  // 较大的标签颜色
            }
        }, 'skill-tags')) {
            // TagCanvas failed to load
            $('#skill-galaxy-container').hide();
        }
    } catch (e) {
        console.error('Failed to init TagCanvas:', e);
        $('#skill-galaxy-container').hide();
    }
}

function observeSkillGalaxy() {
    const container = document.getElementById('skill-galaxy-container');
    if (!container || shouldAvoidHeavyEffects()) return;

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;

        observer.disconnect();
        scheduleIdleTask(async () => {
            try {
                await ensureSkillGalaxyAssets();
                initSkillGalaxy();
            } catch (error) {
                console.error('Failed to load skill galaxy assets:', error);
            }
        }, 1000);
    }, { rootMargin: '200px 0px', threshold: 0.01 });

    observer.observe(container);
}

function bootNeuralBackground() {
    if (shouldAvoidHeavyEffects()) return;

    ensureVantaAssets()
        .then(() => {
            initNeuralBackground();
        })
        .catch((error) => {
            console.error('Failed to load neural background assets:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    observeSkillGalaxy();
    scheduleIdleTask(bootNeuralBackground, 2000);
});

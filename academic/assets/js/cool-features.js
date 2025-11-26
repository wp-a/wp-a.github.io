/**
 * Cool Features for Academic Homepage
 * 1. 3D Neural Network Background (Vanta.js)
 * 2. Terminal Easter Egg
 * 3. Interactive Skill Galaxy (Three.js)
 * 4. Visitor Globe (Globe.gl)
 */

// --- 1. 3D Neural Network Background (Vanta.js) ---
function initNeuralBackground() {
    // 检查是否是移动端，移动端为了性能不加载复杂3D背景
    if (window.innerWidth < 768) return;

    // 确保 Vanta 已加载
    if (typeof VANTA === 'undefined') {
        console.warn('Vanta.js not loaded');
        return;
    }

    try {
        VANTA.NET({
            el: "#bg-animation-container",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x38bdf8,       // 连线颜色 (Light Blue)
            backgroundColor: 0x0f172a, // 背景颜色 (Dark Blue)
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

// --- 2. Terminal Easter Egg ---
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
            if (args[1] === 'rm' && args[2] === '-rf' && args[3] === '/') {
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

// --- 3. Interactive Skill Galaxy (Three.js) ---
// This will be a simplified version using CSS3DObject or just standard DOM manipulation for "planet" tags
// For simplicity and performance, we might use a tag cloud library or custom implementation
// Here we'll implement a simple 3D Tag Cloud
function initSkillGalaxy() {
    const container = document.getElementById('skill-galaxy');
    if (!container) return;

    // TODO: Implement 3D Tag Cloud using Three.js or similar
    // For now, we'll leave this placeholder. 
    // We need to inject the HTML structure first.
    console.log('Skill Galaxy placeholder');
}

// --- 4. Visitor Globe (Globe.gl) ---
function initVisitorGlobe() {
    const container = document.getElementById('visitor-globe');
    if (!container) return;

    if (typeof Globe === 'undefined') {
        console.warn('Globe.gl not loaded');
        return;
    }

    // 生成一些随机数据模拟访客
    const N = 20;
    const arcsData = [...Array(N).keys()].map(() => ({
        startLat: (Math.random() - 0.5) * 180,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 180,
        endLng: (Math.random() - 0.5) * 360,
        color: [['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]]
    }));

    try {
        const world = Globe()
            (container)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .arcsData(arcsData)
            .arcColor('color')
            .arcDashLength(() => Math.random())
            .arcDashGap(() => Math.random())
            .arcDashAnimateTime(() => Math.random() * 4000 + 500)
            .width(container.offsetWidth)
            .height(400)
            .backgroundColor('rgba(0,0,0,0)');

        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.5;

        console.log('Visitor Globe initialized');
    } catch (e) {
        console.error('Failed to init Globe:', e);
    }
}


// Initialize all
document.addEventListener('DOMContentLoaded', () => {
    // Load scripts dynamically if not present
    // But ideally they should be in index.html

    setTimeout(() => {
        initNeuralBackground();
        initTerminal();
        initSkillGalaxy();
        initVisitorGlobe();
    }, 1000); // Delay to ensure libraries are loaded
});

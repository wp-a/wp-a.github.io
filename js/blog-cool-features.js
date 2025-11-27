/**
 * Cool Features for Hexo Blog (Butterfly Theme)
 */

// 1. 3D Tag Cloud in Sidebar
function initSidebarTagCloud() {
    console.log('Initializing Sidebar Tag Cloud...');

    // 尝试多种选择器找到标签卡片的内容容器
    // Butterfly 主题通常是 .card-widget.card-tags .card-tag-cloud
    let tagCard = document.querySelector('.card-widget.card-tags .card-tag-cloud');
    if (!tagCard) {
        tagCard = document.querySelector('.card-tags .card-content');
    }

    if (!tagCard) {
        console.warn('Tag card container not found');
        return;
    }

    // 创建 Canvas 容器
    const canvasId = 'sidebar-tag-canvas';
    // 如果已经存在，就不重复创建
    if (document.getElementById(canvasId)) {
        console.log('Canvas already exists');
        return;
    }

    // 获取原有的标签链接
    const tagsHtml = tagCard.innerHTML;

    // 清空原有内容，替换为 Canvas 和隐藏的标签列表
    // 注意：TagCanvas 需要标签列表在 Canvas 之外或者作为参数
    // 这里我们创建一个隐藏的 div 来存放标签列表
    tagCard.innerHTML = `
        <div id="tag-cloud-container" style="width: 100%; height: 250px;">
            <canvas id="${canvasId}" width="300" height="250" style="width: 100%; height: 100%"></canvas>
        </div>
        <div id="tag-list" style="display: none;">${tagsHtml}</div>
    `;

    // 检查 jQuery
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not loaded');
        return;
    }

    // 确保 TagCanvas 已加载
    if (typeof $.fn.tagcanvas !== 'function') {
        console.warn('TagCanvas plugin not loaded yet, retrying...');
        // 简单的重试机制
        setTimeout(initSidebarTagCloud, 1000);
        return;
    }

    try {
        console.log('Starting TagCanvas...');
        $('#' + canvasId).tagcanvas({
            textColour: null, // 使用原有链接颜色
            outlineColour: 'transparent',
            reverse: true,
            depth: 0.8,
            maxSpeed: 0.05,
            wheelZoom: false,
            shape: 'sphere',
            shuffleTags: true,
            noSelect: true,
            textFont: null, // 使用原有字体
            textHeight: 16, // 稍微调大字体
            weight: true,
            weightMode: 'both',
            weightSize: 1.0,
            initial: [0.1, -0.1]
        }, 'tag-list');
    } catch (e) {
        console.error('Failed to init TagCanvas:', e);
        // 恢复原始内容
        tagCard.innerHTML = tagsHtml;
    }
}

// 2. Terminal Easter Egg (Simplified for Blog)
function initBlogTerminal() {
    // 复用之前的终端逻辑，但样式可能需要微调以适应博客主题
    // 这里为了避免冲突，使用不同的类名前缀
    const terminalBtn = document.createElement('div');
    terminalBtn.className = 'blog-terminal-trigger';
    terminalBtn.innerHTML = '<i class="fas fa-terminal"></i>';
    terminalBtn.style.cssText = `
        position: fixed;
        bottom: 80px; /* 避开返回顶部按钮 */
        left: 20px;
        width: 40px;
        height: 40px;
        background: rgba(30, 41, 59, 0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 999;
        color: #38bdf8;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: transform 0.3s;
    `;

    // 只有在非移动端显示
    if (window.innerWidth > 768) {
        document.body.appendChild(terminalBtn);
    }

    // 点击事件... (简化版，直接跳转到学术主页的终端彩蛋，或者弹出一个简单的提示)
    terminalBtn.addEventListener('click', () => {
        // 这里我们可以简单地弹出一个 SweetAlert 或者直接打开学术主页
        // 为了炫酷，我们还是注入一个简易终端
        createTerminalOverlay();
    });
}

function createTerminalOverlay() {
    if (document.querySelector('.blog-terminal-overlay')) {
        document.querySelector('.blog-terminal-overlay').style.display = 'flex';
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'blog-terminal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    overlay.innerHTML = `
        <div style="width: 600px; height: 400px; background: #1e293b; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="height: 30px; background: #0f172a; display: flex; align-items: center; padding: 0 10px;">
                <div style="display: flex; gap: 6px;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56; cursor: pointer;" onclick="this.closest('.blog-terminal-overlay').style.display='none'"></span>
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e;"></span>
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></span>
                </div>
                <div style="flex: 1; text-align: center; color: #94a3b8; font-size: 12px;">wangpeng@blog: ~</div>
            </div>
            <div style="flex: 1; padding: 15px; color: #38bdf8; font-family: monospace; overflow-y: auto;" id="blog-term-body">
                <p>Welcome to Wang Peng's Blog Terminal.</p>
                <p>Type 'help' for commands.</p>
                <div style="display: flex; margin-top: 10px;">
                    <span style="margin-right: 8px;">wangpeng@blog:~$</span>
                    <input type="text" id="blog-term-input" style="flex: 1; background: transparent; border: none; color: #e2e8f0; outline: none; font-family: inherit;">
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const input = document.getElementById('blog-term-input');
    input.focus();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            const output = document.getElementById('blog-term-body');
            const p = document.createElement('div');
            p.textContent = `wangpeng@blog:~$ ${cmd}`;
            output.insertBefore(p, input.parentElement);

            // 处理命令
            handleBlogCommand(cmd, output, input.parentElement);

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });
}

function handleBlogCommand(cmd, output, inputLine) {
    const append = (text, html = false) => {
        const div = document.createElement('div');
        if (html) div.innerHTML = text;
        else div.textContent = text;
        output.insertBefore(div, inputLine);
    };

    const args = cmd.split(' ');

    if (cmd === 'help') {
        append('Available commands: help, home, academic, about, clear');
    } else if (cmd === 'home') {
        window.location.href = '/';
    } else if (cmd === 'academic') {
        window.location.href = '/academic/';
    } else if (cmd === 'about') {
        window.location.href = '/about/';
    } else if (cmd === 'clear') {
        // 清除除了 input line 之外的所有内容
        // 这里简化处理，只保留最后几个
    } else if (args.includes('rm') && args.includes('-rf')) {
        append('⚠️ DANGER: Do not try this at home!', true);
    } else if (cmd !== '') {
        append(`Command not found: ${cmd}`);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟执行，等待 jQuery 和 DOM 就绪
    setTimeout(() => {
        initSidebarTagCloud();
        initBlogTerminal();
    }, 1000);

    // Pjax 支持 (如果博客使用了 Pjax)
    document.addEventListener('pjax:complete', () => {
        setTimeout(() => {
            initSidebarTagCloud();
        }, 500);
    });
});

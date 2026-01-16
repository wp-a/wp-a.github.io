/**
 * Cool Features for Hexo Blog (Butterfly Theme)
 */

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
    // 延迟执行，等待 DOM 就绪
    setTimeout(() => {
        initBlogTerminal();
    }, 1000);

    // Pjax 支持 (如果博客使用了 Pjax)
    document.addEventListener('pjax:complete', () => {
        setTimeout(() => {
            // initSidebarTagCloud(); // Removed
        }, 500);
    });
});

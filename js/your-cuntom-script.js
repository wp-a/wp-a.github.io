// source/js/your-custom-script.js

(() => {
    // 你现有的 JavaScript 代码 (CountUp, GSAP 等)
    // ... (之前回复中优化后的 JavaScript 代码) ...

    // 示例：如果你需要在 Pjax 加载后重新初始化某些内容：
    document.addEventListener('pjax:complete', () => {
      // 重新初始化 CountUp、GSAP 动画等。
      // 你可能需要销毁并重新创建实例。
      initCountUp(); // 假设你有这样一个函数
      initGsapAnimations();

    });


    // CountUp 初始化函数 (从内联脚本中移出)
    function initCountUp() {
        fetch('https://v6-widget.51.la/v6/{3LBntowT7EmP3WHU}/quote.js') // 替换成你的 ID
            .then(res => res.text())
            .then(data => {
                const title = ['最近活跃', '今日人数', '今日访问', '昨日人数', '昨日访问', '本月访问', '总访问量'];
                const num = data.match(/(<\/span><span>).*?(\/span><\/p>)/g).map(el => el.replace(/<\/?span>|<\/?p>/g, ''));
                const statisticEl = document.getElementById('statistic');
                if (!statisticEl) return;

                const statistic = [];
                for (let i = 1; i < num.length - 1; i++) {
                    statisticEl.innerHTML += `<div><span>${title[i]}</span><span id="${title[i]}">${num[i]}</span></div>`;
                     const countUpInstance = new CountUp(title[i], 0, num[i], 0, 2, {
                        useEasing: true,
                        useGrouping: true,
                        separator: ',',
                     });
                    statistic.push(countUpInstance);
                 }

                // 在视图中时启动 CountUp 动画。使用简单的检查。
                function animateCountUp() {
                    const statisticElment = document.querySelector('.about-statistic.author-content-item');
                    if (isInViewPort(statisticElment)) {  // 使用辅助函数
                        statistic.forEach(instance => instance.start());
                         document.removeEventListener('scroll', animateCountUp); // 触发后移除监听器
                    }
                }
                document.addEventListener('scroll', animateCountUp);

            })
            .catch(error => console.error('获取 51.la 数据时出错:', error));


        // 初始化年份的 CountUp
        const selfInfoContentYear = new CountUp('selfInfo-content-year', 0, 2001, 0, 2, {
            useEasing: true,
            useGrouping: false,
        });

        function scrollSelfInfoContentYear() {
            const selfInfoContentYearElment = document.querySelector('.author-content-item.selfInfo.single');
            if (isInViewPort(selfInfoContentYearElment)) { // 使用辅助函数
                selfInfoContentYear.start();
                document.removeEventListener('scroll', scrollSelfInfoContentYear); // 触发后移除
            }
        }
        document.addEventListener('scroll', scrollSelfInfoContentYear);
    }



     // 文本动画间隔 (使用改进后的 mask)
     // 如果你使用 CSS 动画，这里不需要更改

    // 使用 GSAP 的鼠标移动动画 (无需更改)
    const helloAboutEl = document.querySelector('.hello-about');
    if (helloAboutEl){
        helloAboutEl.addEventListener('mousemove', evt => {
          const mouseX = evt.offsetX;
          const mouseY = evt.offsetY;
          gsap.set('.cursor', { x: mouseX, y: mouseY });
          gsap.to('.shape', { x: mouseX, y: mouseY, stagger: -0.1 });
        });
    }

    // 用于检查元素是否在视口中的辅助函数 (简化)
    function isInViewPort(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
    }

    // 调用初始化
    initCountUp();
    // initGsapAnimations(); // 如果你有要初始化的 GSAP 动画

    // 赞赏按钮逻辑 (使用之前回复中的简化版本)
    const rewardButton = document.querySelector('.reward-button');
    const rewardMain = document.querySelector('.reward-main');
    const wechatImgSrc = 'https://wpironman.oss-cn-qingdao.aliyuncs.com/20250208233652040.JPG';

    if (rewardButton) { // 检查按钮是否存在
        rewardButton.addEventListener('click', function(e) {
            e.stopPropagation();
            rewardMain.classList.toggle('active');
            this.classList.add('coin-animate'); // 添加动画类
            setTimeout(() => this.classList.remove('coin-animate'), 1000);
            ensureQrCodeImages(); // 确保图片已加载
      });
    }
    // 点击外部关闭
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.reward-main') && !e.target.closest('.reward-button')) {
            rewardMain.classList.remove('active');
        }
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            rewardMain.classList.remove('active');
        }
    });

    // 确保加载二维码图片的函数
    function ensureQrCodeImages() {
        const wechatQrCode = document.querySelector('.reward-item [alt="微信赞赏"]');
        // const alipayQrCode = ...  (如果你添加支付宝)

        if (!wechatQrCode) {
            const wechatImg = document.createElement('img');
            wechatImg.src = wechatImgSrc;
            wechatImg.alt = '微信赞赏';
            wechatImg.classList.add('post-qr-code-img');
            document.querySelector('.reward-item:first-child a').appendChild(wechatImg);
        }
    }
})();
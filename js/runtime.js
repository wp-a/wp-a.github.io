function updateRuntime() {
    const startTime = new Date('2025/01/22 00:00:00');
    const currentTime = new Date();
    const runTime = currentTime - startTime;
    const days = Math.floor(runTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((runTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((runTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((runTime % (1000 * 60)) / 1000);
    
    // 处理倒计时显示
    if (runTime < 0) {
        const absRunTime = Math.abs(runTime);
        const absDays = Math.floor(absRunTime / (1000 * 60 * 60 * 24));
        const absHours = Math.floor((absRunTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const absMinutes = Math.floor((absRunTime % (1000 * 60 * 60)) / (1000 * 60));
        const absSeconds = Math.floor((absRunTime % (1000 * 60)) / 1000);
        
        document.getElementById('runtime').innerHTML = `距离网站正式上线还有: ${absDays} 天 ${absHours} 小时 ${absMinutes} 分 ${absSeconds} 秒`;
    } else {
        document.getElementById('runtime').innerHTML = `本站已运行 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
    }
}

// 减少更新频率，从1秒改为60秒
setInterval(updateRuntime, 60000);
// 页面加载时执行一次
updateRuntime(); 
function updateRuntime() {
    const startTime = new Date('2025/01/22 00:00:00');  // 修改为与站点设置一致的2025年开始时间
    const currentTime = new Date();
    const runTime = currentTime - startTime;
    const days = Math.floor(runTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((runTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((runTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((runTime % (1000 * 60)) / 1000);

    document.getElementById('runtime').innerHTML = `本站已运行 ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
}

// 每秒更新一次
setInterval(updateRuntime, 1000);
// 页面加载时立即执行一次
updateRuntime(); 
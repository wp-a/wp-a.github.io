// 赞赏按钮功能
const rewardBtn = document.querySelector('.reward-button');
if (rewardBtn) {
  rewardBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const rewardMain = document.querySelector('.reward-main');
    
    // 切换激活状态
    if (rewardMain) {
      rewardMain.classList.toggle('active');
      // 兼容旧版 style.display 逻辑
      rewardMain.style.display = rewardMain.classList.contains('active') ? 'block' : 'none';
    }
    
    // 硬币动画优化
    this.classList.add('coin-animate');
    setTimeout(() => {
      this.classList.remove('coin-animate');
      this.style.transform = 'none';
    }, 1000);
  });

  // 点击外部关闭
  document.addEventListener('click', (e) => {
    const rewardMain = document.querySelector('.reward-main');
    if (rewardMain && !e.target.closest('.reward-main') && !e.target.closest('.reward-button')) {
      rewardMain.classList.remove('active');
      rewardMain.style.display = 'none';
    }
  });

  // ESC键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const rewardMain = document.querySelector('.reward-main');
      if (rewardMain) {
        rewardMain.classList.remove('active');
        rewardMain.style.display = 'none';
      }
    }
  });
}

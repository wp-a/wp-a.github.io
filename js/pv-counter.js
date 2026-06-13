(function () {
  'use strict';

  const loadPv = () => {
    const pvEl = document.getElementById('my-pv');
    if (!pvEl) return;

    fetch('https://wpironman.top/pv')
      .then(res => res.json())
      .then(data => {
        pvEl.textContent = data.pv;
      })
      .catch(() => {
        pvEl.textContent = '获取失败';
      });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPv);
  } else {
    loadPv();
  }

  document.addEventListener('pjax:complete', loadPv);
})();

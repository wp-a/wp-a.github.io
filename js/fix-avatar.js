// 修复 Valine 头像加载失败，替换为 Cravatar 国内源
(function () {
  'use strict';

  const replaceAvatar = (img) => {
    if (!img || !img.src) return;
    if (img.src.includes('gravatar.com')) {
      img.src = img.src.replace('gravatar.com', 'cravatar.cn');
    }
  };

  const scan = (root) => {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.vimg').forEach(replaceAvatar);
  };

  const handleNode = (node) => {
    if (!node || node.nodeType !== 1) return;
    if (node.classList && node.classList.contains('vimg')) {
      replaceAvatar(node);
      return;
    }
    scan(node);
  };

  let observer;

  const startObserver = () => {
    const target = document.getElementById('vcomment') || document.querySelector('.v') || document.body;
    if (!target) return;

    scan(target);

    if (!observer) {
      observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
          if (mutation.type !== 'childList') return;
          mutation.addedNodes.forEach(handleNode);
        });
      });
    } else {
      observer.disconnect();
    }

    observer.observe(target, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  document.addEventListener('pjax:complete', startObserver);
})();

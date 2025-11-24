// 修复 Valine 头像加载失败，替换为 Cravatar 国内源
const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const imgs = document.querySelectorAll('.vimg');
      imgs.forEach((img) => {
        // 检查是否是 gravatar 且未被替换过
        if (img.src.includes('gravatar.com')) {
          img.src = img.src.replace('gravatar.com', 'cravatar.cn');
        }
      });
    }
  });
});

const targetNode = document.querySelector('body');
if (targetNode) {
  observer.observe(targetNode, { childList: true, subtree: true });
}

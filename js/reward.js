// function reward(){
//     Swal.fire({
//       title: '<strong>您正在为 <u>Peach</u> 充电</strong>',
//       html: '<b>请选择您的付款方式</b>',
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonText:
//         '<i class="fa-brands fa-alipay"></i> 支付宝',
//       cancelButtonText:
//         '<i class="fa-brands fa-weixin"></i> 微信支付',
//       confirmButtonColor: '#1677FF',
//       cancelButtonColor: '#2AAE67',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: '感谢您',
//           html: '请打开支付宝 <b>[扫一扫]</b> 以充电',
//           imageUrl: 'https://wpironman.oss-cn-qingdao.aliyuncs.com/20250208230357793.JPG',
//           imageWidth: 175,
//           imageHeight: 175,
//           imageAlt: 'Custom image'
//         }).then((result) => {
//           Swal.fire(
//             '充电成功',
//             '感谢您的支持',
//             'success'
//           )
//         })
//       } else if (
//         result.dismiss === Swal.DismissReason.cancel
//       ) {
//         Swal.fire({
//           title: '感谢您',
//           html: '请打开微信 <b>[扫一扫]</b> 以充电',
//           imageUrl: 'https://wpironman.oss-cn-qingdao.aliyuncs.com/20250208230357793.JPG',
//           imageWidth: 175,
//           imageHeight: 175,
//           imageAlt: 'Custom image'
//         }).then((result) => {
//           Swal.fire(
//             '充电成功',
//             '感谢您的支持',
//             'success'
//           )
//         })
//       }
//     })
//   }
// 赞赏按钮功能
document.querySelector('.reward-button').addEventListener('click', function(e) {
    e.preventDefault();
    const rewardMain = document.querySelector('.reward-main');
    
    // 显隐切换逻辑
    rewardMain.style.display = rewardMain.style.display === 'block' ? 'none' : 'block';
    
    // 硬币动画
    this.classList.add('active');
    setTimeout(() => this.classList.remove('active'), 1000);
    
    // 动态加载二维码图片（可选）
    if (!document.querySelector('.reward-item img')) {
      const wechatImg = document.createElement('img');
      wechatImg.src = '你的微信二维码地址';
      document.querySelector('.reward-item:first-child').appendChild(wechatImg);
      
      const alipayImg = document.createElement('img'); 
      alipayImg.src = '你的支付宝二维码地址';
      document.querySelector('.reward-item:last-child').appendChild(alipayImg);
    }
  });

// 修改原有点击事件
document.querySelector('.reward-button').addEventListener('click', function(e) {
    e.stopPropagation();
    const rewardMain = document.querySelector('.reward-main');
    
    // 切换激活状态
    rewardMain.classList.toggle('active');
    
    // 硬币动画优化
    this.classList.add('coin-animate');
    setTimeout(() => {
      this.classList.remove('coin-animate');
      this.style.transform = 'none';
    }, 1000);
  });
  
  // 点击外部关闭
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.reward-main') && !e.target.closest('.reward-button')) {
      document.querySelector('.reward-main').classList.remove('active');
    }
  });
  
  // ESC键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('.reward-main').classList.remove('active');
    }
  });

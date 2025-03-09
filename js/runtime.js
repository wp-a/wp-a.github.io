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

// 优化文章发布统计图
function optimizePostChart() {
  const postChart = echarts.init(document.getElementById('post-chart'));
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 篇文章'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        interval: 0,
        rotate: 30 // 旋转标签，避免重叠
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '文章数量',
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(55, 162, 255, 0.8)'
        }, {
          offset: 1,
          color: 'rgba(116, 21, 219, 0.3)'
        }])
      },
      emphasis: {
        focus: 'series'
      },
      itemStyle: {
        color: '#3778FF'
      }
    }]
  };
  
  postChart.setOption(option);
  window.addEventListener('resize', () => postChart.resize());
} 
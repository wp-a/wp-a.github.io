/**
 * 博客统计页面增强脚本
 * 实现视觉美观性、功能扩展和性能优化
 */

// 使用IntersectionObserver实现懒加载
const observers = [];
const chartInitFunctions = new Map();
let chartsData = null;
let darkMode = false;

// 主题配色方案
const colorSchemes = {
  light: {
    primary: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#FFC107', '#607D8B'],
    areaGradient: [
      { offset: 0, color: 'rgba(55, 162, 255, 0.8)' },
      { offset: 1, color: 'rgba(116, 21, 219, 0.3)' }
    ],
    pieGradient: [
      { offset: 0, color: '#58B8EB' },
      { offset: 1, color: '#5673ED' }
    ],
    textColor: '#303133',
    axisColor: '#909399',
    splitLineColor: '#EBEEF5'
  },
  dark: {
    primary: ['#67C23A', '#409EFF', '#E6A23C', '#F56C6C', '#909399', '#9B67E3', '#19CAAD', '#34B3F1', '#FFD700', '#A0DDFF'],
    areaGradient: [
      { offset: 0, color: 'rgba(64, 158, 255, 0.8)' },
      { offset: 1, color: 'rgba(155, 103, 227, 0.3)' }
    ],
    pieGradient: [
      { offset: 0, color: '#409EFF' },
      { offset: 1, color: '#9B67E3' }
    ],
    textColor: '#E6E6E6',
    axisColor: '#909399',
    splitLineColor: '#383838'
  }
};

// 初始化统计页面
function initStatistics() {
  // 检测暗黑模式
  darkMode = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // 获取统计数据
  fetchStatisticsData().then(() => {
    // 注册所有图表
    registerCharts();
    
    // 设置懒加载
    setupLazyLoading();
    
    // 监听暗黑模式变化
    setupDarkModeListener();
    
    // 设置交互功能
    setupInteractions();
  });
}

// 从缓存或服务器获取统计数据
async function fetchStatisticsData() {
  // 尝试从sessionStorage获取缓存数据
  const cachedData = sessionStorage.getItem('blog_statistics_data');
  if (cachedData) {
    try {
      chartsData = JSON.parse(cachedData);
      return;
    } catch (e) {
      console.error('统计数据缓存解析错误', e);
    }
  }
  
  // 如果没有缓存，从页面元素收集数据
  chartsData = {
    posts: collectPostsData(),
    tags: collectTagsData(),
    categories: collectCategoriesData(),
    readingStats: collectReadingStats()
  };
  
  // 缓存到sessionStorage
  sessionStorage.setItem('blog_statistics_data', JSON.stringify(chartsData));
}

// 收集文章数据
function collectPostsData() {
  // 这里应该根据你的页面结构收集数据
  // 示例数据
  return {
    dates: getMonthlyDates(),
    counts: [4, 6, 8, 10, 12, 11, 9, 7, 6, 4, 3, 2],
    total: 82
  };
}

// 生成最近12个月的日期标签
function getMonthlyDates() {
  const months = [];
  const date = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(date);
    d.setMonth(d.getMonth() - i);
    months.push(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2));
  }
  return months;
}

// 收集标签数据
function collectTagsData() {
  // 示例数据
  return {
    names: ['数据结构与算法', '递归', '二叉树遍历', '数组', '查找', '字符串', '堆', '哈希表', '双端队列', '双指针'],
    counts: [19, 6, 5, 4, 3, 3, 3, 3, 3, 3]
  };
}

// 收集分类数据
function collectCategoriesData() {
  // 示例数据
  return {
    names: ['算法', '数据结构', '编程基础', '前端开发', '后端开发'],
    counts: [25, 20, 15, 10, 8]
  };
}

// 收集阅读统计数据
function collectReadingStats() {
  // 示例数据
  return {
    totalWords: 150000,
    avgWordsPerPost: 1829,
    readingTime: {
      labels: ['<5分钟', '5-10分钟', '10-20分钟', '20-30分钟', '>30分钟'],
      data: [15, 25, 30, 10, 2]
    }
  };
}

// 注册所有图表
function registerCharts() {
  // 注册文章发布统计图表
  chartInitFunctions.set('post-chart', initPostChart);
  
  // 注册标签统计图表
  chartInitFunctions.set('tag-chart', initTagChart);
  
  // 注册分类统计图表
  chartInitFunctions.set('category-chart', initCategoryChart);
  
  // 注册阅读统计图表
  chartInitFunctions.set('reading-chart', initReadingChart);
  
  // 注册文章字数分布图表
  chartInitFunctions.set('words-chart', initWordsDistributionChart);
}

// 设置懒加载
function setupLazyLoading() {
  const chartContainers = document.querySelectorAll('.chart-container');
  
  // 如果浏览器支持IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chartId = entry.target.id;
          const initFunction = chartInitFunctions.get(chartId);
          
          if (initFunction) {
            initFunction();
            // 初始化后解除观察
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1 });
    
    chartContainers.forEach(container => {
      observer.observe(container);
    });
    
    observers.push(observer);
  } else {
    // 降级处理：立即初始化所有图表
    chartContainers.forEach(container => {
      const chartId = container.id;
      const initFunction = chartInitFunctions.get(chartId);
      if (initFunction) {
        initFunction();
      }
    });
  }
}

// 监听暗黑模式变化
function setupDarkModeListener() {
  // 监听暗黑模式变化并更新图表
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        const newTheme = document.documentElement.getAttribute('data-theme');
        darkMode = newTheme === 'dark';
        
        // 重新渲染所有已初始化的图表
        chartInitFunctions.forEach((initFunc, chartId) => {
          const chartElement = document.getElementById(chartId);
          if (chartElement && chartElement.__chart_initialized) {
            initFunc();
          }
        });
      }
    });
  });
  
  observer.observe(document.documentElement, { attributes: true });
  observers.push(observer);
}

// 设置交互功能
function setupInteractions() {
  // 添加图表类型切换按钮
  const chartTypeButtons = document.querySelectorAll('.chart-type-switch');
  chartTypeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const chartId = e.target.getAttribute('data-chart');
      const chartType = e.target.getAttribute('data-type');
      
      // 更新按钮状态
      const buttons = document.querySelectorAll(`.chart-type-switch[data-chart="${chartId}"]`);
      buttons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      // 重新渲染图表
      const initFunction = chartInitFunctions.get(chartId);
      if (initFunction) {
        initFunction(chartType);
      }
    });
  });
}

// 初始化文章发布统计图表
function initPostChart(chartType = 'line') {
  const chartContainer = document.getElementById('post-chart');
  if (!chartContainer) return;
  
  const chart = echarts.init(chartContainer);
  chartContainer.__chart_initialized = true;
  
  const colors = darkMode ? colorSchemes.dark : colorSchemes.light;
  
  const option = {
    title: {
      text: '文章发布统计图',
      left: 'center',
      textStyle: {
        color: colors.textColor
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 篇文章',
      axisPointer: {
        type: 'shadow'
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: '保存为图片' }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartsData.posts.dates,
      axisLabel: {
        interval: 0,
        rotate: 30,
        color: colors.axisColor
      },
      axisLine: {
        lineStyle: {
          color: colors.axisColor
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: colors.splitLineColor
        }
      },
      axisLabel: {
        color: colors.axisColor
      }
    },
    series: [{
      name: '文章数量',
      type: chartType,
      data: chartsData.posts.counts,
      smooth: true,
      showSymbol: chartType === 'line',
      symbolSize: 6,
      areaStyle: chartType === 'line' ? {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, colors.areaGradient)
      } : undefined,
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        color: colors.primary[0]
      }
    }]
  };
  
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
}

// 初始化标签统计图表
function initTagChart(chartType = 'bar') {
  const chartContainer = document.getElementById('tag-chart');
  if (!chartContainer) return;
  
  const chart = echarts.init(chartContainer);
  chartContainer.__chart_initialized = true;
  
  const colors = darkMode ? colorSchemes.dark : colorSchemes.light;
  
  const option = {
    title: {
      text: 'Top 10 标签统计图',
      left: 'center',
      textStyle: {
        color: colors.textColor
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: '保存为图片' }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: chartType === 'bar' ? 'category' : 'value',
      data: chartType === 'bar' ? chartsData.tags.names : undefined,
      axisLabel: {
        interval: 0,
        rotate: 45,
        color: colors.axisColor
      },
      axisLine: {
        lineStyle: {
          color: colors.axisColor
        }
      }
    },
    yAxis: {
      type: chartType === 'bar' ? 'value' : 'category',
      data: chartType === 'bar' ? undefined : chartsData.tags.names,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: colors.splitLineColor
        }
      },
      axisLabel: {
        color: colors.axisColor
      }
    },
    series: [{
      name: '文章数量',
      type: chartType,
      data: chartsData.tags.counts.map((value, index) => {
        return {
          value: value,
          name: chartsData.tags.names[index],
          itemStyle: {
            color: colors.primary[index % colors.primary.length]
          }
        };
      }),
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
  
  // 添加点击事件支持
  chart.on('click', function(params) {
    if (params.componentType === 'series') {
      // 跳转到标签页
      const tagName = params.name;
      const tagUrl = `/tags/${tagName}/`;
      window.location.href = tagUrl;
    }
  });
}

// 初始化分类统计图表
function initCategoryChart(chartType = 'pie') {
  const chartContainer = document.getElementById('category-chart');
  if (!chartContainer) return;
  
  const chart = echarts.init(chartContainer);
  chartContainer.__chart_initialized = true;
  
  const colors = darkMode ? colorSchemes.dark : colorSchemes.light;
  
  let option;
  
  if (chartType === 'pie') {
    option = {
      title: {
        text: '文章分类统计图',
        left: 'center',
        textStyle: {
          color: colors.textColor
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true, title: '保存为图片' }
        }
      },
      legend: {
        orient: 'vertical',
        left: 10,
        textStyle: {
          color: colors.textColor
        }
      },
      series: [{
        name: '文章分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chartsData.categories.names.map((name, index) => {
          return {
            value: chartsData.categories.counts[index],
            name: name,
            itemStyle: {
              color: colors.primary[index % colors.primary.length]
            }
          };
        })
      }]
    };
  } else {
    option = {
      title: {
        text: '文章分类统计图',
        left: 'center',
        textStyle: {
          color: colors.textColor
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true, title: '保存为图片' }
        }
      },
      xAxis: {
        type: 'category',
        data: chartsData.categories.names,
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: colors.axisColor
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: colors.splitLineColor
          }
        },
        axisLabel: {
          color: colors.axisColor
        }
      },
      series: [{
        name: '文章数量',
        type: 'bar',
        data: chartsData.categories.counts.map((value, index) => {
          return {
            value: value,
            itemStyle: {
              color: colors.primary[index % colors.primary.length]
            }
          };
        }),
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }
  
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
  
  // 添加点击事件支持
  chart.on('click', function(params) {
    if (params.componentType === 'series') {
      // 跳转到分类页
      const categoryName = params.name;
      const categoryUrl = `/categories/${categoryName}/`;
      window.location.href = categoryUrl;
    }
  });
}

// 初始化阅读统计图表
function initReadingChart(chartType = 'radar') {
  const chartContainer = document.getElementById('reading-chart');
  if (!chartContainer) return;
  
  const chart = echarts.init(chartContainer);
  chartContainer.__chart_initialized = true;
  
  const colors = darkMode ? colorSchemes.dark : colorSchemes.light;
  
  let option;
  
  if (chartType === 'radar') {
    option = {
      title: {
        text: '阅读时间分布',
        left: 'center',
        textStyle: {
          color: colors.textColor
        }
      },
      tooltip: {
        trigger: 'item'
      },
      radar: {
        indicator: chartsData.readingStats.readingTime.labels.map(label => {
          return { name: label, max: Math.max(...chartsData.readingStats.readingTime.data) * 1.2 };
        }),
        splitArea: {
          areaStyle: {
            color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)']
          }
        },
        axisName: {
          color: colors.textColor
        }
      },
      series: [{
        name: '阅读时间分布',
        type: 'radar',
        data: [{
          value: chartsData.readingStats.readingTime.data,
          name: '文章数量',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, colors.areaGradient)
          }
        }]
      }]
    };
  } else {
    option = {
      title: {
        text: '阅读时间分布',
        left: 'center',
        textStyle: {
          color: colors.textColor
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 篇文章'
      },
      xAxis: {
        type: 'category',
        data: chartsData.readingStats.readingTime.labels,
        axisLabel: {
          color: colors.axisColor
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: colors.splitLineColor
          }
        },
        axisLabel: {
          color: colors.axisColor
        }
      },
      series: [{
        name: '文章数量',
        type: 'bar',
        data: chartsData.readingStats.readingTime.data.map((value, index) => {
          return {
            value: value,
            itemStyle: {
              color: colors.primary[index % colors.primary.length]
            }
          };
        })
      }]
    };
  }
  
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
}

// 初始化文章字数分布图表
function initWordsDistributionChart() {
  const chartContainer = document.getElementById('words-chart');
  if (!chartContainer) return;
  
  const chart = echarts.init(chartContainer);
  chartContainer.__chart_initialized = true;
  
  const colors = darkMode ? colorSchemes.dark : colorSchemes.light;
  
  // 生成字数区间数据
  const wordsData = generateWordsDistribution();
  
  const option = {
    title: {
      text: '文章字数分布',
      left: 'center',
      textStyle: {
        color: colors.textColor
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 篇文章'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: '保存为图片' }
      }
    },
    xAxis: {
      type: 'category',
      data: wordsData.labels,
      axisLabel: {
        color: colors.axisColor
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: colors.splitLineColor
        }
      },
      axisLabel: {
        color: colors.axisColor
      }
    },
    series: [{
      name: '文章数量',
      type: 'bar',
      data: wordsData.data.map((value, index) => {
        return {
          value: value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.primary[index % colors.primary.length] },
              { offset: 1, color: colors.primary[(index + 2) % colors.primary.length] }
            ])
          }
        };
      }),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
}

// 生成字数分布数据
function generateWordsDistribution() {
  // 这里应根据实际情况生成
  return {
    labels: ['<500字', '500-1000字', '1000-2000字', '2000-3000字', '3000-5000字', '>5000字'],
    data: [5, 12, 25, 20, 15, 5]
  };
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initStatistics);

// 在页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  observers.forEach(observer => observer.disconnect());
}); 
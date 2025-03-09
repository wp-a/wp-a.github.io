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
  try {
    // 从页面中获取文章数据
    const articles = document.querySelectorAll('.article-sort-item');
    
    // 按年月统计文章数量
    const countByMonth = {};
    const dates = [];
    const counts = [];
    
    // 获取页面上所有的日期数据
    articles.forEach(article => {
      const dateElement = article.querySelector('.article-sort-item-time');
      if (dateElement) {
        const dateText = dateElement.textContent.trim();
        const dateMatch = dateText.match(/(\d{4})-(\d{2})-\d{2}/);
        
        if (dateMatch) {
          const yearMonth = `${dateMatch[1]}-${dateMatch[2]}`;
          countByMonth[yearMonth] = (countByMonth[yearMonth] || 0) + 1;
        }
      }
    });
    
    // 如果页面上没有找到文章日期，从URL获取
    if (Object.keys(countByMonth).length === 0) {
      const articleLinks = document.querySelectorAll('a[href*="/20"]');
      articleLinks.forEach(link => {
        const href = link.getAttribute('href');
        const dateMatch = href.match(/\/(\d{4})\/(\d{2})\//);
        
        if (dateMatch) {
          const yearMonth = `${dateMatch[1]}-${dateMatch[2]}`;
          countByMonth[yearMonth] = (countByMonth[yearMonth] || 0) + 1;
        }
      });
    }
    
    // 按时间排序
    const sortedMonths = Object.keys(countByMonth).sort();
    
    // 取最近12个月或全部（如果少于12个月）
    const monthsToShow = sortedMonths.length > 12 ? sortedMonths.slice(-12) : sortedMonths;
    
    monthsToShow.forEach(month => {
      dates.push(month);
      counts.push(countByMonth[month]);
    });
    
    // 如果没有找到任何数据，使用站点开始时间生成日期范围
    if (dates.length === 0) {
      // 站点开始时间：2025年1月
      const startDate = new Date(2025, 0, 1); // 月份从0开始，所以1月是0
      const endDate = new Date();
      
      // 计算月份差
      let monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
      monthDiff = Math.max(monthDiff, 0); // 确保不是负数
      monthDiff = Math.min(monthDiff, 11); // 最多显示12个月
      
      // 生成从2025年1月开始的月份数据
      for (let i = 0; i <= monthDiff; i++) {
        const d = new Date(startDate);
        d.setMonth(startDate.getMonth() + i);
        const month = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
        dates.push(month);
        counts.push(0);
      }
      
      // 如果少于3个月的数据，添加额外的月份
      if (dates.length < 3) {
        const lastDate = new Date(dates[dates.length - 1].split('-')[0], parseInt(dates[dates.length - 1].split('-')[1]) - 1);
        for (let i = 1; i <= 3 - dates.length; i++) {
          const d = new Date(lastDate);
          d.setMonth(lastDate.getMonth() + i);
          const month = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;
          dates.push(month);
          counts.push(0);
        }
      }
    }
    
    return {
      dates: dates,
      counts: counts,
      total: articles.length || document.querySelectorAll('.article-sort-item, article.post').length
    };
  } catch (e) {
    console.error('Error collecting posts data:', e);
    // 返回基于站点开始时间的数据
    return {
      dates: getMonthsFromStart(2025, 1, 12), // 从2025年1月开始，生成12个月
      counts: Array(12).fill(0),
      total: 0
    };
  }
}

// 生成指定开始年月的月份数组
function getMonthsFromStart(startYear, startMonth, count) {
  const months = [];
  for (let i = 0; i < count; i++) {
    const year = startYear + Math.floor((startMonth - 1 + i) / 12);
    const month = ((startMonth - 1 + i) % 12) + 1;
    months.push(`${year}-${('0' + month).slice(-2)}`);
  }
  return months;
}

// 生成最近12个月的日期标签（替换为基于站点开始时间的版本）
function getMonthlyDates() {
  return getMonthsFromStart(2025, 1, 12); // 从2025年1月开始，生成12个月
}

// 收集标签数据
function collectTagsData() {
  try {
    const tags = {};
    const tagElements = document.querySelectorAll('.tag-cloud-tags a, .card-tag-cloud a');
    
    tagElements.forEach(tag => {
      const tagName = tag.textContent.trim();
      // 尝试从样式中提取文章数量
      const style = tag.getAttribute('style');
      let size = 1;
      
      if (style && style.includes('font-size')) {
        const sizeMatch = style.match(/font-size:\s*(\d+\.?\d*)px/);
        if (sizeMatch && sizeMatch[1]) {
          // 根据字体大小估算文章数量
          size = Math.max(1, Math.round((parseFloat(sizeMatch[1]) - 10) / 2));
        }
      }
      
      tags[tagName] = (tags[tagName] || 0) + size;
    });
    
    // 如果页面上没有找到标签，尝试从文章中收集
    if (Object.keys(tags).length === 0) {
      const articleTags = document.querySelectorAll('.article-meta-tag, .article-tag-list-item, .article-tag');
      articleTags.forEach(tag => {
        const tagName = tag.textContent.trim();
        if (tagName && tagName !== '标签') {
          tags[tagName] = (tags[tagName] || 0) + 1;
        }
      });
    }
    
    // 排序并获取前10个标签
    const sortedTags = Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return {
      names: sortedTags.map(tag => tag[0]),
      counts: sortedTags.map(tag => tag[1])
    };
  } catch (e) {
    console.error('Error collecting tags data:', e);
    return {
      names: [],
      counts: []
    };
  }
}

// 收集分类数据
function collectCategoriesData() {
  try {
    const categories = {};
    const categoryElements = document.querySelectorAll('.category-list-link, .aside-category-item a');
    
    categoryElements.forEach(category => {
      const categoryName = category.textContent.trim().split(' ')[0]; // 移除计数部分
      let count = 1;
      
      // 尝试从文本中提取计数
      const countMatch = category.textContent.trim().match(/\((\d+)\)/);
      if (countMatch && countMatch[1]) {
        count = parseInt(countMatch[1]);
      }
      
      categories[categoryName] = (categories[categoryName] || 0) + count;
    });
    
    // 如果页面上没有找到分类，尝试从文章中收集
    if (Object.keys(categories).length === 0) {
      const articleCategories = document.querySelectorAll('.article-meta-category, .article-category');
      articleCategories.forEach(category => {
        const categoryName = category.textContent.trim();
        if (categoryName && categoryName !== '分类') {
          categories[categoryName] = (categories[categoryName] || 0) + 1;
        }
      });
    }
    
    // 排序分类
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1]);
    
    return {
      names: sortedCategories.map(category => category[0]),
      counts: sortedCategories.map(category => category[1])
    };
  } catch (e) {
    console.error('Error collecting categories data:', e);
    return {
      names: [],
      counts: []
    };
  }
}

// 收集阅读统计数据
function collectReadingStats() {
  try {
    // 尝试获取总字数统计
    let totalWords = 0;
    const totalWordsElement = document.querySelector('.card_webinfo .webinfo-item:contains("本站总字数") .item-count');
    if (totalWordsElement) {
      const wordsText = totalWordsElement.textContent.trim();
      totalWords = parseInt(wordsText.replace(/[^\d]/g, '')) || 0;
    }
    
    // 估算平均阅读时间分布
    const articles = document.querySelectorAll('article.post, .article-sort-item');
    const readingTimeDistribution = {
      labels: ['<5分钟', '5-10分钟', '10-20分钟', '20-30分钟', '>30分钟'],
      data: [0, 0, 0, 0, 0]
    };
    
    // 基于文章长度估算阅读时间
    const avgWordsPerMinute = 300; // 假设平均阅读速度
    let totalArticleWords = 0;
    
    articles.forEach(article => {
      // 估算文章字数
      let articleWords = 0;
      const contentElement = article.querySelector('.post-content, .article-content, .content');
      
      if (contentElement) {
        articleWords = contentElement.textContent.trim().length / 2; // 粗略估计中文字数
      } else {
        // 如果找不到内容元素，使用元素大小估算
        articleWords = article.textContent.trim().length / 3;
      }
      
      totalArticleWords += articleWords;
      
      // 估算阅读时间（分钟）
      const readingTime = articleWords / avgWordsPerMinute;
      
      // 更新分布统计
      if (readingTime < 5) {
        readingTimeDistribution.data[0]++;
      } else if (readingTime < 10) {
        readingTimeDistribution.data[1]++;
      } else if (readingTime < 20) {
        readingTimeDistribution.data[2]++;
      } else if (readingTime < 30) {
        readingTimeDistribution.data[3]++;
      } else {
        readingTimeDistribution.data[4]++;
      }
    });
    
    // 如果没有足够文章数据，使用模拟数据
    if (articles.length < 3) {
      readingTimeDistribution.data = [3, 5, 4, 2, 1];
    }
    
    // 计算平均字数
    const avgWordsPerPost = articles.length > 0 ? Math.round(totalArticleWords / articles.length) : 0;
    
    return {
      totalWords: totalWords || totalArticleWords,
      avgWordsPerPost: avgWordsPerPost,
      readingTime: readingTimeDistribution
    };
  } catch (e) {
    console.error('Error collecting reading stats:', e);
    return {
      totalWords: 0,
      avgWordsPerPost: 0,
      readingTime: {
        labels: ['<5分钟', '5-10分钟', '10-20分钟', '20-30分钟', '>30分钟'],
        data: [0, 0, 0, 0, 0]
      }
    };
  }
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
  
  // 检查数据是否为空
  if (!chartsData.posts.dates.length || chartsData.posts.counts.every(count => count === 0)) {
    chart.setOption({
      title: {
        text: '文章发布统计图',
        left: 'center',
        textStyle: {
          color: colors.textColor
        },
        subtext: '暂无文章数据'
      }
    });
    return;
  }
  
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
  
  // 如果数据为空，添加一个提示
  if (!chartsData.tags.names.length) {
    chart.setOption({
      title: {
        text: 'Top 10 标签统计图',
        left: 'center',
        textStyle: {
          color: colors.textColor
        },
        subtext: '暂无标签数据'
      }
    });
    return;
  }
  
  // 创建横向或纵向柱状图
  const isHorizontal = chartType === 'barH';
  
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
      left: isHorizontal ? '15%' : '3%',
      right: '4%',
      bottom: isHorizontal ? '3%' : '15%',
      containLabel: true
    },
    xAxis: {
      type: isHorizontal ? 'value' : 'category',
      data: isHorizontal ? undefined : chartsData.tags.names,
      axisLabel: {
        interval: 0,
        rotate: isHorizontal ? 0 : 45,
        color: colors.axisColor,
        formatter: function(value) {
          // 如果是横向图，不做处理
          if (isHorizontal) return value;
          // 纵向图，太长的标签缩短
          return value.length > 10 ? value.substring(0, 8) + '...' : value;
        }
      },
      axisLine: {
        lineStyle: {
          color: colors.axisColor
        }
      }
    },
    yAxis: {
      type: isHorizontal ? 'category' : 'value',
      data: isHorizontal ? chartsData.tags.names.map(name => {
        // 横向图中太长的标签处理
        return name.length > 15 ? name.substring(0, 12) + '...' : name;
      }) : undefined,
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
  
  // 检查数据是否为空
  if (!chartsData.categories.names.length) {
    chart.setOption({
      title: {
        text: '文章分类统计图',
        left: 'center',
        textStyle: {
          color: colors.textColor
        },
        subtext: '暂无分类数据'
      }
    });
    return;
  }
  
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
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartsData.categories.names,
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: colors.axisColor,
          formatter: function(value) {
            return value.length > 10 ? value.substring(0, 8) + '...' : value;
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
  
  // 检查数据是否有效
  const hasData = chartsData.readingStats.readingTime.data.some(value => value > 0);
  if (!hasData) {
    chart.setOption({
      title: {
        text: '阅读时间分布',
        left: 'center',
        textStyle: {
          color: colors.textColor
        },
        subtext: '暂无阅读数据'
      }
    });
    return;
  }
  
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
  
  // 检查数据是否有效
  const hasData = wordsData.data.some(value => value > 0);
  if (!hasData) {
    chart.setOption({
      title: {
        text: '文章字数分布',
        left: 'center',
        textStyle: {
          color: colors.textColor
        },
        subtext: '暂无字数统计数据'
      }
    });
    return;
  }
  
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
  try {
    const articles = document.querySelectorAll('article.post, .article-sort-item');
    const distribution = {
      labels: ['<500字', '500-1000字', '1000-2000字', '2000-3000字', '3000-5000字', '>5000字'],
      data: [0, 0, 0, 0, 0, 0]
    };
    
    // 分析文章字数分布
    articles.forEach(article => {
      // 估算文章字数
      let wordCount = 0;
      const contentElement = article.querySelector('.post-content, .article-content, .content');
      
      if (contentElement) {
        wordCount = contentElement.textContent.trim().length / 2; // 粗略估计中文字数
      } else {
        // 如果找不到内容元素，使用元素大小估算
        wordCount = article.textContent.trim().length / 3;
      }
      
      // 更新分布
      if (wordCount < 500) {
        distribution.data[0]++;
      } else if (wordCount < 1000) {
        distribution.data[1]++;
      } else if (wordCount < 2000) {
        distribution.data[2]++;
      } else if (wordCount < 3000) {
        distribution.data[3]++;
      } else if (wordCount < 5000) {
        distribution.data[4]++;
      } else {
        distribution.data[5]++;
      }
    });
    
    // 如果没有足够的数据，分配一些模拟数据
    if (articles.length < 3) {
      distribution.data = [1, 2, 3, 2, 1, 0];
    }
    
    return distribution;
  } catch (e) {
    console.error('Error generating words distribution:', e);
    return {
      labels: ['<500字', '500-1000字', '1000-2000字', '2000-3000字', '3000-5000字', '>5000字'],
      data: [0, 0, 0, 0, 0, 0]
    };
  }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initStatistics);

// 在页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  observers.forEach(observer => observer.disconnect());
}); 
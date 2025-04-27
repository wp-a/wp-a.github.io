---
title: 博客统计
date: 2025-01-25 12:00:00
type: charts
comments: false
top_img: https://wpironman.oss-cn-qingdao.aliyuncs.com/statistics.jpg
---

<div class="container" id="container">
  <div class="article-statistics-container" id="article-statistics-container"></div>
  
  <div class="row">
    <div class="col-md-12">
      <div class="card-wrap">
        <div class="card-header">
          <span><i class="fas fa-chart-pie"></i> 文章分类统计</span>
        </div>
        <div class="card-content">
          <div id="category-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card-wrap">
        <div class="card-header">
          <span><i class="fas fa-tags"></i> 标签统计</span>
        </div>
        <div class="card-content">
          <div id="tag-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card-wrap">
        <div class="card-header">
          <span><i class="fas fa-calendar-alt"></i> 文章发布日历</span>
        </div>
        <div class="card-content">
          <div id="post-calendar" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <div class="card-wrap">
        <div class="card-header">
          <span><i class="fas fa-file-alt"></i> 文章字数统计</span>
        </div>
        <div class="card-content">
          <div id="word-count-chart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-bottom: 20px;
}

.col-md-12 {
  flex: 0 0 100%;
  max-width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

.card-wrap {
  background-color: var(--card-bg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  font-weight: bold;
}

.card-content {
  padding: 15px;
}

.statistics-overview {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.stat-item {
  flex: 1 0 calc(25% - 20px);
  min-width: 120px;
  display: flex;
  align-items: center;
  padding: 15px;
  margin: 10px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-icon {
  font-size: 2.5em;
  color: var(--theme-color);
  margin-right: 15px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.8em;
  font-weight: bold;
  line-height: 1.2;
}

.stat-name {
  font-size: 0.9em;
  color: var(--font-color);
  opacity: 0.8;
}

@media screen and (max-width: 768px) {
  .stat-item {
    flex: 1 0 calc(50% - 20px);
  }
}

@media screen and (max-width: 480px) {
  .stat-item {
    flex: 1 0 100%;
  }
}
</style>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script src="/js/statistics.js"></script> 
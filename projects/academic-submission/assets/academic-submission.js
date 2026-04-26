(function () {
  const runtime = window.AcademicSubmissionRuntime || {};
  const dataConfig = runtime.data || {};
  const aiPrecheckConfig = runtime.aiPrecheck || {};
  const cache = new Map();

  const state = {
    venues: [],
    filteredVenues: [],
    selectedVenueId: null,
    papers: [],
    filteredPapers: [],
    selectedPaperId: null,
    topVenueDirectionStats: [],
    frontierLoaded: false,
    frontierLoading: false,
  };

  const els = {
    metricVenueCount: document.getElementById('metric-venue-count'),
    metricPaperCount: document.getElementById('metric-paper-count'),
    statusPublicData: document.getElementById('status-public-data'),
    statusFrontierData: document.getElementById('status-frontier-data'),
    statusAiService: document.getElementById('status-ai-service'),
    venueSearch: document.getElementById('venue-search'),
    venueTypeFilter: document.getElementById('venue-type-filter'),
    venueRankFilter: document.getElementById('venue-rank-filter'),
    venueDisciplineFilter: document.getElementById('venue-discipline-filter'),
    venueList: document.getElementById('venue-list'),
    venueDetail: document.getElementById('venue-detail'),
    venueResultCount: document.getElementById('venue-result-count'),
    venueToolbarMeta: document.getElementById('venue-toolbar-meta'),
    paperSearch: document.getElementById('paper-search'),
    paperSourceFilter: document.getElementById('paper-source-filter'),
    paperVenueFilter: document.getElementById('paper-venue-filter'),
    paperDirectionFilter: document.getElementById('paper-direction-filter'),
    paperList: document.getElementById('paper-list'),
    paperDetail: document.getElementById('paper-detail'),
    paperToolbarMeta: document.getElementById('paper-toolbar-meta'),
    frontierUpdatedAt: document.getElementById('frontier-updated-at'),
    frontierTotalPapers: document.getElementById('frontier-total-papers'),
    frontierTopVenue: document.getElementById('frontier-top-venue'),
    frontierTopVenueCount: document.getElementById('frontier-top-venue-count'),
    frontierHotDirection: document.getElementById('frontier-hot-direction'),
    frontierHotDirectionRatio: document.getElementById('frontier-hot-direction-ratio'),
    precheckForm: document.getElementById('precheck-form'),
    precheckSubmit: document.getElementById('precheck-submit'),
    precheckStatusTitle: document.getElementById('precheck-status-title'),
    precheckStatusCopy: document.getElementById('precheck-status-copy'),
    precheckServiceTrace: document.getElementById('precheck-service-trace'),
    frontierSection: document.getElementById('frontier-observatory'),
  };

  function fetchJsonOnce(url) {
    if (!url) {
      return Promise.reject(new Error('missing data url'));
    }

    if (cache.has(url)) {
      return cache.get(url);
    }

    const request = fetch(url).then(async response => {
      if (!response.ok) {
        throw new Error(`request failed: ${response.status}`);
      }
      return response.json();
    });

    cache.set(url, request);
    return request;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
  }

  function uniq(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function parseDate(timestamp) {
    if (!timestamp) return null;
    const time = Date.parse(timestamp);
    return Number.isNaN(time) ? null : new Date(time);
  }

  function rankWeight(rank) {
    const order = { A: 0, T1: 0, B: 1, T2: 1, C: 2, T3: 2 };
    return order[rank] ?? 3;
  }

  function formatDate(value) {
    const date = parseDate(value);
    if (!date) return '未知';
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  function formatShortDate(value) {
    const date = parseDate(value);
    if (!date) return '未知时间';
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
    });
  }

  function formatUpdatedAt(value) {
    const date = parseDate(value);
    if (!date) return '索引时间未知';
    return `${date.toLocaleDateString('zh-CN')} ${date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  function formatPercentage(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '--';
    return `${(value * 100).toFixed(1)}%`;
  }

  function addYears(timestamp, years) {
    const date = new Date(timestamp);
    date.setFullYear(date.getFullYear() + years);
    return date.getTime();
  }

  function getEffectiveDeadlineTimestamp(venue) {
    if (!venue || venue.type !== 'conference' || !venue.deadline) return null;

    const baseTimestamp = Date.parse(`${venue.deadline}T23:59:59`);
    if (Number.isNaN(baseTimestamp)) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let effectiveTimestamp = baseTimestamp;
    let guard = 0;

    while (effectiveTimestamp < today.getTime() && guard < 8) {
      effectiveTimestamp = addYears(effectiveTimestamp, 1);
      guard += 1;
    }

    return effectiveTimestamp;
  }

  function formatVenueMeta(venue) {
    const deadlineTimestamp = getEffectiveDeadlineTimestamp(venue);
    const deadlineText = deadlineTimestamp
      ? `DDL ${formatShortDate(new Date(deadlineTimestamp).toISOString())}`
      : venue.type === 'conference'
        ? 'DDL 待更新'
        : 'Journal';

    return [
      venue.type === 'conference' ? '会议' : '期刊',
      venue.ccfRank ? `CCF-${venue.ccfRank}` : null,
      venue.subdiscipline || venue.discipline || null,
      deadlineText,
    ].filter(Boolean);
  }

  function sortVenues(list) {
    return [...list].sort((left, right) => {
      const leftDeadline = getEffectiveDeadlineTimestamp(left) ?? Number.POSITIVE_INFINITY;
      const rightDeadline = getEffectiveDeadlineTimestamp(right) ?? Number.POSITIVE_INFINITY;
      if (leftDeadline !== rightDeadline) {
        return leftDeadline - rightDeadline;
      }

      const leftRank = rankWeight(left.ccfRank || left.xrTier);
      const rightRank = rankWeight(right.ccfRank || right.xrTier);
      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      const leftImpact = Number(left.impactFactor) || 0;
      const rightImpact = Number(right.impactFactor) || 0;
      if (leftImpact !== rightImpact) {
        return rightImpact - leftImpact;
      }

      return String(left.abbreviation || left.name || '').localeCompare(
        String(right.abbreviation || right.name || ''),
        'zh-CN'
      );
    });
  }

  function populateVenueDisciplineFilter(venues) {
    if (!els.venueDisciplineFilter) return;
    const disciplines = uniq(
      venues.map(item => item.subdiscipline || item.discipline).sort((a, b) => String(a).localeCompare(String(b), 'zh-CN'))
    );

    els.venueDisciplineFilter.innerHTML = [
      '<option value="">全部</option>',
      ...disciplines.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`),
    ].join('');
  }

  function renderVenueList() {
    const venues = state.filteredVenues;
    els.venueResultCount.textContent = String(venues.length);
    els.venueToolbarMeta.textContent = `${venues.length} 个结果`;

    if (!venues.length) {
      els.venueList.innerHTML = `
        <div class="empty-state">
          <p class="detail-kicker">NO MATCH</p>
          <h3>当前筛选没有命中结果。</h3>
          <p>可以先清空关键词，或者放宽类型与 CCF 过滤条件。</p>
        </div>
      `;
      els.venueDetail.innerHTML = `
        <div class="detail-empty">
          <p class="detail-kicker">VENUE DETAIL</p>
          <h3>没有可展示的 venue。</h3>
          <p>放宽筛选后，右侧详情会自动恢复。</p>
        </div>
      `;
      return;
    }

    if (!venues.some(item => item.id === state.selectedVenueId)) {
      state.selectedVenueId = venues[0].id;
    }

    els.venueList.innerHTML = venues.map(venue => {
      const title = venue.abbreviation || venue.name;
      const subtitle = venue.abbreviation && venue.name !== venue.abbreviation ? venue.name : venue.publisher || venue.description || '';
      const isActive = venue.id === state.selectedVenueId;
      const meta = formatVenueMeta(venue);

      return `
        <article class="list-row ${isActive ? 'is-active' : ''}" data-venue-id="${escapeHtml(venue.id)}" tabindex="0">
          <strong>${escapeHtml(title)}</strong>
          <div class="row-meta">
            ${meta.map(item => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}
          </div>
          <span>${escapeHtml(subtitle)}</span>
        </article>
      `;
    }).join('');

    els.venueList.querySelectorAll('[data-venue-id]').forEach(node => {
      const activate = () => {
        state.selectedVenueId = node.getAttribute('data-venue-id');
        renderVenueList();
        renderVenueDetail();
      };

      node.addEventListener('click', activate);
      node.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });

    renderVenueDetail();
  }

  function renderVenueDetail() {
    const venue = state.filteredVenues.find(item => item.id === state.selectedVenueId);
    if (!venue) return;

    const effectiveDeadline = getEffectiveDeadlineTimestamp(venue);
    const metadata = [
      venue.type === 'conference' ? '会议' : '期刊',
      venue.ccfRank ? `CCF-${venue.ccfRank}` : null,
      venue.xrTier ? venue.xrTier : null,
      venue.jcrQuartile ? `JCR ${venue.jcrQuartile}` : null,
      venue.casRank ? `中科院 ${venue.casRank}` : null,
    ].filter(Boolean);

    const detailLines = [
      venue.subdiscipline || venue.discipline ? `<p><strong>方向：</strong>${escapeHtml(venue.subdiscipline || venue.discipline)}</p>` : '',
      effectiveDeadline ? `<p><strong>截稿：</strong>${escapeHtml(formatDate(new Date(effectiveDeadline).toISOString()))}</p>` : '',
      venue.conferenceDate ? `<p><strong>会议日期：</strong>${escapeHtml(venue.conferenceDate)}</p>` : '',
      venue.location ? `<p><strong>地点：</strong>${escapeHtml(venue.location)}</p>` : '',
      venue.publisher ? `<p><strong>出版方：</strong>${escapeHtml(venue.publisher)}</p>` : '',
      venue.impactFactor ? `<p><strong>影响因子：</strong>${escapeHtml(String(venue.impactFactor))}</p>` : '',
    ].filter(Boolean).join('');

    const links = [
      venue.website ? `<a class="detail-link" href="${escapeHtml(venue.website)}" target="_blank" rel="noreferrer">官网</a>` : '',
      venue.xrSource ? `<a class="detail-link" href="${escapeHtml(venue.xrSource)}" target="_blank" rel="noreferrer">XR 来源</a>` : '',
    ].filter(Boolean).join('');

    els.venueDetail.innerHTML = `
      <div class="detail-content">
        <div class="detail-title">
          <p class="detail-kicker">VENUE DETAIL</p>
          <h3>${escapeHtml(venue.abbreviation || venue.name)}</h3>
          <p>${escapeHtml(venue.name)}</p>
        </div>
        <div class="detail-meta">
          ${metadata.map(item => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}
        </div>
        <div class="detail-body">
          <p>${escapeHtml(venue.description || '该 venue 当前没有补充描述。')}</p>
          ${detailLines}
        </div>
        <div class="detail-actions">${links}</div>
      </div>
    `;
  }

  function applyVenueFilters() {
    const search = normalizeText(els.venueSearch.value);
    const type = els.venueTypeFilter.value;
    const rank = els.venueRankFilter.value;
    const discipline = els.venueDisciplineFilter.value;

    state.filteredVenues = sortVenues(
      state.venues.filter(venue => {
        const haystack = normalizeText([
          venue.name,
          venue.abbreviation,
          venue.discipline,
          venue.subdiscipline,
          venue.description,
          venue.publisher,
        ].filter(Boolean).join(' '));

        if (search && !haystack.includes(search)) return false;
        if (type && venue.type !== type) return false;
        if (rank && venue.ccfRank !== rank && venue.xrTier !== rank) return false;
        if (discipline && (venue.subdiscipline || venue.discipline) !== discipline) return false;
        return true;
      })
    );

    renderVenueList();
  }

  async function loadVenues() {
    const venues = await fetchJsonOnce(dataConfig.venues);
    state.venues = Array.isArray(venues) ? venues : [];
    populateVenueDisciplineFilter(state.venues);
    els.metricVenueCount.textContent = `${state.venues.length} 个`;
    applyVenueFilters();
  }

  function bindVenueControls() {
    for (const node of [
      els.venueSearch,
      els.venueTypeFilter,
      els.venueRankFilter,
      els.venueDisciplineFilter,
    ]) {
      node.addEventListener('input', applyVenueFilters);
      node.addEventListener('change', applyVenueFilters);
    }
  }

  function dedupePapers(indexPayload) {
    const merged = [];
    const seen = new Set();
    const candidates = [
      ...(Array.isArray(indexPayload.latestFeed) ? indexPayload.latestFeed : []),
      ...((Array.isArray(indexPayload.venues) ? indexPayload.venues : []).flatMap(entry => entry.previewPapers || [])),
    ];

    for (const paper of candidates) {
      const key = String(paper.id || paper.title || '').trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(paper);
    }

    return merged.sort((left, right) => {
      const leftTime = Date.parse(left.publishedAt || '') || 0;
      const rightTime = Date.parse(right.publishedAt || '') || 0;
      return rightTime - leftTime;
    });
  }

  function populatePaperFilters(indexPayload, directionStats) {
    const sources = uniq(state.papers.map(item => item.source)).sort((a, b) => String(a).localeCompare(String(b)));
    const venues = uniq(state.papers.map(item => item.venueAbbreviation || item.venueName)).sort((a, b) => String(a).localeCompare(String(b)));
    const directions = uniq(
      [
        ...state.papers.flatMap(item => item.directions || []),
        ...(Array.isArray(directionStats) ? directionStats.flatMap(item => (item.directionRatios || []).map(entry => entry.name)) : []),
      ]
    ).sort((a, b) => String(a).localeCompare(String(b)));

    els.paperSourceFilter.innerHTML = [
      '<option value="">全部来源</option>',
      ...sources.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`),
    ].join('');

    els.paperVenueFilter.innerHTML = [
      '<option value="">全部 venue</option>',
      ...venues.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`),
    ].join('');

    els.paperDirectionFilter.innerHTML = [
      '<option value="">全部方向</option>',
      ...directions.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`),
    ].join('');

    const topVenue = (Array.isArray(indexPayload.venues) ? indexPayload.venues : [])[0];
    const hottestDirection = (Array.isArray(directionStats) ? directionStats : [])
      .flatMap(item => item.directionRatios || [])
      .sort((left, right) => (right.ratio || 0) - (left.ratio || 0))[0];

    els.frontierUpdatedAt.textContent = formatUpdatedAt(indexPayload.metadata?.updatedAt);
    els.frontierTotalPapers.textContent = `${indexPayload.metadata?.totalPapers || state.papers.length} 篇`;
    els.frontierTopVenue.textContent = topVenue ? escapeHtml(topVenue.venueAbbreviation || topVenue.venueName) : '未知';
    els.frontierTopVenueCount.textContent = topVenue ? `${topVenue.totalCount} 篇` : '--';
    els.frontierHotDirection.textContent = hottestDirection?.name || '未知';
    els.frontierHotDirectionRatio.textContent = hottestDirection ? formatPercentage(hottestDirection.ratio) : '--';
  }

  function renderPaperList() {
    const papers = state.filteredPapers;
    els.paperToolbarMeta.textContent = `${papers.length} 篇候选`;
    els.metricPaperCount.textContent = `${state.papers.length} 篇`;

    if (!papers.length) {
      els.paperList.innerHTML = `
        <div class="empty-state">
          <p class="detail-kicker">NO MATCH</p>
          <h3>当前过滤条件下没有论文。</h3>
          <p>可以先清空方向或 venue 过滤，再继续浏览。</p>
        </div>
      `;
      els.paperDetail.innerHTML = `
        <div class="detail-empty">
          <p class="detail-kicker">PAPER DETAIL</p>
          <h3>没有论文可展示。</h3>
          <p>放宽过滤条件后，这里会恢复详情面板。</p>
        </div>
      `;
      return;
    }

    if (!papers.some(item => item.id === state.selectedPaperId)) {
      state.selectedPaperId = papers[0].id;
    }

    els.paperList.innerHTML = papers.map(paper => {
      const isActive = paper.id === state.selectedPaperId;
      const directions = (paper.directions || []).slice(0, 3);
      const authors = Array.isArray(paper.authors) ? paper.authors.slice(0, 4).join(', ') : '';

      return `
        <article class="list-row ${isActive ? 'is-active' : ''}" data-paper-id="${escapeHtml(paper.id)}" tabindex="0">
          <div class="paper-heading">
            <strong>${escapeHtml(paper.title)}</strong>
            <span class="paper-date">${escapeHtml(formatDate(paper.publishedAt))}</span>
          </div>
          <div class="row-meta">
            <span class="meta-pill">${escapeHtml(paper.venueAbbreviation || paper.venueName || 'Unknown Venue')}</span>
            <span class="meta-pill">${escapeHtml(paper.source || 'Unknown Source')}</span>
            ${paper.ccfRank ? `<span class="meta-pill">CCF-${escapeHtml(paper.ccfRank)}</span>` : ''}
          </div>
          <span>${escapeHtml(authors || '作者信息待补充')}</span>
          <div class="row-tags">
            ${directions.map(item => `<span class="tag-pill">${escapeHtml(item)}</span>`).join('')}
          </div>
        </article>
      `;
    }).join('');

    els.paperList.querySelectorAll('[data-paper-id]').forEach(node => {
      const activate = () => {
        state.selectedPaperId = node.getAttribute('data-paper-id');
        renderPaperList();
        renderPaperDetail();
      };

      node.addEventListener('click', activate);
      node.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });

    renderPaperDetail();
  }

  function renderPaperDetail() {
    const paper = state.filteredPapers.find(item => item.id === state.selectedPaperId);
    if (!paper) return;

    const links = [
      paper.detailURLString ? `<a class="detail-link" href="${escapeHtml(paper.detailURLString)}" target="_blank" rel="noreferrer">详情</a>` : '',
      paper.pdfURLString ? `<a class="detail-link" href="${escapeHtml(paper.pdfURLString)}" target="_blank" rel="noreferrer">PDF</a>` : '',
      paper.codeURLString ? `<a class="detail-link" href="${escapeHtml(paper.codeURLString)}" target="_blank" rel="noreferrer">Code</a>` : '',
      paper.repositoryURLString ? `<a class="detail-link" href="${escapeHtml(paper.repositoryURLString)}" target="_blank" rel="noreferrer">Repo</a>` : '',
    ].filter(Boolean).join('');

    const meta = [
      paper.venueAbbreviation || paper.venueName,
      paper.source,
      paper.paperStage,
      paper.ccfRank ? `CCF-${paper.ccfRank}` : null,
    ].filter(Boolean);

    els.paperDetail.innerHTML = `
      <div class="detail-content">
        <div class="detail-title">
          <p class="detail-kicker">PAPER DETAIL</p>
          <h3>${escapeHtml(paper.title)}</h3>
          <p>${escapeHtml(Array.isArray(paper.authors) ? paper.authors.join(', ') : '作者信息待补充')}</p>
        </div>
        <div class="detail-meta">
          ${meta.map(item => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}
        </div>
        <p class="paper-abstract">${escapeHtml(paper.summary || '该论文当前没有摘要镜像。')}</p>
        <div class="detail-tags">
          ${(paper.directions || []).map(item => `<span class="tag-pill">${escapeHtml(item)}</span>`).join('')}
        </div>
        <div class="detail-actions">${links || '<span class="detail-note">当前没有公开跳转链接。</span>'}</div>
      </div>
    `;
  }

  function applyPaperFilters() {
    const search = normalizeText(els.paperSearch.value);
    const source = els.paperSourceFilter.value;
    const venue = els.paperVenueFilter.value;
    const direction = els.paperDirectionFilter.value;

    state.filteredPapers = state.papers.filter(paper => {
      const haystack = normalizeText([
        paper.title,
        ...(paper.authors || []),
        ...(paper.tags || []),
        ...(paper.directions || []),
        ...(paper.subDirections || []),
        paper.summary,
        paper.venueName,
        paper.venueAbbreviation,
      ].filter(Boolean).join(' '));

      if (search && !haystack.includes(search)) return false;
      if (source && paper.source !== source) return false;
      if (venue && (paper.venueAbbreviation || paper.venueName) !== venue) return false;
      if (direction && !(paper.directions || []).includes(direction) && !(paper.subDirections || []).includes(direction)) return false;
      return true;
    });

    renderPaperList();
  }

  async function loadFrontierData() {
    if (state.frontierLoaded || state.frontierLoading) return;
    state.frontierLoading = true;
    els.statusFrontierData.textContent = '索引加载中';
    els.paperToolbarMeta.textContent = '正在读取本地索引';

    try {
      const [indexPayload, directionStats] = await Promise.all([
        fetchJsonOnce(dataConfig.topPapersIndex),
        fetchJsonOnce(dataConfig.topPaperDirectionStats),
      ]);

      state.papers = dedupePapers(indexPayload || {});
      state.topVenueDirectionStats = Array.isArray(directionStats) ? directionStats : [];
      state.frontierLoaded = true;
      state.frontierLoading = false;
      els.statusFrontierData.textContent = '本地索引已加载';
      populatePaperFilters(indexPayload || {}, state.topVenueDirectionStats);
      applyPaperFilters();
    } catch (error) {
      state.frontierLoading = false;
      els.statusFrontierData.textContent = '索引加载失败';
      els.paperToolbarMeta.textContent = '公开索引读取失败';
      els.paperList.innerHTML = `
        <div class="empty-state">
          <p class="detail-kicker">LOAD FAILED</p>
          <h3>前沿论文索引暂时不可用。</h3>
          <p>${escapeHtml(error.message || 'unknown error')}</p>
        </div>
      `;
    }
  }

  function bindPaperControls() {
    for (const node of [
      els.paperSearch,
      els.paperSourceFilter,
      els.paperVenueFilter,
      els.paperDirectionFilter,
    ]) {
      node.addEventListener('input', applyPaperFilters);
      node.addEventListener('change', applyPaperFilters);
    }
  }

  function updatePrecheckStatus() {
    if (aiPrecheckConfig.enabled) {
      els.statusAiService.textContent = '已接入真实服务';
      els.precheckStatusTitle.textContent = 'AI 预审服务已接入';
      els.precheckStatusCopy.textContent = '当前页面会把标题、摘要和模式参数提交到真实预审接口。';
      els.precheckSubmit.textContent = '开始预审';
      return;
    }

    els.statusAiService.textContent = '服务暂未上线';
    els.precheckStatusTitle.textContent = '服务暂未上线';
    els.precheckStatusCopy.textContent = '后端部署完成后，这里会直接切到真实预审任务流。当前版本不生成假报告，也不返回模拟结果。';
    els.precheckSubmit.textContent = '服务暂未上线';
  }

  async function handlePrecheckSubmit(event) {
    event.preventDefault();

    if (!aiPrecheckConfig.enabled || !aiPrecheckConfig.baseUrl) {
      els.precheckStatusTitle.textContent = '服务暂未上线';
      els.precheckStatusCopy.textContent = '预审入口已经就位，但当前没有可用的线上后端地址。你后续部署 API 后，只需要改运行时配置。';
      return;
    }

    const title = document.getElementById('precheck-title').value.trim();
    const abstractText = document.getElementById('precheck-abstract').value.trim();
    const mode = document.getElementById('precheck-mode').value;
    const language = document.getElementById('precheck-language').value;

    if (!title && !abstractText) {
      els.precheckStatusTitle.textContent = '输入不完整';
      els.precheckStatusCopy.textContent = '标题和摘要至少填写一项。';
      return;
    }

    els.precheckSubmit.disabled = true;
    els.precheckStatusTitle.textContent = '正在提交预审';
    els.precheckStatusCopy.textContent = '请求已发出，等待服务端返回结构化结果。';

    try {
      const response = await fetch(`${aiPrecheckConfig.baseUrl}${aiPrecheckConfig.createPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          abstractText,
          mode,
          language,
          useFullText: false,
          sourceName: 'academic-submission-web',
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || `request failed: ${response.status}`);
      }

      const report = payload.report || {};
      els.precheckStatusTitle.textContent = report.verdict || '预审完成';
      els.precheckStatusCopy.textContent = report.summary || '服务端已返回结构化结果。';
    } catch (error) {
      els.precheckStatusTitle.textContent = '调用失败';
      els.precheckStatusCopy.textContent = error.message || '预审请求失败';
    } finally {
      els.precheckSubmit.disabled = false;
      els.precheckSubmit.textContent = '开始预审';
    }
  }

  function bindPrecheckForm() {
    els.precheckForm.addEventListener('submit', handlePrecheckSubmit);
  }

  function primeFrontierOnView() {
    if (!('IntersectionObserver' in window) || !els.frontierSection) {
      loadFrontierData();
      return;
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          loadFrontierData();
          break;
        }
      }
    }, {
      rootMargin: '180px 0px',
    });

    observer.observe(els.frontierSection);
  }

  async function boot() {
    updatePrecheckStatus();
    bindVenueControls();
    bindPaperControls();
    bindPrecheckForm();
    primeFrontierOnView();

    try {
      await loadVenues();
    } catch (error) {
      if (els.statusPublicData) {
        els.statusPublicData.textContent = '镜像读取失败';
      }
      els.venueToolbarMeta.textContent = '公开 venue 数据读取失败';
      els.venueList.innerHTML = `
        <div class="empty-state">
          <p class="detail-kicker">LOAD FAILED</p>
          <h3>公开 venue 数据暂时不可用。</h3>
          <p>${escapeHtml(error.message || 'unknown error')}</p>
        </div>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

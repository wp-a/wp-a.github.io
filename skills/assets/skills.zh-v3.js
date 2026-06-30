(function () {
  const skills = Array.isArray(window.WP_SKILLS) ? window.WP_SKILLS : [];
  const collections = Array.isArray(window.WP_SKILL_COLLECTIONS) ? window.WP_SKILL_COLLECTIONS : [];
  const discoveryRoutes = Array.isArray(window.WP_DISCOVERY_ROUTES) ? window.WP_DISCOVERY_ROUTES : [];
  const referencePatterns = Array.isArray(window.WP_REFERENCE_PATTERNS) ? window.WP_REFERENCE_PATTERNS : [];
  const runbooks = Array.isArray(window.WP_RUNBOOKS) ? window.WP_RUNBOOKS : [];
  const taskBriefs = Array.isArray(window.WP_TASK_BRIEFS) ? window.WP_TASK_BRIEFS : [];
  const stackBlueprints = Array.isArray(window.WP_STACK_BLUEPRINTS) ? window.WP_STACK_BLUEPRINTS : [];
  const fallbackMarketplaceCategories = [
    { id: 'all', name: '全部', label: 'All', icon: 'fa-layer-group', description: '显示全部可下载 skills。', filters: [], skillIds: [] }
  ];
  const marketplaceCategories = Array.isArray(window.WP_MARKETPLACE_CATEGORIES) && window.WP_MARKETPLACE_CATEGORIES.length
    ? window.WP_MARKETPLACE_CATEGORIES
    : fallbackMarketplaceCategories;
  const skillsById = new Map(skills.map(skill => [skill.id, skill]));
  const visibleMarketplaceCategories = marketplaceCategories.filter(category => {
    if (!category || category.id === 'all') return true;
    return Array.isArray(category.skillIds) && category.skillIds.some(id => skillsById.has(id));
  });
  const state = {
    categoryId: visibleMarketplaceCategories[0]?.id || 'all',
    query: '',
    routeId: null,
    briefId: taskBriefs[0]?.id || null,
    blueprintId: stackBlueprints[0]?.id || null,
    stackIds: [],
    selectedId: skills[0]?.id || null
  };

  const nodes = {
    taskBriefBoard: document.querySelector('[data-task-brief-board]'),
    routeBoard: document.querySelector('[data-route-board]'),
    referencePatterns: document.querySelector('[data-reference-patterns]'),
    skillGrid: document.querySelector('[data-skill-grid]'),
    skillCount: document.querySelector('[data-skill-count]'),
    workflowCount: document.querySelector('[data-workflow-count]'),
    runbookCount: document.querySelector('[data-runbook-count]'),
    categoryCount: document.querySelector('[data-category-count]'),
    detailPanel: document.getElementById('skill-detail-panel'),
    skillStack: document.getElementById('skill-stack'),
    categoryRail: document.querySelector('[data-category-rail]'),
    categoryContext: document.querySelector('[data-category-context]'),
    searchInput: document.querySelector('[data-skill-search]'),
    resultMeter: document.querySelector('[data-result-meter]'),
    fieldGuideGrid: document.querySelector('[data-field-guide-grid]'),
    copyStatus: document.querySelector('[data-copy-status]'),
    stackBlueprints: document.querySelector('[data-stack-blueprints]'),
    executionStack: document.querySelector('[data-execution-stack]')
  };

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revealObserver = null;
  let revealInitialized = false;

  function revealCandidates() {
    return Array.from(document.querySelectorAll([
      '.skills-hero__copy',
      '.hero-control-panel',
      '.task-brief-card',
      '.task-brief-board__detail',
      '.route-panel',
      '.reference-pattern',
      '.category-rail',
      '.skill-card',
      '.skill-detail-panel',
      '.depth-panel',
      '.stack-blueprint',
      '.execution-stack',
      '.field-guide-card',
      '.runbook-console',
      '.submit-skill'
    ].join(',')));
  }

  function isInRevealViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    return rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidth;
  }

  function syncRevealItems() {
    const candidates = revealCandidates();
    candidates.forEach((element, index) => {
      if (element.dataset.revealReady === 'true') {
        if (revealInitialized && isInRevealViewport(element)) {
          element.classList.add('reveal-on-scroll--instant', 'is-visible');
          if (revealObserver) revealObserver.unobserve(element);
        }
        return;
      }
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 45}ms`);

      if (revealObserver) {
        element.dataset.revealReady = 'true';
        if (revealInitialized && isInRevealViewport(element)) {
          element.classList.add('reveal-on-scroll--instant', 'is-visible');
          return;
        }
        revealObserver.observe(element);
      } else if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
        element.dataset.revealReady = 'true';
        element.classList.add('is-visible');
      }
    });
  }

  function initRevealMotion() {
    if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
      syncRevealItems();
      return;
    }

    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    syncRevealItems();
    revealInitialized = true;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function listItems(items) {
    return items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  }

  function tagList(tags) {
    return tags.map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('');
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function activeCategory() {
    return visibleMarketplaceCategories.find(category => category.id === state.categoryId) || visibleMarketplaceCategories[0] || null;
  }

  function categorySkills(category) {
    if (!category || category.id === 'all') return skills;
    if (Array.isArray(category.skillIds) && category.skillIds.length) {
      return category.skillIds.map(id => skillsById.get(id)).filter(Boolean);
    }
    if (!Array.isArray(category.filters) || category.filters.length === 0) return [];
    const allowed = new Set(category.filters);
    return skills.filter(skill => allowed.has(skill.category));
  }

  function categoryCount(category) {
    return categorySkills(category).length;
  }

  function categoryForSkill(skill) {
    if (!skill) return visibleMarketplaceCategories[0] || null;
    return visibleMarketplaceCategories.find(category => Array.isArray(category.skillIds) && category.skillIds.includes(skill.id))
      || visibleMarketplaceCategories.find(category => Array.isArray(category.filters) && category.filters.includes(skill.category))
      || visibleMarketplaceCategories[0]
      || null;
  }

  function categoryForRoute(route) {
    if (!route) return visibleMarketplaceCategories[0] || null;
    const routeSkillIds = new Set(route.skillIds || []);
    return visibleMarketplaceCategories
      .filter(category => category.id !== 'all')
      .map(category => ({
        category,
        score: categorySkills(category).filter(skill => routeSkillIds.has(skill.id)).length
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.category || visibleMarketplaceCategories[0] || null;
  }

  function allCategory() {
    return visibleMarketplaceCategories.find(category => category.id === 'all') || visibleMarketplaceCategories[0] || null;
  }

  function skillSearchText(skill) {
    return normalize([
      skill.name,
      skill.description,
      skill.source,
      skill.origin,
      skill.category,
      skill.creator,
      skill.workflow,
      skill.installType,
      skill.status,
      skill.quality,
      skill.install,
      skill.repo,
      skill.userRole,
      skill.maturity,
      skill.riskLevel,
      categoryForSkill(skill)?.name,
      categoryForSkill(skill)?.label,
      categoryForSkill(skill)?.description,
      ...(skill.input || []),
      ...(skill.output || []),
      ...(skill.failureModes || []),
      ...(skill.quickStart || []),
      ...(skill.trust || []),
      ...(skill.sourceTrail || []),
      ...(skill.verification || []),
      ...(skill.tags || [])
    ].join(' '));
  }

  function filteredSkills() {
    const query = normalize(state.query);
    const route = discoveryRoutes.find(item => item.id === state.routeId);
    const category = activeCategory();
    const baseSkills = route
      ? (route.skillIds || []).map(id => skillsById.get(id)).filter(Boolean)
      : category && category.id !== 'all'
        ? categorySkills(category)
        : skills;

    return baseSkills.filter(skill => {
      if (query && !skillSearchText(skill).includes(query)) return false;
      return true;
    });
  }

  function cardMarkup(skill) {
    const isSelected = skill.id === state.selectedId;
    const category = categoryForSkill(skill);
    const metaItems = [category?.name || skill.category, skill.category, skill.origin]
      .filter(Boolean)
      .filter((item, index, items) => items.indexOf(item) === index);
    return `
      <article class="skill-card ${isSelected ? 'is-selected' : ''}">
        <button class="skill-card__button" type="button" data-skill-id="${escapeHtml(skill.id)}" aria-pressed="${isSelected ? 'true' : 'false'}">
          <span class="skill-card__meta">
            ${metaItems.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
          </span>
          <span class="skill-card__title">${escapeHtml(skill.name)}</span>
          <span class="skill-card__desc">${escapeHtml(skill.description)}</span>
          <span class="skill-card__identity">
            <span>${escapeHtml(skill.creator)}</span>
            <span>${escapeHtml(skill.workflow)}</span>
          </span>
          <span class="skill-card__footer">
            <span>${escapeHtml(skill.quality)}</span>
            <span>${escapeHtml(skill.status)}</span>
          </span>
        </button>
      </article>
    `;
  }

  function renderLibrary() {
    if (!nodes.skillGrid) return;
    const visible = filteredSkills();
    const category = activeCategory();
    const route = discoveryRoutes.find(item => item.id === state.routeId);
    if (nodes.categoryContext && (route || category)) {
      nodes.categoryContext.innerHTML = `
        <span>${route ? '路径' : '分类'}</span>
        <strong>${escapeHtml(route?.name || category.name)}</strong>
        <p>${escapeHtml(route?.summary || category.description)}</p>
      `;
    }
    if (nodes.resultMeter) {
      const parts = [`${String(visible.length).padStart(2, '0')} 个结果`];
      if (route) parts.push(route.name);
      if (!route && category?.name) parts.push(category.name);
      if (state.query) parts.push(`搜索：${state.query}`);
      nodes.resultMeter.textContent = parts.join(' / ');
    }
    nodes.skillGrid.innerHTML = visible.length
      ? visible.map(skill => cardMarkup(skill)).join('')
      : '<div class="skill-empty"><strong>没有匹配的 skill</strong><span>换一个分类、清空搜索，或查看 All。</span></div>';
    syncRevealItems();
  }

  function renderMarketplaceCategories() {
    if (!nodes.categoryRail) return;

    nodes.categoryRail.innerHTML = `
      <div class="category-rail__head">
        <span>分类</span>
        <button type="button" data-category-clear>全部</button>
      </div>
      <div class="category-rail__list">
        ${visibleMarketplaceCategories.map(category => {
          const isActive = category.id === state.categoryId;
          return `
            <button class="category-pill ${isActive ? 'is-active' : ''}" type="button" data-category-id="${escapeHtml(category.id)}" aria-pressed="${isActive ? 'true' : 'false'}">
              <span class="category-pill__icon"><i class="fas ${escapeHtml(category.icon || 'fa-layer-group')}" aria-hidden="true"></i></span>
              <span class="category-pill__label">
                <strong>${escapeHtml(category.name)}</strong>
                <small>${String(categoryCount(category)).padStart(2, '0')} / ${escapeHtml(category.label || '')}</small>
              </span>
            </button>
          `;
        }).join('')}
      </div>
    `;
    syncRevealItems();
  }

  function routeSkillNames(route) {
    return (route.skillIds || [])
      .map(id => skillsById.get(id)?.name)
      .filter(Boolean);
  }

  function renderDiscoveryRoutes() {
    if (!nodes.routeBoard) return;

    nodes.routeBoard.innerHTML = discoveryRoutes.map(route => {
      const isActive = route.id === state.routeId;
      const skillNames = routeSkillNames(route);
      const previewNames = skillNames.slice(0, 4);
      const moreCount = Math.max(skillNames.length - previewNames.length, 0);

      return `
        <article class="route-panel ${isActive ? 'is-active' : ''}">
          <button class="route-panel__button" type="button" data-route-id="${escapeHtml(route.id)}" aria-pressed="${isActive ? 'true' : 'false'}">
            <span class="route-panel__top">
              <span class="route-panel__mode">${escapeHtml(route.mode)}</span>
              <span class="route-panel__source">${escapeHtml(route.categoryHint)}</span>
            </span>
            <span class="route-panel__title">${escapeHtml(route.name)}</span>
            <span class="route-panel__summary">${escapeHtml(route.summary)}</span>
            <span class="route-panel__prompt">${escapeHtml(route.prompt)}</span>
            <span class="route-panel__skills">
              ${previewNames.map(name => `<span>${escapeHtml(name)}</span>`).join('')}
              ${moreCount ? `<span>+${moreCount}</span>` : ''}
            </span>
          </button>
        </article>
      `;
    }).join('');
    syncRevealItems();
  }

  function renderReferencePatterns() {
    if (!nodes.referencePatterns) return;

    nodes.referencePatterns.innerHTML = `
      <div class="reference-patterns__head">
        <span>质量标准</span>
        <button type="button" data-route-clear>显示全部</button>
      </div>
      ${referencePatterns.map((pattern, index) => `
        <article class="reference-pattern">
          <p>标准 ${String(index + 1).padStart(2, '0')}</p>
          <h3>${escapeHtml(pattern.title)}</h3>
          <span>${escapeHtml(pattern.lesson)}</span>
        </article>
      `).join('')}
    `;
    syncRevealItems();
  }

  function taskSkillNames(brief) {
    return (brief.skillIds || [])
      .map(id => skillsById.get(id)?.name)
      .filter(Boolean);
  }

  function renderTaskBriefs() {
    if (!nodes.taskBriefBoard) return;

    const activeBrief = taskBriefs.find(brief => brief.id === state.briefId) || taskBriefs[0] || null;
    if (!activeBrief) {
      nodes.taskBriefBoard.innerHTML = '<p class="route-board__empty">暂无可用任务</p>';
      return;
    }

    const activeRoute = discoveryRoutes.find(item => item.id === activeBrief.routeId);
    const activeSkillNames = taskSkillNames(activeBrief);

    const briefOptions = taskBriefs.map(brief => {
      const isActive = brief.id === state.briefId;
      const route = discoveryRoutes.find(item => item.id === brief.routeId);

      return `
        <article class="task-brief-card ${isActive ? 'is-active' : ''}">
          <button class="task-brief-card__button" type="button" data-brief-id="${escapeHtml(brief.id)}" aria-pressed="${isActive ? 'true' : 'false'}">
            <span class="task-brief-card__top">
              <span class="task-brief-card__signal">${escapeHtml(brief.signal)}</span>
              <span class="task-brief-card__route">${escapeHtml(route?.name || brief.title)}</span>
            </span>
            <span class="task-brief-card__title">${escapeHtml(brief.title)}</span>
          </button>
        </article>
      `;
    }).join('');

    nodes.taskBriefBoard.innerHTML = `
      <div class="task-brief-board__rail">
        ${briefOptions}
      </div>
      <aside class="task-brief-board__detail" aria-live="polite">
        <span class="task-brief-board__eyebrow">${escapeHtml(activeBrief.signal)}</span>
        <h3>${escapeHtml(activeBrief.title)}</h3>
        <p>${escapeHtml(activeBrief.summary)}</p>
        <div class="task-brief-board__meta">
          <span>${escapeHtml(activeRoute?.categoryHint || '工作流')}</span>
          <span>${escapeHtml(activeRoute?.mode || '任务组合')}</span>
        </div>
        <div class="task-brief-board__outcome">
          <span>目标产物</span>
          <strong>${escapeHtml(activeBrief.outcome)}</strong>
        </div>
        <div class="task-brief-board__route">
          <span>匹配路径</span>
          <strong>${escapeHtml(activeRoute?.name || '自动收窄目录')}</strong>
        </div>
        <div class="task-brief-card__skills">
          ${activeSkillNames.slice(0, 6).map(name => `<span>${escapeHtml(name)}</span>`).join('')}
          ${activeSkillNames.length > 6 ? `<span>+${activeSkillNames.length - 6}</span>` : ''}
        </div>
        <a class="task-brief-board__link" href="#skill-library">查看匹配目录</a>
      </aside>
    `;
    syncRevealItems();
  }

  function selectDiscoveryRoute(routeId, shouldScroll = true) {
    const route = discoveryRoutes.find(item => item.id === routeId);
    if (!route) return;

    state.routeId = route.id;
    state.categoryId = allCategory()?.id || 'all';
    state.query = route.query || '';

    if (nodes.searchInput) nodes.searchInput.value = state.query;
    renderMarketplaceCategories();
    renderDiscoveryRoutes();
    renderLibrary();

    const firstVisibleSkill = filteredSkills()[0];
    if (firstVisibleSkill) selectSkill(firstVisibleSkill.id);

    if (shouldScroll && !reduceMotionQuery.matches) {
      document.getElementById('skill-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function clearDiscoveryRoute() {
    state.routeId = null;
    state.query = '';
    state.categoryId = allCategory()?.id || 'all';
    if (nodes.searchInput) nodes.searchInput.value = '';
    renderMarketplaceCategories();
    renderDiscoveryRoutes();
    renderLibrary();
    if (skills[0]) selectSkill(skills[0].id);
  }

  function renderCounts() {
    if (nodes.skillCount) nodes.skillCount.textContent = String(skills.length).padStart(2, '0');
    if (nodes.workflowCount) nodes.workflowCount.textContent = String(collections.length).padStart(2, '0');
    if (nodes.runbookCount) nodes.runbookCount.textContent = String(runbooks.length).padStart(2, '0');
    if (nodes.categoryCount) nodes.categoryCount.textContent = String(visibleMarketplaceCategories.length).padStart(2, '0');
  }

  function blueprintSkillNames(blueprint) {
    return (blueprint.steps || [])
      .map(id => skillsById.get(id)?.name)
      .filter(Boolean);
  }

  function renderStackBlueprints() {
    if (!nodes.stackBlueprints) return;

    nodes.stackBlueprints.innerHTML = stackBlueprints.map(blueprint => {
      const isActive = blueprint.id === state.blueprintId;
      const skillNames = blueprintSkillNames(blueprint);

      return `
        <article class="stack-blueprint ${isActive ? 'is-active' : ''}">
          <button class="stack-blueprint__button" type="button" data-blueprint-id="${escapeHtml(blueprint.id)}" aria-pressed="${isActive ? 'true' : 'false'}">
            <span class="stack-blueprint__top">
              <span class="stack-blueprint__label">Blueprint</span>
              <span class="stack-blueprint__focus">${escapeHtml(blueprint.focus)}</span>
            </span>
            <span class="stack-blueprint__name">${escapeHtml(blueprint.name)}</span>
            <span class="stack-blueprint__summary">${escapeHtml(blueprint.summary)}</span>
            <span class="stack-blueprint__steps">
              ${skillNames.slice(0, 5).map(name => `<span>${escapeHtml(name)}</span>`).join('')}
              ${skillNames.length > 5 ? `<span>+${skillNames.length - 5}</span>` : ''}
            </span>
          </button>
        </article>
      `;
    }).join('');
    syncRevealItems();
  }

  function activeStackSkills() {
    const activeBlueprint = stackBlueprints.find(item => item.id === state.blueprintId) || stackBlueprints[0] || null;
    const stackIds = state.stackIds.length ? state.stackIds : (activeBlueprint?.steps || []);
    return stackIds.map(id => skillsById.get(id)).filter(Boolean);
  }

  function renderExecutionStack() {
    if (!nodes.executionStack) return;

    const activeBlueprint = stackBlueprints.find(item => item.id === state.blueprintId) || stackBlueprints[0] || null;
    const stackSkills = activeStackSkills();

    nodes.executionStack.innerHTML = `
      <div class="execution-stack__header">
        <div>
          <span>Execution stack</span>
          <strong>${escapeHtml(activeBlueprint?.name || '未选择蓝图')}</strong>
        </div>
        <button type="button" data-stack-clear>清空</button>
      </div>
      <p class="execution-stack__summary">${escapeHtml(activeBlueprint?.summary || '从蓝图开始串联 skill。')}</p>
      <div class="execution-stack__steps">
        ${stackSkills.map((skill, index) => `
          <article class="execution-step">
            <span class="execution-step__index">${String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>${escapeHtml(skill.name)}</strong>
              <p>${escapeHtml(skill.description)}</p>
            </div>
            <button type="button" data-stack-remove="${escapeHtml(skill.id)}" aria-label="移除 ${escapeHtml(skill.name)}">移除</button>
          </article>
        `).join('')}
      </div>
      <div class="execution-stack__footer">
        <button type="button" data-stack-copy>复制执行栈</button>
        <span>${stackSkills.length} 个步骤</span>
      </div>
    `;
    syncRevealItems();
  }

  function stackPlanText() {
    return activeStackSkills()
      .map((skill, index) => `${String(index + 1).padStart(2, '0')}. ${skill.name} - ${skill.install}`)
      .join('\n');
  }

  function renderRunbooks() {
    if (!nodes.fieldGuideGrid) return;

    nodes.fieldGuideGrid.innerHTML = runbooks.map(runbook => {
      const checks = runbook.checks || [
        runbook.backups?.length ? '先完成备份' : '',
        runbook.acceptance?.[0] || ''
      ].filter(Boolean);

      return `
        <article class="field-guide-card">
          <div class="field-guide-card__top">
            <span class="field-guide-card__risk">${escapeHtml(runbook.risk)}</span>
            <a href="${escapeHtml(runbook.repo)}" target="_blank" rel="noopener">来源</a>
          </div>
          <div class="field-guide-card__body">
            <h3>${escapeHtml(runbook.name)}</h3>
            <p class="field-guide-card__summary">${escapeHtml(runbook.summary || runbook.scenario)}</p>
          </div>
          <div class="field-guide-card__quick">
            ${checks.slice(0, 2).map(check => `<span>${escapeHtml(check)}</span>`).join('')}
          </div>
          <details class="field-guide-details">
            <summary>
              <span>展开完整步骤</span>
              <small>备份、边界、验收</small>
            </summary>
            <div class="field-guide-details__body">
              <div class="field-guide-specs field-guide-specs--compact">
                <section>
                  <h4>影响范围</h4>
                  <p>${escapeHtml((runbook.touches || []).slice(0, 2).join('、'))}</p>
                </section>
                <section>
                  <h4>必须备份</h4>
                  <p>${escapeHtml((runbook.backups || []).slice(0, 2).join('、'))}</p>
                </section>
                <section>
                  <h4>验收标准</h4>
                  <p>${escapeHtml((runbook.acceptance || []).slice(0, 2).join('、'))}</p>
                </section>
              </div>
              <p class="field-guide-details__body-note">${escapeHtml(runbook.scenario)}</p>
              <details class="field-guide-steps">
                <summary>
                  <span>再看核心步骤</span>
                  <small>完整流程</small>
                </summary>
                <ol>${(runbook.steps || []).map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
              </details>
            </div>
          </details>
        </article>
      `;
    }).join('');
    syncRevealItems();
  }

  function selectSkill(skillId) {
    const skill = skills.find(item => item.id === skillId) || skills[0];
    if (!skill || !nodes.detailPanel) return;

    state.selectedId = skill.id;
    nodes.detailPanel.innerHTML = `
      <div class="skill-detail-panel__header">
        <div>
          <p class="skill-detail-panel__source">${escapeHtml(skill.category)}</p>
          <h2>${escapeHtml(skill.name)}</h2>
          <p class="skill-detail-panel__route">${escapeHtml(skill.workflow)} · ${escapeHtml(skill.category)}</p>
        </div>
        <a href="${escapeHtml(skill.repo)}" target="_blank" rel="noopener">打开仓库</a>
      </div>
      <p class="skill-detail-panel__desc">${escapeHtml(skill.description)}</p>
      <div class="skill-detail-panel__facts">
        <div>
          <span>创建者</span>
          <strong>${escapeHtml(skill.creator)}</strong>
        </div>
        <div>
          <span>工作流</span>
          <strong>${escapeHtml(skill.workflow)}</strong>
        </div>
        <div>
          <span>安装方式</span>
          <strong>${escapeHtml(skill.installType)}</strong>
        </div>
        <div>
          <span>状态</span>
          <strong>${escapeHtml(skill.status)}</strong>
        </div>
        <div>
          <span>质量信号</span>
          <strong>${escapeHtml(skill.quality)}</strong>
        </div>
        <div>
          <span>来源类型</span>
          <strong>${escapeHtml(skill.origin)}</strong>
        </div>
        <div>
          <span>使用角色</span>
          <strong>${escapeHtml(skill.userRole || '任务执行者')}</strong>
        </div>
        <div>
          <span>风险</span>
          <strong>${escapeHtml(skill.riskLevel || '使用前复核')}</strong>
        </div>
      </div>
      <div class="skill-detail-panel__summary-line">
        <span><small>来源</small>${escapeHtml(skill.source)}</span>
        <span><small>维护状态</small>${escapeHtml(skill.maturity || '')}</span>
      </div>
      <div class="skill-repo-block">
        <span>仓库链接</span>
        <a href="${escapeHtml(skill.repo)}" target="_blank" rel="noopener">${escapeHtml(skill.repo)}</a>
      </div>
      <div class="skill-install-block">
        <span>下载 / 安装命令</span>
        <code>${escapeHtml(skill.install)}</code>
        <button type="button" data-copy-install="${escapeHtml(skill.install)}">复制</button>
      </div>
      <details class="skill-detail-panel__dossier">
        <summary>
          <span>深度档案</span>
          <strong>输入、输出、失败模式和信任线索</strong>
        </summary>
        <div class="skill-detail-panel__dossier-grid">
          <section>
            <h3>输入</h3>
            <ul>${listItems(skill.input || skill.bestFor)}</ul>
          </section>
          <section>
            <h3>输出</h3>
            <ul>${listItems(skill.output || skill.verification || [])}</ul>
          </section>
          <section>
            <h3>快速开始</h3>
            <ul>${listItems(skill.quickStart || skill.bestFor)}</ul>
          </section>
          <section>
            <h3>常见失败</h3>
            <ul>${listItems(skill.failureModes || skill.avoidWhen)}</ul>
          </section>
          <section>
            <h3>信任线索</h3>
            <ul>${listItems(skill.trust || skill.verification || [])}</ul>
          </section>
          <section>
            <h3>来源链</h3>
            <ul>${listItems(skill.sourceTrail || [skill.source, skill.repo])}</ul>
          </section>
        </div>
      </details>
      <div class="skill-detail-panel__actions">
        <button type="button" data-stack-add="${escapeHtml(skill.id)}">加入执行栈</button>
      </div>
      <div class="skill-detail-panel__lists">
        <section>
          <h3>适用边界</h3>
          <ul>${listItems(skill.bestFor)}</ul>
        </section>
        <section>
          <h3>不适合</h3>
          <ul>${listItems(skill.avoidWhen)}</ul>
        </section>
        <section>
          <h3>验证标准</h3>
          <ul>${listItems(skill.verification || [])}</ul>
        </section>
      </div>
      <div class="skill-tags">${tagList(skill.tags)}</div>
    `;

    renderLibrary();
  }

  function selectCategory(categoryId, options = {}) {
    const category = visibleMarketplaceCategories.find(item => item.id === categoryId) || visibleMarketplaceCategories[0];
    if (!category) return;

    state.categoryId = category.id;
    if (options.clearRoute !== false) state.routeId = null;
    if (options.clearQuery) {
      state.query = '';
      if (nodes.searchInput) nodes.searchInput.value = '';
    }

    renderMarketplaceCategories();
    renderDiscoveryRoutes();
    renderLibrary();

    const firstVisibleSkill = filteredSkills()[0];
    if (firstVisibleSkill) selectSkill(firstVisibleSkill.id);

    if (options.shouldScroll && !reduceMotionQuery.matches) {
      document.getElementById('skill-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function selectTaskBrief(briefId) {
    const brief = taskBriefs.find(item => item.id === briefId);
    if (!brief) return;
    state.briefId = brief.id;
    state.routeId = brief.routeId || null;
    state.query = '';
    if (nodes.searchInput) nodes.searchInput.value = '';
    const firstSkill = (brief.skillIds || []).map(id => skillsById.get(id)).find(Boolean);
    state.categoryId = allCategory()?.id || 'all';
    renderTaskBriefs();
    renderMarketplaceCategories();
    renderDiscoveryRoutes();
    renderLibrary();
    if (firstSkill) selectSkill(firstSkill.id);
  }

  function openSkillStack(shouldScroll = false) {
    if (shouldScroll && !reduceMotionQuery.matches) {
      nodes.skillStack?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function selectBlueprint(blueprintId, shouldOpen = false) {
    const blueprint = stackBlueprints.find(item => item.id === blueprintId);
    if (!blueprint) return;
    state.blueprintId = blueprint.id;
    state.stackIds = [...blueprint.steps];
    renderStackBlueprints();
    renderExecutionStack();
    if (shouldOpen) openSkillStack(false);
  }

  function addSkillToStack(skillId) {
    if (!skillsById.has(skillId)) return;
    if (!state.stackIds.includes(skillId)) {
      state.stackIds = [...state.stackIds, skillId];
      renderExecutionStack();
    }
    openSkillStack(false);
    if (nodes.copyStatus) nodes.copyStatus.textContent = '已加入执行栈';
  }

  function removeFromStack(skillId) {
    state.stackIds = state.stackIds.filter(id => id !== skillId);
    renderExecutionStack();
  }

  function clearStack() {
    state.stackIds = [];
    renderExecutionStack();
  }

  async function copyStackPlan() {
    const text = stackPlanText();
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!copyWithSelection(text)) {
        throw new Error('Clipboard fallback failed');
      }
      if (nodes.copyStatus) nodes.copyStatus.textContent = '执行栈已复制';
    } catch (error) {
      if (copyWithSelection(text)) {
        if (nodes.copyStatus) nodes.copyStatus.textContent = '执行栈已复制';
      } else if (nodes.copyStatus) {
        nodes.copyStatus.textContent = '无法自动复制；执行栈已显示在右侧';
      }
    }
  }

  function copyWithSelection(command) {
    const textarea = document.createElement('textarea');
    textarea.value = command;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.inset = '0 auto auto 0';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  }

  async function copyInstall(command) {
    if (!command) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command);
      } else if (!copyWithSelection(command)) {
        throw new Error('Clipboard fallback failed');
      }
      if (nodes.copyStatus) nodes.copyStatus.textContent = '安装命令已复制';
    } catch (error) {
      if (copyWithSelection(command)) {
        if (nodes.copyStatus) nodes.copyStatus.textContent = '安装命令已复制';
      } else if (nodes.copyStatus) {
        nodes.copyStatus.textContent = '无法自动复制；安装命令已显示在上方';
      }
    }
  }

  document.addEventListener('click', event => {
    const briefButton = event.target.closest('[data-brief-id]');
    if (briefButton) {
      selectTaskBrief(briefButton.dataset.briefId);
      return;
    }

    const heroCategoryLink = event.target.closest('[data-hero-category]');
    if (heroCategoryLink) {
      event.preventDefault();
      selectCategory(heroCategoryLink.dataset.heroCategory, {
        clearRoute: true,
        clearQuery: true,
        shouldScroll: true
      });
      return;
    }

    const routeButton = event.target.closest('[data-route-id]');
    if (routeButton) {
      selectDiscoveryRoute(routeButton.dataset.routeId);
      return;
    }

    const routeClearButton = event.target.closest('[data-route-clear]');
    if (routeClearButton) {
      clearDiscoveryRoute();
      return;
    }

    const categoryButton = event.target.closest('[data-category-id]');
    if (categoryButton) {
      selectCategory(categoryButton.dataset.categoryId, { clearRoute: true });
      return;
    }

    const categoryClearButton = event.target.closest('[data-category-clear]');
    if (categoryClearButton) {
      selectCategory(visibleMarketplaceCategories[0]?.id || 'all', { clearRoute: true, clearQuery: true });
      return;
    }

    const skillButton = event.target.closest('[data-skill-id]');
    if (skillButton) {
      selectSkill(skillButton.dataset.skillId);
      return;
    }

    const blueprintButton = event.target.closest('[data-blueprint-id]');
    if (blueprintButton) {
      selectBlueprint(blueprintButton.dataset.blueprintId, true);
      return;
    }

    const stackAddButton = event.target.closest('[data-stack-add]');
    if (stackAddButton) {
      addSkillToStack(stackAddButton.dataset.stackAdd);
      return;
    }

    const copyButton = event.target.closest('[data-copy-install]');
    if (copyButton) {
      copyInstall(copyButton.dataset.copyInstall);
      return;
    }

    const stackRemoveButton = event.target.closest('[data-stack-remove]');
    if (stackRemoveButton) {
      removeFromStack(stackRemoveButton.dataset.stackRemove);
      return;
    }

    const stackCopyButton = event.target.closest('[data-stack-copy]');
    if (stackCopyButton) {
      copyStackPlan();
      return;
    }

    const stackClearButton = event.target.closest('[data-stack-clear]');
    if (stackClearButton) {
      clearStack();
    }
  });

  if (nodes.searchInput) {
    nodes.searchInput.addEventListener('input', event => {
      state.routeId = null;
      state.query = event.target.value;
      renderMarketplaceCategories();
      renderDiscoveryRoutes();
      renderLibrary();
    });
  }

  renderTaskBriefs();
  renderMarketplaceCategories();
  renderDiscoveryRoutes();
  renderReferencePatterns();
  renderRunbooks();
  renderStackBlueprints();
  renderExecutionStack();
  renderLibrary();
  renderCounts();
  if (stackBlueprints[0]) selectBlueprint(stackBlueprints[0].id);
  selectSkill(state.selectedId);
  initRevealMotion();
})();

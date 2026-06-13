(function () {
  const skills = Array.isArray(window.WP_SKILLS) ? window.WP_SKILLS : [];
  const collections = Array.isArray(window.WP_SKILL_COLLECTIONS) ? window.WP_SKILL_COLLECTIONS : [];
  const runbooks = Array.isArray(window.WP_RUNBOOKS) ? window.WP_RUNBOOKS : [];
  const state = {
    filter: '全部',
    query: '',
    selectedId: skills[0]?.id || null
  };

  const nodes = {
    skillGrid: document.querySelector('[data-skill-grid]'),
    skillCount: document.querySelector('[data-skill-count]'),
    workflowCount: document.querySelector('[data-workflow-count]'),
    runbookCount: document.querySelector('[data-runbook-count]'),
    categoryCount: document.querySelector('[data-category-count]'),
    detailPanel: document.getElementById('skill-detail-panel'),
    filterButtons: Array.from(document.querySelectorAll('[data-filter]')),
    searchInput: document.querySelector('[data-skill-search]'),
    resultMeter: document.querySelector('[data-result-meter]'),
    fieldGuideGrid: document.querySelector('[data-field-guide-grid]'),
    copyStatus: document.querySelector('[data-copy-status]'),
    showcaseCommand: document.querySelector('[data-showcase-command]')
  };

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let revealObserver = null;
  let revealInitialized = false;

  function compactCommand(command) {
    const value = String(command || '').replace(/\s+/g, ' ').trim();
    return value.length > 118 ? `${value.slice(0, 115)}...` : value;
  }

  function revealCandidates() {
    return Array.from(document.querySelectorAll([
      '.skills-hero__copy',
      '.hero-product-visual',
      '.skill-card',
      '.skill-detail-panel',
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

  function initShowcaseCommandLoop() {
    if (!nodes.showcaseCommand || skills.length === 0) return;

    const commands = skills
      .map(skill => skill.install)
      .filter(Boolean)
      .slice(0, 7)
      .map(compactCommand);

    if (commands.length === 0) return;
    nodes.showcaseCommand.textContent = commands[0];
    if (commands.length === 1 || reduceMotionQuery.matches) return;

    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % commands.length;
      nodes.showcaseCommand.classList.add('is-changing');
      window.setTimeout(() => {
        nodes.showcaseCommand.textContent = commands[index];
        nodes.showcaseCommand.classList.remove('is-changing');
      }, 180);
    }, 3600);
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
      ...(skill.verification || []),
      ...(skill.tags || [])
    ].join(' '));
  }

  function filteredSkills() {
    const query = normalize(state.query);

    return skills.filter(skill => {
      if (state.filter !== '全部' && skill.category !== state.filter) return false;
      if (query && !skillSearchText(skill).includes(query)) return false;
      return true;
    });
  }

  function cardMarkup(skill) {
    const isSelected = skill.id === state.selectedId;
    return `
      <article class="skill-card ${isSelected ? 'is-selected' : ''}">
        <button class="skill-card__button" type="button" data-skill-id="${escapeHtml(skill.id)}" aria-pressed="${isSelected ? 'true' : 'false'}">
          <span class="skill-card__meta">
            <span>${escapeHtml(skill.origin)}</span>
            <span>${escapeHtml(skill.category)}</span>
            <span>${escapeHtml(skill.installType)}</span>
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
    if (nodes.resultMeter) {
      const query = state.query ? `，匹配「${state.query}」` : '';
      nodes.resultMeter.textContent = `${String(visible.length).padStart(2, '0')} 个结果${query}`;
    }
    nodes.skillGrid.innerHTML = visible.length
      ? visible.map(skill => cardMarkup(skill)).join('')
      : '<div class="skill-empty"><strong>没有匹配的 skill</strong><span>可以换一个更宽泛的关键词，或切回全部。</span></div>';
    syncRevealItems();
  }

  function renderCounts() {
    const categories = new Set(skills.map(skill => skill.category));
    if (nodes.skillCount) nodes.skillCount.textContent = String(skills.length).padStart(2, '0');
    if (nodes.workflowCount) nodes.workflowCount.textContent = String(collections.length).padStart(2, '0');
    if (nodes.runbookCount) nodes.runbookCount.textContent = String(runbooks.length).padStart(2, '0');
    if (nodes.categoryCount) nodes.categoryCount.textContent = String(categories.size).padStart(2, '0');
  }

  function renderRunbooks() {
    if (!nodes.fieldGuideGrid) return;

    nodes.fieldGuideGrid.innerHTML = runbooks.map(runbook => `
      <article class="field-guide-card">
        <div class="field-guide-card__top">
          <span class="field-guide-card__risk">${escapeHtml(runbook.risk)}</span>
          <a href="${escapeHtml(runbook.repo)}" target="_blank" rel="noopener">来源</a>
        </div>
        <div class="field-guide-card__body">
          <p>${escapeHtml(runbook.source)}</p>
          <h3>${escapeHtml(runbook.name)}</h3>
          <p>${escapeHtml(runbook.scenario)}</p>
        </div>
        <div class="field-guide-specs">
          <section>
            <h4>影响范围</h4>
            <ul>${listItems(runbook.touches || [])}</ul>
          </section>
          <section>
            <h4>必须备份</h4>
            <ul>${listItems(runbook.backups || [])}</ul>
          </section>
          <section>
            <h4>禁止动作</h4>
            <ul>${listItems(runbook.donts || [])}</ul>
          </section>
          <section>
            <h4>验收标准</h4>
            <ul>${listItems(runbook.acceptance || [])}</ul>
          </section>
        </div>
        <div class="field-guide-steps">
          <h4>核心步骤</h4>
          <ol>${(runbook.steps || []).map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
        </div>
      </article>
    `).join('');
    syncRevealItems();
  }

  function selectSkill(skillId) {
    const skill = skills.find(item => item.id === skillId) || skills[0];
    if (!skill || !nodes.detailPanel) return;

    state.selectedId = skill.id;
    nodes.detailPanel.innerHTML = `
      <div class="skill-detail-panel__header">
        <div>
          <p class="skill-detail-panel__source">${escapeHtml(skill.source)}</p>
          <h2>${escapeHtml(skill.name)}</h2>
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

  function updateFilters(nextFilter) {
    state.filter = nextFilter;
    nodes.filterButtons.forEach(button => {
      const isActive = button.dataset.filter === nextFilter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    renderLibrary();
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
    const filterButton = event.target.closest('[data-filter]');
    if (filterButton) {
      updateFilters(filterButton.dataset.filter);
      return;
    }

    const skillButton = event.target.closest('[data-skill-id]');
    if (skillButton) {
      selectSkill(skillButton.dataset.skillId);
      return;
    }

    const copyButton = event.target.closest('[data-copy-install]');
    if (copyButton) {
      copyInstall(copyButton.dataset.copyInstall);
    }
  });

  if (nodes.searchInput) {
    nodes.searchInput.addEventListener('input', event => {
      state.query = event.target.value;
      renderLibrary();
    });
  }

  renderRunbooks();
  renderLibrary();
  renderCounts();
  selectSkill(state.selectedId);
  initRevealMotion();
  initShowcaseCommandLoop();
})();

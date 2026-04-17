(function () {
  'use strict';

  const currentScript = document.currentScript;
  const versionSuffix = currentScript && currentScript.src.includes('?')
    ? currentScript.src.slice(currentScript.src.indexOf('?'))
    : '';
  const calendarScriptUrl = '/js/hexo_githubcalendar.js' + versionSuffix;
  const shouldLoad = () => {
    const path = location.pathname || '/';
    if (path === '/' || path === '/index.html') return true;
    return Boolean(document.getElementById('recent-posts'));
  };

  const pending = [];
  let loading = false;
  let scheduled = false;

  const flushQueue = () => {
    while (pending.length) {
      const args = pending.shift();
      if (typeof window.GithubCalendar === 'function') {
        window.GithubCalendar.apply(null, args);
      }
    }
  };

  const loadCalendarScript = () => {
    if (loading) return;
    loading = true;
    const script = document.createElement('script');
    script.src = calendarScriptUrl;
    script.async = true;
    script.onload = flushQueue;
    script.onerror = () => {
      pending.length = 0;
    };
    document.head.appendChild(script);
  };

  const scheduleLoad = () => {
    if (loading || scheduled) return;
    scheduled = true;

    const observeAndLoad = () => {
      const target = document.getElementById('github_container') || document.getElementById('recent-posts');
      if (!target || !('IntersectionObserver' in window)) {
        loadCalendarScript();
        return;
      }

      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        loadCalendarScript();
      }, { rootMargin: '240px 0px' });

      observer.observe(target);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(observeAndLoad, { timeout: 1500 });
      return;
    }

    setTimeout(observeAndLoad, 600);
  };

  window.GithubCalendar = function () {
    if (!shouldLoad()) return;
    pending.push(Array.from(arguments));
    scheduleLoad();
  };
})();

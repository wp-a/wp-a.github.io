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

  window.GithubCalendar = function () {
    if (!shouldLoad()) return;
    pending.push(Array.from(arguments));
    loadCalendarScript();
  };
})();

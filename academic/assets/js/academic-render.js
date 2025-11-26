let currentLang = 'zh'; // 默认中文
let data = null;

// 渲染内容函数（根据当前语言）
function renderContent() {
    if (!data) return;

    const lang = currentLang;

    // 渲染侧边栏
    document.getElementById('author-title').innerHTML = data.profile.title[lang] + '<br>' + data.profile.affiliation[lang];

    // Typing Effect for Bio
    const bioElement = document.getElementById('author-desc');
    bioElement.innerHTML = ''; // Clear first
    const bioText = data.profile.bio[lang];

    // Simple HTML typing simulation
    // Note: Real typing effect with HTML tags is complex, so we just fade it in for elegance
    bioElement.innerHTML = bioText;
    bioElement.style.opacity = 0;
    bioElement.style.transition = 'opacity 1.5s ease';
    setTimeout(() => {
        bioElement.style.opacity = 1;
    }, 500);

    // 渲染 About 部分
    const aboutContent = document.getElementById('about-content');
    aboutContent.innerHTML = ''; // 清空
    data.about[lang].forEach(para => {
        const p = document.createElement('p');
        p.innerHTML = para;
        aboutContent.appendChild(p);
    });

    // 渲染 News
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // 清空
    data.news[lang].forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="news-date">${item.date}:</span><span>${item.content}</span>`;
        newsList.appendChild(li);
    });

    // 渲染 Publications
    const pubsList = document.getElementById('publications-list');
    pubsList.innerHTML = ''; // 清空
    data.publications.forEach(paper => {
        const div = document.createElement('div');
        div.className = 'paper-item';

        const paperLinks = paper.links[lang];
        let linksHtml = '';
        if (lang === 'zh') {
            if (paperLinks.paper) linksHtml += `<a href="${paperLinks.paper}">[论文]</a>`;
            if (paperLinks.code) linksHtml += `<a href="${paperLinks.code}">[代码]</a>`;
            if (paperLinks.project) linksHtml += `<a href="${paperLinks.project}">[项目主页]</a>`;
        } else {
            if (paperLinks.paper) linksHtml += `<a href="${paperLinks.paper}">[Paper]</a>`;
            if (paperLinks.code) linksHtml += `<a href="${paperLinks.code}">[Code]</a>`;
            if (paperLinks.project) linksHtml += `<a href="${paperLinks.project}">[Project]</a>`;
        }

        const noteHtml = paper.note ? `<div class="paper-note" style="color: #666; font-size: 0.85rem; margin-top: 5px;">${paper.note[lang]}</div>` : '';

        div.innerHTML = `
      <div class="paper-img-box">
        <div class="conf-badge ${paper.venueClass}">${paper.venue.split(',')[0]}</div>
        <img src="${paper.image}" alt="Paper Thumbnail">
      </div>
      <div class="paper-info">
        <div class="paper-title">${paper.title}</div>
        <div class="paper-authors">${paper.authors}</div>
        ${noteHtml}
        <div class="paper-links">${linksHtml}</div>
      </div>
    `;
        pubsList.appendChild(div);
    });

    // 渲染 Honors
    const honorsList = document.getElementById('honors-list');
    honorsList.innerHTML = ''; // 清空
    data.honors[lang].forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="news-date">${item.year}</span> ${item.title}`;
        honorsList.appendChild(li);
    });
}

// 语言切换函数
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';

    // 更新切换按钮文字
    document.getElementById('lang-text').textContent = currentLang === 'zh' ? 'English' : '中文';

    // 显示/隐藏对应语言的UI文本
    const zhElements = document.querySelectorAll('.lang-zh');
    const enElements = document.querySelectorAll('.lang-en');

    if (currentLang === 'zh') {
        zhElements.forEach(el => el.style.display = 'inline');
        enElements.forEach(el => el.style.display = 'none');
    } else {
        zhElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = 'inline');
    }

    // 重新渲染内容
    renderContent();
}

// 暗黑模式切换函数
function toggleDarkMode() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    body.classList.toggle('dark-mode');

    // 更新图标
    if (body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function () {
    // 恢复用户的主题偏好
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    }

    if (typeof academicData === 'undefined') {
        console.error('academic-data.js 未加载成功！');
        return;
    }

    data = academicData;

    // 设置页面标题
    document.getElementById('page-title').textContent = data.profile.name + ' - Academic Homepage';

    // 渲染侧边栏（固定不变的部分）
    document.getElementById('avatar').src = data.profile.avatar || '/img/head.webp';
    document.getElementById('author-name').textContent = data.profile.name;
    document.getElementById('location').textContent = data.profile.location;
    document.getElementById('email').href = 'mailto:' + data.profile.email;
    document.getElementById('github').href = data.profile.github;
    // document.getElementById('scholar').href = data.profile.scholar; // 暂时隐藏
    document.getElementById('blog').href = data.profile.blog;

    // 初次渲染内容（默认中文）
    renderContent();
});

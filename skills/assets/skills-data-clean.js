const WP_SKILL_REPO_BASE = "https://github.com/wp-a";

window.WP_SKILLS = [
  // 自研工具
  {
    id: "academic-review-workflow",
    name: "学术审稿工作流",
    source: "WPIRONMAN",
    origin: "自研",
    category: "审稿",
    creator: "WPIRONMAN",
    workflow: "稿件预审",
    installType: "GitHub 仓库",
    status: "产品工作流",
    quality: "产品化工作流",
    description: "围绕证据、相关工作、修改计划和期刊会议匹配构建的稿件预审工作流。",
    bestFor: ["投稿前的稿件诊断", "生成 reviewer 风格的问题与修改计划"],
    install: "git clone https://github.com/wp-a/academic-submission.git",
    repo: "https://github.com/wp-a/academic-submission",
    tags: ["审稿", "学术", "证据", "工作流"],
    featured: true
  },
  {
    id: "wpironman-blog-design",
    name: "WPIRONMAN 博客设计",
    source: "WPIRONMAN",
    origin: "自研",
    category: "设计",
    creator: "WPIRONMAN",
    workflow: "博客与站点 QA",
    installType: "独立仓库",
    status: "可下载",
    quality: "本地生产工作流",
    description: "面向 WPIRONMAN Hexo 与 Butterfly 博客的受控设计、重构和上线前 QA 工作流。",
    bestFor: ["博客首页与项目页的视觉打磨", "部署前的真实渲染与视觉 QA"],
    install: "npx skills add https://github.com/wp-a/wpironman-skills",
    repo: "https://github.com/wp-a/wpironman-skills",
    tags: ["Hexo", "Butterfly", "QA", "设计"],
    featured: true
  },

  // 社区开源工具
  {
    id: "ml-paper-writing",
    name: "ML 顶会论文写作",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "面向 NeurIPS、ICML、ICLR、ACL、AAAI 等顶会的论文写作工作流（开源工具）",
    tags: ["NeurIPS", "ICLR", "LaTeX"],
    repo: "https://github.com/wp-a/ml-paper-writing",
    featured: true,
    workflow: "顶会论文初稿",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "research-paper-writing",
    name: "Research Paper Writing",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "用于 ML/CV/NLP 论文的段落重写与 claim-evidence 对齐（开源工具）",
    tags: ["改写", "审稿视角"],
    repo: "https://github.com/wp-a/research-paper-writing",
    workflow: "段落与章节重写",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-reader",
    name: "Nature 论文阅读器",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "生成有来源锚点的中英文论文阅读稿，保留图表和引用（开源工具）",
    tags: ["PDF", "双语"],
    repo: "https://github.com/wp-a/nature-reader",
    featured: true,
    workflow: "论文精读",
    installType: "独立仓库",
    status: "工作流已验证"
  },
  {
    id: "nature-writing",
    name: "Nature 风格正文写作",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "从中文 notes 到 Nature 风格英文 manuscript（开源工具）",
    tags: ["Nature", "Manuscript"],
    repo: "https://github.com/wp-a/nature-writing",
    workflow: "Nature-style manuscript",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-polishing",
    name: "Nature 英文润色",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "学术英文润色、中文作者表达校准（开源工具）",
    tags: ["润色", "Academic English"],
    repo: "https://github.com/wp-a/nature-polishing",
    workflow: "学术英文润色",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-academic-search",
    name: "多源文献检索",
    source: "社区开源",
    origin: "开源工具",
    category: "文献检索",
    creator: "社区",
    description: "整合 PubMed、CrossRef、arXiv 等来源的检索工具（开源工具）",
    tags: ["CrossRef", "arXiv", "PubMed"],
    repo: "https://github.com/wp-a/nature-academic-search",
    featured: true,
    workflow: "检索与引用核验",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-citation",
    name: "Nature/CNS 引用补全",
    source: "社区开源",
    origin: "开源工具",
    category: "文献检索",
    creator: "社区",
    description: "给论文段落补引用，检查 claim-evidence 关系（开源工具）",
    tags: ["引用", "CNS", "BibTeX"],
    repo: "https://github.com/wp-a/nature-citation",
    workflow: "引用插入与核验",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-response",
    name: "Reviewer Response",
    source: "社区开源",
    origin: "开源工具",
    category: "审稿",
    creator: "社区",
    description: "把审稿意见整理成 point-by-point response letter（开源工具）",
    tags: ["返修", "Response Letter"],
    repo: "https://github.com/wp-a/nature-response",
    workflow: "返修回复",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-paper2ppt",
    name: "论文汇报 PPT",
    source: "社区开源",
    origin: "开源工具",
    category: "PPT",
    creator: "社区",
    description: "从论文 PDF 生成中文论文汇报 PPTX（开源工具）",
    tags: ["PPTX", "组会"],
    repo: "https://github.com/wp-a/nature-paper2ppt",
    featured: true,
    workflow: "Paper to PPT",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "nature-figure",
    name: "论文图表打磨",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "论文图、表、caption 的最终质量检查（开源工具）",
    tags: ["Figure", "Table"],
    repo: "https://github.com/wp-a/nature-figure",
    workflow: "Figure polish",
    installType: "独立仓库",
    status: "轻量公开版"
  },
  {
    id: "pdf",
    name: "PDF 读写与渲染",
    source: "社区开源",
    origin: "开源工具",
    category: "论文写作",
    creator: "社区",
    description: "读取、生成、渲染和检查 PDF（开源工具）",
    tags: ["PDF", "渲染"],
    repo: "https://github.com/wp-a/pdf",
    workflow: "PDF processing",
    installType: "独立仓库",
    status: "可下载"
  },

  // 第三方推荐
  {
    id: "research-writing-assistant",
    name: "科研写作助手",
    source: "Norman-bury",
    origin: "第三方",
    category: "论文写作",
    creator: "Norman-bury",
    description: "面向本科生、研究生的科研写作协作系统（第三方工具）",
    tags: ["论文写作", "毕业论文"],
    repo: "https://github.com/Norman-bury/research-writing-skill",
    workflow: "学术写作",
    installType: "独立仓库",
    status: "可下载"
  },
  {
    id: "guizang-ppt-skill",
    name: "歸藏 PPT Skill",
    source: "歸藏",
    origin: "第三方",
    category: "PPT",
    creator: "歸藏",
    description: "用于生成高级视觉 PPT/HTML 演示稿（第三方工具）",
    tags: ["PPT", "演示"],
    repo: "https://github.com/op7418/guizang-ppt-skill",
    workflow: "演示文稿",
    installType: "独立仓库",
    status: "可下载"
  }
];

// 工作流集合
window.WP_SKILL_COLLECTIONS = [];

// Runbooks
window.WP_RUNBOOKS = [
  {
    id: "codex-provider-metadata-recovery",
    name: "Codex Provider Metadata 恢复",
    risk: "高风险",
    source: "Dailin521",
    scenario: "旧会话因为 provider、可见性 metadata 不一致，在 Desktop 或 /resume 里不可见",
    repo: "https://github.com/Dailin521/codex-provider-sync"
  },
  {
    id: "codex-plus-plus-plugin-entry",
    name: "Codex++ 插件入口解锁",
    risk: "中高风险",
    source: "BigPizzaV3",
    scenario: "Codex Desktop 已能使用中转 API，但插件按钮或增强入口不可见",
    repo: "https://github.com/BigPizzaV3/CodexPlusPlus"
  }
];

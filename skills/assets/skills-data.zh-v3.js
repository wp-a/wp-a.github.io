const WP_SKILL_REPO_BASE = "https://github.com/wp-a";

window.WP_SKILLS = [
  {
    id: "wpironman-blog-design",
    name: "WPIRONMAN 博客设计",
    source: "WPIRONMAN",
    origin: "WPIRONMAN",
    category: "设计",
    creator: "WPIRONMAN",
    workflow: "博客与站点 QA",
    installType: "独立仓库",
    status: "可下载",
    quality: "本地生产工作流",
    description: "面向 WPIRONMAN Hexo 与 Butterfly 博客的受控设计、重构和上线前 QA 工作流。",
    bestFor: [
      "博客首页与项目页的视觉打磨",
      "需要保留评论、Pjax 和 Butterfly 主题能力的改动",
      "部署前的真实渲染与视觉 QA"
    ],
    avoidWhen: [
      "目标不是 Hexo 或 Butterfly 站点",
      "只需要脱离 WPIRONMAN 语境的通用前端建议"
    ],
    verification: [
      "改动前先读 Hexo/Butterfly 当前实现和页面级 CSS",
      "生成后的 /skills/ 或目标页面在桌面与移动视口无横向溢出",
      "Pjax、评论、导航和页面资源版本不被改坏"
    ],
    install: "npx skills add https://github.com/wp-a/wpironman-blog-design",
    repo: `${WP_SKILL_REPO_BASE}/wpironman-blog-design`,
    tags: ["Hexo", "Butterfly", "QA", "设计"]
  },
  {
    id: "ml-paper-writing",
    name: "ML 顶会论文写作",
    source: "wp-a/ml-paper-writing",
    origin: "WPIRONMAN 整理",
    category: "论文写作",
    creator: "Orchestra Research / WPIRONMAN",
    workflow: "顶会论文初稿",
    installType: "独立仓库",
    status: "可下载",
    quality: "顶会写作工作流",
    description: "面向 NeurIPS、ICML、ICLR、ACL、AAAI、COLM 和系统顶会的论文写作、结构、引用与 camera-ready 工作流。",
    bestFor: [
      "从研究 repo、实验结果和 notes 写第一版论文",
      "整理 Introduction、Method、Experiments 和 Related Work",
      "需要严格处理引用、BibTeX 和 venue checklist"
    ],
    avoidWhen: [
      "没有任何实验结果或贡献边界",
      "只需要一段中文润色"
    ],
    verification: [
      "论文主张能对应到实验结果、图表或代码证据",
      "引用、BibTeX 和 venue checklist 已逐项核验",
      "最终稿能按目标会议模板编译或进入 camera-ready 检查"
    ],
    install: "npx skills add https://github.com/wp-a/ml-paper-writing",
    repo: `${WP_SKILL_REPO_BASE}/ml-paper-writing`,
    tags: ["论文写作", "NeurIPS", "ICLR", "ACL", "LaTeX", "引用"]
  },
  {
    id: "research-paper-writing",
    name: "Research Paper Writing",
    source: "wp-a/research-paper-writing",
    origin: "WPIRONMAN",
    category: "论文写作",
    creator: "WPIRONMAN",
    workflow: "段落与章节重写",
    installType: "独立仓库",
    status: "可下载",
    quality: "论文表达与自查",
    description: "用于 ML/CV/NLP 论文的 Abstract、Introduction、Related Work、Method、Experiments 等章节重写与 claim-evidence 对齐。",
    bestFor: [
      "论文已有内容，但逻辑、段落流或 reviewer-facing 表达不清",
      "需要逐段改写、反向大纲和 claim-support 检查",
      "投稿前做自审稿和图表文字检查"
    ],
    avoidWhen: [
      "需要从零做文献检索",
      "作者还没有确定核心 story"
    ],
    verification: [
      "每个段落有明确 topic sentence 和 claim-evidence 关系",
      "重写后保留作者原始科学结论，不新增无来源结论",
      "投稿前完成 reviewer-facing 自查和图表文字检查"
    ],
    install: "npx skills add https://github.com/wp-a/research-paper-writing",
    repo: `${WP_SKILL_REPO_BASE}/research-paper-writing`,
    tags: ["论文写作", "改写", "审稿视角", "段落流"]
  },
  {
    id: "research-writing-assistant",
    name: "科研写作助手",
    source: "Norman-bury/research-writing-skill",
    origin: "第三方",
    category: "论文写作",
    creator: "Norman-bury",
    workflow: "毕业论文与科研写作编排",
    installType: "GitHub 仓库",
    status: "来源已标注",
    quality: "多平台科研写作系统",
    description: "面向本科生、研究生和早期科研人员的科研写作协作系统，覆盖头脑风暴、章节写作、文献综述、LaTeX、图表、自审和环境配置。",
    bestFor: [
      "毕业论文、课程论文或投稿初稿需要从选题推进到章节交付",
      "需要先确认论文类型、学科、题目、研究背景、方法和章节结构",
      "希望把写作正文、章节文件、LaTeX 项目、图表脚本和提示词资产放进可追踪流程"
    ],
    avoidWhen: [
      "只需要一两句英文润色",
      "作者不愿提供题目、学科、方法、数据或文献来源",
      "需要系统直接生成最终 Word 排版成品"
    ],
    verification: [
      "写作前完成头脑风暴或任务包，明确论文类型、学科和章节结构",
      "文献、数据和引用可追溯，不编造来源或实验结果",
      "章节写作后完成规范合规与质量检查，必要时再进入 LaTeX、图表或自审模块"
    ],
    install: "git clone https://github.com/Norman-bury/research-writing-skill.git ~/.codex/research-writing-skill && mkdir -p ~/.agents/skills && ln -s ~/.codex/research-writing-skill/skills ~/.agents/skills/research-writing",
    repo: "https://github.com/Norman-bury/research-writing-skill",
    tags: ["论文写作", "毕业论文", "文献综述", "LaTeX", "图表", "去AI化"]
  },
  {
    id: "nature-reader",
    name: "Nature 论文阅读器",
    source: "wp-a/nature-reader",
    origin: "WPIRONMAN",
    category: "论文写作",
    creator: "WPIRONMAN",
    workflow: "论文精读",
    installType: "独立仓库",
    status: "工作流已验证",
    quality: "可用科研工作流",
    description: "生成有来源锚点的中英文论文阅读稿，并尽量保留图表、表格和引用语境。",
    bestFor: [
      "阅读密集的机器学习或科学论文",
      "从 PDF 生成双语精读笔记",
      "保留图表和正文之间的论证关系"
    ],
    avoidWhen: [
      "只需要一段很短的摘要",
      "原始 PDF 不可用或内容不完整"
    ],
    verification: [
      "输出保留原文锚点，关键结论能回查到 PDF 或来源文本",
      "图表、表格与相关正文放在相邻语境中",
      "双语内容不把解释性扩写伪装成原文翻译"
    ],
    install: "npx skills add https://github.com/wp-a/nature-reader",
    repo: `${WP_SKILL_REPO_BASE}/nature-reader`,
    tags: ["科研", "论文", "双语", "PDF", "Paper"]
  },
  {
    id: "nature-writing",
    name: "Nature 风格正文写作",
    source: "wp-a/nature-writing",
    origin: "WPIRONMAN",
    category: "论文写作",
    creator: "WPIRONMAN",
    workflow: "Nature-style manuscript",
    installType: "独立仓库",
    status: "可下载",
    quality: "高影响力论文写作",
    description: "从中文 notes、结果、图表和贡献边界出发，重建摘要、引言、结果叙事、讨论和结论。",
    bestFor: [
      "把实验结果组织成 Nature/Nature Communications 风格故事线",
      "需要先定 argument，再写句子",
      "中文实验 notes 转英文 manuscript prose"
    ],
    avoidWhen: [
      "只需要语法润色",
      "缺少核心 claim、证据或边界"
    ],
    verification: [
      "摘要、引言、结果和讨论共享同一条主张线",
      "每个 claim 都能对应结果、图表或引用",
      "改写后没有扩大贡献边界或隐藏负结果"
    ],
    install: "npx skills add https://github.com/wp-a/nature-writing",
    repo: `${WP_SKILL_REPO_BASE}/nature-writing`,
    tags: ["Nature", "Manuscript", "摘要", "引言", "结果"]
  },
  {
    id: "nature-polishing",
    name: "Nature 英文润色",
    source: "wp-a/nature-polishing",
    origin: "WPIRONMAN",
    category: "论文写作",
    creator: "WPIRONMAN",
    workflow: "学术英文润色",
    installType: "独立仓库",
    status: "可下载",
    quality: "句子级与段落级润色",
    description: "用于学术英文润色、中文作者表达校准、hedging、claim 强度和 Nature/Nature Communications 风格表达。",
    bestFor: [
      "论文已有英文稿，需要变得更像学术论文",
      "需要校准 claim 强度，避免过度承诺",
      "中文式英文需要重写成自然学术表达"
    ],
    avoidWhen: [
      "论文本身逻辑还没成立",
      "需要补实验或补引用，而不是改句子"
    ],
    verification: [
      "润色后语义与作者原稿一致",
      "hedging、时态、术语和 claim 强度符合目标期刊语境",
      "修改记录能区分语言改写和科学内容建议"
    ],
    install: "npx skills add https://github.com/wp-a/nature-polishing",
    repo: `${WP_SKILL_REPO_BASE}/nature-polishing`,
    tags: ["润色", "Academic English", "Nature", "中文作者"]
  },
  {
    id: "nature-academic-search",
    name: "多源文献检索",
    source: "wp-a/nature-academic-search",
    origin: "WPIRONMAN",
    category: "文献检索",
    creator: "WPIRONMAN",
    workflow: "检索与引用核验",
    installType: "独立仓库",
    status: "可下载",
    quality: "多源检索工作流",
    description: "整合 PubMed、CrossRef、arXiv、Semantic Scholar 等来源，用于检索策略、引用核验和 BibTeX/RIS 管理。",
    bestFor: [
      "系统性找相关工作",
      "核验 DOI、PMID、arXiv 和 BibTeX",
      "为 Related Work 构建可追溯证据"
    ],
    avoidWhen: [
      "只想要一个很粗略的背景解释",
      "没有明确主题、关键词或领域边界"
    ],
    verification: [
      "检索式、数据库和时间范围被完整记录",
      "DOI、PMID、arXiv ID 或 BibTeX 能回源核验",
      "候选文献按相关性和证据用途筛选，而不是只按数量堆叠"
    ],
    install: "npx skills add https://github.com/wp-a/nature-academic-search",
    repo: `${WP_SKILL_REPO_BASE}/nature-academic-search`,
    tags: ["文献检索", "CrossRef", "arXiv", "PubMed", "BibTeX"]
  },
  {
    id: "nature-citation",
    name: "Nature/CNS 引用补全",
    source: "wp-a/nature-citation",
    origin: "WPIRONMAN",
    category: "文献检索",
    creator: "WPIRONMAN",
    workflow: "引用插入与核验",
    installType: "独立仓库",
    status: "可下载",
    quality: "严格引用流程",
    description: "把长段论文文本拆成可引用 claim，优先检索高质量来源，生成可审阅的 citation map。",
    bestFor: [
      "给论文段落补引用",
      "检查每个 claim 是否真的有来源支持",
      "避免 AI 伪造参考文献"
    ],
    avoidWhen: [
      "用户只需要格式化已有参考文献",
      "无法访问或核验相关来源"
    ],
    verification: [
      "每个补充引用都绑定到具体 claim",
      "来源 title、DOI、期刊和年份能独立回查",
      "无法核验的引用会被标记为待确认而不是直接写入"
    ],
    install: "npx skills add https://github.com/wp-a/nature-citation",
    repo: `${WP_SKILL_REPO_BASE}/nature-citation`,
    tags: ["引用", "CNS", "BibTeX", "证据", "核验"]
  },
  {
    id: "nature-response",
    name: "Reviewer Response",
    source: "wp-a/nature-response",
    origin: "WPIRONMAN",
    category: "审稿",
    creator: "WPIRONMAN",
    workflow: "返修回复",
    installType: "独立仓库",
    status: "可下载",
    quality: "逐条回复工作流",
    description: "把审稿意见、作者 notes 和修改证据整理成 point-by-point response letter。",
    bestFor: [
      "Nature-family 或高影响力期刊返修",
      "需要区分已完成修改、需补实验、需作者确认的问题",
      "生成 response package 和作者行动清单"
    ],
    avoidWhen: [
      "没有 reviewer comments",
      "作者还没决定是否接受审稿人的修改方向"
    ],
    verification: [
      "每条审稿意见都有逐点回应、修改位置或作者待确认项",
      "新增实验、补充分析和文本修改能对应到 manuscript change log",
      "语气保持专业克制，不回避审稿人核心问题"
    ],
    install: "npx skills add https://github.com/wp-a/nature-response",
    repo: `${WP_SKILL_REPO_BASE}/nature-response`,
    tags: ["审稿", "返修", "Response Letter", "Reviewer"]
  },
  {
    id: "academic-review-workflow",
    name: "学术审稿工作流",
    source: "WPIRONMAN AcademicSubmission",
    origin: "WPIRONMAN",
    category: "审稿",
    creator: "WPIRONMAN",
    workflow: "稿件预审",
    installType: "GitHub 仓库",
    status: "产品工作流",
    quality: "产品化工作流",
    description: "围绕证据、相关工作、修改计划和期刊会议匹配构建的稿件预审工作流。",
    bestFor: [
      "投稿前的稿件诊断",
      "生成 reviewer 风格的问题与修改计划",
      "把 AI 预审接入学术产品界面"
    ],
    avoidWhen: [
      "需要法律效力或正式同行评审结论",
      "稿件不能交给 AI 工作流处理"
    ],
    verification: [
      "预审结论区分证据问题、表达问题和投稿匹配问题",
      "修改计划能映射到具体章节、图表或实验",
      "不会把 AI 预审结果表述为正式同行评审结论"
    ],
    install: "git clone https://github.com/wp-a/academic-submission.git",
    repo: "https://github.com/wp-a/academic-submission/tree/main/AcademicSubmission/deep_research_review_v2",
    tags: ["审稿", "学术", "证据", "工作流"]
  },
  {
    id: "nature-paper2ppt",
    name: "论文汇报 PPT",
    source: "wp-a/nature-paper2ppt",
    origin: "WPIRONMAN",
    category: "PPT",
    creator: "WPIRONMAN",
    workflow: "Paper to PPT",
    installType: "独立仓库",
    status: "可下载",
    quality: "论文组会汇报",
    description: "从论文 PDF、摘要、图注或阅读 notes 生成中文论文汇报 PPTX，带图表选择、讲稿和轻量 QA。",
    bestFor: [
      "组会、journal club、论文分享",
      "需要从原文提炼故事线和关键图",
      "生成可编辑 PPTX 而不是纯文本大纲"
    ],
    avoidWhen: [
      "只需要一页摘要",
      "没有论文原文或足够可靠的 notes"
    ],
    verification: [
      "PPT 故事线覆盖问题、方法、结果、局限和讨论",
      "关键图表来源清楚，截图或重绘不改变论文含义",
      "导出的 PPTX 可编辑，讲稿和图注能支撑口头汇报"
    ],
    install: "npx skills add https://github.com/wp-a/nature-paper2ppt",
    repo: `${WP_SKILL_REPO_BASE}/nature-paper2ppt`,
    tags: ["PPT", "论文汇报", "PPTX", "组会"]
  },
  {
    id: "guizang-ppt-skill",
    name: "歸藏 PPT Skill",
    source: "op7418/guizang-ppt-skill",
    origin: "第三方",
    category: "PPT",
    creator: "歸藏",
    workflow: "高质量演示文稿",
    installType: "GitHub skill",
    status: "来源已标注",
    quality: "第三方 PPT 工作流",
    description: "用于生成高级视觉 PPT/HTML 演示稿，适合课程展示、路演和论文汇报的视觉排版。",
    bestFor: [
      "需要更强视觉表现的 PPT",
      "课程答辩、项目路演、论文报告",
      "已有明确内容但需要专业排版"
    ],
    avoidWhen: [
      "只需要普通 Markdown 大纲",
      "内容还没有组织成演示故事线"
    ],
    verification: [
      "演示稿结构有清晰封面、转场、主体和结尾",
      "视觉资产、字体和图表在目标导出格式中正常显示",
      "页面不因动效或装饰牺牲可读性"
    ],
    install: "npx skills add https://github.com/op7418/guizang-ppt-skill",
    repo: "https://github.com/op7418/guizang-ppt-skill",
    tags: ["PPT", "演示", "课程", "路演"]
  },
  {
    id: "nature-figure",
    name: "论文图表打磨",
    source: "wp-a/nature-figure",
    origin: "WPIRONMAN",
    category: "论文写作",
    creator: "WPIRONMAN",
    workflow: "Figure polish",
    installType: "独立仓库",
    status: "轻量公开版",
    quality: "图表审查与导出",
    description: "用于论文图、表、caption 和导出规格的最终质量检查；大资产模板未整包放入站点仓库。",
    bestFor: [
      "投稿前检查图表可读性、尺寸、字体和 caption",
      "统一多 panel 图和表格风格",
      "补 source data、统计说明和导出合同"
    ],
    avoidWhen: [
      "还没有任何图表草稿",
      "需要完整私有模板资产"
    ],
    verification: [
      "字体、线宽、色彩和 panel 标注符合目标期刊导出规格",
      "caption、统计说明和 source data 与图中信息一致",
      "SVG/PDF/TIFF 等目标格式能打开并保持清晰"
    ],
    install: "npx skills add https://github.com/wp-a/nature-figure",
    repo: `${WP_SKILL_REPO_BASE}/nature-figure`,
    tags: ["Figure", "Table", "Caption", "投稿"]
  },
  {
    id: "pdf",
    name: "PDF 读写与渲染",
    source: "wp-a/pdf",
    origin: "WPIRONMAN",
    category: "论文写作",
    creator: "WPIRONMAN",
    workflow: "PDF processing",
    installType: "独立仓库",
    status: "可下载",
    quality: "PDF 工具 skill",
    description: "用于读取、生成、渲染和检查 PDF，尤其适合论文、报告和审稿材料的版面核查。",
    bestFor: [
      "论文 PDF 文本提取和页面渲染",
      "检查导出的报告或审稿 PDF",
      "生成简单 PDF artifact"
    ],
    avoidWhen: [
      "只处理纯 Markdown",
      "需要完整 LaTeX 编译链"
    ],
    verification: [
      "PDF 页面能渲染成图片用于人工版面检查",
      "文本提取结果与原 PDF 关键字段一致",
      "生成或修改后的 PDF 页数、尺寸和可读性通过抽样检查"
    ],
    install: "npx skills add https://github.com/wp-a/pdf",
    repo: `${WP_SKILL_REPO_BASE}/pdf`,
    tags: ["PDF", "论文", "渲染", "提取"]
  },
  {
    id: "design-taste-frontend",
    name: "Design Taste Frontend",
    source: "Leonxlnx/taste-skill",
    origin: "第三方",
    category: "设计",
    creator: "Leonxlnx",
    workflow: "前端品味",
    installType: "GitHub skill",
    status: "来源已标注",
    quality: "实验性 v2",
    description: "一个反模板化前端 skill，强调先读懂设计意图，再做布局判断和视觉预检。",
    bestFor: [
      "Landing page 和作品集页面",
      "需要更强设计判断的重设计",
      "避免默认 AI 紫色渐变式前端输出"
    ],
    avoidWhen: [
      "正在构建高密度 dashboard",
      "需要严格套用企业级设计系统"
    ],
    verification: [
      "实现前已明确页面目标、受众和视觉方向",
      "完成后检查间距、层级、颜色和响应式状态不模板化",
      "桌面与移动截图确认没有文字溢出或组件重叠"
    ],
    install: "npx skills add https://github.com/Leonxlnx/taste-skill --skill \"design-taste-frontend\"",
    repo: "https://github.com/Leonxlnx/taste-skill",
    tags: ["前端", "品味", "Landing", "重设计"]
  },
  {
    id: "gpt-taste",
    name: "GPT Taste",
    source: "Leonxlnx/taste-skill",
    origin: "第三方",
    category: "前端",
    creator: "Leonxlnx",
    workflow: "动效前端",
    installType: "GitHub skill",
    status: "来源已标注",
    quality: "强动效变体",
    description: "面向 GPT 与 Codex 的更强约束视觉 skill，适合高变化度 landing page 和动效更重的界面。",
    bestFor: [
      "需要强视觉冲击的产品发布页",
      "Awwwards 风格探索",
      "brief 明确要求更大胆动效的场景"
    ],
    avoidWhen: [
      "页面信息密度很高",
      "品牌更需要安静、可信和克制"
    ],
    verification: [
      "动效服务于信息层级，而不是遮挡内容",
      "低性能或 reduced-motion 场景仍能完整浏览页面",
      "关键 CTA、正文和媒体在主要视口中保持可读"
    ],
    install: "npx skills add https://github.com/Leonxlnx/taste-skill --skill \"gpt-taste\"",
    repo: "https://github.com/Leonxlnx/taste-skill",
    tags: ["动效", "GSAP", "Landing", "Codex"]
  },
  {
    id: "image-to-code",
    name: "Image To Code",
    source: "Leonxlnx/taste-skill",
    origin: "第三方",
    category: "前端",
    creator: "Leonxlnx",
    workflow: "参考图复刻",
    installType: "GitHub skill",
    status: "来源已标注",
    quality: "图像优先流程",
    description: "先分析视觉参考的结构和层级，再把参考图转成可实现的前端工作流。",
    bestFor: [
      "根据已给参考图重建页面",
      "减少实现过程中的泛化设计决策",
      "从截图出发做设计 QA"
    ],
    avoidWhen: [
      "没有明确参考图",
      "界面之前还需要原创品牌策略"
    ],
    verification: [
      "先拆解参考图的布局、比例、文字层级和交互意图",
      "实现结果与参考的核心结构一致，但不复制受限素材",
      "截图对比确认主要断点的视觉比例没有走样"
    ],
    install: "npx skills add https://github.com/Leonxlnx/taste-skill --skill \"image-to-code\"",
    repo: "https://github.com/Leonxlnx/taste-skill",
    tags: ["图像", "前端", "参考", "实现"]
  },
  {
    id: "redesign-existing-projects",
    name: "既有项目重设计",
    source: "Leonxlnx/taste-skill",
    origin: "第三方",
    category: "设计",
    creator: "Leonxlnx",
    workflow: "先审计再重设计",
    installType: "GitHub skill",
    status: "来源已标注",
    quality: "审计优先重设计",
    description: "先审计既有界面，再调整布局、层级、间距和风格，避免无上下文重做。",
    bestFor: [
      "在不破坏产品逻辑的前提下改进现有站点",
      "发现真实代码库里的设计回退",
      "用更有意图的结构替换泛化卡片"
    ],
    avoidWhen: [
      "正在从空白页面开始",
      "只需要文案或内容层面的调整"
    ],
    verification: [
      "先记录现有界面的真实问题和保留约束",
      "重设计后核心业务流程没有被装饰性布局打断",
      "用截图和交互检查确认改动比原界面更清晰"
    ],
    install: "npx skills add https://github.com/Leonxlnx/taste-skill --skill \"redesign-existing-projects\"",
    repo: "https://github.com/Leonxlnx/taste-skill",
    tags: ["重设计", "审计", "UI", "质量"]
  }
];

window.WP_SKILL_COLLECTIONS = [
  {
    id: "daily-skills",
    name: "社区常用 Skill",
    description: "优先展示社区常用、能直接下载或打开仓库的科研、审稿、PPT、PDF 和站点工作流。",
    skillIds: [
      "ml-paper-writing",
      "research-paper-writing",
      "research-writing-assistant",
      "nature-reader",
      "nature-academic-search",
      "nature-citation",
      "academic-review-workflow",
      "nature-paper2ppt",
      "guizang-ppt-skill",
      "wpironman-blog-design"
    ]
  },
  {
    id: "research-writing-flow",
    name: "科研写作流",
    description: "从精读、检索、引用、写正文、润色、图表、返修到汇报 PPT 的可下载 skill 工作流。",
    skillIds: [
      "ml-paper-writing",
      "research-paper-writing",
      "research-writing-assistant",
      "nature-reader",
      "nature-writing",
      "nature-polishing",
      "nature-academic-search",
      "nature-citation",
      "nature-figure",
      "nature-response",
      "nature-paper2ppt",
      "pdf"
    ]
  },
  {
    id: "design-taste-stack",
    name: "设计品味栈",
    description: "让界面工作少一点模板味：先读 brief，再审计界面，最后用视觉纪律实现。",
    skillIds: [
      "design-taste-frontend",
      "image-to-code",
      "redesign-existing-projects",
      "wpironman-blog-design"
    ]
  },
  {
    id: "research-loop",
    name: "科研闭环",
    description: "覆盖文献精读、稿件诊断和可审阅的学术工作流产物。",
    skillIds: [
      "nature-reader",
      "academic-review-workflow",
      "nature-academic-search",
      "nature-citation"
    ]
  },
  {
    id: "build-and-verify",
    name: "构建与验证",
    description: "从视觉参考到代码实现，再检查边界并避免主题回归。",
    skillIds: [
      "wpironman-blog-design",
      "design-taste-frontend",
      "redesign-existing-projects",
      "pdf"
    ]
  }
];

window.WP_RUNBOOKS = [
  {
    id: "codex-provider-metadata-recovery",
    name: "Codex Provider Metadata 恢复",
    risk: "高风险：会触及 Codex 本地会话状态",
    source: "Dailin521/codex-provider-sync",
    scenario: "旧会话因为 provider、可见性 metadata 或项目路径缓存不一致，在 Desktop 或 /resume 里不可见。",
    touches: [
      "Codex rollout 文件",
      "~/.codex/state_5.sqlite 线程表",
      "项目路径缓存与可见性 metadata"
    ],
    backups: [
      "~/.codex/config.toml",
      "~/.codex/auth.json",
      "~/.codex/state_5.sqlite",
      "工具文档要求备份的 rollout/cache 文件"
    ],
    donts: [
      "不要在 Codex 仍运行时修改状态文件",
      "不要把恢复 metadata 理解成切换 API provider",
      "不要在没有备份的情况下覆盖 config/auth/state"
    ],
    steps: [
      "确认当前 Codex 基础配置可正常连接目标 API 服务商",
      "从官方仓库克隆 codex-provider-sync 并按 README 安装依赖",
      "执行工具的核心恢复命令，修复 rollout、SQLite 和路径缓存里的 metadata 不一致",
      "重启 Codex 后检查 Desktop 或 /resume 中旧会话是否恢复可见"
    ],
    acceptance: [
      "旧会话重新出现在 Desktop 或 /resume",
      "原 API 中转配置仍可使用",
      "config.toml 与 auth.json 没有被无意修改"
    ],
    repo: "https://github.com/Dailin521/codex-provider-sync"
  },
  {
    id: "codex-plus-plus-plugin-entry",
    name: "Codex++ 插件入口解锁",
    risk: "中高风险：涉及桌面端启动路径与第三方增强器",
    source: "BigPizzaV3/CodexPlusPlus",
    scenario: "Codex Desktop 已能使用中转 API，但插件按钮或传统增强入口不可见，需要从 Codex++ 启动解锁入口。",
    touches: [
      "Codex++ 应用安装与启动方式",
      "Codex Desktop 插件入口显示状态",
      "本地 Codex state 只读核验"
    ],
    backups: [
      "~/.codex/config.toml",
      "~/.codex/auth.json",
      "~/.codex/state_5.sqlite"
    ],
    donts: [
      "不要使用 Codex++ 的中转注入模式",
      "不要切换 ChatGPT 登录",
      "不要清除 API Key 模式",
      "不要修改 provider 或任何 API 配置"
    ],
    steps: [
      "备份 config.toml、auth.json 和 state_5.sqlite",
      "从官方 GitHub Release 下载适合 macOS 的安装包",
      "只使用传统增强或插件入口解锁功能",
      "完全退出原版 Codex 后，从 Codex++ 重新启动 Codex"
    ],
    acceptance: [
      "插件按钮可点击",
      "原来的中转站 API 仍然可用",
      "config.toml 和 auth.json 内容保持不变"
    ],
    repo: "https://github.com/BigPizzaV3/CodexPlusPlus"
  }
];

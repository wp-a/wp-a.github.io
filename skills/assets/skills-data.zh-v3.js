const WP_SKILL_REPO_BASE = "https://github.com/wp-a";

window.WP_SKILLS = [
  {
    id: "wpironman-blog-design",
    name: "WPIRONMAN 博客设计",
    source: "WPIRONMAN",
    origin: "WPIRONMAN",
    category: "设计",
    creator: "WPIRONMAN",
    workflow: "站点设计 QA",
    installType: "独立仓库",
    status: "可下载",
    quality: "公开站点工作流",
    description: "面向 Hexo 与 Butterfly 站点的受控设计、重构和上线前 QA 工作流。",
    bestFor: [
      "博客、项目页和独立产品页的视觉打磨",
      "需要保留评论、Pjax、导航和主题能力的改动",
      "上线前需要桌面与移动端真实渲染 QA"
    ],
    avoidWhen: [
      "目标不是 Hexo 或 Butterfly 站点",
      "只需要完全脱离现有代码库的通用前端建议"
    ],
    verification: [
      "改动前先读 Hexo/Butterfly 当前实现和页面级 CSS",
      "生成后的 /skills/ 或目标页面在桌面与移动视口无横向溢出",
      "Pjax、评论、导航和页面资源版本保持可用"
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
    id: "premium-section-prompts",
    name: "Premium UI Design",
    source: "wp-a/premium-section-prompts",
    origin: "WPIRONMAN",
    category: "设计",
    creator: "WPIRONMAN",
    workflow: "高级 UI 设计",
    installType: "独立仓库",
    status: "可下载",
    quality: "高级 UI section 设计库",
    description: "把高质量参考页面、截图和交互案例转成可执行的 UI 设计 brief、section 结构和 QA 清单。",
    bestFor: [
      "把高级参考站点转成可执行 UI 设计方案",
      "为 Hero、Footer、Pricing、404、Carousel 等 section 定义版式、动效和交互",
      "需要区分结构、动效、响应式和验收标准"
    ],
    avoidWhen: [
      "只需要一句很短的灵感描述",
      "还没有任何参考图、参考站或目标 section 类型"
    ],
    verification: [
      "设计 brief 明确 section 类型、内容层级、媒体策略和交互约束",
      "包含响应式行为、motion 和 QA 检查",
      "最终输出能指导 Codex、v0、Framer 或前端实现"
    ],
    install: "npx skills add https://github.com/wp-a/premium-section-prompts",
    repo: "https://github.com/wp-a/premium-section-prompts",
    tags: ["UI", "设计", "高级", "Section"]
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
      "需求明确要求更大胆动效的场景"
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
  },
  {
    id: "anthropic-docx",
    name: "Anthropic DOCX",
    source: "anthropics/skills/docx",
    origin: "Anthropic 官方",
    category: "文档办公",
    creator: "Anthropic",
    workflow: "Word 文档读写",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方文档 skill",
    description: "用于创建、读取、编辑和排版 Word 文档，覆盖目录、页眉页脚、表格和专业文档格式。",
    bestFor: [
      "需要生成正式 Word 报告、申请书或说明文档",
      "修改已有 DOCX 的结构、样式、表格或页面元素",
      "把结构化内容整理成可继续编辑的 Word 文件"
    ],
    avoidWhen: [
      "只需要纯 Markdown 文本",
      "目标是排版极复杂的出版社级模板且缺少原模板"
    ],
    verification: [
      "生成后能用 Word 或兼容工具打开",
      "目录、标题层级、表格和页眉页脚保持可编辑",
      "关键字段、页数和格式在导出后抽样核验"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/docx ~/.agents/skills/docx",
    repo: "https://github.com/anthropics/skills/tree/main/skills/docx",
    tags: ["DOCX", "Word", "文档", "官方"]
  },
  {
    id: "anthropic-xlsx",
    name: "Anthropic XLSX",
    source: "anthropics/skills/xlsx",
    origin: "Anthropic 官方",
    category: "文档办公",
    creator: "Anthropic",
    workflow: "表格清洗与建模",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方表格 skill",
    description: "用于读取、清洗、编辑和生成电子表格，覆盖公式、格式、图表、CSV/TSV 转换和数据整理。",
    bestFor: [
      "清洗 CSV、TSV、XLSX 或 XLSM 数据",
      "给表格增加公式、汇总列、格式和图表",
      "从结构化数据生成可交付的 Excel 工作簿"
    ],
    avoidWhen: [
      "数据量已经超出普通电子表格适合处理的规模",
      "需要生产数据库级事务一致性，而不是工作簿交付"
    ],
    verification: [
      "公式能重新计算且关键汇总值可抽样核验",
      "表头、数据类型、冻结窗格和格式符合交付要求",
      "CSV/TSV/XLSX 转换后行列数量没有意外变化"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/xlsx ~/.agents/skills/xlsx",
    repo: "https://github.com/anthropics/skills/tree/main/skills/xlsx",
    tags: ["XLSX", "Excel", "CSV", "数据清洗", "官方"]
  },
  {
    id: "anthropic-pptx",
    name: "Anthropic PPTX",
    source: "anthropics/skills/pptx",
    origin: "Anthropic 官方",
    category: "PPT",
    creator: "Anthropic",
    workflow: "PowerPoint 读写编辑",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方演示文档 skill",
    description: "用于创建、读取、编辑和合并 PowerPoint 文件，处理版式、模板、讲稿、备注、表格和评论。",
    bestFor: [
      "生成可继续编辑的 PPTX 演示文稿",
      "修改已有 deck 的文字、版式、备注或评论",
      "从报告、表格和讲稿整理成演示交付物"
    ],
    avoidWhen: [
      "只需要静态海报或艺术图",
      "没有明确演示结构，只想自动生成大量装饰页"
    ],
    verification: [
      "导出的 PPTX 能正常打开并保持可编辑",
      "版式、图片、表格和讲稿在主要幻灯片抽样检查通过",
      "合并或拆分 deck 后页序、备注和模板没有丢失"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/pptx ~/.agents/skills/pptx",
    repo: "https://github.com/anthropics/skills/tree/main/skills/pptx",
    tags: ["PPTX", "PowerPoint", "演示", "官方"]
  },
  {
    id: "anthropic-pdf",
    name: "Anthropic PDF",
    source: "anthropics/skills/pdf",
    origin: "Anthropic 官方",
    category: "文档办公",
    creator: "Anthropic",
    workflow: "PDF 处理工具箱",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方 PDF skill",
    description: "用于读取、拆分、合并、旋转、加水印、填写表单、加密解密、抽取图片和 OCR PDF。",
    bestFor: [
      "处理合同、报告、论文和扫描件 PDF",
      "合并、拆分、旋转、填表或加水印",
      "需要 OCR 让扫描 PDF 可搜索"
    ],
    avoidWhen: [
      "原文件不是 PDF，也不需要生成 PDF",
      "需要人工签署或法律效力判断"
    ],
    verification: [
      "页数、页面尺寸和阅读顺序处理前后可核验",
      "表单、OCR 或水印结果在抽样页面人工检查通过",
      "加密、解密和合并操作不会破坏原始文件备份"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/pdf ~/.agents/skills/pdf",
    repo: "https://github.com/anthropics/skills/tree/main/skills/pdf",
    tags: ["PDF", "OCR", "表单", "合并", "官方"]
  },
  {
    id: "anthropic-webapp-testing",
    name: "Anthropic Webapp Testing",
    source: "anthropics/skills/webapp-testing",
    origin: "Anthropic 官方",
    category: "工程开发",
    creator: "Anthropic",
    workflow: "Playwright 真实浏览器验收",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方 Web 测试 skill",
    description: "用 Playwright 与本地 Web 应用交互，验证前端功能、调试 UI 行为、截图并收集浏览器日志。",
    bestFor: [
      "本地前端改动后的真实浏览器 QA",
      "复现 UI bug、检查交互状态和控制台错误",
      "用脚本验证桌面与移动端关键流程"
    ],
    avoidWhen: [
      "页面不需要浏览器运行即可静态检查",
      "服务端或数据问题还没有能打开的前端入口"
    ],
    verification: [
      "动态页面等待 networkidle 后再检查 DOM",
      "脚本关闭浏览器并记录控制台错误",
      "关键断点截图、交互结果和溢出指标可复查"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/webapp-testing ~/.agents/skills/webapp-testing",
    repo: "https://github.com/anthropics/skills/tree/main/skills/webapp-testing",
    tags: ["Playwright", "Web QA", "前端测试", "官方"]
  },
  {
    id: "anthropic-mcp-builder",
    name: "Anthropic MCP Builder",
    source: "anthropics/skills/mcp-builder",
    origin: "Anthropic 官方",
    category: "工程开发",
    creator: "Anthropic",
    workflow: "MCP 服务开发",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方 MCP 开发指南",
    description: "指导构建高质量 MCP 服务器，覆盖工具设计、API 集成、错误处理、测试和评估。",
    bestFor: [
      "把外部 API 或内部服务接入 LLM 工具链",
      "设计可发现、可组合、返回结构化结果的 MCP tools",
      "为 MCP server 增加测试和评估问题"
    ],
    avoidWhen: [
      "只需要普通脚本，不需要暴露给 agent 使用",
      "目标服务没有清晰 API 或权限模型"
    ],
    verification: [
      "工具命名、参数 schema 和错误消息可被 agent 理解",
      "MCP Inspector 或等价方式能跑通核心工具",
      "至少有覆盖真实任务的评估问题和答案核验"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/mcp-builder ~/.agents/skills/mcp-builder",
    repo: "https://github.com/anthropics/skills/tree/main/skills/mcp-builder",
    tags: ["MCP", "API", "工具设计", "官方"]
  },
  {
    id: "anthropic-skill-creator",
    name: "Anthropic Skill Creator",
    source: "anthropics/skills/skill-creator",
    origin: "Anthropic 官方",
    category: "工程开发",
    creator: "Anthropic",
    workflow: "Skill 设计与测试",
    installType: "官方 GitHub skill",
    status: "官方来源",
    quality: "官方 skill 创建流程",
    description: "用于设计、编写、测试和评估新的 Agent Skill，强调先定义能力边界再做压力测试。",
    bestFor: [
      "把重复工作沉淀成可复用 skill",
      "为团队工作流写 SKILL.md 和测试 prompts",
      "评估 skill 是否真的改变 agent 行为"
    ],
    avoidWhen: [
      "只是一次性提示词，不值得沉淀成 skill",
      "没有真实失败案例或压力场景可测试"
    ],
    verification: [
      "先记录没有 skill 时的失败行为",
      "用测试 prompts 验证 skill 后行为改善",
      "说明触发条件、边界、脚本和引用资料"
    ],
    install: "git clone https://github.com/anthropics/skills.git ~/.codex/anthropic-skills && cp -R ~/.codex/anthropic-skills/skills/skill-creator ~/.agents/skills/skill-creator",
    repo: "https://github.com/anthropics/skills/tree/main/skills/skill-creator",
    tags: ["Skill", "测试", "流程文档", "官方"]
  },
  {
    id: "superpowers-test-driven-development",
    name: "Superpowers TDD",
    source: "obra/superpowers/test-driven-development",
    origin: "第三方高分",
    category: "工程开发",
    creator: "Jesse Vincent / obra",
    workflow: "红绿重构开发",
    installType: "GitHub skill",
    status: "高分来源",
    quality: "87/100 公开评分",
    description: "强制先写失败测试、再写最小实现、最后重构，用红绿重构约束功能和 bugfix 开发。",
    bestFor: [
      "实现功能或修 bug 时需要防回归",
      "希望 agent 不直接跳到实现代码",
      "需要留下可证明的红绿测试证据"
    ],
    avoidWhen: [
      "任务是纯探索或不适合自动化测试",
      "现有代码库无法运行任何相关测试"
    ],
    verification: [
      "先看到测试失败，再看到同一测试通过",
      "实现只做让测试通过所需的最小改动",
      "重构后完整测试仍通过"
    ],
    install: "git clone https://github.com/obra/superpowers.git ~/.codex/superpowers && cp -R ~/.codex/superpowers/skills/test-driven-development ~/.agents/skills/test-driven-development",
    repo: "https://github.com/obra/superpowers/tree/main/skills/test-driven-development",
    tags: ["TDD", "测试", "红绿重构", "高分"]
  },
  {
    id: "superpowers-systematic-debugging",
    name: "Superpowers Systematic Debugging",
    source: "obra/superpowers/systematic-debugging",
    origin: "第三方高分",
    category: "工程开发",
    creator: "Jesse Vincent / obra",
    workflow: "根因优先调试",
    installType: "GitHub skill",
    status: "高分来源",
    quality: "Superpowers 核心 skill",
    description: "要求先查根因再修复，避免随机 patch 和只处理症状的调试方式。",
    bestFor: [
      "测试失败、线上 bug 或行为异常需要定位根因",
      "多个假设并存，需要证据化排查",
      "修复前必须保护现有行为"
    ],
    avoidWhen: [
      "已经有明确可复现根因和最小修复",
      "只是改文案或低风险样式微调"
    ],
    verification: [
      "修复前记录可复现症状和根因证据",
      "修复能解释为什么问题不会再次出现",
      "相关回归测试或验证命令通过"
    ],
    install: "git clone https://github.com/obra/superpowers.git ~/.codex/superpowers && cp -R ~/.codex/superpowers/skills/systematic-debugging ~/.agents/skills/systematic-debugging",
    repo: "https://github.com/obra/superpowers/tree/main/skills/systematic-debugging",
    tags: ["调试", "根因", "测试失败", "高分"]
  },
  {
    id: "superpowers-verification-before-completion",
    name: "Superpowers Verification",
    source: "obra/superpowers/verification-before-completion",
    origin: "第三方高分",
    category: "工程开发",
    creator: "Jesse Vincent / obra",
    workflow: "完成前证据验收",
    installType: "GitHub skill",
    status: "高分来源",
    quality: "完成声明守门员",
    description: "在声称完成、修好或通过之前强制运行验证命令，用证据替代口头确认。",
    bestFor: [
      "完成开发任务前做最后验收",
      "防止 agent 没跑测试就说完成",
      "需要把命令输出和成功标准写清楚"
    ],
    avoidWhen: [
      "任务没有任何可验证产物",
      "验证依赖外部状态且当前无法访问"
    ],
    verification: [
      "列出实际运行的命令和结果",
      "失败项明确说明未完成而不是淡化",
      "人工检查、截图或日志证据可回看"
    ],
    install: "git clone https://github.com/obra/superpowers.git ~/.codex/superpowers && cp -R ~/.codex/superpowers/skills/verification-before-completion ~/.agents/skills/verification-before-completion",
    repo: "https://github.com/obra/superpowers/tree/main/skills/verification-before-completion",
    tags: ["验收", "测试", "证据", "高分"]
  },
  {
    id: "superpowers-requesting-code-review",
    name: "Superpowers Code Review",
    source: "obra/superpowers/requesting-code-review",
    origin: "第三方高分",
    category: "工程开发",
    creator: "Jesse Vincent / obra",
    workflow: "完成后代码审查",
    installType: "GitHub skill",
    status: "高分来源",
    quality: "审查工作流",
    description: "在完成主要功能、子任务或合并前请求独立审查，聚焦需求符合度、缺陷和测试缺口。",
    bestFor: [
      "大功能完成后需要第二视角",
      "多 agent 或多文件改动需要检查遗漏",
      "合并前想发现测试、边界和回归风险"
    ],
    avoidWhen: [
      "只是无行为变化的微小文案修正",
      "还没有完成可审查的代码差异"
    ],
    verification: [
      "审查输出按严重程度列发现",
      "每条问题能定位到文件、行为或测试缺口",
      "修复后重新运行相关验证"
    ],
    install: "git clone https://github.com/obra/superpowers.git ~/.codex/superpowers && cp -R ~/.codex/superpowers/skills/requesting-code-review ~/.agents/skills/requesting-code-review",
    repo: "https://github.com/obra/superpowers/tree/main/skills/requesting-code-review",
    tags: ["代码审查", "质量", "合并前", "高分"]
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
    id: "prompt-design-kit",
    name: "高级 UI 设计包",
    description: "把高级参考页面、版式模式和交互结构整理成可执行的 UI section 设计方案。",
    skillIds: [
      "premium-section-prompts",
      "wpironman-blog-design",
      "design-taste-frontend",
      "image-to-code",
      "gpt-taste"
    ]
  },
  {
    id: "design-taste-stack",
    name: "设计品味栈",
    description: "让界面工作少一点模板味：先读需求，再审计界面，最后用视觉纪律实现。",
    skillIds: [
      "design-taste-frontend",
      "premium-section-prompts",
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
      "premium-section-prompts",
      "design-taste-frontend",
      "redesign-existing-projects",
      "pdf"
    ]
  },
  {
    id: "official-office-kit",
    name: "官方办公文档包",
    description: "Anthropic 官方 DOCX、XLSX、PPTX、PDF skills，适合把内容变成可编辑交付物。",
    skillIds: [
      "anthropic-docx",
      "anthropic-xlsx",
      "anthropic-pptx",
      "anthropic-pdf"
    ]
  },
  {
    id: "engineering-quality-kit",
    name: "工程质量包",
    description: "Web 测试、MCP、skill 创建、TDD、调试、验收和代码审查的高信任工程 workflow。",
    skillIds: [
      "anthropic-webapp-testing",
      "anthropic-mcp-builder",
      "anthropic-skill-creator",
      "superpowers-test-driven-development",
      "superpowers-systematic-debugging",
      "superpowers-verification-before-completion",
      "superpowers-requesting-code-review"
    ]
  }
];

window.WP_MARKETPLACE_CATEGORIES = [
  {
    id: "all",
    name: "全部",
    label: "All",
    icon: "fa-layer-group",
    description: "显示当前收录的全部可下载 skills。推荐路径可以跨分类组合，目录分类只负责快速定位。",
    filters: [],
    skillIds: []
  },
  {
    id: "paper-reading",
    name: "文献阅读",
    label: "Reading",
    icon: "fa-book-open",
    description: "把论文 PDF 读懂、拆开，并保留图表、引用和正文之间的证据关系。",
    filters: ["论文写作"],
    skillIds: [
      "nature-reader"
    ]
  },
  {
    id: "literature-citation",
    name: "检索引用",
    label: "Evidence",
    icon: "fa-search",
    description: "检索相关工作、核验 DOI/BibTeX，并把 claim 与可信来源绑定起来。",
    filters: ["文献检索"],
    skillIds: [
      "nature-academic-search",
      "nature-citation"
    ]
  },
  {
    id: "paper-writing",
    name: "论文写作",
    label: "Writing",
    icon: "fa-pencil-alt",
    description: "从初稿、章节重写、Nature 风格叙事到英文润色的正文生产流程。",
    filters: ["论文写作"],
    skillIds: [
      "ml-paper-writing",
      "research-paper-writing",
      "research-writing-assistant",
      "nature-writing",
      "nature-polishing"
    ]
  },
  {
    id: "review-revision",
    name: "审稿返修",
    label: "Review",
    icon: "fa-comments",
    description: "投稿前预审、审稿意见拆解、返修计划和 point-by-point 回复。",
    filters: ["审稿"],
    skillIds: [
      "academic-review-workflow",
      "nature-response"
    ]
  },
  {
    id: "figures-presentation",
    name: "图表演示",
    label: "Slides",
    icon: "fa-chart-line",
    description: "打磨论文图表、caption、组会 PPT、答辩材料和视觉化讲述顺序。",
    filters: ["PPT", "论文写作"],
    skillIds: [
      "nature-figure",
      "nature-paper2ppt",
      "guizang-ppt-skill",
      "anthropic-pptx"
    ]
  },
  {
    id: "pdf-tools",
    name: "PDF 工具",
    label: "PDF",
    icon: "fa-file-pdf",
    description: "读取、渲染、生成和抽查 PDF，用于论文、报告和审稿材料的版面核验。",
    filters: ["论文写作", "文档办公"],
    skillIds: [
      "pdf",
      "anthropic-pdf"
    ]
  },
  {
    id: "document-office",
    name: "文档办公",
    label: "Office",
    icon: "fa-file-alt",
    description: "处理 Word、Excel、CSV 和结构化办公文档，适合报告、表格和可编辑交付物。",
    filters: ["文档办公"],
    skillIds: [
      "anthropic-docx",
      "anthropic-xlsx"
    ]
  },
  {
    id: "ui-design",
    name: "UI 设计",
    label: "UI",
    icon: "fa-quote-right",
    description: "把参考页面、截图和交互案例转成高级 UI section 设计方案。",
    filters: ["设计", "前端"],
    skillIds: [
      "premium-section-prompts"
    ]
  },
  {
    id: "site-design",
    name: "站点设计",
    label: "Design",
    icon: "fa-adjust",
    description: "面向博客、项目页和产品页面的视觉审计、重设计、品牌一致性与上线前 QA。",
    filters: ["设计"],
    skillIds: [
      "wpironman-blog-design",
      "design-taste-frontend",
      "redesign-existing-projects"
    ]
  },
  {
    id: "frontend-build",
    name: "前端实现",
    label: "Frontend",
    icon: "fa-code",
    description: "从参考图、动效方向和明确界面需求出发，把设计转成可运行前端。",
    filters: ["前端"],
    skillIds: [
      "gpt-taste",
      "image-to-code"
    ]
  },
  {
    id: "engineering-dev",
    name: "工程开发",
    label: "Engineering",
    icon: "fa-terminal",
    description: "覆盖 Web 测试、MCP 工具开发、skill 创作、TDD、调试、验收和代码审查。",
    filters: ["工程开发"],
    skillIds: [
      "anthropic-webapp-testing",
      "anthropic-mcp-builder",
      "anthropic-skill-creator",
      "superpowers-test-driven-development",
      "superpowers-systematic-debugging",
      "superpowers-verification-before-completion",
      "superpowers-requesting-code-review"
    ]
  }
];

window.WP_TASK_BRIEFS = [
  {
    id: "task-paper",
    title: "写论文 / 返修 / 汇报",
    summary: "从阅读、检索、正文到返修和汇报，组合一条可持续迭代的学术工作流。",
    signal: "适合研究生、早期科研人员和技术写作者",
    routeId: "research-thesis",
    skillIds: ["research-writing-assistant", "nature-reader", "nature-academic-search", "nature-citation", "nature-response", "nature-paper2ppt"],
    outcome: "可复用的论文写作与返修流程，包含阅读、证据、正文和汇报产物。"
  },
  {
    id: "task-design",
    title: "重设计 / 前端实现 / 视觉 QA",
    summary: "把现有页面升级成更清晰、更高级、可在桌面和移动端验证的界面。",
    signal: "适合已有项目的产品化重设计",
    routeId: "design-build",
    skillIds: ["wpironman-blog-design", "premium-section-prompts", "design-taste-frontend", "redesign-existing-projects", "image-to-code"],
    outcome: "一个保留品牌识别、结构更稳定、交互更清楚的前端页面。"
  },
  {
    id: "task-review",
    title: "审稿 / 返修 / 证据核验",
    summary: "把审稿意见拆成修改计划、证据位置、回复信和待确认事项。",
    signal: "适合需要逐条回应审稿意见的团队",
    routeId: "review-revision",
    skillIds: ["academic-review-workflow", "nature-response", "nature-citation", "nature-figure", "pdf"],
    outcome: "可追踪的返修清单，每条意见都能对应文档位置、证据或作者决策。"
  },
  {
    id: "task-ppt",
    title: "论文汇报 / 图表 / 演示文稿",
    summary: "从论文、PDF 或读书笔记生成能讲清楚的汇报结构、图表和讲稿。",
    signal: "适合组会、答辩和项目汇报",
    routeId: "presentation-figures",
    skillIds: ["nature-paper2ppt", "guizang-ppt-skill", "nature-figure", "pdf", "nature-reader"],
    outcome: "可编辑的演示文稿、图表检查清单和清晰的讲述顺序。"
  },
  {
    id: "task-quality",
    title: "Skill 质量判断 / 选型 / 收录",
    summary: "根据来源、安装方式、适用边界和验证标准判断一个 skill 是否值得长期使用。",
    signal: "适合团队选型和个人工具库整理",
    routeId: "skill-quality",
    skillIds: ["wpironman-blog-design", "design-taste-frontend", "ml-paper-writing", "research-writing-assistant", "pdf"],
    outcome: "一套可解释的选型结论，减少无效安装和重复试错。"
  },
  {
    id: "task-office",
    title: "文档 / 表格 / PDF / PPT",
    summary: "把报告、数据表、扫描件和演示文稿变成可编辑、可核验的办公交付物。",
    signal: "适合需要处理 Word、Excel、PDF 和 PPTX 的日常交付",
    routeId: "office-documents",
    skillIds: ["anthropic-docx", "anthropic-xlsx", "anthropic-pdf", "anthropic-pptx"],
    outcome: "可打开、可编辑、字段和页数经过抽样核验的文档包。"
  },
  {
    id: "task-engineering",
    title: "开发 / 调试 / 测试 / 审查",
    summary: "把功能实现、Web 验收、MCP 工具、TDD、根因调试和代码审查串成工程质量闭环。",
    signal: "适合需要稳定交付代码和工具链的开发任务",
    routeId: "engineering-quality",
    skillIds: ["anthropic-webapp-testing", "anthropic-mcp-builder", "anthropic-skill-creator", "superpowers-test-driven-development", "superpowers-systematic-debugging", "superpowers-verification-before-completion", "superpowers-requesting-code-review"],
    outcome: "可复现的开发流程，包含测试证据、浏览器验收和完成前检查。"
  }
];

window.WP_STACK_BLUEPRINTS = [
  {
    id: "paper-submission-stack",
    name: "Paper Submission Stack",
    summary: "从阅读到投稿的闭环：精读、检索、写作、润色、图表、返修。",
    steps: ["nature-reader", "nature-academic-search", "nature-writing", "nature-polishing", "nature-figure", "nature-paper2ppt"],
    focus: "适合正式投稿和返修前准备。"
  },
  {
    id: "review-response-stack",
    name: "Review Response Stack",
    summary: "把 reviewer comments 转成修改计划、证据和回复信。",
    steps: ["academic-review-workflow", "nature-response", "nature-citation", "pdf"],
    focus: "适合审稿回复和修改清单。"
  },
  {
    id: "design-ship-stack",
    name: "Design Ship Stack",
    summary: "先审计，再参考，再实现，再验证。",
    steps: ["wpironman-blog-design", "design-taste-frontend", "redesign-existing-projects", "image-to-code"],
    focus: "适合博客、项目页和界面重设计。"
  },
  {
    id: "skill-audit-stack",
    name: "Skill Audit Stack",
    summary: "从来源、安装、边界和验收标准判断 skill 是否值得长期使用。",
    steps: ["wpironman-blog-design", "design-taste-frontend", "research-writing-assistant", "ml-paper-writing", "pdf"],
    focus: "适合收录前的选型和清单整理。"
  },
  {
    id: "office-delivery-stack",
    name: "Office Delivery Stack",
    summary: "把 Word、Excel、PDF 和 PPTX 交付物放进一个可检查的文档流程。",
    steps: ["anthropic-docx", "anthropic-xlsx", "anthropic-pdf", "anthropic-pptx"],
    focus: "适合报告、表格、扫描件和演示文稿交付。"
  },
  {
    id: "engineering-quality-stack",
    name: "Engineering Quality Stack",
    summary: "从实现、测试、调试、浏览器验收到代码审查的工程闭环。",
    steps: ["superpowers-test-driven-development", "superpowers-systematic-debugging", "anthropic-webapp-testing", "superpowers-verification-before-completion", "superpowers-requesting-code-review"],
    focus: "适合修 bug、做功能、交付 Web 应用和工具链。"
  }
];

window.WP_DISCOVERY_ROUTES = [
  {
    id: "research-thesis",
    name: "论文写作工作流",
    source: "xstongxue/best-skills",
    mode: "从选题到投稿",
    categoryHint: "论文写作",
    summary: "为论文选题、精读、检索、引用、正文、润色、图表和汇报组合可下载 skills。",
    prompt: "帮我把这篇论文或课题整理成可投稿、可答辩的写作计划。",
    query: "",
    skillIds: [
      "research-writing-assistant",
      "nature-reader",
      "nature-academic-search",
      "nature-citation",
      "research-paper-writing",
      "nature-writing",
      "nature-polishing",
      "nature-figure",
      "nature-paper2ppt"
    ]
  },
  {
    id: "evidence-map",
    name: "文献与证据地图",
    source: "ComposioHQ/awesome-claude-skills",
    mode: "证据链核验",
    categoryHint: "文献检索",
    summary: "把检索、阅读、引用和 PDF 核验放在同一个证据链里，减少无法追溯的结论。",
    prompt: "围绕这个 claim 找可核验来源，并生成 citation map 和待确认清单。",
    query: "",
    skillIds: [
      "nature-academic-search",
      "nature-citation",
      "nature-reader",
      "pdf",
      "research-paper-writing"
    ]
  },
  {
    id: "review-revision",
    name: "审稿返修闭环",
    source: "obra/superpowers",
    mode: "诊断到回复",
    categoryHint: "审稿",
    summary: "把预审、审稿意见、修改证据和 response letter 串成可验收的返修流程。",
    prompt: "把这些 reviewer comments 变成逐条回复、修改计划和作者待确认项。",
    query: "",
    skillIds: [
      "academic-review-workflow",
      "nature-response",
      "research-paper-writing",
      "nature-citation",
      "nature-figure"
    ]
  },
  {
    id: "presentation-figures",
    name: "图表与汇报产物",
    source: "xstongxue/best-skills",
    mode: "演示与图表",
    categoryHint: "PPT",
    summary: "先明确交付物是 PPT、图表、PDF 还是讲稿，再选对应的生成与检查 skill。",
    prompt: "把这篇论文整理成组会 PPT，并检查关键图表、图注和讲稿。",
    query: "",
    skillIds: [
      "nature-paper2ppt",
      "guizang-ppt-skill",
      "nature-figure",
      "pdf",
      "nature-reader"
    ]
  },
  {
    id: "design-build",
    name: "前端设计与实现",
    source: "anthropics/skills",
    mode: "设计到上线",
    categoryHint: "设计",
    summary: "覆盖页面审计、视觉方向、实现、动效和上线前 QA，降低模板化前端输出。",
    prompt: "先审计这个页面，再按目标受众重设计，并用截图验证桌面和移动端。",
    query: "",
    skillIds: [
      "wpironman-blog-design",
      "premium-section-prompts",
      "design-taste-frontend",
      "redesign-existing-projects",
      "image-to-code",
      "gpt-taste"
    ]
  },
  {
    id: "skill-quality",
    name: "Skill 质量自查",
    source: "anthropics/skills + awesome-claude-skills",
    mode: "可安装可验证",
    categoryHint: "质量标准",
    summary: "看真实用例、安装方式、适用边界和验证证据，判断一个 skill 是否值得长期保留。",
    prompt: "帮我判断这个 skill 是否值得收录：看真实用例、安装方式、边界和测试证据。",
    query: "",
    skillIds: [
      "wpironman-blog-design",
      "ml-paper-writing",
      "research-writing-assistant",
      "design-taste-frontend",
      "pdf"
    ]
  },
  {
    id: "office-documents",
    name: "办公文档交付",
    source: "anthropics/skills",
    mode: "官方文档工具",
    categoryHint: "文档办公",
    summary: "把 DOCX、XLSX、PDF 和 PPTX 放在一个可核验的办公文档处理路径里。",
    prompt: "帮我把这些资料整理成 Word 报告、Excel 附表、PDF 附件和 PPTX 汇报，并逐项检查可编辑性。",
    query: "",
    skillIds: [
      "anthropic-docx",
      "anthropic-xlsx",
      "anthropic-pdf",
      "anthropic-pptx"
    ]
  },
  {
    id: "section-prompt-design",
    name: "高级 UI 设计",
    source: "wp-a/premium-section-prompts",
    mode: "参考到 UI",
    categoryHint: "设计",
    summary: "把参考页面、截图或现成案例提炼成可执行的 UI section 设计 brief、实现约束和 QA 清单。",
    prompt: "把这个参考页面转成一份高级 UI section 设计方案，说明版式、动效、交互、响应式和验收标准。",
    query: "",
    skillIds: [
      "premium-section-prompts",
      "wpironman-blog-design",
      "design-taste-frontend",
      "image-to-code",
      "gpt-taste"
    ]
  },
  {
    id: "engineering-quality",
    name: "工程质量闭环",
    source: "obra/superpowers + anthropics/skills",
    mode: "实现到验收",
    categoryHint: "工程开发",
    summary: "用 TDD、系统调试、Webapp Testing、完成前验证和代码审查约束开发交付。",
    prompt: "帮我按 TDD 做这个功能，定位根因，用浏览器验证，再完成代码审查和验收记录。",
    query: "",
    skillIds: [
      "superpowers-test-driven-development",
      "superpowers-systematic-debugging",
      "anthropic-webapp-testing",
      "anthropic-mcp-builder",
      "anthropic-skill-creator",
      "superpowers-verification-before-completion",
      "superpowers-requesting-code-review"
    ]
  }
];

window.WP_REFERENCE_PATTERNS = [
  {
    id: "best-skills",
    title: "从任务进入",
    source: "xstongxue/best-skills",
    lesson: "先回答“我要完成什么”，再展示相关 skills，避免用户在长列表里盲找。"
  },
  {
    id: "awesome-claude-skills",
    title: "保持目录可扫读",
    source: "ComposioHQ/awesome-claude-skills",
    lesson: "用清晰大类承接长目录，并让每个条目都有用途、安装方式和边界说明。"
  },
  {
    id: "anthropic-skills",
    title: "条目必须可执行",
    source: "anthropics/skills",
    lesson: "优先收录有明确说明、脚本、引用或资产的 skill，降低下载后无法使用的概率。"
  },
  {
    id: "superpowers",
    title: "组合而不是收藏",
    source: "obra/superpowers",
    lesson: "把 skills 串成计划、执行、测试和验收的流程，而不是只做孤立收藏夹。"
  }
];

window.WP_RUNBOOKS = [
  {
    id: "codex-provider-metadata-recovery",
    name: "Codex Provider Metadata 恢复",
    risk: "高风险：会触及 Codex 本地会话状态",
    source: "Dailin521/codex-provider-sync",
    summary: "用于找回 Desktop 或 /resume 中消失的旧会话。",
    checks: ["先备份 config/auth/state", "恢复后旧会话重新可见"],
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
    summary: "用于找回桌面端插件入口，同时保留现有 API 配置。",
    checks: ["先备份本地配置", "入口可见且 API 仍可用"],
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

const WP_DEFAULT_DOSSIER_BY_CATEGORY = {
  "论文写作": {
    userRole: "论文作者 / 研究生 / 技术写作者",
    input: ["论文 PDF、实验 notes、已有草稿或 reviewer comments", "目标会议、期刊或汇报场景", "需要保留的 claim、图表和贡献边界"],
    output: ["可继续编辑的写作产物", "可回查的证据链", "下一步修改或验收清单"],
    failureModes: ["把润色误当成补实验", "引用没有回源核验", "输出扩大了原始贡献边界"],
    quickStart: ["先准备论文 PDF 或草稿", "明确目标：精读、初稿、润色、返修或汇报", "运行安装命令后按 skill 的 SKILL.md 提供必要输入"],
    trust: ["公开仓库", "安装命令可复制", "验证标准已写入目录"]
  },
  "文献检索": {
    userRole: "需要证据和引用的人",
    input: ["claim、关键词或研究问题", "目标数据库或领域边界", "已有参考文献或 DOI"],
    output: ["citation map", "待确认来源", "可核验 BibTeX / DOI / arXiv 信息"],
    failureModes: ["只堆数量不筛相关性", "AI 生成不可追溯引用", "检索式和时间范围没有记录"],
    quickStart: ["先写清 claim", "列出必须覆盖的数据库", "把无法核验的来源留在待确认区"],
    trust: ["来源字段可见", "引用核验标准清楚", "适合和写作 skill 组合"]
  },
  "审稿": {
    userRole: "投稿作者 / 返修负责人",
    input: ["reviewer comments", "manuscript change log", "补实验或补分析证据"],
    output: ["逐条回复", "修改计划", "作者待确认项"],
    failureModes: ["回避审稿人核心问题", "回复和正文修改位置对不上", "把 AI 预审当作正式同行评审"],
    quickStart: ["先贴原始审稿意见", "标注已完成修改和待确认项", "最后逐条核对 response 与 manuscript change log"],
    trust: ["高风险边界明确", "验收标准面向返修", "可与 citation / figure skill 串联"]
  },
  "PPT": {
    userRole: "组会汇报者 / 课程展示者",
    input: ["论文 PDF、阅读 notes、图表或已有大纲", "汇报时长和听众", "导出格式要求"],
    output: ["可编辑 PPTX 或 HTML 演示", "讲稿", "图表来源说明"],
    failureModes: ["页面好看但讲不清故事线", "关键图表来源不清", "导出后字体或图片失效"],
    quickStart: ["先确定汇报故事线", "标出必须出现的关键图", "导出后检查 PPTX 可编辑性"],
    trust: ["输出物导向", "图表和讲稿一起检查", "适合和 PDF / figure skill 组合"]
  },
  "设计": {
    userRole: "站点作者 / 产品设计实现者",
    input: ["当前页面、目标受众和参考方向", "需要保留的品牌识别", "桌面和移动端验收视口"],
    output: ["更清晰的页面结构", "可验证的视觉实现", "上线前 QA 记录"],
    failureModes: ["直接换皮导致产品人格丢失", "只看静态 HTML 不看真实渲染", "移动端文字或组件溢出"],
    quickStart: ["先说明要保留的旧版优点", "再选参考项目里真正可借鉴的结构", "最后用截图和指标验收"],
    trust: ["适合既有项目", "强调真实浏览器 QA", "不破坏 WPIRONMAN 现有主题能力"]
  },
  "前端": {
    userRole: "前端实现者 / 设计工程师",
    input: ["视觉参考、交互目标和技术约束", "现有项目代码", "目标断点"],
    output: ["可运行界面", "响应式行为", "可复查的视觉 QA"],
    failureModes: ["动效压过信息层级", "hover 交互没有移动端替代", "只做炫技不解决任务"],
    quickStart: ["先审计现状", "再拆参考结构", "最后实现并跑桌面与移动端检查"],
    trust: ["代码实现导向", "适合与设计 skill 组合", "关注状态和交互完整性"]
  },
  "文档办公": {
    userRole: "报告作者 / 数据整理者 / 办公交付负责人",
    input: ["DOCX、XLSX、CSV、PDF、PPTX 或结构化内容", "目标模板、字段和交付格式", "需要人工核验的关键页或关键数值"],
    output: ["可编辑文档", "清洗后的表格", "可打开的 PDF 或 PPTX", "抽样核验记录"],
    failureModes: ["文件能生成但不可编辑", "表格公式或行列数量变化未核验", "OCR、页序或水印破坏原始语义"],
    quickStart: ["先备份原文件", "明确输出格式和模板约束", "生成后抽查页数、行列、公式和关键字段"],
    trust: ["Anthropic 官方来源", "面向真实文件交付", "验证标准覆盖可打开和可编辑"]
  },
  "工程开发": {
    userRole: "软件工程师 / 工具链开发者 / 技术负责人",
    input: ["代码仓库、失败日志、需求说明或 API 文档", "可运行测试或本地服务", "完成标准和审查重点"],
    output: ["可验证代码改动", "测试或浏览器验收证据", "调试结论、代码审查或 MCP 工具"],
    failureModes: ["没定位根因就 patch", "没跑验证就声明完成", "工具 schema 或测试用例无法覆盖真实任务"],
    quickStart: ["先复现问题或写失败测试", "再做最小实现或根因修复", "最后跑测试、浏览器验收和代码审查"],
    trust: ["官方与高分来源组合", "强调红绿测试和根因", "完成前必须有证据"]
  }
};

function enhanceSkillDossier(skill) {
  const defaults = WP_DEFAULT_DOSSIER_BY_CATEGORY[skill.category] || WP_DEFAULT_DOSSIER_BY_CATEGORY["设计"];
  return {
    ...skill,
    userRole: skill.userRole || defaults.userRole,
    input: skill.input || defaults.input,
    output: skill.output || defaults.output,
    failureModes: skill.failureModes || defaults.failureModes,
    quickStart: skill.quickStart || defaults.quickStart,
    trust: skill.trust || defaults.trust,
    maturity: skill.origin === "WPIRONMAN" ? "WPIRONMAN 公开维护" : "第三方公开来源",
    riskLevel: skill.category === "审稿" ? "需要人工复核" : "常规使用前复核",
    sourceTrail: [
      skill.source,
      skill.repo,
      skill.install
    ]
  };
}

window.WP_SKILLS = window.WP_SKILLS.map(enhanceSkillDossier);

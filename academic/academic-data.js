// 学术主页数据配置文件
// 修改这个文件来更新您的学术主页内容

const academicData = {
  // 个人信息
  profile: {
    name: "Wang Peng (王鹏)",
    title: "硕士研究生 / Researcher",
    affiliation: "某某大学计算机学院",
    bio: "专注于<strong>深度学习</strong>、<strong>计算机视觉</strong>以及<strong>AI for Science</strong>的研究。<br>目前主要关注 Vision Transformer 和大模型高效微调。",
    avatar: "/img/head.webp",
    location: "Beijing, China",
    email: "your-email@example.com",
    github: "https://github.com/wp-a",
    scholar: "#",
    blog: "/"
  },

  // 个人简介
  about: [
    "我是某某大学软件学院的硕士研究生，于2023年入学。我的研究方向包括<strong>时空数据挖掘</strong>、<strong>计算机视觉</strong>以及<strong>LLM Agent</strong>。我由<a href=\"#\">某某教授</a>指导。",
    "我曾于2025年2月至8月在<strong>阿里巴巴达摩院（杭州）</strong>担任研究型实习生，主要从事多模态大模型方向的研究工作。"
  ],

  // 最新动态
  news: [
    {
      date: "2025.04",
      content: "🎉🎉 一篇论文被 <strong>CVPR 2025</strong> 接收！"
    },
    {
      date: "2025.04",
      content: "🎉🎉 一篇论文被 <strong>TKDE</strong> 接收！"
    },
    {
      date: "2025.02",
      content: "🚀 我加入阿里巴巴达摩院（杭州）担任研究实习生！"
    }
  ],

  // 论文列表
  publications: [
    {
      title: "Deep Residual Learning for Image Recognition",
      authors: "<strong>Wang Peng</strong>, Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
      venue: "CVPR 2025",
      venueClass: "cvpr", // 用于设置标签颜色：cvpr, tkde, 等
      image: "https://picsum.photos/500/200?random=1",
      links: {
        paper: "#",
        code: "#",
        project: "#"
      }
    },
    {
      title: "STDA: Spatio-Temporal Deviation Alignment Learning for Cross-city Fine-grained Urban Flow Inference",
      authors: "<strong>Wang Peng</strong>, Xiaoyu Li, Bin Xu, Xiushan Nie",
      venue: "TKDE",
      venueClass: "tkde",
      image: "https://picsum.photos/500/200?random=2",
      links: {
        paper: "#",
        code: "#"
      }
    }
  ],

  // 荣誉奖项
  honors: [
    { year: "2025", title: "国家奖学金 (Top 1%)" },
    { year: "2024", title: "全国大学生数学建模竞赛一等奖" }
  ]
};

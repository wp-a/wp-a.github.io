// 学术主页数据配置文件
// 修改这个文件来更新您的学术主页内容

const academicData = {
  // 个人信息
  profile: {
    name: "Wang Peng (王鹏)",
    title: {
      zh: "硕士研究生 / Researcher",
      en: "Master's Student / Researcher"
    },
    affiliation: {
      zh: "山东大学软件学院",
      en: "School of Software, Shandong University"
    },
    bio: {
      zh: "专注于<strong>深度学习</strong>、<strong>计算机视觉</strong>以及<strong>AI for Science</strong>的研究。<br>目前主要关注 Vision Transformer 和大模型高效微调。",
      en: "Focusing on research in <strong>Deep Learning</strong>, <strong>Computer Vision</strong>, and <strong>AI for Science</strong>.<br>Currently interested in Vision Transformers and efficient fine-tuning of large models."
    },
    avatar: "https://wpironman.oss-cn-qingdao.aliyuncs.com/202511241453014.png",
    location: "Beijing, China",
    email: "your-email@example.com",
    github: "https://github.com/wp-a",
    scholar: "#",
    blog: "/"
  },

  // 个人简介
  about: {
    zh: [
      "我是山东大学软件学院的硕士研究生，于2025年入学。我的研究方向包括<strong>时空数据挖掘</strong>、<strong>计算机视觉</strong>以及<strong>LLM Agent</strong>。我由<a href=\"#\">某某教授</a>指导。",
      "我曾于2025年2月至8月在<strong>阿里巴巴达摩院（杭州）</strong>担任研究型实习生，主要从事多模态大模型方向的研究工作。"
    ],
    en: [
      "I am a Master's student at the School of Software, Shandong University, enrolled in 2025. My research interests include <strong>Spatio-Temporal Data Mining</strong>, <strong>Computer Vision</strong>, and <strong>LLM Agents</strong>. I am supervised by <a href=\"#\">Prof. XXX</a>.",
      "From February to August 2025, I worked as a research intern at <strong>Alibaba DAMO Academy (Hangzhou)</strong>, focusing on multimodal large language models."
    ]
  },

  // 最新动态
  news: {
    zh: [
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
    en: [
      {
        date: "2025.04",
        content: "🎉🎉 One paper accepted by <strong>CVPR 2025</strong>!"
      },
      {
        date: "2025.04",
        content: "🎉🎉 One paper accepted by <strong>TKDE</strong>!"
      },
      {
        date: "2025.02",
        content: "🚀 Joined Alibaba DAMO Academy (Hangzhou) as a research intern!"
      }
    ]
  },

  // 论文列表
  publications: [
    {
      title: "Deep Residual Learning for Image Recognition",
      authors: "<strong>Wang Peng</strong>, Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
      venue: "CVPR 2025",
      venueClass: "cvpr",
      image: "https://picsum.photos/500/200?random=1",
      links: {
        zh: {
          paper: "#",
          code: "#",
          project: "#"
        },
        en: {
          paper: "#",
          code: "#",
          project: "#"
        }
      }
    },
    {
      title: "STDA: Spatio-Temporal Deviation Alignment Learning for Cross-city Fine-grained Urban Flow Inference",
      authors: "<strong>Wang Peng</strong>, Xiaoyu Li, Bin Xu, Xiushan Nie",
      venue: "TKDE",
      venueClass: "tkde",
      image: "https://picsum.photos/500/200?random=2",
      links: {
        zh: {
          paper: "#",
          code: "#"
        },
        en: {
          paper: "#",
          code: "#"
        }
      }
    }
  ],

  // 荣誉奖项
  honors: {
    zh: [
      { year: "2025", title: "国家奖学金 (Top 1%)" },
      { year: "2024", title: "全国大学生数学建模竞赛一等奖" }
    ],
    en: [
      { year: "2025", title: "National Scholarship (Top 1%)" },
      { year: "2024", title: "First Prize, National Mathematical Modeling Contest" }
    ]
  }
};

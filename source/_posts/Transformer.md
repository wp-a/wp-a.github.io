---
title: Transformer
date: 2025-04-17 22:16:19
tags: [transformer,论文精读]
categories: [学习,论文精读,Transformer]
updated: 
type: 
cover: https://wpironman.oss-cn-qingdao.aliyuncs.com/20250417222102581.png
---

# Attention Is All You Need

**Transformer** 是一种基于注意力机制（Attention Mechanism）的深度学习模型，摒弃了传统的循环神经网络（RNN）和卷积神经网络（CNN），完全依赖注意力机制处理序列数据。

注意力机制通过注意力汇聚将*查询*（自主性提示）和*键*（非自主性提示）结合在一起，实现对*值*（感官输入）的**选择倾向**，这是与 CNN 等模型的关键区别。

![transformer](https://wpironman.oss-cn-qingdao.aliyuncs.com/20250425222936440.png)



<img src="https://wpironman.oss-cn-qingdao.aliyuncs.com/20250425223011527.png" alt="QKV" style="zoom:30%;" />

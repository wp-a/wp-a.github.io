---
title: Transformer
date: 2025-04-17 22:16:19
tags: [transformer,论文精读]
categories: [论文精读,Transformer]
updated: 
type: 
cover: https://wpironman.oss-cn-qingdao.aliyuncs.com/20250417222102581.png
---

# Attention Is All You Need

个人理解 transformer 编码器是把人能理解的东西转化成计算机能理解的东西。对比与论文写作的这个过程来说，位置编码就是作者写这篇论文的顺序，反复打磨论文这个过程就对应着这个n个编码器，第一遍的初稿相当于第一个编码器，可能效果不尽人意。把人能理解的东西编码成论文。到读者来说就是解码的过程，每一次读论文就是一次解码的过程，你必须多次解码才能对这个论文理解的更加透彻，还要时刻注意mask操作，写作时要时刻注意读者理解到什么地步，读者的阅读是按顺序进行的。q就是你感兴趣的地方，k就是论文中的关键点。



**Transformer** 是一种基于注意力机制（Attention Mechanism）的深度学习模型，摒弃了传统的循环神经网络（RNN）和卷积神经网络（CNN），完全依赖注意力机制处理序列数据。

RNN处理长序列时容易出现梯度消失或梯度爆炸的问题，健达来说就是就像一个记性不好的老人，处理长内容时，前面的内容记不住，后面又容易混淆。

CNN虽然在提取局部特征上表现出色，但对长距离依赖关系的捕捉能力欠佳，就好比只盯着眼前的局部风景，而忽略了远方的整体美景。

Transformer则巧妙地摒弃了RNN的顺序处理方式和CNN的局部处理局限，引入了自注意力机制，这就像是给大模型装上了一个“全局扫描雷达”，能够同时关注输入序列中的各个位置，极大地提升了对长序列的处理能力，完美解决了上述两个难题。

注意力机制通过注意力汇聚将*查询*（自主性提示）和*键*（非自主性提示）结合在一起，实现对*值*（感官输入）的**选择倾向**，这是与 CNN 等模型的关键区别。

![transformer](https://wpironman.oss-cn-qingdao.aliyuncs.com/20250425222936440.png)



<img src="https://wpironman.oss-cn-qingdao.aliyuncs.com/20250425223011527.png" alt="QKV" style="zoom:30%;" />

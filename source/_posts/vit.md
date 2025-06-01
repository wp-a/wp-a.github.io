---
title: vit
date: 2025-06-01 12:09:13
tags: [Vit,手撕代码]
categories: [手撕代码,Vision Transformer]
updated: 
type: 
cover: https://wpironman.oss-cn-qingdao.aliyuncs.com/20250601121856303.png
---

## 手撕 Vision Transformer

<img src="https://wpironman.oss-cn-qingdao.aliyuncs.com/20250601121856303.png" style="zoom:50%;" />

​	之前接触过挺多pytorch框架写的代码的，但是一直没有学过，觉得没啥可学的，上个月看了b站上的一个博主的速成课，感觉确实没啥学的，就是几个函数而已，不过通一下也是很有收获的。我现在准备练习一下代码能力，所以尝试手写一下Vit代码。这也是第一次写除了算法题之外的代码，之前复试结束后联系了一个老师问我写过代码吗，我说没有，也是很尴尬了，最后老师也没要我，嫌我基础太差了，希望能在开学之前把代码能力练好，并且把基础的一些东西弄明白。

​	根据Gemini给我生成了个提示，手写了一遍，不过中间有好几处错误，目前已经更正，不是很熟练，还需要再练习一下。

```python

import torch
import torch.nn as nn

# 1. 图像分块与嵌入 (Patch Embedding)
# 模块： PatchEmbedding(nn.Module)
class PatchEmbedding(nn.Module):
    def __init__(self,in_channels,patch_size,embed_dim,image_size):
        super().__init__()
        self.patch_num=(image_size//patch_size)**2
        self.emb=nn.Conv2d(in_channels,embed_dim,kernel_size=patch_size,stride=patch_size)
        self.pos_emb=nn.Parameter(torch.randn(1,self.patch_num+1,embed_dim))
        self.cls_emb=nn.Parameter(torch.randn(1,1,embed_dim))

    def forward(self,x):
        x=self.emb(x)
        b,d,h,w=x.shape
        x=x.permute(0,2,3,1).reshape(b,h*w,d)
        cls_emb=self.cls_emb.expand(b,-1,-1)
        x=torch.cat((cls_emb,x),dim=1)
        out=x+self.pos_emb[:,:1+h*w]
        return out

# 2. 多头自注意力机制 (Multi-Head Self-Attention, MSA)
# 模块： MultiHeadSelfAttention(nn.Module)
class MultiHeadSelfAttention(nn.Module):
    def __init__(self,embed_dim,num_heads,dropout=0.0):
        super().__init__()
        self.embed_dim=embed_dim
        self.num_heads=num_heads
        self.head_dim=embed_dim//num_heads
        self.proj_q=nn.Linear(embed_dim,embed_dim)
        self.proj_k=nn.Linear(embed_dim,embed_dim)
        self.proj_v=nn.Linear(embed_dim,embed_dim)
        self.out_proj=nn.Linear(embed_dim,embed_dim)
        self.drop=nn.Dropout(dropout)
    
    def forward(self,x):
        b,l,_=x.shape
        q = self.proj_q(x).reshape(b, l, self.num_heads, self.head_dim).transpose(1, 2)
        k = self.proj_k(x).reshape(b, l, self.num_heads, self.head_dim).transpose(1, 2)
        v = self.proj_v(x).reshape(b, l, self.num_heads, self.head_dim).transpose(1, 2)
        atten_score=torch.matmul(q,k.transpose(-2,-1))/self.head_dim**0.5
        atten_weight=torch.nn.functional.softmax(atten_score,dim=-1)
        atten_weight = self.drop(atten_weight)
        atten = torch.matmul(atten_weight, v).transpose(1, 2).reshape(b, l, self.embed_dim)
        out=self.out_proj(atten)
        out=self.drop(out)
        return out


# 3. 多层感知机块 (MLP Block)
# 模块： MlpBlock(nn.Module)
class MlpBlock(nn.Module):
    def __init__(self,embed_dim,mlp_dim,out_dim,dropout=0.0):
        super().__init__()
        self.fc1=nn.Linear(embed_dim,mlp_dim)
        self.fc2=nn.Linear(mlp_dim,out_dim)
        self.act=nn.GELU()
        self.drop=nn.Dropout(dropout)
    
    def forward(self,x):
        x=self.fc1(x)
        x=self.act(x)
        x=self.drop(x)
        x=self.fc2(x)
        out=self.drop(x)
        return out

# 4. Transformer 编码器块 (Transformer Encoder Block)
# 模块： TransformerEncoderBlock(nn.Module)
class TransformerEncoderBlock(nn.Module):
    def __init__(self,embed_dim,num_heads,mlp_dim,dropout=0.0):
        super().__init__()
        self.norm1=nn.LayerNorm(embed_dim)
        self.norm2=nn.LayerNorm(embed_dim)
        self.mlp = MlpBlock(embed_dim, mlp_dim, embed_dim, dropout) 
        self.msa = MultiHeadSelfAttention(embed_dim, num_heads, dropout)
    
    def forward(self,x):
        norm=self.norm1(x)
        msa=self.msa(norm)
        res=msa+x
        norm=self.norm2(res)
        mlp=self.mlp(norm)
        out=mlp+res
        return out


# 5. Transformer 编码器 (Transformer Encoder)
# 模块： TransformerEncoder(nn.Module)
class TransformerEncoder(nn.Module):
    def __init__(self,embed_dim,num_heads,mlp_dim,depth,dropout=0.0):
        super().__init__()
        self.layers=nn.ModuleList([])
        for _ in range(depth): 
            layer = TransformerEncoderBlock(embed_dim, num_heads, mlp_dim, dropout)
            self.layers.append(layer)
        self.norm=nn.LayerNorm(embed_dim)

    def forward(self,x):
        for layer in self.layers: 
            x = layer(x) 
        out=self.norm(x)
        return out

# 6. 完整的 Vision Transformer (ViT) 模型
# 模块： VisionTransformer(nn.Module)
class VisionTransformer(nn.Module):
    def __init__(self,image_size,in_channels,num_classes,patch_size,embed_dim,depth,num_heads,mlp_dim,dropout=0.0):
        super().__init__()

        self.emb=PatchEmbedding(in_channels,patch_size,embed_dim,image_size)
        self.trans=TransformerEncoder(embed_dim,num_heads,mlp_dim,depth,dropout)
        self.lin=nn.Linear(embed_dim,num_classes)
    
    def forward(self,x):
        emb=self.emb(x)
        trans_output=self.trans(emb)
        cls_token_output = trans_output[:, 0]
        out=self.lin(cls_token_output)
        return out

```


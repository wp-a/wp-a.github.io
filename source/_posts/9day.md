---
title: 代码随想录--二叉树
date: 2025-02-12 00:10:23
tags: [数据结构与算法,二叉树,二叉树遍历,递归,迭代]
categories: [学习,数据结构与算法,代码随想录]
updated: 
description: 代码随想录--二叉树（1）前中后序遍历
---

## 二叉树前中后序遍历

二叉树定义

```c++
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
```

### 二叉树的前序遍历

题目链接：[144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)

#### 递归遍历

```c++
class Solution {
public:
    void traversal(TreeNode* cur, vector<int>& vec) {
        if (cur == NULL) return;
        vec.push_back(cur->val);    // 中
        traversal(cur->left, vec);  // 左
        traversal(cur->right, vec); // 右
    }
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        traversal(root, result);
        return result;
    }
};
```

#### 迭代遍历

<img src="https://code-thinking.cdn.bcebos.com/gifs/%E4%BA%8C%E5%8F%89%E6%A0%91%E5%89%8D%E5%BA%8F%E9%81%8D%E5%8E%86%EF%BC%88%E8%BF%AD%E4%BB%A3%E6%B3%95%EF%BC%89.gif" style="zoom:67%;" />

```c++
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> s;
        if(root==NULL) return res;
        s.push(root);
        while(!s.empty()){
            TreeNode* node= s.top();
            s.pop();
            res.push_back(node->val);
            if(node->right) s.push(node->right);
            if(node->left) s.push(node->left);
        }
        return res;
    }
};
```

#### 统一迭代法

每次加入一个右中左，接着将中全部输出，最后再按顺序输出栈里的内容，思路很直观，另外两种遍历也是如此。

```c++
class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        if (root != NULL) st.push(root);
        while (!st.empty()) {
            TreeNode* node = st.top();
            if (node != NULL) {
                st.pop();
                if (node->right) st.push(node->right);  // 右
                if (node->left) st.push(node->left);    // 左
                st.push(node);                          // 中
                st.push(NULL);
            } else {
                st.pop();
                node = st.top();
                st.pop();
                result.push_back(node->val);
            }
        }
        return result;
    }
};
```





### 二叉树的中序遍历

题目链接：[94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

#### 递归遍历

```c++
class Solution {
public:
    void traversal(TreeNode* cur, vector<int>& vec) {
        if (cur == NULL) return;
        traversal(cur->left, vec);  // 左
        vec.push_back(cur->val);    // 中
        traversal(cur->right, vec); // 右
    }
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        traversal(root, result);
        return result;
    }
};
```

#### 迭代遍历

<img src="https://code-thinking.cdn.bcebos.com/gifs/%E4%BA%8C%E5%8F%89%E6%A0%91%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86%EF%BC%88%E8%BF%AD%E4%BB%A3%E6%B3%95%EF%BC%89.gif" style="zoom: 67%;" />

```c++
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> s;
        TreeNode* cur = root;
        
        while (cur != nullptr || !s.empty()) {
            // 将当前节点及其左子树压入栈
            while (cur != nullptr) {
                s.push(cur);
                cur = cur->left;
            }
            cur = s.top();
            s.pop();
            res.push_back(cur->val);
            cur = cur->right;
        } 
        return res;
    }
};
```

#### 统一迭代法

<img src="https://code-thinking.cdn.bcebos.com/gifs/%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86%E8%BF%AD%E4%BB%A3%EF%BC%88%E7%BB%9F%E4%B8%80%E5%86%99%E6%B3%95%EF%BC%89.gif" style="zoom:67%;" />

```c++
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        if (root != NULL) st.push (root);
        while (!st.empty()) {
            TreeNode* node = st.top();
            if (node != NULL) {
                st.pop(); // 将该节点弹出，避免重复操作，下面再将右中左节点添加到栈中
                if (node->right) st.push(node->right);  // 添加右节点（空节点不入栈）
                st.push(node);                          // 添加中节点
                st.push(NULL); // 中节点访问过，但是还没有处理，加入空节点做为标记。
                if (node->left) st.push(node->left);    // 添加左节点（空节点不入栈）
            } else { // 只有遇到空节点的时候，才将下一个节点放进结果集
                st.pop();           // 将空节点弹出
                node = st.top();    // 重新取出栈中元素
                st.pop();
                result.push_back(node->val); // 加入到结果集
            }
        }
        return result;
    }
};
```



### 二叉树的后序遍历

题目链接：[145. 二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)

#### 递归遍历

```c++
class Solution {
public:
    void traversal(TreeNode *root,vector<int>& res){
        if(root==NULL) return;
        traversal(root->left,res);
        traversal(root->right,res);
        res.push_back(root->val);
    }
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> re;
        traversal(root,re);
        return re;
    }
};
```

#### 迭代遍历

```c++
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> s;
        if(root==NULL) return res;
        s.push(root);
        while(!s.empty()){
            TreeNode* node=s.top();
            s.pop();
            res.push_back(node->val);
            if(node->left) s.push(node->left);
            if(node->right) s.push(node->right);
        }
        reverse(res.begin(),res.end());
        return res;
    }
};
```

#### 统一迭代法

```c++
class Solution {
public:
    vector<int> postorderTraversal(TreeNode* root) {
        stack<TreeNode*> s;
        vector<int> res;
        if(root==NULL) return res;
        s.push(root);
        while(!s.empty())
        {
            TreeNode* node =s.top();
            if(node!=NULL)
            {
                s.pop();
                s.push(node);
                s.push(NULL);
                if(node->right) s.push(node->right);
                if(node->left) s.push(node->left);
            }
            else{
                s.pop();
                node =s.top();
                s.pop();
                res.push_back(node->val);
            }
        }
        return res;
    }
};
```


---
title: 代码随想录--二叉树
date: 2025-02-19 15:10:38
tags: [数据结构与算法,二叉树,二叉树遍历,递归,迭代]
categories: [数据结构与算法,代码随想录]
updated: 
description: 代码随想录--二叉树（3）
---

## 二叉树

### 完全二叉树的节点个数

题目链接：[222. 完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

迭代法：

```c++
class Solution {
public:
    int countNodes(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        int sum=0;
        while(!q.empty()){
            int s=q.size();
            for(int i=0;i<s;i++){
                TreeNode* node=q.front();
                q.pop();
                sum+=1;
                if(node->right) q.push(node->right);
                if(node->left) q.push(node->left);
            }
        }
        return sum;
    }
};
```



### 平衡二叉树

题目链接：[110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

```c++
class Solution {
    int get_height(TreeNode* node){
        if(node==NULL) return 0;
        int left=get_height(node->left);
        if(left==-1) return -1;
        int right=get_height(node->right);
        if(right==-1 || abs(left-right)>1) return -1;
        return max(left,right)+1;
    }
public: 
    bool isBalanced(TreeNode* root) {
        return get_height(root) != -1;
    }
};
```



### 二叉树的所有路径

题目链接：[257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)

**回溯和递归是一一对应的，有一个递归，就要有一个回溯**

```c++
class Solution {
private:

    void traversal(TreeNode* cur, string path, vector<string>& result) {
        path += to_string(cur->val); // 中
        if (cur->left == NULL && cur->right == NULL) {
            result.push_back(path);
            return;
        }
        if (cur->left) traversal(cur->left, path + "->", result); // 左
        if (cur->right) traversal(cur->right, path + "->", result); // 右
    }

public:
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> result;
        string path;
        if (root == NULL) return result;
        traversal(root, path, result);
        return result;

    }
};
```





```c++
class Solution {
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        stack<TreeNode*> treeSt; 
        stack<string> path;
        vector<string> ans;
        if(root!=NULL) treeSt.push(root);
        path.push(to_string(root->val));
        while(!treeSt.empty()){
            TreeNode* node=treeSt.top();
            treeSt.pop();
            string p=path.top();
            path.pop();
            if(node->right==NULL && node->left==NULL) ans.push_back(p);
            if(node->left){
                treeSt.push(node->left);
                path.push(p+"->"+to_string(node->left->val));
            }
            if(node->right){
                treeSt.push(node->right);
                path.push(p+"->"+to_string(node->right->val));
            }
        }
        return ans;
    }
};
```

### 左叶子之和

题目链接：[404. 左叶子之和](https://leetcode.cn/problems/sum-of-left-leaves/)

感觉还是迭代法简单好想

```c++
class Solution {
public:
    int sumOfLeftLeaves(TreeNode* root) {
        stack<TreeNode*> s;
        if(root!=NULL) s.push(root);
        int sum=0;
        while(!s.empty()){
            TreeNode* node=s.top();
            s.pop();
            if(node->left && node->left->left==NULL && node->left->right==NULL) sum+=node->left->val;
            if(node->left) s.push(node->left);
            if(node->right) s.push(node->right);
        }
        return sum;
    }
};
```

递归法：

```c++
class Solution {
public:
    int sumOfLeftLeaves(TreeNode* root) {
        if (root == NULL) return 0;
        if (root->left == NULL && root->right== NULL) return 0;

        int leftValue = sumOfLeftLeaves(root->left);    // 左
        if (root->left && !root->left->left && !root->left->right) { // 左子树就是一个左叶子的情况
            leftValue = root->left->val;
        }
        int rightValue = sumOfLeftLeaves(root->right);  // 右

        int sum = leftValue + rightValue;               // 中
        return sum;
    }
};
```

### 找树左下角的值

题目链接：[513. 找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)

#### 迭代法

```c++
class Solution {
public:
    int findBottomLeftValue(TreeNode* root) {
        queue<TreeNode*> q;
        int ans=0;
        if(root!=NULL) q.push(root);
        while(!q.empty()){
            int s=q.size();
            for(int i=0;i<s;i++)
            {
                TreeNode* node = q.front();
                q.pop();
                if(i==0) ans=node->val;
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
        }
        return ans;
    }
};
```



### 路径总和

题目链接：[112. 路径总和](https://leetcode.cn/problems/path-sum/)

#### 迭代法

这题和二叉树的所有路径很像，就是把存储路径改成存储路径和。

##### 版本一

```c++
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        stack<TreeNode*> s;
        stack<int> sums;  // 用来存储每个节点的路径和
        if (root != NULL) {
            s.push(root);  // 将根节点压入栈
            sums.push(root->val);  // 将根节点的值作为初始路径和压入路径和栈
        }  
        while (!s.empty()) {
            TreeNode* node = s.top();
            int sum = sums.top();  // 获取当前节点的路径和
            s.pop();
            sums.pop();            
            // 判断是否是叶子节点并且路径和等于目标值
            if (node->left == NULL && node->right == NULL && sum == targetSum) {
                return true;
            }            
            // 继续将左右子节点和更新后的路径和压入栈中
            if (node->right) {
                s.push(node->right);
                sums.push(sum + node->right->val);
            }
            if (node->left) {
                s.push(node->left);
                sums.push(sum + node->left->val);
            }
        }        
        return false;
    }
};
```

##### 版本二

```c++
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (root == NULL) return false;       
        stack<pair<TreeNode*, int>> s; // 使用栈存储节点和当前的路径和
        s.push({root, root->val}); // 初始化，根节点和它的值      
        while (!s.empty()) {
            TreeNode* node = s.top().first;
            int currentSum = s.top().second;
            s.pop();   
            // 判断是否是叶子节点，并且路径和是否等于目标值
            if (node->left == NULL && node->right == NULL && currentSum == targetSum) {
                return true;
            }       
            // 将子节点和更新后的路径和压入栈中
            if (node->right) s.push({node->right, currentSum + node->right->val});
            if (node->left) s.push({node->left, currentSum + node->left->val});
        }     
        return false;
    }
};
```

#### 递归法





### 路径总和 II

题目链接：[113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)






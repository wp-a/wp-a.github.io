---
title: 代码随想录--二叉树
date: 2025-02-13 14:21:25
tags: [数据结构与算法,二叉树,二叉树遍历,递归,迭代]
categories: [数据结构与算法,代码随想录]
updated: 
description: 代码随想录--二叉树（2）层序遍历
---

## 二叉树层序遍历

### 二叉树层序遍历的模板

<img src="https://code-thinking.cdn.bcebos.com/gifs/102%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%B1%82%E5%BA%8F%E9%81%8D%E5%8E%86.gif" style="zoom:67%;" />

第一种方法看了一遍代码+写 花了16分钟，挺简单的，递归法就先不看了。

```c++
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        vector<vector<int>> res;
        while(!q.empty()){
            int size=q.size();
            vector<int> re;
            for(int i=0;i<size;i++)
            {
                TreeNode* node = q.front();
                q.pop();
                re.push_back(node->val);
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
            res.push_back(re);
        }
        return res;
    }
};
```

```c++
# 递归法
class Solution {
public:
    void order(TreeNode* cur, vector<vector<int>>& result, int depth)
    {
        if (cur == nullptr) return;
        if (result.size() == depth) result.push_back(vector<int>());
        result[depth].push_back(cur->val);
        order(cur->left, result, depth + 1);
        order(cur->right, result, depth + 1);
    }
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        int depth = 0;
        order(root, result, depth);
        return result;
    }
};
```

### 二叉树的层序遍历 II

题目链接：[107. 二叉树的层序遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)

五分钟结束战斗，就是上一个代码翻一下。但是性能有点慢，又交了一次时间也是超100%了。

```c++
class Solution {
public:
    vector<vector<int>> levelOrderBottom(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        vector<vector<int>> res;
        while(!q.empty()){
            int size=q.size();
            vector<int> re;
            for(int i=0;i<size;i++){
                TreeNode* node=q.front();
                q.pop();
                re.push_back(node->val);
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
            res.push_back(re);
        }
        reverse(res.begin(),res.end());
        return res;
    }
};
```



### 二叉树的右视图

题目链接：[199. 二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

四分钟解决战斗，思考了不到一分钟。

```c++
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        vector<int> res;
        while(!q.empty()){
            int size=q.size();
            vector<int> re;
            for(int i=0;i<size;i++)
            {
                TreeNode* node=q.front();
                q.pop();
                re.push_back(node->val); 
                //代码随想录 if (i == (size - 1)) result.push_back(node->val); 
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
            res.push_back(re[size-1]);
        }
        return res;
    }
};
```



### 二叉树的层平均值

题目链接：[637. 二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)

出了一点小插曲，花了五分钟，前边写的q后边写成p了，double第一次用的int忘了改。

```c++
class Solution {
public:
    vector<double> averageOfLevels(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        vector<double> res;
        while(!q.empty()){
            int s=q.size();
            double sum=0;
            for(int i=0;i<s;i++){
                TreeNode* node=q.front();
                q.pop();
                sum+=node->val;
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
            res.push_back(sum/s);
        }
        return res;
    }
};
```

### N 叉树的层序遍历

题目链接：[429. N 叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)

乍一看以为是第一题，看了一下不太明白孩子是啥意思，就直接看的题解，其实也没多大区别。

```c++
class Solution {
public:
    vector<vector<int>> levelOrder(Node* root) {
        queue<Node*> que;
        if (root != NULL) que.push(root);
        vector<vector<int>> result;
        while (!que.empty()) {
            int size = que.size();
            vector<int> vec;
            for (int i = 0; i < size; i++) {
                Node* node = que.front();
                que.pop();
                vec.push_back(node->val);
                for (int i = 0; i < node->children.size(); i++) { // 将节点孩子加入队列
                    if (node->children[i]) que.push(node->children[i]);
                }
            }
            result.push_back(vec);
        }
        return result;

    }
};
```



### 在每个树行中找最大值

题目链接：[515. 在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)

花了8分钟，因为INT_MIN不知道如何操作，本来用的int，然后改成long long一点一点试的。

```c++
class Solution {
public:
    vector<int> largestValues(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        vector<int> res;
        while(!q.empty()){
            int s=q.size();
            long long m=-1e14;   //int maxValue = INT_MIN; // 取每一层的最大值
            for(int i=0;i<s;i++)
            {
            TreeNode* node=q.front();
            q.pop();
            if(node->val>m) m=node->val;
            if(node->left) q.push(node->left);
            if(node->right) q.push(node->right);
            }
            res.push_back(m);
        }
        return res;
    }
};
```

### 填充每个节点的下一个右侧节点指针

题目链接：[116. 填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)

这题没想明白怎么处理，我是应该新建一个什么类型的vector，用int,char,Node类型都不行，然后就直接看题解了。

```c++
class Solution {
public:
    Node* connect(Node* root) {
        if (root == NULL) return NULL;
        queue<Node*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            Node* prev = NULL;  // 用来保存当前层级的前一个节点
            for (int i = 0; i < size; ++i) {
                Node* current = q.front();
                q.pop();
                // 连接前一个节点的next指针指向当前节点
                if (prev != NULL) prev->next = current;
                // 更新prev为当前节点
                prev = current;
                // 将左子树和右子树加入队列
                if (current->left) q.push(current->left);
                if (current->right) q.push(current->right);
            }
            // 将当前层级最后一个节点的next指针设置为NULL
            prev->next = NULL;
        }
        return root;
    }
};
```

利用next指针逐层处理（优化）

```c++
class Solution {
public:
    Node* connect(Node* root) {
        if (!root) return nullptr;
        Node* leftmost = root; // 当前层的最左节点
        while (leftmost->left) { // 直到叶子层
            Node* curr = leftmost;
            while (curr) {
                // 连接左子节点和右子节点
                curr->left->next = curr->right;
                // 连接右子节点和相邻节点的左子节点
                if (curr->next) {
                    curr->right->next = curr->next->left;
                }
                curr = curr->next; // 移动到同层下一节点
            }
            leftmost = leftmost->left; // 移到下一层最左
        }
        return root;
    }
};
```

### 填充每个节点的下一个右侧节点指针 II

题目链接：[117. 填充每个节点的下一个右侧节点指针 II](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)

```c++
class Solution {
public:
    Node* connect(Node* root) {
        if (root == NULL) return NULL;
        queue<Node*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            Node* prev = NULL;  // 用来保存当前层级的前一个节点
            for (int i = 0; i < size; ++i) {
                Node* current = q.front();
                q.pop();
                // 连接前一个节点的next指针指向当前节点
                if (prev != NULL) prev->next = current;
                // 更新prev为当前节点
                prev = current;
                // 将左子树和右子树加入队列
                if (current->left) q.push(current->left);
                if (current->right) q.push(current->right);
            }
            // 将当前层级最后一个节点的next指针设置为NULL
            prev->next = NULL;
        }
        return root;
    }
};
```

###  二叉树的最大深度

题目链接：[104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

虽然简单，但是用这个方法有种高射炮打蚊子的感觉，感觉应该有更简单的方法。

```c++
class Solution {
public:
    int maxDepth(TreeNode* root) {
        queue<TreeNode*> q;
        if(root!=NULL) q.push(root);
        int sum=0;
        while(!q.empty()){
            int s=q.size();
            sum=sum+1;
            for(int i=0;i<s;i++){
                TreeNode* node=q.front();
                q.pop();
                if(node->right) q.push(node->right);
                if(node->left) q.push(node->left);
            }        
        }
        return sum;
    }
};
```

递归方法：后序遍历（DFS）

```c++
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root == nullptr) return 0;
        return max(maxDepth(root->left), maxDepth(root->right)) + 1;
    }
};
```

###  二叉树的最小深度

题目链接：[111. 二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

找第一个没有左右子树的节点的深度。

```c++
class Solution {
public:
    int minDepth(TreeNode* root) {
        if (root == NULL) return 0;
        int depth = 0;
        queue<TreeNode*> que;
        que.push(root);
        while(!que.empty()) {
            int size = que.size();
            depth++; // 记录最小深度
            for (int i = 0; i < size; i++) {
                TreeNode* node = que.front();
                que.pop();
                if (node->left) que.push(node->left);
                if (node->right) que.push(node->right);
                if (!node->left && !node->right) { // 当左右孩子都为空的时候，说明是最低点的一层了，退出
                    return depth;
                }
            }
        }
        return depth;
    }
};
```

递归

    如果 node 是空节点，由于没有节点，返回 0。
    如果 node 没有右儿子，那么深度就是左子树的深度加一，即 dfs(node)=dfs(node.left)+1。
    如果 node 没有左儿子，那么深度就是右子树的深度加一，即 dfs(node)=dfs(node.right)+1。
    如果 node 左右儿子都有，那么分别递归计算左子树的深度，以及右子树的深度，二者取最小值再加一，即 dfs(node)=min(dfs(node.left),dfs(node.right))+1

```c++
class Solution {
public:
    int minDepth(TreeNode *root) {
        if (root == nullptr) return 0;
        if (root->right == nullptr) return minDepth(root->left) + 1;
        if (root->left == nullptr) return minDepth(root->right) + 1;
        return min(minDepth(root->left), minDepth(root->right)) + 1;
    }
};
```

### 翻转二叉树

题目链接：[226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

迭代法：深度优先遍历

```c++
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (root == nullptr) return nullptr;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            // 使用临时变量交换左右子节点
            TreeNode* temp = node->left;
            node->left = node->right;
            node->right = temp;
            // 如果左右子节点不为空，则加入队列
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        return root;
    }
};
```

递归法：

```c++
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (root == NULL) return root;
        swap(root->left, root->right);  // 中
        invertTree(root->left);         // 左
        invertTree(root->right);        // 右
        return root;
    }
};
```

### 对称二叉树

题目链接：[101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

<img src="https://code-thinking.cdn.bcebos.com/gifs/101.%E5%AF%B9%E7%A7%B0%E4%BA%8C%E5%8F%89%E6%A0%91.gif" style="zoom:67%;" />

迭代队列法：

```c++
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if (root == NULL) return true;
        queue<TreeNode*> que;
        que.push(root->left);   // 将左子树头结点加入队列
        que.push(root->right);  // 将右子树头结点加入队列
        
        while (!que.empty()) {  // 接下来就要判断这两个树是否相互翻转
            TreeNode* leftNode = que.front(); que.pop();
            TreeNode* rightNode = que.front(); que.pop();
            if (!leftNode && !rightNode) {  // 左节点为空、右节点为空，此时说明是对称的
                continue;
            }

            // 左右一个节点不为空，或者都不为空但数值不相同，返回false
            if ((!leftNode || !rightNode || (leftNode->val != rightNode->val))) {
                return false;
            }
            que.push(leftNode->left);   // 加入左节点左孩子
            que.push(rightNode->right); // 加入右节点右孩子
            que.push(leftNode->right);  // 加入左节点右孩子
            que.push(rightNode->left);  // 加入右节点左孩子
        }
        return true;
    }
};
```

迭代栈法：

```c++
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if (root == NULL) return true;
        stack<TreeNode*> st; // 这里改成了栈
        st.push(root->left);
        st.push(root->right);
        while (!st.empty()) {
            TreeNode* rightNode = st.top(); st.pop();
            TreeNode* leftNode = st.top(); st.pop();
            if (!leftNode && !rightNode) {
                continue;
            }
            if ((!leftNode || !rightNode || (leftNode->val != rightNode->val))) {
                return false;
            }
            st.push(leftNode->left);
            st.push(rightNode->right);
            st.push(leftNode->right);
            st.push(rightNode->left);
        }
        return true;
    }
};
```

递归法：

```c++
class Solution {
public:
    bool compare(TreeNode* left, TreeNode* right) {
        // 首先排除空节点的情况
        if (left == NULL && right != NULL) return false;
        else if (left != NULL && right == NULL) return false;
        else if (left == NULL && right == NULL) return true;
        // 排除了空节点，再排除数值不相同的情况
        else if (left->val != right->val) return false;

        // 此时就是：左右节点都不为空，且数值相同的情况
        // 此时才做递归，做下一层的判断
        bool outside = compare(left->left, right->right);   // 左子树：左、 右子树：右
        bool inside = compare(left->right, right->left);    // 左子树：右、 右子树：左
        bool isSame = outside && inside;                    // 左子树：中、 右子树：中 （逻辑处理）
        return isSame;

    }
    bool isSymmetric(TreeNode* root) {
        if (root == NULL) return true;
        return compare(root->left, root->right);
    }
};
```


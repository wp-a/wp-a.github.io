---
title: 代码随想录--回溯算法
date: 2025-03-04 22:31:53
tags: [数据结构与算法,回溯,递归,剪枝]
categories: [学习,数据结构与算法,代码随想录]
updated: 
description: 代码随想录--回溯算法（1）
---

## 回溯

### 组合

题目链接：[77. 组合](https://leetcode.cn/problems/combinations/)

<img src="https://code-thinking-1253855093.file.myqcloud.com/pics/20201123195242899.png" style="zoom: 50%;" />

```c++
class Solution {
private:
    vector<vector<int>> result; // 存放符合条件结果的集合
    vector<int> path; // 用来存放符合条件结果
    void backtracking(int n, int k, int startIndex) {
        if (path.size() == k) {
            result.push_back(path);
            return;
        }
        for (int i = startIndex; i <= n; i++) {
            path.push_back(i); // 处理节点
            backtracking(n, k, i + 1); // 递归
            path.pop_back(); // 回溯，撤销处理的节点
        }
    }
public:
    vector<vector<int>> combine(int n, int k) {
        result.clear(); // 可以不写
        path.clear();   // 可以不写
        backtracking(n, k, 1);
        return result;
    }
};
```

#### 回溯剪枝

剪枝的地方就在递归中每一层的for循环所选择的起始位置。

如果for循环选择的起始位置之后的元素个数 已经不足 我们需要的元素个数了，那么就没有必要搜索了。

<img src="https://code-thinking-1253855093.file.myqcloud.com/pics/20210130194335207.png" style="zoom: 50%;" />

```c++
class Solution {
private:
    vector<vector<int>> result;
    vector<int> path;
    void backtracking(int n, int k, int startIndex) {
        if (path.size() == k) {
            result.push_back(path);
            return;
        }
        for (int i = startIndex; i <= n - (k - path.size()) + 1; i++) { // 优化的地方
            path.push_back(i); // 处理节点
            backtracking(n, k, i + 1);
            path.pop_back(); // 回溯，撤销处理的节点
        }
    }
public:
    vector<vector<int>> combine(int n, int k) {
        backtracking(n, k, 1);
        return result;
    }
};
```

### 组合总和 III

题目链接：[216. 组合总和 III](https://leetcode.cn/problems/combination-sum-iii/)

```c++
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> an;
    int sum=0;
    void track(int n,int k,int s){
        if(an.size()==k && sum==n){
            ans.push_back(an);
            return;
        }
        if(sum>n) return;
        for(int i=s;i<=9;i++){
            an.push_back(i);
            sum+=i;
            track(n,k,i+1);
            sum-=i;
            an.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum3(int k, int n) {
        track(n,k,1);
        return ans;
    }
};
```

### 电话号码的字母组合

题目链接：[17. 电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

```c++
class Solution {
private:
    vector<string> ans; // 存储最终结果，字符串组合
    string combination;   // 当前正在构建的字符串组合
    string phoneMap[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"}; // 电话号码数字到字母的映射
    void backtracking(string digits, int index) {
        if (index == digits.size()) { // 递归终止条件：当处理完所有数字时
            ans.push_back(combination); // 将当前组合添加到结果集
            return;
        }
        char digitChar = digits[index]; // 获取当前处理的数字字符
        int digitIndex = digitChar - '0'; // 将数字字符转换为整数索引 (0-9)
        string letters = phoneMap[digitIndex]; // 获取数字对应的字母字符串
        for (char letter : letters) { // 遍历当前数字对应的每个字母
            combination.push_back(letter); // 将当前字母添加到组合中
            backtracking(digits, index + 1); // 递归处理下一个数字，索引 + 1
            combination.pop_back(); // 回溯：移除最后一个添加的字母，尝试下一个字母
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        ans.clear(); // 清空结果集
        combination.clear(); // 清空当前组合
        if (digits.empty()) { // 如果输入 digits 为空，直接返回空结果集
            return ans;
        }
        backtracking(digits, 0); // 从 digits 的第一个数字开始回溯，索引从 0 开始
        return ans;
    }
};
```

### 组合总和

题目链接：[39. 组合总和](https://leetcode.cn/problems/combination-sum/)

```c++
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> an;
    void track(vector<int>& candidates, int target, int startIndex){
        if(target == 0){
            ans.push_back(an);
            return;
        }
        if(target < 0) return;
        for(int i = startIndex; i < candidates.size(); i++){
            an.push_back(candidates[i]);
            track(candidates, target - candidates[i], i); // 注意这里是 i，允许重复使用同一元素
            an.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        ans.clear();
        an.clear();
        track(candidates, target, 0);
        return ans;
    }
};
```

### 组合总和 II

题目链接：[40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)

```c++
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> an;
    void track(vector<int>& candidates, int target, int inx) {
        if (target == 0) {
            ans.push_back(an);
            return;
        }
        if (target < 0) return;
        for (int i = inx; i < candidates.size(); i++) {
            if (i > inx && candidates[i] == candidates[i - 1]) continue; // 如果该元素与左边元素相等，说明该搜索分支重复，直接跳过
            an.push_back(candidates[i]);
            track(candidates, target - candidates[i], i + 1); 
            an.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        track(candidates, target, 0);
        return ans;
    }
};
```

### 子集

题目链接：[78. 子集](https://leetcode.cn/problems/subsets/)

```c++
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> an;
    void track(vector<int>& nums,int idx){
        int n=nums.size();
        ans.push_back(an);
        for(int i=idx;i<n;i++){
            an.push_back(nums[i]);
            track(nums,i+1);
            an.pop_back();
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        track(nums,0);
        return ans;
    }
};
```

### 子集 II

题目链接：[90. 子集 II](https://leetcode.cn/problems/subsets-ii/)

```c++
class Solution {
private:
    vector<vector<int>> ans;
    vector<int> an;
    void track(vector<int>& nums,int idx){
        int n=nums.size();
        ans.push_back(an);
        for(int i=idx;i<n;i++){
            if(i>idx && nums[i]==nums[i-1]) continue;
            an.push_back(nums[i]);
            track(nums,i+1);
            an.pop_back();
        }
    }
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        track(nums,0);
        return ans;
    }
};
```


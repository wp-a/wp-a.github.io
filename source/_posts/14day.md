---
title: 代码随想录--动态规划
date: 2025-03-11 14:14:03
tags: [数据结构与算法,动态规划]
categories: [数据结构与算法,代码随想录]
updated: 
description: 代码随想录--动态规划
---

## 动态规划

动态规划，英文：Dynamic Programming，简称DP，如果某一问题有很多重叠子问题，使用动态规划是最有效的。所以动态规划中每一个状态一定是由上一个状态推导出来的，**这一点就区分于贪心**，贪心没有状态推导，而是从局部直接选最优的。

### 斐波那契数

题目链接：[509. 斐波那契数](https://leetcode.cn/problems/fibonacci-number/)

前几天做过一个斐波那契用递归超时，动态规划感觉就是递归加剪枝。

```c++
class Solution {
public:
    int fib(int N) {
        if (N <= 1) return N;
        int dp[2];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= N; i++) {
            int sum = dp[0] + dp[1];
            dp[0] = dp[1];
            dp[1] = sum;
        }
        return dp[1];
    }
};
```

### 爬楼梯

题目链接：[70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

按照题意，要上楼梯的话，第一步只有两种上法，要么走一级台阶要么走两级台阶，走了一级台阶之后，等于是还要上一个n-1级台阶的楼梯，同理，走了两级台阶的话就等于是还要上一个n-2级台阶的楼梯，以此类推这样动态规划的思想就体现出来了。

```c++
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 1) return n;
        int dp[3];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            int sum = dp[1] + dp[2];
            dp[1] = dp[2];
            dp[2] = sum;
        }
        return dp[2];
    }
};
```

### 使用最小花费爬楼梯

题目链接：[746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)

```c++
class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {
        vector<int> dp(cost.size()+1);
        for(int i=2;i<=cost.size();i++)
        {
            dp[i]=min(dp[i-1]+cost[i-1],dp[i-2]+cost[i-2]);
        }
        return dp[cost.size()];
    }
};
```

### 不同路径

题目链接：[62. 不同路径](https://leetcode.cn/problems/unique-paths/)

```c++
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector f(m + 1, vector<int>(n + 1));
        f[0][1] = 1;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                f[i + 1][j + 1] = f[i][j + 1] + f[i + 1][j];
            }
        }
        return f[m][n];
    }
};
```

### 比特位计数

题目链接：[LCR 003. 比特位计数](https://leetcode.cn/problems/w3tCBm/)

#### 除以2

如果 `i` 是偶数，那么 `i` 的二进制表示中 1 的个数与 `i / 2` 的二进制表示中 1 的个数相同。

如果 `i` 是奇数，那么 `i` 的二进制表示中 1 的个数比 `i / 2` 的二进制表示中 1 的个数多 1。

```c++
class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1);
        ans[0] = 0;
        for (int i = 1; i <= n; ++i) {
            if (i % 2 == 0) {
                ans[i] = ans[i / 2];
            } else {
                ans[i] = ans[i / 2] + 1;
            }
        }
        return ans;
    }
};
```

#### 位运算

进行按位与运算 `i & (i - 1)` 后，从最右边的 1 开始的所有位都会变成 0，而其左边的位保持不变。因此，`i & (i - 1)` 的结果就是将 `i` 最右边的 1 去掉后得到的数字。

```c++
class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1);
        ans[0] = 0;
        for (int i = 1; i <= n; ++i) {
            ans[i] = ans[i & (i - 1)] + 1;
        }
        return ans;
    }
};
```


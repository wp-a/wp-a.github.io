---
title: 代码随想录--数组
date: 2025/1/24
tags: [数据结构与算法,数组,滑动窗口,矩阵规律,前缀和]
categories: [学习,数据结构与算法,代码随想录]
updated: 
description: 代码随想录--数组（下）
keywords: [算法,复试]
top_img:
---

## 滑动窗口

​	刚开始不太好想到滑动窗口这种方法，即使想到了也并没有办法证明滑动窗口方法的正确性，现在我也不会证明。只是会用，前几天做过一次，这是第二次做，记住了这个方法之后也是没有什么障碍。

### 例题

题目链接：[209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

题目描述：找出数组中满足其总和大于等于 `target` 的长度最小的子数组，并返回其长度**。**如果不存在符合条件的子数组，返回 `0` 。

``` c++
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
      int n=nums.size();
      int sum=0,m=100010,j=0;
      for(int i=0;i<n;i++)
      {
        sum=sum+nums[i];
        while(sum>=target){
            m=min(m,i-j+1);
            sum-=nums[j++];
        }
      }
      if(m==100010) return 0;
      return m;
    }
};
```



### 相关题目 

[904. 水果成篮](https://leetcode.cn/problems/fruit-into-baskets/)

题目描述：找一个最长连续子数组，满足子数组中至多有两种数字。返回子数组的长度。

这题题目描述很抽象，没看懂啥意思，去评论区的解释。

[76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

不会做，没思路，目前水平不够，直接跳。



## 矩阵规律

题目链接：[59. 螺旋矩阵 II](https://leetcode.cn/problems/spiral-matrix-ii/)

题目描述：给定一个正整数 `n` ，生成一个包含 `1` 到 `n2` 所有元素，且元素按顺时针顺序螺旋排列的 `n x n` 正方形矩阵 `matrix` 。
### 例题

#### 贪吃蛇输出

题目思路：直接按顺序输出，定义上下左右四个边界，从左到右输出上边界加一，从上到下输出右边界减一，从右向左输出下边界减一，从下到上输出左边界加一，依次输出就可以，因为上边界加一，从上到下就少输出一个，右边界减一，从右到左输出就少输出一个。从下向上输出时，下边界减一，上边界加一，正好按顺序输出，完美！

``` c++
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> res(n, vector<int>(n, 0));
        int l=0,r=n-1,t=0,b=n-1,count=1;
        while(count<=(n*n))
        {
            for(int i=l;i<=r;i++)
            {
                res[t][i]=count;
                count++;
            }
            t++;
            for(int j=t;j<=b;j++)
            {
                res[j][r]=count;
                count++;
            }
            r--;
            for(int j=r;j>=l;j--)
            {
                res[b][j]=count;
                count++;
            }
            b--;
            for(int j=b;j>=t;j--)
            {
                res[j][l]=count;
                count++;
            }
            l++;
        }
        return res;
    }
};
```

#### 循环不变量原则

思路：每条边按左闭右开的输出，每圈输出四次，每次输出边长减一个，这里直接贴一下代码随想录的代码。

``` c++
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        vector<vector<int>> res(n, vector<int>(n, 0)); // 使用vector定义一个二维数组
        int startx = 0, starty = 0; // 定义每循环一个圈的起始位置
        int loop = n / 2; 
        // 每个圈循环几次，例如n为奇数3，那么loop = 1 只是循环一圈，矩阵中间的值需要单独处理
        int mid = n / 2; 
        // 矩阵中间的位置，例如：n为3， 中间的位置就是(1，1)，n为5，中间位置为(2, 2)
        int count = 1; // 用来给矩阵中每一个空格赋值
        int offset = 1; // 需要控制每一条边遍历的长度，每次循环右边界收缩一位
        int i,j;
        while (loop --) {
            i = startx;
            j = starty;
        // 下面开始的四个for就是模拟转了一圈
        // 模拟填充上行从左到右(左闭右开)
            for (j; j < n - offset; j++) res[i][j] = count++;
        // 模拟填充右列从上到下(左闭右开)
            for (i; i < n - offset; i++) res[i][j] = count++;
        // 模拟填充下行从右到左(左闭右开)
            for (; j > starty; j--) res[i][j] = count++;
        // 模拟填充左列从下到上(左闭右开)
            for (; i > startx; i--) res[i][j] = count++;
        // 第二圈开始的时候，起始位置要各自加1， 例如：第一圈起始位置是(0, 0)，第二圈起始位置是(1, 1)
            startx++;
            starty++;
        // offset 控制每一圈里每一条边遍历的长度
            offset += 1;
        }
        // 如果n为奇数的话，需要单独给矩阵最中间的位置赋值
        if (n % 2) res[mid][mid] = count;
        return res;
    }
};
```

### 相关题目

[54. 螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

进阶了一下，今天没时间了改天再做，这两天光建blog了。

[LCR 146. 螺旋遍历二维数组](https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/)

这题虽然是简单题，但是做起来比例题难，这题边界问题比较棘手。

```c++
class Solution {
public:
    vector<int> spiralArray(vector<vector<int>>& array) {
        if (array.empty() || array[0].empty()) {
            return {}; // 返回空 vector
        }
        int t=0,l=0,r=array[0].size() -1,b=array.size()-1,n=array[0].size()*array.size();
        vector<int> ans(n);
        int j=0;
        while(t <= b && l <= r){
            for(int i=l;i<=r;i++) ans[j++]=array[t][i];
            t++;
            for(int i=t;i<=b;i++) ans[j++]=array[i][r];
            r--;
            if (t <= b) { // 确保没有重复遍历
                for (int i = r; i >= l; i--) {
                    ans[j++] = array[b][i];
                }
                b--;
            }
            if (l <= r) { // 确保没有重复遍历
                for (int i = b; i >= t; i--) {
                    ans[j++] = array[i][l];
                }
                l++;
            }
        }
        return ans;
    }
};
```



## 前缀和

**前缀和 在涉及计算区间和的问题时非常有用**！

刚开始使用的暴力解法，一直不行，知道看了题解才知道，故意卡暴力解。然后自己也想不出什么好方法，就问的chatgpt，这种方法刚开始我还以为时间复杂度差不多呢。

### 例题

题目链接：[区间和](https://kamacoder.com/problempage.php?pid=1070/)

题目描述：给定一个整数数组 Array，请计算该数组在每个指定区间内元素的总和。 

``` 
#include <cstdio>

int main() {
    int n;
    scanf("%d", &n);
    int a[n];

    // 读取数组元素
    for (int i = 0; i < n; i++) {
        scanf("%d", &a[i]);
    }

    // 计算前缀和数组
    int prefixSum[n + 1];  // prefixSum[0] = 0
    prefixSum[0] = 0;
    for (int i = 1; i <= n; i++) {
        prefixSum[i] = prefixSum[i - 1] + a[i - 1];
    }

    // 处理区间查询
    int l, r;
    while (scanf("%d %d", &l, &r) != EOF) {
        // 使用前缀和快速计算区间 [l, r] 的和
        printf("%d\n", prefixSum[r + 1] - prefixSum[l]);
    }

    return 0;
}

```



### 相关题目 

[开发商购买土地](https://kamacoder.com/problempage.php?pid=1044/)

看起来挺难的，没看懂题目意思，明天再研究。


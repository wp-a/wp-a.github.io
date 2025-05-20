---
title: 代码随想录--数组
date: 2025/1/23
tags: [数据结构与算法,二分查找,双指针,数组]
categories: [数据结构与算法,代码随想录]
updated: 
type: 
comments:
description: 代码随想录--数组（上）
keywords: [算法,复试]
top_img: 
---


## 二分查找

每次去除当前区间一半的元素，时间复杂度O(logn)，注意处理好区间。

### 例题
题目链接：[704. 二分查找](https://leetcode.cn/problems/binary-search/)

题目描述：在严格递增的序列中找到给定的数，并返回其下标。
#### 左闭右闭 [left,right]

``` c++
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l=0,r=nums.size()-1;
        while(l<=r)
        {
            int mid=(l+r)/2;
            if(nums[mid]>target) r=mid-1;
            else if(nums[mid]<target) l=mid+1;
            else return mid;
        }
        return -1;
    }
};

```

#### 左闭右开 [left,right)

``` c++
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l=0,r=nums.size()-1;
        while(l<r) //当l=r时没有意义，所以改为l<r.
        {
            int mid=(l+r)/2;
            if(nums[mid]>target) r=mid;
            else if(nums[mid]<target) l=mid+1;
            else return mid;
        }
        return -1;
    }
};

```
### 相关题目 

[35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)
比较简单，处理一下返回值就可以。

[34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)
需要进行两次操作，找到左右边界，较复杂，还需要多做做。

[69. x 的平方根 ](https://leetcode.cn/problems/sqrtx/)
我的思路是当(l-r)<=1,找到的l便是整数部分。

[367. 有效的完全平方数](https://leetcode.cn/problems/valid-perfect-square/)
题目还未做



## 双指针

一种重要的编程思想，非常高效。
### 例题
题目链接：https://leetcode.cn/problems/remove-element/

题目描述：给定一个数组 nums 和一个值 val，原地移除所有数值等于 val 的元素，并返回移除后数组的新长度。

#### 左右指针法

思路：从两头向中间移动指针，当左边==val，右边！=val时，交换两个元素，边界问题不太好处理，较麻烦。

``` c++
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int l=0,r=nums.size()-1;
        while(l<=r)
        {
            while(l<=r && nums[l]!=val) l++;
            while(l<=r && nums[r]==val) r--;
            if(l<r){ swap(nums[l],nums[r]);
            l++;
            r--;}
        }
        return r+1;
    }
};
```

#### 快慢指针法 

思路：定义一个快指针，用于一直向前循环，定义一个慢指针，当快指针指到的元素！=val时，将这个元素加入到慢指针指向的位置。快指针不会慢于慢指针，所以慢指针元素的更改就是它最后输出的数组。
``` c++
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int fast=0,slow=0,n=nums.size();
        while(fast<n)
        {
            if(nums[fast]==val) fast++;
            else nums[slow++]=nums[fast++];
        }
        return slow;
    }
};

```

### 相关题目

26.删除有序数组中的重复项：https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/

思路：快慢指针，题解中i为快指针，n为慢指针，当快慢指针指向的元素不相等时，更新慢指针，思路和例题中的差不多。

``` c++
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int n=0;
        for(int i=0;i<nums.size();i++) if(nums[i]!=nums[n]) nums[++n]=nums[i];
        return n+1;
    }
};
```

283.移动零：https://leetcode.cn/problems/move-zeroes/solutions/2821184/san-chong-jie-fa-duo-yu-yan-you-pei-tu-b-1d3s/

思路：这题不太好想，前几天做过，这次看还是没思路。

``` c++
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int n=0,tem;
        for(int i=0;i<nums.size();i++)
        {
            if(nums[i]!=0)
            {
                tem=nums[i];
                nums[i]=0;
                nums[n++]=tem;     
            }
        }
    }
};
```

977.有序数组的平方：https://leetcode.cn/problems/squares-of-a-sorted-array/

这题印象比较深刻，前几天做的时候一直想不明白我的做法的问题，后来问了学长，才知道，我因为没有定义一个新数组，导致在原数组上操作导致的问题。直接定义int数组也不行，得用vector定义一个动态数组，没接触过vector也是不太会用，一直想着看看呢，也总是不想看。当时一直以为是超出int范围了。

思路：左右指针法，两边的数的平方向中间是递减的，所以比较两端，大的那一个就是剩下元素中最大的那个。

``` c++
class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int l = 0, r = nums.size() - 1, pos = nums.size() - 1;
        vector<int> result(nums.size());  // 创建 int 类型的结果数组
        while (l <= r) {
            int ll = nums[l] * nums[l];  
            int rr = nums[r] * nums[r];  
            if (ll >= rr) {
                result[pos] = ll;
                l++;
            } else {
                result[pos] = rr;
                r--;
            }
            pos--;
        }
        return result;  // 返回结果数组
    }
};
```

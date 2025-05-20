---
title: 代码随想录--哈希表
date: 2025-02-03 14:10:17
tags: [数据结构与算法,哈希表,查找,set,map]
categories: [数据结构与算法,代码随想录]
updated: 
description: 代码随想录--哈希表（上）
---

## 哈希表

​	查询一个元素是否出现过，或者一个元素是否在集合里的时候，就要第一时间想到哈希法。一种以关键码的值**「key-value」**而直接进行访问的**数据结构**。

### 有效的字母异位词

题目链接：[242. 有效的字母异位词](https://leetcode.cn/problems/remove-linked-list-elements/)

题目描述：给定两个字符串 `s` 和 `t` ，编写一个函数来判断 `t` 是否是 `s` 的 字母异位词。

题目思路：创建一个哈希表，表长为26，哈希函数采用直接定址法，都不用处理冲突，还是比较简单的。直接排序，看是否两个数组相等应该也可以吧。

``` c++
class Solution {
public:
    bool isAnagram(string s, string t) {
        int n=s.size(),m=t.size(),q[26]={0};
        if(m!=n) return false;
        for(int i=0;i<n;i++) q[s[i]-'a']++;
        for(int i=0;i<m;i++) q[t[i]-'a']--;
        for(int i=0;i<26;i++) if(q[i]!=0) return false;
        return true;
    }
};
```



### 两个数组的交集

题目链接：[349. 两个数组的交集](https://leetcode.cn/problems/intersection-of-two-arrays/)

题目描述：给定两个数组 `nums1` 和 `nums2` ，返回它们的交集。输出结果中的每个元素一定是 **唯一** 的。

我的思路：感觉自己写的这个代码和屎一样，又臭又长，一点也不优雅。首先循环nums1数组，将出现的元素在s[]的位置变为1，然后再遍历第二个数组，如果出现和第一个数组相同的元素，则t[]对应位置变为1，再将这些位置存到一个新数组中，记录数组长度，然后构建一个正好长度的新数组，返回这个数组。

```c++
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        int n=nums1.size(),m=nums2.size();
        int s[1001]={0},t[1001]={-1},num=0,u=1001;
        for(int i=0;i<n;i++) s[nums1[i]]=1;
        for(int i=0;i<m;i++) if(s[nums2[i]]==1) t[nums2[i]]=1;
        vector<int> r(u);
        for(int i=0;i<1001;i++)
        {
            if(t[i]>0){r[num]=i;
            num++;
            }
        }
        vector<int> v(num);
        for(int i=0;i<num;i++) v[i]=r[i];
        return v;
    }
};
```

代码随想录题解：太高级了，看都看不懂，特意搜了一下这几个函数的用法。

​	使用 `unordered_set<int> result` 来存储交集，这样可以自动去重，只保留一个 `nums2` 中与 `nums1` 相同的元素。

**`set1.find(num)`**：

- `find` 是 `unordered_set` 提供的一个成员函数，用于查找一个元素。如果元素存在，它会返回指向该元素的迭代器；如果元素不存在，它会返回指向 **`set1.end()`** 的迭代器。

**`set1.end()`**：

- `set1.end()` 返回的是一个指向 `set1` 容器最后一个元素之后的位置的迭代器。它并不是容器中的一个有效元素，表示容器的末尾。

**`set1.find(num) != set1.end()`**：

- 如果 `find(num)` 返回的迭代器与 `set1.end()` 不同，说明 **`num`** 存在于 `set1` 中。
- 如果 `find(num)` 返回的迭代器等于 `set1.end()`，说明 **`num`** 不存在于 `set1` 中。

```c++
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        unordered_set<int> result_set; 
        unordered_set<int> nums_set(nums1.begin(), nums1.end());
        for (int num : nums2) {
            if (nums_set.find(num) != nums_set.end()) {
                result_set.insert(num);
            }
        }
        return vector<int>(result_set.begin(), result_set.end());
    }
};
```

```c++
class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        unordered_set<int> result_set; 
        int hash[1005] = {0}; 
        for (int num : nums1) { 
            hash[num] = 1;
        }
        for (int num : nums2) { 
            if (hash[num] == 1) {
                result_set.insert(num);
            }
        }
        return vector<int>(result_set.begin(), result_set.end());
    }
};

```

### 快乐数

题目链接：[202. 快乐数](https://leetcode.cn/problems/happy-number/)

我的思路：我就随便试一下，就直接过了，因为不知道停止条件，所以直接设了个100次，性能还很高。

```c++
class Solution {
public:
    bool isHappy(int n) {
        for(int j=0;j<100;j++)
        {
            int num=0,t;
            while(n>0)
            {t=n%10;
            n=n/10;
            num=num+t*t;
            }
            n=num;
            if(n==1) return true;
        }
        return false;
    }
};
```

代码随想录：题目中说了会 **无限循环**，那么也就是说**求和的过程中，sum会重复出现，这对解题很重要！**

```c++
class Solution {
public:
    // 取数值各个位上的单数之和
    int getSum(int n) {
        int sum = 0;
        while (n) {
            sum += (n % 10) * (n % 10);
            n /= 10;
        }
        return sum;
    }
    bool isHappy(int n) {
        unordered_set<int> set;
        while(1) {
            int sum = getSum(n);
            if (sum == 1) {
                return true;
            }
            // 如果这个sum曾经出现过，说明已经陷入了无限循环了，立刻return false
            if (set.find(sum) != set.end()) {
                return false;
            } else {
                set.insert(sum);
            }
            n = sum;
        }
    }
};

```

### 两数之和

题目链接：[1. 两数之和](https://leetcode.cn/problems/two-sum/)

暴力解法：我直接先用暴力解写了一下,比较简单。

```c++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) { 
        int n=nums.size();
        for(int i=0;i<n;i++)
        {
            for(int j=i+1;j<n;j++)
            {
                if((nums[i]+nums[j])==target) 
                {
                    return {i,j};
                }
            }
        }
        return {};
    }
};
```

哈希解法：思路还是挺好想的，但是代码不太会实现，不太熟练，自己写了一半，发现很多操作不会表达。直接贴一份代码随想录的代码。

- 数组的大小是受限制的，而且如果元素很少，而哈希值太大会造成内存空间的浪费。
- set是一个集合，里面放的元素只能是一个key，而两数之和这道题目，不仅要判断y是否存在而且还要记录y的下标位置，因为要返回x 和 y的下标。所以set 也不能用。

​	此时就要选择另一种数据结构：map ，map是一种key value的存储结构，可以用key保存数值，用value再保存数值所在的下标。

map中的存储结构为 {key：数据元素，value：数组元素对应的下标}。

`auto` 是 **C++11** 引入的 **类型自动推导（Type Inference）** 关键字，编译器会根据变量的 **初始化值** 自动推导出其数据类型，而无需手动声明类型。

```c++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        std::unordered_map <int,int> map;
        for(int i = 0; i < nums.size(); i++) {
            // 遍历当前元素，并在map中寻找是否有匹配的key
            auto iter = map.find(target - nums[i]); 
            if(iter != map.end()) {
                return {iter->second, i};
            }
            // 如果没找到匹配对，就把访问过的元素和下标加入到map中
            map.insert(pair<int, int>(nums[i], i)); 
        }
        return {};
    }
};

```


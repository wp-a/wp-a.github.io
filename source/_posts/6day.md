---
title: 代码随想录--哈希表
date: 2025-02-04 14:10:17
tags: [数据结构与算法,哈希表,map,双指针]
categories: [数据结构与算法,代码随想录]
updated: 
description: 代码随想录--哈希表（下）
---

## 哈希表

​	查询一个元素是否出现过，或者一个元素是否在集合里的时候，就要第一时间想到哈希法。一种以关键码的值**「key-value」**而直接进行访问的**数据结构**。[总结](https://programmercarl.com/%E5%93%88%E5%B8%8C%E8%A1%A8%E6%80%BB%E7%BB%93.html#%E5%93%88%E5%B8%8C%E8%A1%A8%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80)

### 四数相加Ⅱ

题目链接：[454. 四数相加 II](https://leetcode.cn/problems/4sum-ii/)

题目思路：我刚开始的思路是for四次，但是算了一下，可能有点超时，然后就直接看题解了。将四个数组两两分成一组进行处理，时间复杂度就是O(n*n)。

1. 首先定义 一个unordered_map，key放a和b两数之和，value 放a和b两数之和出现的次数。
2. 遍历大A和大B数组，统计两个数组元素之和，和出现的次数，放到map中。
3. 定义int变量count，用来统计 a+b+c+d = 0 出现的次数。
4. 再遍历大C和大D数组，找到如果 0-(c+d) 在map中出现过的话，就用count把map中key对应的value也就是出现次数统计出来。
5. 最后返回统计值 count 就可以了

```c++
class Solution {
public:
    int fourSumCount(vector<int>& nums1, vector<int>& nums2, vector<int>& nums3, vector<int>& nums4) {
        unordered_map<int,int> umap;
        for(int a : nums1) for(int b:nums2) umap[a+b]++;
        int count=0;
        for(int c:nums3) for(int d:nums4) if(umap.find(0-(c+d))!=umap.end()) count+=umap[0-(c+d)];
        return count;
    }
};
```

### 救赎金

题目链接：[383. 赎金信](https://leetcode.cn/problems/ransom-note/)

题目思路：秒了，这和 [242. 有效的字母异位词](https://leetcode.cn/problems/valid-anagram/) 几乎差不多。

```c++
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        int n=magazine.size(),m=ransomNote.size();
        int j[26]={0};
        for(int i=0;i<n;i++) j[magazine[i]-'a']++;
        for(int i=0;i<m;i++) j[ransomNote[i]-'a']--;
        for(int i=0;i<26;i++) if(j[i]<0) return false; 
        return true;
    }
};
```

### 三数之和

题目链接：[15. 三数之和](https://leetcode.cn/problems/3sum/)

题目思路1：感觉这题最不好处理的地方就是去重。三次循环，意料之中的超时了，当锻炼一下代码熟练度了。

```c++
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> result;
        sort(nums.begin(),nums.end());
        for(int i=0;i<nums.size();i++)
        {
            for(int j=i+1;j<nums.size();j++)
            {
                for(int k=j+1;k<nums.size();k++)
                {
                    if((nums[i]+nums[j]+nums[k])==0) 
                    result.push_back({nums[i], nums[j], nums[k]});
                }
            }
        }
        set<vector<int>> unique_nums(result.begin(), result.end());
        vector<vector<int>> result_vector(unique_nums.begin(), unique_nums.end());
        return result_vector;
    }
};
```

题目思路2：改了一下上一种方法，用哈希表进行处理。虽然可以通过，但是还是很慢。

```c++
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> result;
        sort(nums.begin(),nums.end());
        for(int i=0;i<nums.size();i++)
        {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            unordered_set<int> set;
            for(int j=i+1;j<nums.size();j++)
            {
                int target = 0 - (nums[i] + nums[j]);
                if (set.find(target) != set.end()) {
                    result.push_back({nums[i], target, nums[j]});   
                    set.erase(target);
                }
                else {
                    set.insert(nums[j]);
                }
            }
        }
        set<vector<int>> unique_nums(result.begin(), result.end());
        vector<vector<int>> result_vector(unique_nums.begin(), unique_nums.end());
        return result_vector;
    }
};
```

双指针：代码随想录的那个代码，感觉很多地方可以优化，所以就去找了一个优化完的代码。首先先将数组排序，我们只需要输出加和等于0的元素就可以，不用管次序。排序之后就可以从两端开始操作了，先创造一个大循环，用来固定住第一个数，然后再用双指针取操作另外两个数。

优化一：当最小的三个数的和大于0时，就可以直接退出循环了。

优化二：当最大的两个数加最小的那个数，还是小于0，就可以向前移动到再大的数了。

```c++
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        ranges::sort(nums);
        vector<vector<int>> ans;
        int n = nums.size();
        for (int i = 0; i < n - 2; i++) {
            int x = nums[i];
            if (i && x == nums[i - 1]) continue; // 跳过重复数字
            if (x + nums[i + 1] + nums[i + 2] > 0) break; // 优化一
            if (x + nums[n - 2] + nums[n - 1] < 0) continue; // 优化二
            int j = i + 1, k = n - 1;
            while (j < k) {
                int s = x + nums[j] + nums[k];
                if (s > 0) {
                    k--;
                } else if (s < 0) {
                    j++;
                } else { // 三数之和为 0
                    ans.push_back({x, nums[j], nums[k]});
                    for (j++; j < k && nums[j] == nums[j - 1]; j++); // 跳过重复数字
                    for (k--; k > j && nums[k] == nums[k + 1]; k--); // 跳过重复数字
                }
            }
        }
        return ans;
    }
};

```

### 四数之和

题目链接：[18. 四数之和](https://leetcode.cn/problems/4sum/)

我的思路：做了半个小时，好几个小问题，思路和上一题一样，用同样的方法，只不过多了一层循环，需要多判断一下重复条件，那几个相加超范围不太会如何处理，chatgpt让它给的方案。看了一下代码随想录的思路，差不多，它加了两行剪枝代码，但是它的代码性能有点慢，加了也不如我的这个性能高，我也在代码中加上了那两行剪枝代码。

```c++
class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        int n=nums.size();
        sort(nums.begin(),nums.end());
        vector<vector<int>> ans;
        for(int i=0;i<n-3;i++)
            if(i>0 && nums[i]==nums[i-1]) continue;
            if (nums[i] > target && nums[i] >= 0) break; // 
            for(int j=i+1;j<n-2;j++)
            {
                if(j>i+1 && nums[j]==nums[j-1]) continue;
                if(nums[i]+nums[j] > target && nums[i]+nums[j] >= 0) break; //
                int c=j+1,d=n-1;
                if((long long)nums[i]+nums[j]+nums[j+1]+nums[j+2]>target) break;
                if((long long)nums[i]+nums[j]+nums[n-1]+nums[n-2]<target) continue;
                while(c<d){
                    long long sum=(long long)nums[i]+nums[j]+nums[c]+nums[d];
                    if(sum>target) d--;
                    else if(sum<target) c++;
                    else{
                        ans.push_back(vector<int> {nums[i],nums[j],nums[c],nums[d]});
                        while(c<d && nums[c]==nums[c+1]) c++;
                        while(c<d && nums[d]==nums[d-1]) d--;
                        c++;
                        d--;
                    }
                }
            }
        }
        return ans;
    }
};
```






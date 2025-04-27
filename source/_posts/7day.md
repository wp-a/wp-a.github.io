---
title: 代码随想录--字符串
date: 2025-02-05 17:48:35
tags: [数据结构与算法,字符串,KMP,双指针,reverse]
categories: [学习,数据结构与算法,代码随想录]
updated: 
description: 代码随想录--字符串
---

## 字符串

​	字符串，就是由字符连接而成的序列。常见的字符串问题包括字符串匹配问题、子串相关问题、前缀/后缀相关问题、回文串相关问题、子序列相关问题等。

### 反转字符串

题目链接：[344. 反转字符串](https://leetcode.cn/problems/reverse-string/)

```c++
class Solution {
public:
    void reverseString(vector<char>& s) {
        for(int i=0,j=s.size()-1;i<j;i++,j--)
        {
            char a=s[i];
            s[i]=s[j];
            s[j]=a;
        }
    }
};
```

### 反转字符串

题目链接：[541. 反转字符串 II](https://leetcode.cn/problems/reverse-string-ii/)

注意一下reverse函数的用法。

```c++
class Solution {
public:
    string reverseStr(string s, int k) {
        for (int i = 0; i < s.size(); i += (2 * k)) {
            if (i + k <= s.size()) {
                reverse(s.begin()  i, s.begin() + i + k );
            } else {
                reverse(s.begin() + i, s.end());
            }
        }
        return s;
    }
};

```

### 替换数字                            

题目链接：[替换数字（第八期模拟笔试）](https://kamacoder.com/problempage.php?pid=1064)

题目思路：看似简单，实则不好操作，gpt给的这个思路很好啊，重新弄一个新字符串然后拼接。代码随想录的那个太麻烦了，直接pass掉了。

```c++
#include <iostream>
#include <cctype>  // 需要 isdigit()
using namespace std;
string replaceDigitsWithNumber(const string& s) {
    string result;
    for (char c : s) {
        if (isdigit(c)) {
            result += "number";  // 仅替换数字
        } else {
            result += c;  // 直接添加非数字字符
        }
    }
    return result;
}
int main() {
    string s;
    cin >> s;  // 读取输入
    cout << replaceDigitsWithNumber(s) << endl;  
    return 0;
}
```

主要难点在于如何去掉空格，使用快慢指针。

```c++
class Solution {
public:
    void reverse(string& s, int start, int end){ //翻转，区间写法：左闭右闭 []
        for (int i = start, j = end; i < j; i++, j--) {
            swap(s[i], s[j]);
        }
    }

    void removeExtraSpaces(string& s) {//去除所有空格并在相邻单词之间添加空格, 快慢指针。
        int slow = 0;   //整体思想参考https://programmercarl.com/0027.移除元素.html
        for (int i = 0; i < s.size(); ++i) { //
            if (s[i] != ' ') { //遇到非空格就处理，即删除所有空格。
                if (slow != 0) s[slow++] = ' '; //手动控制空格，给单词之间添加空格。slow != 0说明不是第一个单词，需要在单词前添加空格。
                while (i < s.size() && s[i] != ' ') { //补上该单词，遇到空格说明单词结束。
                    s[slow++] = s[i++];
                }
            }
        }
        s.resize(slow); //slow的大小即为去除多余空格后的大小。
    }

    string reverseWords(string s) {
        removeExtraSpaces(s); //去除多余空格，保证单词之间之只有一个空格，且字符串首尾没空格。
        reverse(s, 0, s.size() - 1);
        int start = 0; //removeExtraSpaces后保证第一个单词的开始下标一定是0。
        for (int i = 0; i <= s.size(); ++i) {
            if (i == s.size() || s[i] == ' ') { //到达空格或者串尾，说明一个单词结束。进行翻转。
                reverse(s, start, i - 1); //翻转，注意是左闭右闭 []的翻转。
                start = i + 1; //更新下一个单词的开始下标start
            }
        }
        return s;
    }
};
```



### 右旋字符串

题目链接：[右旋字符串](https://kamacoder.com/problempage.php?pid=1065)

题目思路：和前边有一题很类似，都是申请了一个额外的空间往上加，这题是先把后n个加上，再把前m-n个加上。

```c++
#include<iostream>
using namespace std;
int main()
{
    int n;
    string s,ans;
    cin>>n>>s;
    int m=s.size();
    for(int i=(m-n);i<m;i++) ans+=s[i];
    for(int i=0;i<(m-n);i++) ans+=s[i];
    cout<<ans;
    return 0;
}
```

代码随想录：它要求不申请额外的空间，这个就直接reverse两次，和上一题差不多，先全局再局部。

```c++
#include<iostream>
#include<algorithm>
using namespace std;
int main() {
    int n;
    string s;
    cin >> n;
    cin >> s;
    int len = s.size(); //获取长度
    reverse(s.begin(), s.end()); // 整体反转
    reverse(s.begin(), s.begin() + n); // 先反转前一段，长度n
    reverse(s.begin() + n, s.end()); // 再反转后一段
    cout << s << endl;

} 
```



### 找出字符串中第一个匹配项的下标

题目链接：[28. 找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/)

暴力解法：思路正确，但是我写的代码写的太麻烦了，下边贴一份优雅的代码。时间复杂度O(m*n)。

```c++
class Solution {
public:
    int strStr(string haystack, string needle) {
        int s[26]={0};
        if(needle.size()>haystack.size()) return -1;
        for(int i:needle) s[i-'a']++;
        for(int i=0;i<haystack.size();i++)
        {
            int t;
            if(s[haystack[i]-'a']==0) continue;
            else{
                t=i;
                int a=t;
                for(int j=0;j<needle.size();j++) if(haystack.size()-a>=needle.size() && haystack[a+j]==needle[j]) t++;
            }
            if((t-i)==needle.size()) return i;
        }
        return -1;
    }
};
```

```c++
class Solution {
public:
    int strStr(string s, string p) {
        int n = s.size(), m = p.size();
        for(int i = 0; i <= n - m; i++){
            int j = i, k = 0; 
            while(k < m and s[j] == p[k]){
                j++;
                k++;
            }
            if(k == m) return i;
        }
        return -1;
    }
};
```

**KMP解法：**当出现字符串不匹配时，可以记录一部分之前已经匹配的文本内容，利用这些信息避免从头再去做匹配。

前缀表是用来回退的，它记录了模式串与主串(文本串)不匹配的时候，模式串应该从哪里开始重新匹配。代码随想录写的这个就很通俗易懂。

**Nex数组构造：**

1. 初始化
2. 处理前后缀不相同的情况
3. 处理前后缀相同的情况

![](https://code-thinking.cdn.bcebos.com/gifs/KMP%E7%B2%BE%E8%AE%B23.gif)

```c++
class Solution {
public:
    void getNext(int* next, const string& s) {
        int j = -1;
        next[0] = j;
        for(int i = 1; i < s.size(); i++) { // 注意i从1开始
            while (j >= 0 && s[i] != s[j + 1]) { // 前后缀不相同了
                j = next[j]; // 向前回退
            }
            if (s[i] == s[j + 1]) { // 找到相同的前后缀
                j++;
            }
            next[i] = j; // 将j（前缀的长度）赋给next[i]
        }
    }
    int strStr(string haystack, string needle) {
        if (needle.size() == 0) {
            return 0;
        }
		vector<int> next(needle.size());
		getNext(&next[0], needle);
        int j = -1; // // 因为next数组里记录的起始位置为-1
        for (int i = 0; i < haystack.size(); i++) { // 注意i就从0开始
            while(j >= 0 && haystack[i] != needle[j + 1]) { // 不匹配
                j = next[j]; // j 寻找之前匹配的位置
            }
            if (haystack[i] == needle[j + 1]) { // 匹配，j和i同时向后移动
                j++; // i的增加在for循环里
            }
            if (j == (needle.size() - 1) ) { // 文本串s里出现了模式串t
                return (i - needle.size() + 1);
            }
        }
        return -1;
    }
};
```



### 重复的子字符串

题目链接：[459. 重复的子字符串](https://leetcode.cn/problems/repeated-substring-pattern/)

暴力解法：想用暴力法写一下，结果写了两个小时，还是看了题解写出来的，钻牛角尖了。我写的代码性能不如官方代码高，贴一下官方代码。

```c++
class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        int n = s.size();
        for (int i = 1; i * 2 <= n; ++i) {
            if (n % i == 0) {
                bool match = true;
                for (int j = i; j < n; ++j) {
                    if (s[j] != s[j - i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return true;
                }
            }
        }
        return false;
    }
};

```

移动匹配：将两个 s 连在一起，并移除第一个和最后一个字符。如果 s 是该字符串的子串，那么 s 就满足题目要求。

```c++
class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        string t = s + s;
        t.erase(t.begin()); t.erase(t.end() - 1); // 掐头去尾
        if (t.find(s) != std::string::npos) return true; // r
        return false;
    }
};
```

KMP实现：

```c++
class Solution {
public:
    void getNext (int* next, const string& s){
        next[0] = -1;
        int j = -1;
        for(int i = 1;i < s.size(); i++){
            while(j >= 0 && s[i] != s[j + 1]) {
                j = next[j];
            }
            if(s[i] == s[j + 1]) {
                j++;
            }
            next[i] = j;
        }
    }
    bool repeatedSubstringPattern (string s) {
        if (s.size() == 0) {
            return false;
        }
        int next[s.size()];
        getNext(next, s);
        int len = s.size();
        if (next[len - 1] != -1 && len % (len - (next[len - 1] + 1)) == 0) {
            return true;
        }
        return false;
    }
};
```


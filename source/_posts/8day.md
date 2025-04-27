---
title: 代码随想录--栈·队列
date: 2025-02-07 00:10:23
tags: [数据结构与算法,栈,队列,双端队列,堆,queue,stack,deque]
categories: [学习,数据结构与算法,代码随想录]
description: 代码随想录--栈·队列
---

## 栈·队列

​                                     ![栈：先进后出](https://oi-wiki.org/ds/images/stack.svg)                                               ![队列：先进先出](https://oi-wiki.org/ds/images/queue.svg)

### stack

STL 中的 `stack` 容器提供了一众成员函数以供调用，其中较为常用的有：

- 元素访问
  - `st.top()` 返回栈顶
- 修改
  - `st.push()` 插入传入的参数到栈顶
  - `st.pop()` 弹出栈顶
- 容量
  - `st.empty()` 返回是否为空
  - `st.size()` 返回元素数量

### queue 

STL 中的 `queue` 容器提供了一众成员函数以供调用。其中较为常用的有：

- 元素访问
  - `q.front()` 返回队首元素
  - `q.back()` 返回队尾元素
- 修改
  - `q.push()` 在队尾插入元素
  - `q.pop()` 弹出队首元素
- 容量
  - `q.empty()` 队列是否为空
  - `q.size()` 返回队列中元素的数量

### deque

STL 中的 `deque` 容器提供了一众成员函数以供调用。其中较为常用的有：

- 元素访问
  - `q.front()` 返回队首元素
  - `q.back()` 返回队尾元素
- 修改
  - `q.push_back()` 在队尾插入元素
  - `q.pop_back()` 弹出队尾元素
  - `q.push_front()` 在队首插入元素
  - `q.pop_front()` 弹出队首元素
  - `q.insert()` 在指定位置前插入元素（传入迭代器和元素）
  - `q.erase()` 删除指定位置的元素（传入迭代器）
- 容量
  - `q.empty()` 队列是否为空
  - `q.size()` 返回队列中元素的数量

此外，`deque` 还提供了一些运算符。其中较为常用的有：

- 使用赋值运算符 `=` 为 `deque` 赋值，类似 `queue`。

- 使用 `[]` 访问元素，类似 `vector`。

  

### 用栈实现队列

题目链接：[232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

```c++
class MyQueue {
private:
    // 如果 B 栈为空，将 A 栈中的元素倒入 B 栈
    void moveToB() {
        if (B.empty()) {
            while (!A.empty()) {
                B.push(A.top());
                A.pop();
            }
        }
    }
public:
    stack<int> A, B;
    MyQueue() {
    }
    void push(int x) {
        A.push(x);
    }
    int pop() {
        moveToB(); // 移动元素到 B 栈
        int val = B.top();
        B.pop();
        return val;
    }
    int peek() {
        moveToB(); // 移动元素到 B 栈
        return B.top();
    }
    bool empty() {
        return A.empty() && B.empty();
    }
};

```



### 用队列实现栈

题目链接：[225. 用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/)

#### 方法一：使用 **一个队列**

1. **push(x)**：
   - 首先，将元素 `x` 入队到队列末尾。
   - 然后，将队列中前面已有的元素依次出队，再重新入队到队列末尾。
     这样，队列的前端就始终是最新压入的元素，相当于实现了栈的“后进先出（LIFO）”顺序。
2. **pop()**：
   - 直接将队首元素出队即可。因为在上一步的处理里，队首元素就是栈顶。
3. **top()**：
   - 返回队首元素（不弹出）。
4. **empty()**：
   - 判断队列是否为空。

```c++
class MyStack {
public:
    queue<int> q;

    MyStack() {
    }
    
    // 每次 push 后，把前面的 (size - 1) 个元素依次出队并重新入队，确保新元素在队首
    void push(int x) {
        // 1. 新元素先入队
        q.push(x);
        // 2. 将前面的元素依次移到末尾
        int n = q.size();
        // 只需要将前面的 (n - 1) 个元素移动到末尾
        for(int i = 0; i < n - 1; i++) {
            q.push(q.front());
            q.pop();
        }
    }
    
    int pop() {
        int val = q.front();  // 由于 push 中的旋转操作，队首就是栈顶
        q.pop();
        return val;
    }
    
    int top() {
        return q.front();     // 队首即为栈顶
    }
    
    bool empty() {
        return q.empty();
    }
};
```



#### 方法二：使用 **两个队列**

1. **队列 A** 和 **队列 B** 协同工作，保证其中一个队列始终存放当前所有元素，另一个队列用来做辅助操作。
2. push(x)：
   - 把新元素直接入队到**空**队列中（或者你可以总是把它放到 A，然后把 A 里旧的元素转移到 B，具体实现略有差异）。
3. pop()：
   - 在 `pop()` 之前，我们需要把除最后一个元素外的所有元素，从一个队列（有数据的队列）依次出队并入队到另一个空队列，让最后一个元素留在原队列，然后弹出这个元素，这相当于栈顶元素。
4. top()：
   - 类似 `pop()`，只是查看最后一个元素而不把它真正弹出。
5. empty()：
   - 两个队列都为空即为真。

```c++
#include <queue>
using namespace std;

class MyStack {
public:
    queue<int> q1, q2;  // 两个队列

    MyStack() {
    }
    
    void push(int x) {
        // 1. 新元素先入空的队列 q2
        q2.push(x);

        // 2. 把 q1 中所有元素依次移到 q2 中
        while (!q1.empty()) {
            q2.push(q1.front());
            q1.pop();
        }

        // 3. 交换 q1 和 q2，保证所有元素又回到 q1，q2 变空
        swap(q1, q2);
    }
    
    int pop() {
        // 队首就是栈顶
        int val = q1.front();
        q1.pop();
        return val;
    }
    
    int top() {
        return q1.front();
    }
    
    bool empty() {
        return q1.empty() && q2.empty();
    }
};

```



### 有效的括号

题目链接：[20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

题目思路：先判断一下s的长度是否为偶数，如果不是就返回false，再将全部的左符号压入栈中，然后开始判断剩余的符号是否可以匹配，如果不能就返回false，将s循环结束，如果全部匹配成功，最后应该栈是空的，如果不是返回false。

```c++
class Solution {
public:
    bool isValid(string s) {
        int n=s.size();
        if(n%2!=0) return false;
        stack<char> t;
        for(int i=0;i<n;i++)
        {
            if(s[i]=='(') t.push(')');
            else if(s[i]=='{') t.push('}');
            else if(s[i]=='[') t.push(']');
            else if(t.empty() || t.top()!=s[i]) return false;
            else t.pop();
        }
        return t.empty();
    }
};
```



### 删除字符串中的所有相邻重复项

题目链接：[1047. 删除字符串中的所有相邻重复项](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

建栈的写法，性能太差了。

```c++
class Solution {
public:
    string removeDuplicates(string s) {
        stack<char> t;
        int n=s.size();
        for(int i=0;i<n;i++)
        {
            if(!t.empty() && s[i]==t.top()) t.pop();
            else t.push(s[i]); 
        } 
        string result;
        while(!t.empty())
        {
            result=t.top()+result;
            t.pop();
        }
        return result;
    }
};
```

string自己就可以做栈，string有pop和push接口，性能很高。

```c++
class Solution {
public:
    string removeDuplicates(string s) {
        string stk;
        for (char ch : s) {
            if (!stk.empty() && stk.back() == ch) {
                stk.pop_back();
            } else {
                stk.push_back(ch);
            }
        }
        return stk;
    }
};
```



### 逆波兰表达式求值

题目链接：[150. 逆波兰表达式求值](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)

题目挺简单的，就是一个点需要注意：

**`stoi()`**：

- `stoi` 是一个将 `std::string` 类型转换为 `int` 的函数。如果 `tokens[i]` 是一个有效的整数表示，`stoi(tokens[i])` 将返回对应的整数值。

```c++
class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<int> t;
        int n=tokens.size(),re;
        for(int i=0;i<n;i++)
        {
            if(tokens[i]=="+") 
            {
                int a=t.top();t.pop();
                int b=t.top();t.pop();
                re=a+b;
                t.push(re);
            }
            else if(tokens[i]=="-")
            {
                int a=t.top();t.pop();
                int b=t.top();t.pop();
                re=b-a;
                t.push(re);
            }
            else if(tokens[i]=="*")
            {
                int a=t.top();t.pop();
                int b=t.top();t.pop();
                re=b*a;
                t.push(re);
            }
            else if(tokens[i]=="/")
            {
                int a=t.top();t.pop();
                int b=t.top();t.pop();
                re=b/a;
                t.push(re);
            }
            else t.push(stoi(tokens[i]));
        }
        return t.top();
    }
};
```



### 滑动窗口最大值

题目链接：[239. 滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

双端队列：队列中元素个数大于k，就删除队首元素，若入队元素大于队列中的元素，则把队列中的元素弹出。

```c++
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        vector<int> ans;
        deque<int> q; // 双端队列
        for (int i = 0; i < nums.size(); i++) {
            // 1. 入
            while (!q.empty() && nums[q.back()] <= nums[i]) {
                q.pop_back(); // 维护 q 的单调性
            }
            q.push_back(i); // 入队
            // 2. 出
            if (i - q.front() >= k) { // 队首已经离开窗口了
                q.pop_front();
            }
            // 3. 记录答案
            if (i >= k - 1) {
                // 由于队首到队尾单调递减，所以窗口最大值就是队首
                ans.push_back(nums[q.front()]);
            }
        }
        return ans;
    }
};
```



### 前 K 个高频元素

题目链接：[347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

堆是一棵完全二叉树，树中每个结点的值都不小于（或不大于）其左右孩子的值。 如果父亲结点是大于等于左右孩子就是大顶堆，小于等于左右孩子就是小顶堆。**小顶堆每次将最小的元素弹出，最后小顶堆里积累的才是前k个最大元素。**

<img src="https://code-thinking.cdn.bcebos.com/pics/347.%E5%89%8DK%E4%B8%AA%E9%AB%98%E9%A2%91%E5%85%83%E7%B4%A0.jpg" style="zoom: 50%;" />

```c++
class Solution {
public:
    // 小顶堆
    class mycomparison {
    public:
        bool operator()(const pair<int, int>& lhs, const pair<int, int>& rhs) {
            return lhs.second > rhs.second;
        }
    };
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // 要统计元素出现频率
        unordered_map<int, int> map; // map<nums[i],对应出现的次数>
        for (int i = 0; i < nums.size(); i++) {
            map[nums[i]]++;
        }

        // 对频率排序
        // 定义一个小顶堆，大小为k
        priority_queue<pair<int, int>, vector<pair<int, int>>, mycomparison> pri_que;

        // 用固定大小为k的小顶堆，扫面所有频率的数值
        for (unordered_map<int, int>::iterator it = map.begin(); it != map.end(); it++) {
            pri_que.push(*it);
            if (pri_que.size() > k) { // 如果堆的大小大于了K，则队列弹出，保证堆的大小一直为k
                pri_que.pop();
            }
        }

        // 找出前K个高频元素，因为小顶堆先弹出的是最小的，所以倒序来输出到数组
        vector<int> result(k);
        for (int i = k - 1; i >= 0; i--) {
            result[i] = pri_que.top().first;
            pri_que.pop();
        }
        return result;

    }
};
```


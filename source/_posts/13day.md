---
title: 代码随想录--图论
date: 2025-03-08 21:26:31
tags: [数据结构与算法,图论]
categories: [学习,数据结构与算法,代码随想录]
updated: 
description: 代码随想录--图论（1）
---

## 图论

### 图的存储方式

#### 邻接矩阵

邻接矩阵 使用 二维数组来表示图结构。 邻接矩阵是从**节点的角度**来表示图，有多少节点就申请多大的二维数组。

有n 个节点，因为节点标号是从1开始的，为了节点标号和下标对齐，申请 n + 1 * n + 1  这么大的二维数组。

```c++
vector<vector<int>> graph(n + 1, vector<int>(n + 1, 0));
while (m--) {
    cin >> s >> t
    // 使用邻接矩阵 ，1 表示 节点s 指向 节点t
    graph[s][t] = 1;
}
```

#### 邻接表

邻接表 使用 数组 + 链表的方式来表示。 邻接表是从边的数量来表示图，有多少边 才会申请对应大小的链表。

邻接表的构造相对邻接矩阵难理解一些。

<img src="https://code-thinking-1253855093.file.myqcloud.com/pics/20240223103713.png" style="zoom:50%;" />

```c++
// 节点编号从1到n，所以申请 n+1 这么大的数组
vector<list<int>> graph(n + 1); // 邻接表，list为C++里的链表
while (m--) {
    cin >> s >> t;
    // 使用邻接表 ，表示 s -> t 是相连的
    graph[s].push_back(t);
}
```

### 深度优先搜索三部曲

1. 确认递归函数，参数

```c++
vector<vector<int>> result; // 收集符合条件的路径
vector<int> path; // 0节点到终点的路径
// x：目前遍历的节点
// graph：存当前的图
// n：终点
void dfs (const vector<vector<int>>& graph, int x, int n) {
```

2. 确认终止条件

```c++
// 当前遍历的节点x 到达节点n 
if (x == n) { // 找到符合条件的一条路径
    result.push_back(path);
    return;
}
```

3. 处理目前搜索节点出发的路径

```c++
for (int i = 1; i <= n; i++) { // 遍历节点x链接的所有节点
    if (graph[x][i] == 1) { // 找到 x链接的节点
        path.push_back(i); // 遍历到的节点加入到路径中来
        dfs(graph, i, n); // 进入下一层递归
        path.pop_back(); // 回溯，撤销本节点
    }
}
```

4. 打印结果

```c++
// 输出结果
if (result.size() == 0) cout << -1 << endl;
for (const vector<int> &pa : result) {
    for (int i = 0; i < pa.size() - 1; i++) { // 这里指打印到倒数第二个
        cout << pa[i] << " ";
    }
    cout << pa[pa.size() - 1]  << endl; // 这里再打印倒数第一个，控制最后一个元素后面没有空格
}
```

### 例题：所有可能的路径

题目链接：[797. 所有可能的路径](https://leetcode.cn/problems/all-paths-from-source-to-target/)

#### 邻接矩阵写法

```c++
#include <iostream>
#include <vector>
using namespace std;
vector<vector<int>> result; // 收集符合条件的路径
vector<int> path; // 1节点到终点的路径

void dfs (const vector<vector<int>>& graph, int x, int n) {
    // 当前遍历的节点x 到达节点n 
    if (x == n) { // 找到符合条件的一条路径
        result.push_back(path);
        return;
    }
    for (int i = 1; i <= n; i++) { // 遍历节点x链接的所有节点
        if (graph[x][i] == 1) { // 找到 x链接的节点
            path.push_back(i); // 遍历到的节点加入到路径中来
            dfs(graph, i, n); // 进入下一层递归
            path.pop_back(); // 回溯，撤销本节点
        }
    }
}

int main() {
    int n, m, s, t;
    cin >> n >> m;

    // 节点编号从1到n，所以申请 n+1 这么大的数组
    vector<vector<int>> graph(n + 1, vector<int>(n + 1, 0));

    while (m--) {
        cin >> s >> t;
        // 使用邻接矩阵 表示无线图，1 表示 s 与 t 是相连的
        graph[s][t] = 1;
    }

    path.push_back(1); // 无论什么路径已经是从0节点出发
    dfs(graph, 1, n); // 开始遍历

    // 输出结果
    if (result.size() == 0) cout << -1 << endl;
    for (const vector<int> &pa : result) {
        for (int i = 0; i < pa.size() - 1; i++) {
            cout << pa[i] << " ";
        }
        cout << pa[pa.size() - 1]  << endl;
    }
}
```

#### 邻接表写法

```c++
#include <iostream>
#include <vector>
#include <list>
using namespace std;

vector<vector<int>> result; // 收集符合条件的路径
vector<int> path; // 1节点到终点的路径

void dfs (const vector<list<int>>& graph, int x, int n) {

    if (x == n) { // 找到符合条件的一条路径
        result.push_back(path);
        return;
    }
    for (int i : graph[x]) { // 找到 x指向的节点
        path.push_back(i); // 遍历到的节点加入到路径中来
        dfs(graph, i, n); // 进入下一层递归
        path.pop_back(); // 回溯，撤销本节点
    }
}

int main() {
    int n, m, s, t;
    cin >> n >> m;

    // 节点编号从1到n，所以申请 n+1 这么大的数组
    vector<list<int>> graph(n + 1); // 邻接表
    while (m--) {
        cin >> s >> t;
        // 使用邻接表 ，表示 s -> t 是相连的
        graph[s].push_back(t);

    }

    path.push_back(1); // 无论什么路径已经是从0节点出发
    dfs(graph, 1, n); // 开始遍历

    // 输出结果
    if (result.size() == 0) cout << -1 << endl;
    for (const vector<int> &pa : result) {
        for (int i = 0; i < pa.size() - 1; i++) {
            cout << pa[i] << " ";
        }
        cout << pa[pa.size() - 1]  << endl;
    }
}
```


---
title: 基础知识--STL
date: 2025-02-11 00:11:46
tags: [STL,vector,string,deque,set,map,stack,queue,algorithm,priority_queue]
categories: [数据结构与算法,基础知识]
updated: 
type: 
cover: https://wpironman.oss-cn-qingdao.aliyuncs.com/10year.webp
---

# 标准模板库（STL）

STL 即标准模板库（Standard Template Library），是 C++  标准库的一部分，里面包含了一些模板化的通用的数据结构和算法。由于其模板化的特点，它能够兼容自定义的数据类型，避免大量的造轮子工作。NOI 和  ICPC 赛事都支持 STL 库的使用，因此合理利用 STL 可以避免编写无用算法，并且充分利用编译器对模板库优化提高效率。

## STL容器

<img src="https://wpironman.oss-cn-qingdao.aliyuncs.com/20250601144904492.png" style="zoom:50%;" />

### 迭代器

​	在 STL 中，迭代器（Iterator）用来访问和检查 STL 容器中元素的对象，它的行为模式和指针类似，但是它封装了一些有效性检查，并且提供了统一的访问格式。

​	迭代器听起来比较晦涩，其实迭代器本身可以看作一个数据指针。迭代器主要支持两个运算符：自增 (`++`) 和解引用（单目 `*` 运算符），其中自增用来移动迭代器，解引用可以获取或修改它指向的元素。

```c++
vector<int> data(10);
//下面两个 for 循环的效果是一样的
for (int i = 0; i < data.size(); i++)
  cout << data[i] << endl;  // 使用下标访问元素

for (vector<int>::iterator iter = data.begin(); iter != data.end(); iter++)
  cout << *iter << endl;  // 使用迭代器访问元素
// 在C++11后可以使用 auto iter = data.begin() 来简化上述代码
```

​	[STL 容器](https://oi-wiki.org/lang/csl/container/) 一般支持从一端或两端开始的访问，以及对 [const 修饰符](https://oi-wiki.org/lang/const/) 的支持。例如容器的 `begin()` 函数可以获得指向容器第一个元素的迭代器，`rbegin()` 函数可以获得指向容器最后一个元素的反向迭代器，`cbegin()` 函数可以获得指向容器第一个元素的 const 迭代器，`end()` 函数可以获得指向容器尾端（「尾端」并不是最后一个元素，可以看作是最后一个元素的后继；「尾端」的前驱是容器里的最后一个元素，其本身不指向任何一个元素）的迭代器。



### 序列式容器

- **向量**(`vector`) 后端可高效增加元素的顺序表。
- **双端队列**(`deque`) 双端都可高效增加元素的顺序表。
- **列表**(`list`) 可以沿双向遍历的链表。
- **单向列表**(`forward_list`) 只能沿一个方向遍历的链表。

#### `vector`

`std::vector` 是 STL 提供的 **内存连续的**、**可变长度** 的数组（亦称列表）数据结构。能够提供线性复杂度的插入和删除，以及常数复杂度的随机访问。

##### vector定义

```c++
#include<vector>                       //头文件

vector<typename> name;                 //相当于长度可以变化的一维数组

vector<vector<typename> > name;        //相当于长度可以变化的一维数组

vector<typename> Arrayname[arraySize]; 
//一维长度固定为arraySize，Arrayname[0]~Arrayname[arraySize-1]中每一个都是一个vector容器

//typename可以是任何基本类型，例如int,double,char,结构体等，也可以是STL标准容器，例如vector,set,queue等
```

```c++
// 1. 创建空vector; 常数复杂度
vector<int> v0;
// 1+. 这句代码可以使得向vector中插入前3个元素时，保证常数时间复杂度
v0.reserve(3);
// 2. 创建一个初始空间为3的vector，其元素的默认值是0; 线性复杂度
vector<int> v1(3);
// 3. 创建一个初始空间为3的vector，其元素的默认值是2; 线性复杂度
vector<int> v2(3, 2);
// 4. 创建一个初始空间为3的vector，其元素的默认值是1，
// 并且使用v2的空间配置器; 线性复杂度
vector<int> v3(3, 1, v2.get_allocator());
// 5. 创建一个v2的拷贝vector v4， 其内容元素和v2一样; 线性复杂度
vector<int> v4(v2);
// 6. 创建一个v4的拷贝vector v5，其内容是{v4[1], v4[2]}; 线性复杂度
vector<int> v5(v4.begin() + 1, v4.begin() + 3);
// 7. 移动v2到新创建的vector v6，不发生拷贝; 常数复杂度; 需要 C++11
vector<int> v6(std::move(v2));  // 或者 v6 = std::move(v2);
```

#####  vector容器内元素的访问

```c++
//1.通过下标访问
vector<int> m;
//直接访问m[index],index从0到m.size()-1

//2.通过迭代器访问
vector<int>::iterator it;
//迭代器就像STL容器的“指针”，可以用*it访问vector中的元素

//m[i]和*(m.begin()+i)等价
```

```c++
#include<stdio.h>
#include<vector>
using namespace std;
int main()
{
    vector<int> vi;
    for(int i=1;i<=5;i++) vi.push_back(i);
    //1
    vector<int>::iterator it = vi.begin();
    for(int i=0;i<5;i++)
    {
        printf("%d",*(it+i)); //输出 1 2 3 4 5
    }
    //2
    for(vector<int>::iterator it = vi.begin();it!=vi.end();it++)
    {
        printf("%d",*it);    //输出 1 2 3 4 5
    }
    return 0;
}
```

#####  vector常用函数

1. `push_back()` 在末尾插入一个元素，均摊复杂度为 **常数**，最坏为线性复杂度。

2. `pop_back()` 删除末尾元素，常数复杂度。

3. ``front()``返回vector的第一个元素，等价于*a.begin() 和 a[0]。

4. ``back()``返回vector的最后一个元素，等价于*==a.end() 和 a[a.size() – 1]。

5. `size()` 返回容器长度（元素数量），即 `std::distance(v.begin(), v.end())`。

6. `v.data()` 返回指向数组第一个元素的指针。

7. `insert()` 支持在某个迭代器位置插入元素、可以插入多个。``insert(it,x)``在it处插入x。

8. `clear()` 清除所有元素。

9. `erase()` 删除某个迭代器或者区间的元素，返回最后被删除的迭代器。

erase(it)删除迭代器为it处的元素，erase(first，last)即删除[first，last)内所有元素。



#### `deque`

`std::deque`（双端队列）支持在头部和尾部进行高效插入删除的序列容器，与vector相比：

- 头尾插入/删除时间复杂度为O(1)
- 支持随机访问（通过下标）
- 存储空间分块管理，迭代器比vector复杂
- 中间插入删除效率较低

##### deque定义

```c++
#include <deque>

std::deque<int> dq1;              // 空双端队列
std::deque<char> dq2(5, 'A');     // 包含5个'A'
std::deque<int> dq3 = {1,2,3};    // 列表初始化（C++11）
```

##### deque容器内元素的访问

| 方式        | 示例         | 说明                     |
| ----------- | ------------ | ------------------------ |
| 下标访问    | `dq[0]`      | 无越界检查               |
| `at()` 方法 | `dq.at(0)`   | 有越界检查，越界抛出异常 |
| 首元素      | `dq.front()` | 等价于 `dq[0]`           |
| 末尾元素    | `dq.back()`  | 等价于 `dq[dq.size()-1]` |

##### deque常用函数

| 函数              | 功能说明                      |
| ----------------- | ----------------------------- |
| `push_front(x)`   | 在头部插入元素x               |
| `pop_front()`     | 删除头部元素                  |
| `push_back(x)`    | 在尾部插入元素x               |
| `pop_back()`      | 删除尾部元素                  |
| `insert(pos, x)`  | 在迭代器pos前插入元素x        |
| `erase(pos)`      | 删除迭代器pos指向的元素       |
| `resize(n)`       | 调整容器大小为n               |
| `shrink_to_fit()` | 请求移除未使用的容量（C++11） |

##### 特殊说明

```c++
// 头尾操作示例
std::deque<int> dq;
dq.push_front(2);    // 头部插入：dq = [2]
dq.push_back(3);     // 尾部插入：dq = [2,3]
dq.pop_front();      // 删除头部：dq = [3]

// 随机访问示例
dq[0] = 5;          // 修改第一个元素
```

##### 综合对比

| 特性\容器  | vector       | deque          |
| ---------- | ------------ | -------------- |
| 头插效率   | O(n)         | O(1)           |
| 尾插效率   | 均摊O(1)     | O(1)           |
| 中间插入   | O(n)         | O(n)           |
| 内存布局   | 单块连续内存 | 多块连续内存   |
| 迭代器失效 | 容易失效     | 部分操作不失效 |
| 缓存友好性 | 高           | 较低           |



### 关联式容器

- **集合**(`set`) 用以有序地存储 **互异** 元素的容器，其实现是由节点组成的红黑树。
- **多重集合**(`multiset`) 用以有序地存储元素的容器。允许存在相等的元素。

​	头文件set，主要包括set和multiset两个容器，分别是“有序集合”和“有序多重集合”，即前者的元素不能重复，而后者可以包含若干个相等的元素。set和multiset的内部实现是一棵红黑树，它们支持的函数基本相同。 

#### ``set``

`set` 是关联容器，含有键值类型对象的已排序集，搜索、移除和插入拥有对数复杂度。`set` 内部通常采用 [红黑树](https://oi-wiki.org/ds/rbtree/) 实现。[平衡二叉树](https://oi-wiki.org/ds/bst/) 的特性使得 `set` 非常适合处理需要同时兼顾查找、插入与删除的情况。

##### set定义

```c++
#include<set>
set<typename> name;    //set数组的定义和vector相同
set<typename> Arrayname[arraySize];
```

##### set容器内元素的访问

``set只能通过迭代器访问``

set和multiset的迭代器称为“双向访问迭代器”，不支持“随机访问”，支持星号(*)解除引用，仅支持”++”和--“两个与算术相关的操作。

若把it++，则it会指向“下一个”元素。这里的“下一个”元素是指在元素从小到大排序的结果中，排在it下一名的元素。同理，若把it--，则it将会指向排在“上一个”的元素。

```c++
set<typename>::iterator it;   //这样就得到了迭代器，可以通过*it来访问set
```

```c++
#include <stdio.h>
#include <set>
using namespace std;
int main()
{
    set<int> st;
    st.insert(1);
    st.insert(5);
    st.insert(3);
    st.insert(3);
    for(set<int>::iterator it = st.begin();it != st.end();it++)
    {
        printf("%d",*it);
    }
    return 0;
}
//输出结果：1 3 5
```

##### set常用函数

1. `insert(x)` 当容器中没有等价元素的时候，将元素 x 插入到 `set` 中。

2. `find(x)` 在 `set` 内存在键为 x 的元素时会返回该元素的迭代器，否则返回 `end()`。

3. `erase(x)` 删除值为 x 的 **所有** 元素，返回删除元素的个数。

​      `erase(pos)` 删除迭代器为 pos 的元素，要求迭代器必须合法。

​      `erase(first,last)` 删除迭代器在 [first,last) 范围内的所有元素。

4. `clear()` 清空 `set`。

5. `count(x)` 返回 `set` 内键为 x 的元素数量。

6. `lower_bound(x)` 返回指向首个不小于给定键的元素的迭代器。如果不存在这样的元素，返回 `end()`。

7. `upper_bound(x)` 返回指向首个大于给定键的元素的迭代器。如果不存在这样的元素，返回 `end()`。

8. `empty()` 返回容器是否为空。

9. `size()` 返回容器内元素个数。

```c++
// 现存可用的元素
set<int> available;
// 需要大于等于的值
int x;

// 查找最小的大于等于x的元素
set<int>::iterator it = available.lower_bound(x);
if (it == available.end()) {
  // 不存在这样的元素，则进行相应操作……
} else {
  // 找到了这样的元素，将其从现存可用元素中移除
  available.erase(it);
  // 进行相应操作……
}
```



- **映射**(`map`) 由 {键，值} 对组成的集合，以某种比较键大小关系的谓词进行排列。
- **多重映射**(`multimap`) 由 {键，值} 对组成的多重集合，亦即允许键有相等情况的映射。

#### ``map``

`map` 是有序键值对容器，它的元素的键是唯一的。搜索、移除和插入操作拥有对数复杂度。`map` 通常实现为 [红黑树](https://oi-wiki.org/ds/rbtree/)。

##### map定义

```c++
map<key,value> mp;
//字符串映射到整型，必须使用string而不能用char数组
map<string,int> mp;
//将set容器映射到字符串
map<set<int>, string> mp;
```

##### map容器内元素的访问

```c++
//1.通过下标访问
map<char,int> mp;
//直接使用mp['c']来访问对应的整数，map中的键是唯一的。
#include <stdio.h>
#include <map>
using namespace std;
int main()
{
    map<char,int> mp;
    mp['c']=20;
    mp['c']=30;
    printf("%d\n",mp['c']);  //输出30
    return 0;
}

//2.通过迭代器访问
map<key,value>::iterator it;
//map可以使用it->first来访问键，使用it->second来访问值。
#include <stdio.h>
#include <map>
using namespace std;
int main()
{
    map<char,int> mp;
    mp['m']=20;
    mp['r']=30;
    mp['a']=40;
    for(map<char,int>::iterator it = mp.begin();it!=mp.end();it++)
    {
        printf("%c %d\n",it->first,it->second);
    }        
    return 0;
}
// 输出：map会以键从小到大的顺序自动排序
// a 40
// m 20
// r 30
```

##### map常用函数

1. 通过向 `map` 中插入一个类型为 `pair<Key, T>` 的值可以达到插入元素的目的，例如 `mp.insert(pair<string,int>("Alan",100));`；

2. `find(x)`: 若容器内存在键为 x 的元素，会返回该元素的迭代器；否则返回 `end()`。

3. `erase(key)` 函数会删除键为 `key` 的 **所有** 元素。返回值为删除元素的数量。

​       `erase(pos)`: 删除迭代器为 pos 的元素，要求迭代器必须合法。

​       `erase(first,last)`: 删除迭代器在 [first,last) 范围内的所有元素。

4. `clear()` 函数会清空整个容器。

5. `count(x)`: 返回容器内键为 x 的元素数量。复杂度为 ![O(\log(size)+ans)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)（关于容器大小对数复杂度，加上匹配个数)。

6. `lower_bound(x)`: 返回指向首个不小于给定键的元素的迭代器。

7. `upper_bound(x)`: 返回指向首个大于给定键的元素的迭代器。若容器内所有元素均小于或等于给定键，返回 `end()`。

8. `empty()`: 返回容器是否为空。

9. `size()`: 返回容器内元素个数。



### 无序（关联式）容器

- **无序（多重）集合**(`unordered_set`/`unordered_multiset`)**C++11**，与 `set`/`multiset` 的区别在于元素无序，只关心「元素是否存在」，使用哈希实现。

- **无序（多重）映射**(`unordered_map`/`unordered_multimap`)**C++11**，与 `map`/`multimap` 的区别在于键 (key) 无序，只关心 "键与值的对应关系"，使用哈希实现。

  

### 容器适配器

容器适配器其实并不是容器。它们不具有容器的某些特点（如：有迭代器、有 `clear()` 函数……）。

> 「适配器是使一种事物的行为类似于另外一种事物行为的一种机制」，适配器对容器进行包装，使其表现出另外一种行为。

- **栈**(`stack`) 后进先出 (LIFO) 的容器，默认是对双端队列（`deque`）的包装。
- **队列**(`queue`) 先进先出 (FIFO) 的容器，默认是对双端队列（`deque`）的包装。
- **优先队列**(`priority_queue`) 元素的次序是由作用于所存储的值对上的某种谓词决定的的一种队列，默认是对向量（`vector`）的包装。



#### stack（栈）

STL [栈](https://oi-wiki.org/ds/stack/)(`std::stack`) 是一种后进先出 (Last In, First Out) 的容器适配器，仅支持查询或删除最后一个加入的元素（栈顶元素），不支持随机访问，且为了保证数据的严格有序性，不支持迭代器。用来模拟实现一些递归。

##### stack定义

```c++
#include<stack>
std::stack<TypeName> name;  // 使用默认底层容器 deque，数据类型为 TypeName
std::stack<TypeName, Container> name;  // 使用 Container 作为底层容器

std::stack<TypeName> s2(s1);        // 将 s1 复制一份用于构造 s2
```

##### stack容器内元素的访问

由于栈本身就是一种后进先出的数据结构，在STL的stack中只能通过top()来访问栈顶元素。

##### stack常用函数

1. `top()` 访问栈顶元素（如果栈为空，此处会出错）

2. `push(x)` 向栈中插入元素 x

3. `pop()` 删除栈顶元素

4. `size()` 查询容器中的元素数量

5. `empty()` 询问容器是否为空



#### queue（队列）

STL [队列](https://oi-wiki.org/ds/queue/)(`std::queue`) 是一种先进先出 (First In, First Out) 的容器适配器，仅支持查询或删除第一个加入的元素（队首元素），不支持随机访问，且为了保证数据的严格有序性，不支持迭代器。

##### queue定义

```c++
#include<queue>
std::queue<TypeName> name;  // 使用默认底层容器 deque，数据类型为 TypeName
std::queue<TypeName, Container> name;  // 使用 Container 作为底层容器

std::queue<TypeName> q2(q1);  // 将 s1 复制一份用于构造 q2
```

##### queue容器内元素的访问

由于队列本身就是一种先进先出的数据结构，在STL的queue中只能通过front()来访问队首元素，通过back()访问队尾元素。

##### queue常用函数

1. `front()` 访问队首元素（如果队列为空，此处会出错）
2. `back()` 访问队尾元素

3. `push(x)` 向队列中插入元素 x

4. `pop()` 删除队首元素

5. `size()` 查询容器中的元素数量
6. `empty()` 询问容器是否为空



#### priority_queue（优先队列）

优先队列 `std::priority_queue` 是一种 [堆](https://oi-wiki.org/ds/heap/)，一般为 [二叉堆](https://oi-wiki.org/ds/binary-heap/)。队首元素一定是当前队列中优先级最高的那一个。

##### priority_queue定义

```c++
#include<queue>
priority_queue<TypeName> name;             // 数据类型为 TypeName
priority_queue<TypeName, Container> name;  // 使用 Container 作为底层容器
priority_queue<TypeName, Container, Compare> name;
// 使用 Container 作为底层容器，使用 Compare 作为比较类型
```

##### priority_queue容器内元素的访问

和队列不一样的是，优先队列没有front()和back()，只能通过top()访问队首元素(堆顶元素)。

##### priority_queue常用函数

1. `top()` 访问堆顶元素（此时优先队列不能为空）
2. `pop()` 删除堆顶元素（此时优先队列不能为空）

3. `push(x)` 插入元素，并对底层容器排序

4. `size()` 查询容器中的元素数量

5. `empty()` 询问容器是否为空



## STL算法

STL 提供了大约 100 个实现算法的模版函数，基本都包含在 `<algorithm>` 之中，还有一部分包含在 `<numeric>` 和 `<functional>`。

### algorithm

`<algorithm>` 头文件提供了大量通用算法，适用于多种容器。所有算法均通过迭代器操作，不对容器进行直接修改（除非明确说明）。

#### 常用算法列表

| 算法                               | 功能说明                                                     |
| ---------------------------------- | ------------------------------------------------------------ |
| `sort(beg, end, cmp)`              | 对区间[beg,end)排序，cmp为可选比较函数（默认升序）           |
| `reverse(beg, end)`                | 反转指定区间的元素顺序                                       |
| `max(a, b)` / `min(a, b)`          | 返回两个值的较大/较小值（C++11支持初始化列表：`max({1,2,3})`） |
| `swap(a, b)`                       | 交换两个变量的值                                             |
| `find(beg, end, val)`              | 在区间内查找值，返回首个匹配的迭代器，未找到返回end          |
| `count(beg, end, val)`             | 统计区间内指定值出现的次数                                   |
| `fill(beg, end, val)`              | 用指定值填充区间                                             |
| `copy(src_beg, src_end, dest_beg)` | 复制源区间到目标位置                                         |
| `unique(beg, end)`                 | 去除相邻重复元素，返回去重后的新结尾迭代器（通常先排序后使用） |
| `lower_bound(beg, end, val)`       | 在有序区间中找第一个不小于val的元素位置                      |
| `upper_bound(beg, end, val)`       | 在有序区间中找第一个大于val的元素位置                        |
| `binary_search(beg, end, val)`     | 检查有序区间中是否存在指定值                                 |

#### 典型使用示例

```c++
// 自定义排序
std::vector<int> vec = {3,1,4,2};
std::sort(vec.begin(), vec.end(), [](int a, int b){ return a > b; }); // 降序排列

// 去重操作
std::sort(vec.begin(), vec.end());
auto last = std::unique(vec.begin(), vec.end());
vec.erase(last, vec.end());

// 查找元素
auto it = std::find(vec.begin(), vec.end(), 3);
if (it != vec.end()) std::cout << "Found: " << *it;
```

## pair

`std::pair` 是一个模板类，用于将两个值组合成一个单元。常用于需要返回两个值的场景，或作为`map`容器的元素类型。通过灵活使用 `pair`，可以轻松应对 **需要将关联数据捆绑存储、处理** 的场景。

### pair定义

```c++
#include <utility>
//可以在定义时直接完成 pair 的初始化。
pair<int, double> p0(1, 2.0);
//也可以使用先定义，后赋值的方法完成 pair 的初始化。
pair<int, double> p1;   // 默认构造：int=0, double=0.0
p1.first = 1;
p1.second = 2.0;
//还可以使用 std::make_pair 函数。该函数接受两个变量，并返回由这两个变量组成的 pair。
pair<int, double> p2 = make_pair(1, 2.0);
//在 C++11 以及之后的版本中，make_pair 可以配合 auto 使用，以避免显式声明数据类型。
auto p3 = make_pair(3.14, "PI");          // 自动推导类型（C++11）
```

### pair元素访问

| 成员变量 | 说明           |
| -------- | -------------- |
| `first`  | 访问第一个元素 |
| `second` | 访问第二个元素 |

### 常用操作

| 操作                      | 说明                                                |
| ------------------------- | --------------------------------------------------- |
| 比较运算符（==, !=, <等） | 按字典序比较：先比较first，相等时再比较second       |
| `swap`                    | 使用 `swap` 函数交换 `pair` 的值。                  |
| 赋值                      | 将 `pair` 的值赋给另一个类型一致的 `pair`。p0 = p1; |

## string

`std::string` 是 C++ 标准库提供的字符串类，用于存储和操作字符序列。它在内存中以连续块存储字符，支持高效的随机访问和动态调整大小。

### string定义

```c++
#include <string>

std::string str1;                // 空字符串
std::string str2 = "Hello";      // 用C风格字符串初始化
std::string str3(5, 'A');        // 创建含5个'A'的字符串，输出"AAAAA"
std::string str4(str2, 1, 3);    // 从str2下标1开始取3个字符，输出"ell"
```

### string容器内元素的访问

```c++
//1. 通过下标访问
str[index]
//2. 通过迭代器访问
string::iterator it;
//可以通过*it访问string里的每一位
for(string::iterator it= str.begin();it!=str.end();it++){
    printf("%c",*it);
}
//string和vector一样，支持直接对迭代器进行加减某个字，str.begin()+3
```

### string常用函数

| 函数                     |                           功能说明                           |
| ------------------------ | :----------------------------------------------------------: |
| `append(str)`            |                     在字符串末尾追加内容                     |
| `push_back(c)`           |                         追加单个字符                         |
| `pop_back()`             |                  删除最后一个字符（C++11）                   |
| `insert(pos, str)`       |                     在指定位置插入字符串                     |
| `erase(pos, len)`        |                    从pos开始删除len个字符                    |
| `replace(pos, len, str)` |                替换从pos开始的len个字符为str                 |
| `find(str, pos)`         | 从pos开始查找子串，返回首次出现的位置，未找到返回`string::npos` |
| `compare(str)`           |   比较字符串（返回0表示相等，负数表示小于，正数表示大于）    |
| `c_str()`                |                返回C风格字符串（const char*）                |
| `clear()`                |                        清空字符串内容                        |
| `resize(n, c)`           |            调整字符串长度为n，多出部分用字符c填充            |
| `capacity()`             |                    返回当前分配的存储容量                    |
| `reserve(n)`             |              预分配至少能存储n个字符的内存空间               |


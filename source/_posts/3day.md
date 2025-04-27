---
title: 代码随想录--链表
date: 2025/1/25
tags: [数据结构与算法,递归,双指针,链表]
categories: [学习,数据结构与算法,代码随想录]
updated: 
description: 代码随想录--链表（上）
---


## 链表基础

​	链表是一种通过指针串联在一起的线性结构，每一个节点由两部分组成，一个是数据域一个是指针域，最后一个节点的指针域指向null（空指针的意思）。

### 移除链表元素

题目链接：[203. 移除链表元素](https://leetcode.cn/problems/remove-linked-list-elements/)

题目描述：一个链表的头节点 `head` 和一个整数 `val` ，删除链表中所有满足 `Node.val == val` 的节点，并返回新的头节点 。

#### 虚拟头节点

时间复杂度：O(n)     空间复杂度：O(1)

题目思路：如果直接处理链表的话，需要考虑头节点，但是加入虚拟头节点就可以按照统一的方式去处理。

``` c++
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode* dummy=new ListNode(0);
        ListNode* pre=dummy;
        pre->next=head;
        while(head)
        {
            if(head->val==val)
            {
                pre->next=head->next;
                ListNode* tem=head;
                head=head->next;
                delete tem;
            }
            else
            {
                pre=head;
                head=head->next;
            }
        }
        return dummy->next;
    }
};
```

#### 直接操作

时间复杂度：O(n)     空间复杂度：O(1)

```c++
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        // 删除头结点
        while (head != NULL && head->val == val) { // 注意这里不是if
            ListNode* tmp = head;
            head = head->next;
            delete tmp;
        }
        // 删除非头结点
        ListNode* cur = head;
        while (cur != NULL && cur->next!= NULL) {
            if (cur->next->val == val) {
                ListNode* tmp = cur->next;
                cur->next = cur->next->next;
                delete tmp;
            } else {
                cur = cur->next;
            }
        }
        return head;
    }
};
```

#### 递归解法

时间复杂度：O(n)     空间复杂度：O(n)

题目思路：首先检查头节点的值是否为 val，如果是则移除头节点，答案即为在头节点的后续节点上递归的结果；如果头节点的值不为 val，则答案为头节点与在头节点的后续节点上递归得到的新链表拼接的结果。

``` c++
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        // 基础情况：空链表
        if (head == nullptr) {
            return nullptr;
        }
        // 递归处理
        if (head->val == val) {
            ListNode* newHead = removeElements(head->next, val);
            delete head;
            return newHead;
        } else {
            head->next = removeElements(head->next, val);
            return head;
        }
    }
};
```

### 反转链表

题目链接：[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)

题目描述：反转单链表，并返回反转后的链表。

#### 双指针法

时间复杂度：O(n)     空间复杂度：O(1)

题目思路：定义cur和pre指针，pre初始化为NULL，cur指向head，然后反转链表，cur->next指向pre，按逻辑移动。

``` c++
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* tem;
        ListNode* cur=head;
        ListNode* pre=NULL;
        while(cur)
        {
            tem=cur->next;
            cur->next=pre;
            pre=cur;
            cur=tem;
        }
        return pre;
    }
};
```

#### 递归法

思路和双指针差不多，明天研究一下。

时间复杂度：O(n)     空间复杂度：O(n)

```c++
class Solution {
public:
    ListNode* reverse(ListNode* pre,ListNode* cur){
        if(cur == NULL) return pre;
        ListNode* temp = cur->next;
        cur->next = pre;
        // 可以和双指针法的代码进行对比，如下递归的写法，其实就是做了这两步
        // pre = cur;
        // cur = temp;
        return reverse(cur,temp);
    }
    ListNode* reverseList(ListNode* head) {
        // 和双指针法初始化是一样的逻辑
        // ListNode* cur = head;
        // ListNode* pre = NULL;
        return reverse(NULL, head);
    }

};
```



### 设计链表

题目链接：[707. 设计链表](https://leetcode.cn/problems/design-linked-list/)

题目描述：获取第index个节点的值，添加头节点，添加尾节点，在第 index 个节点之前添加值为 val 的节点，删除链表中的第 index 个节点。

#### 虚拟头节点

``` c++
class MyLinkedList {
private:
    struct LinkedNode {          // 先定义 LinkedNode 结构体
        int val;
        LinkedNode* next;
        LinkedNode(int val) : val(val), next(nullptr) {}
    };
    LinkedNode* dummyhead;       // 现在可以使用 LinkedNode 类型
    int size;
    
public:
    MyLinkedList() {
        dummyhead=new LinkedNode(0);
        size=0;
    }   
    int get(int index) {
        if(index>(size-1) || index<0){
            return -1;
        }
        LinkedNode* cur=dummyhead->next;
        while(index--){
            cur=cur->next;
        }
        return cur->val;
    }  
    void addAtHead(int val) {
        LinkedNode* newNode = new LinkedNode(val);
        newNode->next=dummyhead->next;
        dummyhead->next=newNode;
        size++;
    } 
    void addAtTail(int val) {
        LinkedNode* newNode=new LinkedNode(val);
        LinkedNode* cur=dummyhead;
        while(cur->next != NULL)
        {
            cur=cur->next;
        }
        cur->next=newNode;
        size++;
    }   
    void addAtIndex(int index, int val) {
        if(index>size) return;
        if(index<0) index=0;
        LinkedNode* newNode=new LinkedNode(val);
        LinkedNode* cur=dummyhead;
        while(index--){
            cur=cur->next;
        }
        newNode->next=cur->next;
        cur->next=newNode;
        size++;
    }
    void deleteAtIndex(int index) {
        if(index>(size-1) || index<0){
            return;
        }
        LinkedNode* cur=dummyhead;
        while(index--)
        {
            cur=cur->next;
        }
        LinkedNode* tem=cur->next;
        cur->next=cur->next->next;
        delete tem;
        size--;
    }
};
```

#### 虚拟头节点（双链表）

还未看，直接copy的

``` c++
//采用循环虚拟结点的双链表实现
class MyLinkedList {
public:
    // 定义双向链表节点结构体
    struct DList {
        int elem; // 节点存储的元素
        DList *next; // 指向下一个节点的指针
        DList *prev; // 指向上一个节点的指针
        // 构造函数，创建一个值为elem的新节点
        DList(int elem) : elem(elem), next(nullptr), prev(nullptr) {};
    };

    // 构造函数，初始化链表
    MyLinkedList() {
        sentinelNode = new DList(0); // 创建哨兵节点，不存储有效数据
        sentinelNode->next = sentinelNode; // 哨兵节点的下一个节点指向自身，形成循环
        sentinelNode->prev = sentinelNode; // 哨兵节点的上一个节点指向自身，形成循环
        size = 0; // 初始化链表大小为0
    }

    // 获取链表中第index个节点的值
    int get(int index) {
        if (index > (size - 1) || index < 0) { // 检查索引是否超出范围
            return -1; // 如果超出范围，返回-1
        }
        int num;
        int mid = size >> 1; // 计算链表中部位置
        DList *curNode = sentinelNode; // 从哨兵节点开始
        if (index < mid) { // 如果索引小于中部位置，从前往后遍历
            for (int i = 0; i < index + 1; i++) {
                curNode = curNode->next; // 移动到目标节点
            }
        } else { // 如果索引大于等于中部位置，从后往前遍历
            for (int i = 0; i < size - index; i++) {
                curNode = curNode->prev; // 移动到目标节点
            }
        }
        num = curNode->elem; // 获取目标节点的值
        return num; // 返回节点的值
    }

    // 在链表头部添加节点
    void addAtHead(int val) {
        DList *newNode = new DList(val); // 创建新节点
        DList *next = sentinelNode->next; // 获取当前头节点的下一个节点
        newNode->prev = sentinelNode; // 新节点的上一个节点指向哨兵节点
        newNode->next = next; // 新节点的下一个节点指向原来的头节点
        size++; // 链表大小加1
        sentinelNode->next = newNode; // 哨兵节点的下一个节点指向新节点
        next->prev = newNode; // 原来的头节点的上一个节点指向新节点
    }

    // 在链表尾部添加节点
    void addAtTail(int val) {
        DList *newNode = new DList(val); // 创建新节点
        DList *prev = sentinelNode->prev; // 获取当前尾节点的上一个节点
        newNode->next = sentinelNode; // 新节点的下一个节点指向哨兵节点
        newNode->prev = prev; // 新节点的上一个节点指向原来的尾节点
        size++; // 链表大小加1
        sentinelNode->prev = newNode; // 哨兵节点的上一个节点指向新节点
        prev->next = newNode; // 原来的尾节点的下一个节点指向新节点
    }

    // 在链表中的第index个节点之前添加值为val的节点
    void addAtIndex(int index, int val) {
        if (index > size) { // 检查索引是否超出范围
            return; // 如果超出范围，直接返回
        }
        if (index <= 0) { // 如果索引为0或负数，在头部添加节点
            addAtHead(val);
            return;
        }
        int num;
        int mid = size >> 1; // 计算链表中部位置
        DList *curNode = sentinelNode; // 从哨兵节点开始
        if (index < mid) { // 如果索引小于中部位置，从前往后遍历
            for (int i = 0; i < index; i++) {
                curNode = curNode->next; // 移动到目标位置的前一个节点
            }
            DList *temp = curNode->next; // 获取目标位置的节点
            DList *newNode = new DList(val); // 创建新节点
            curNode->next = newNode; // 在目标位置前添加新节点
            temp->prev = newNode; // 目标位置的节点的前一个节点指向新节点
            newNode->next = temp; // 新节点的下一个节点指向目标位置的结点
            newNode->prev = curNode; // 新节点的上一个节点指向当前节点
        } else { // 如果索引大于等于中部位置，从后往前遍历
            for (int i = 0; i < size - index; i++) {
                curNode = curNode->prev; // 移动到目标位置的后一个节点
            }
            DList *temp = curNode->prev; // 获取目标位置的节点
            DList *newNode = new DList(val); // 创建新节点
            curNode->prev = newNode; // 在目标位置后添加新节点
            temp->next = newNode; // 目标位置的节点的下一个节点指向新节点
            newNode->prev = temp; // 新节点的上一个节点指向目标位置的节点
            newNode->next = curNode; // 新节点的下一个节点指向当前节点
        }
        size++; // 链表大小加1
    }

    // 删除链表中的第index个节点
    void deleteAtIndex(int index) {
        if (index > (size - 1) || index < 0) { // 检查索引是否超出范围
            return; // 如果超出范围，直接返回
        }
        int num;
        int mid = size >> 1; // 计算链表中部位置
        DList *curNode = sentinelNode; // 从哨兵节点开始
        if (index < mid) { // 如果索引小于中部位置，从前往后遍历
            for (int i = 0; i < index; i++) {
                curNode = curNode->next; // 移动到目标位置的前一个节点
            }
            DList *next = curNode->next->next; // 获取目标位置的下一个节点
            curNode->next = next; // 删除目标位置的节点
            next->prev = curNode; // 目标位置的下一个节点的前一个节点指向当前节点
        } else { // 如果索引大于等于中部位置，从后往前遍历
            for (int i = 0; i < size - index - 1; i++) {
                curNode = curNode->prev; // 移动到目标位置的后一个节点
            }
            DList *prev = curNode->prev->prev; // 获取目标位置的下一个节点
            curNode->prev = prev; // 删除目标位置的节点
            prev->next = curNode; // 目标位置的下一个节点的下一个节点指向当前节点
        }
        size--; // 链表大小减1
    }

private:
    int size; // 链表的大小
    DList *sentinelNode; // 哨兵节点的指针
};
```


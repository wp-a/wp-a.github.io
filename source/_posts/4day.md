---
title: 代码随想录--链表
date: 2025-01-26 10:33:31
tags: [数据结构与算法,递归,双指针,链表]
categories: [数据结构与算法,代码随想录]
updated: 
description: 代码随想录--链表（下）
keywords: [算法,复试]
---

## 链表操作

​	链表是一种通过指针串联在一起的线性结构，每一个节点由两部分组成，一个是数据域一个是指针域，最后一个节点的指针域指向null（空指针的意思）。

### 两两交换链表中的节点

题目链接：[24. 两两交换链表中的节点](https://leetcode.cn/problems/remove-linked-list-elements/)

题目描述：两两交换链表中相邻的节点，并返回交换后链表的头节点

#### 虚拟头节点

时间复杂度：O(n)     空间复杂度：O(1)

题目思路：直接对指针进行处理就行了。刚才随手写了一下，想着交一下看看哪里有bug呢，结果直接过了，也是挺顺的。

``` c++
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode* dummy=new ListNode(0);
        ListNode* pre=dummy;
        dummy->next=head;
        while(head && head->next)
        {
            ListNode* tmp=pre->next;
            ListNode* tmp1=pre->next->next->next;
            pre->next=head->next;
            pre->next->next=tmp;
            pre->next->next->next=tmp1;
            pre=tmp;
            head=tmp1;
        }
        return dummy->next;
    }
};
```



### 删除链表的倒数第 N 个结点

题目链接：[9. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/reverse-linked-list/)

题目描述：删除链表的倒数第 n 个结点，并且返回链表的头结点。

#### 快慢双指针法

时间复杂度：O(n)     空间复杂度：O(1)

题目思路：又给秒了，定义一个快指针，一个慢指针，快指针先移动到第n个位置，然后开始快慢指针开始同时移动，当快指针指向尾节点的时候，慢指针正好指向导数第n个位置的前一个结点，略过倒数第n个结点，就结束了。

``` c++
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy=new ListNode(0);
        ListNode* fast=dummy;
        ListNode* slow=dummy;
        dummy->next=head;
        for(int i=0;i<=n;i++) fast=fast->next;
        while(fast)
        {
            fast=fast->next;
            slow=slow->next;
        }
        ListNode* tmp=slow->next;
        slow->next=slow->next->next;
        delete tmp;
        return dummy->next;
    }
};
```

### 链表相交

题目链接：[面试题 02.07. 链表相交](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/)

题目描述：给定单链表的头节点 headA 和 headB ，找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。

#### 思路1

题目思路：求两个链表交点节点的指针。题目我都看不懂！看题解秒了。

求出两个链表的长度，并求出两个链表长度的差值，然后让curA移动到，和curB 末尾对齐的位置。比较curA和curB是否相同，如果不相同，同时向后移动curA和curB，如果遇到curA == curB，则找到交点。否则循环退出返回空指针。

```c++
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode* curA = headA;
        ListNode* curB = headB;
        int lenA = 0, lenB = 0;
        while (curA != NULL) { // 求链表A的长度
            lenA++;
            curA = curA->next;
        }
        while (curB != NULL) { // 求链表B的长度
            lenB++;
            curB = curB->next;
        }
        curA = headA;
        curB = headB;
        // 让curA为最长链表的头，lenA为其长度
        if (lenB > lenA) {
            swap (lenA, lenB);
            swap (curA, curB);
        }
        // 求长度差
        int gap = lenA - lenB;
        // 让curA和curB在同一起点上（末尾位置对齐）
        while (gap--) {
            curA = curA->next;
        }
        // 遍历curA 和 curB，遇到相同则直接返回
        while (curA != NULL) {
            if (curA == curB) {
                return curA;
            }
            curA = curA->next;
            curB = curB->next;
        }
        return NULL;
    }
};
```

#### 思路二

再贴个牛逼代码。

```c++
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode *A = headA, *B = headB;
        while (A != B) {
            A = A != nullptr ? A->next : headB;
            B = B != nullptr ? B->next : headA;
        }
        return A;
    }
};
```

### 环形链表

题目链接：[142. 环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

题目描述：给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

题目思路：很有生活的题，不太好想，看题解才明白怎么才能找到环的入口，也是挺有思维量的。想明白了就好了，记下来就行了。

```c++
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        ListNode* fast=head;
        ListNode* slow=head;
        while(fast && fast->next){
            fast=fast->next->next;
            slow=slow->next;
            if(fast==slow){
                ListNode* f=fast;
                ListNode* s=head;
                while(f!=s){
                    f=f->next;
                    s=s->next;
                }
                return s;
            }
        }
        return 0;
    }
};
```


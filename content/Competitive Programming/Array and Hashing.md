---
id: Array and Hashing
aliases: []
tags:
- arrays
- hashmaps
- leetcode
created: 20 June 2026
draft: false
title: Array and Hashing
---

> Writing this at 11pm.
>
> I'm so tired..

# Keywords and Patterns

Anything that involves _repetition_, _keeping track_, _counts_, _copying_, generally requires hashmaps one way or another.

# Examples

### Duplicates and Frequencies

Checking for duplicates

```py
hashmaps = set()

for num in nums:
    if num in hashmap:
        return True
    hashmaps.add(num)

return False
```

You can modify the code above to keep track of the frequency of each element

```py
hashmap = {}
for num in nums:
    if num in hashmaps:
        hashmap[num] = hashmap.get(num, 0) + 1
    hashmap.get(num,0)
```

or, you can simply

```python
from collections import Counter

hashmap = Counter(num)
```

## Clones

Generally, cloning uses hashmap where the key of the hashmap is the original node/data and the value is the clone.

_this uses [copy list with random pointer](https://leetcode.com/problems/copy-list-with-random-pointer/description/) as an example_

```python
mapping = defaultdict(lambda: Node(0))

while curr:
    mapping[curr].val = curr.val
    mapping[curr].next = curr.next
    mapping[curr].random = mapping[curr.random]
    curr = curr.next
return mapping[head]
```

A _two pass_ version is also possible; you just have to populate the hashmap with nodes (both key and value) beforehand.

## Some other tips and tricks

The index of an array can also be used to solve a problem. Take this problem for example,

_Source: [find the duplicate number](https://leetcode.com/problems/find-the-duplicate-number/)_

> [!Warning]- Solve the problem before opening this!
> Given an array of integers nums containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.
>
> The problem introduced a very specific constraint _integer is in the range `[1, n]`_; this means that every number in the array is a valid index of the array.

# Problems:

- [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/description/)
- [Valid Anagram](https://leetcode.com/problems/valid-anagram/description/)

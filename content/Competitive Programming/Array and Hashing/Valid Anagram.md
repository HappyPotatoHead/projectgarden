---
title: Valid Anagram
draft: false
tags:
  - arrays-hashing
  - easy
description:
---

> Problem at: [Valid Anagram](https://leetcode.com/problems/valid-anagram/description/)

# Intuition

**Pattern**: _Looking for repeatition, duplication, or similarity between more than one string_

This can be solved using a hashmap. If the length of the two strings differ, return `False`. Otherwise, create a hashmap for each string. Iterate with for loop (_since both lists are guaranteed to have the same length_), and increment the count of each character for both hashes.

If the hashes are different in the end, return `False`; otherwise return `True`.

### Case 1

```text
s = "anagram"
t = "nagaram"
```

HashMap for S

| Character | Count |
| --------- | ----- |
| a         | 3     |
| n         | 1     |
| g         | 1     |
| r         | 1     |
| m         | 1     |

HashMap for T

| Character | Count |
| --------- | ----- |
| a         | 3     |
| n         | 1     |
| g         | 1     |
| r         | 1     |
| m         | 1     |

Since both HashMaps are similar, return True

# Code

## Brute forcing

```python
def isAnagaram(self, s: str, t: str) -> bool:
	letters = set(s)
	for character in letters:
	    if (s.count(character) != t.count(character)):
					return False
	return True
```

Time complexity: $O(n^2)$

Space complexity: $O(n)$

## One Pass

```python
def isAnagaram(self, s: str, t: str) -> bool:
    if len(s) != len(t): return False
    hash_s = {}
    hash_t = {}
    for index in range(len(s)):
        hash_s[s[index]] = hash_s.get(s[index], 0) + 1
        hash_t[t[index]] = hash_t.get(t[index], 0) + 1
    return hash_s == hash_t
```

Time complexity: $O(n)$

Space complexity: $O(n)$

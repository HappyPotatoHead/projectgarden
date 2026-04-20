---
title: Contains Duplicate
draft: false
tags:
  - arrays-hashing
  - easy
description:
---

> Problem at: [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/description/)
# Intuition

**Keywords:** *duplicate*

This can be solved with a set or a HashMap. By keeping track and recording of each number in the array, we can check if we have met the number before. 

If we have not met the number before, add it to the set. Otherwise, return `True`, ending the loop. If all the numbers are unique, return `False`. 

## Test Cases

### Case 1
`nums = [1,2,3,1]`


| Step | Action               | Result               |
| ---- | -------------------- | -------------------- |
| 1    | Add 1 to the hashmap | `False`              |
| 2    | Add 2 to the hashmap | `False`              |
| 3    | Add 3 to the hashmap | `False`              |
| 4    | 1 is in the hashmap  | `True`, end the loop |

### Case 2
`nums = [1,1,1,3,3,4,3,2,4,2]`

| Step | Action               | Result               |
| ---- | -------------------- | -------------------- |
| 1    | Add 1 to the hashmap | `False`              |
| 2    | 1 is in the hashmap  | `True`, end the loop |

# Code

## The long way

```python
def containsDuplicate(self, nums: List[int]) -> bool:
	numHash = set()
	for num in nums:
		if num in numHash:
			return True
		numHash.add(num)
	return False
```

Time complexity: $O(n)$

Space complexity: $O(n)$

## The shortcut

```python
def containsDuplicate(self, nums: List[int]) -> bool:
	return len(set(nums)) != len(nums)
```

Time complexity: $O(n)$

Space complexity: $O(n)$

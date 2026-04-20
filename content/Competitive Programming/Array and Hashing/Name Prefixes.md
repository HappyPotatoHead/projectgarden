---
title: Name Prefixes
draft: false
tags:
  - arrays-hashing
  - easy
description:
---

> This was an interview question that I had. I'll this as easy since it can be brute force pretty easily.

# Intuition

**Pattern**: _Looking for repeatition, duplication, or similarity between more than one string_

You're given two list of names. One of the list (_Let's call them prefixes_) contains names that act as, well, prefixes. The other list (_let's call them names_) contains the full list of names.

## Brute Force

One way of doing this is by interating through both lists. Based on the length of _prefixes_, iterate through every name in _names_. For each name, slice the name according to the length of the _prefix_ at the current index. If the _sliced name_ is the same as the _prefix_, increment the count.

Return the list of count, where each count was decrement by 1

## HashMap

Iterate through `names` once. For every name, generate all possible prefixes and use them as keys.

# Code

## Brute Force

```python
result = [0] * len(prefixes)
for index in range(len(prefixes)):
  for name in names:
      temp_name = name[:len(prefixes[index])]
      if temp_name == prefixes[index]:
          result[index] += 1
return result - 1
```

## HashMap

```python
hash_prefix = {}
for name in names:
    for i in range(len(name)):
        hash_prefix[name[:i]] = hash_prefix.get(name[:i], 0) + 1
return [hash_prefix[prefix] for prefix in hash_prefix]
```

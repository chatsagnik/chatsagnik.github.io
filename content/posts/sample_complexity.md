---
title: "Sample Complexity"
date: 2022-05-15T13:41:04+05:30
draft: false
math: true
---

# Sample Complexity of $k$-CNF($n$) or $C^{n}_{k}$
### How many semantically different boolean functions are there for $n$ boolean variables?
If we have one variable $a$, then we have two literals $a$ and $\hat{a}$. Therefore for $n$ boolean variables, we have $2^n$ combinations of literals. Now, every combination can be mapped to $0$ or $1$. Therefore the possible number functions are $2^{2^n}$.

For a $k$-valued logic we have  $k^{k^n}$ different functions.

***
### How many $k$-CNF($n$)'s are there?
Let $n=2$ and $k=2$. This means that there are $2$ variables available to us, and each clause is formed by a disjunction of at most $2$ literals. Examples:
$(x \lor y)$
$(x)$
$(x \lor x)$
$(x \lor \bar{y} ) \land (\bar{x} \lor \bar{y})$
$(x \lor y) \land (x \lor \bar{y}) \land (\bar{x} \lor y) \land (x) \land (y) \land (\bar{y})$

The number of possible disjunctive clauses is $O({(2n)}^k)$. Now each clause can be excluded or included which gives us $O(2^{(2n)^k})$ possible $k$-CNF($n$)'s.

### What is the sample complexity for $k$-CNF($n$)?
From [[@Rivest.Learningdecision87#Corollary 5 Blum87]] we know that $m$ grows with respect to $O(\log{\mathcal{C}_n})$ which gives $O(n^k)$. Therefore we have polynomial sample complexity.

**Note:** We still need an efficient algorithm that finds a consistent hypothesis for PAC learnability.

## A general approach for number of Conjunctions and Disjunctions of size $k$

$C^n_k$ is the set of all terms of size at most $k$ with literals drawn from $L_{n}$. Similarly, $D^n_k$ is the set of all clauses of size at most $k$ with literals drawn from $L_n$.

$$|C^n_k|=|D^n_k|=\sum_{i=0}^{k}\binom{2n}{i}=O\left(n^{k}\right)$$

For any fixed $k$, $C^n_k$ and $D^n_k$ have sizes that are polynomial functions of $n$.

**Note:** For $k<<n$, we have $\binom{n}{k}\approx(\frac{n^{k}}{k!})\leq O(n^k)$.

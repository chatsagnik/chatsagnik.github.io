---
title: "$q$-ary Lattices"
date: 2025-03-01T12:03:46+05:30
draft: false
tags: [lattices, coding theory, cryptography, linear algebra]
---

In this post, we discuss an important class of algebraic structures known as $q$-ary lattices that are central to lattice-based cryptographic primitives.

## Hardness of problems

Computational hardness usually revolves around problems with **worst-case hardness** guarantees since we want to design algorithms that run efficiently even on the worst possible input.

On the other hand, cryptographic schemes require security guarantees for random keys. Therefore, cryptographic applications require problems with **average-case hardness** guarantees.

However, it is not immediately apparent **how to create hard instances of problems** with worst-case hardness guarantees. In other words, how to design the most secure keys for cryptographic applications is unclear.

Any random instance of a problem with **average-case hardness** guarantee **is hard** with a positive probability. Suppose one could show that such a random instance is as hard as the hardest instance (a reduction from average-case hardness to worst-case hardness). In that case, such a reduction immediately lends itself to applications in cryptography. This reduction is precisely the central thesis of the seminal work Ajtai'96 [^ajtai96].

# Lattice-based Cryptography

## What is a Lattice?

> A Lattice $\Lambda$ or $\mathcal{L}$ is defined as the set of all integer linear combinations of $n$ linearly independent $m$-dimensional vectors $B=\\{\mathrm{b_1},\mathrm{b_2},\ldots,\mathrm{b_n}\\}$.
> Formally, we denote lattices as
> $$\mathcal{L}(B)=\left\\{Bx, x\in\mathbb{Z}^{m}\right\\}=\left\\{\sum_{i=1}^{n}x_i\mathrm{b_i} : x_i\in\mathbb{Z}\right\\}.$$

The set $B\in\mathbb{R}^{n\times m}$ is said to be the basis of the lattice $\Lambda$. We note here that **any lattice $\Lambda$ is characterized by its basis**. Shortly, we will _generalize the definition of lattices_ by showing a different characterization of lattices which will be useful in cryptographic construction schemes.

## Why do we need Lattice-based Cryptography?

Ajtai'96 [^ajtai96] showed **reductions** from **lattice based problems** with _average-case hardness_ guarantees to lattice problems with _worst-case guarantees_.

> Let $P$ be the class of lattice based problems defined in Ajtai'96 [^ajtai96]. Then, the above reduction implies that any randomly sampled instance of $P$ is as computationally hard to solve as the hardest instance in $P$.

For reasons discussed above, this immediately makes lattices an extremely important tool in cryptography. In fact, lattice based cryptographic constructions are invaluable for their many potential advantages as follows:

1. Lattice-based schemes usually **only require linear operations on integers** which leads to asymptotic efficiency.
2. Lattice-based schemes have been shown to be **resistant to cryptanalysis by quantum algorithms** unlike current classical cryptographic schemes which are based on factoring or discrete log (Shor'95 [^shor95]). This makes lattice-based cryptography the cornerstone of post-quantum cryptography.
3. As noted earlier, random instances of lattice based constructions are “_as hard as possible_”, which lends itself to **conceptual simplicity** while designing cryptographic schemes.

## Hard Lattice problems w/ known worst-case hardness guarantees

In this section, we discuss a few lattice problems with **known worst-case hardness guarantees**.

### Shortest Vector Problem $\left(\mathrm{SVP}_\gamma\right)$

In the $\gamma$-approximate Shortest Vector Problem, we are asked find the length of the shortest non-zero vector (denoted by $\lambda_1$) in an $n$-dimensional lattice, approximately, up to a polynomial factor $\gamma$.

- It is known that the approximate (and also decision) SVP is **NP-hard** under a randomized reduction.[^BP23]

### Shortest Independent Vector Problem $\left(\mathrm{SIVP}_\gamma\right)$

The goal of the $\gamma$-approximate Shortest Independent Vector problem is to output a set of $n$ linearly independent lattice vectors in an $n$-dimensional lattice, approximately of length$\leq\gamma\lambda_n$.

- SIVP is **NP-hard** to approximate for any constant approximation factor.[^BS99]

### Shortest Basis Problem $\left(\mathrm{SBP}_\gamma\right)$

The $\gamma$-approximate Shortest Basis Problem asks us to find a basis $B=\{\mathrm{b_1},\mathrm{b_2},\ldots,\mathrm{b_n}\}$ for an $n$-dimensional lattice $\mathcal{L}(B)$ such that $\mathrm{max}_i \lVert\mathrm{b_i}\rVert$ is the smallest possible upto a factor of $\gamma$.

Later in this post we will see the connection between the above problems.

## Constructing random instances of a Hard Lattice problem

In this section, we show a reduction from randomly generated lattices to instances of one of these problems.
We now state some important results from Ajtai'96[^ajtai96] and Ajtai'99[^ajtai99] which deal with the construction of random instances of hard lattice problems. The following lemma shows that hardness of SBP by reduction to SVP.

### Lemma 1 (Ajtai'96)

> If $\mathrm{SBP}_\gamma$ has no polynomial time solution for $\gamma=\mathrm{poly}(n)$, then we can generate a random lattice $\Lambda$ (over some distribution $\mathcal{D}$) together with a "short" vector $x\in\Lambda$ in polynomial time s.t. there is no algorithm which can find a vector shorter than $\sqrt{n}$ in $\Lambda$ over $\mathcal{D}$ w.p. greater than $n^{-c}$, for sufficiently large $n$ and any $c>0$.

**Note:** Here "short'' refers to $\|x\|\leq\sqrt{n}$. Later Ajtai'99 [^ajtai99] extended **Lemma 1** to the following theorem:

### Theorem 2 (Main Theorem, Ajtai'99)

> If $\mathrm{SBP}_\gamma$ has no polynomial time solution for $\gamma=\mathrm{poly}(n)$, then we can generate a random lattice $\Lambda$ (from the same distribution $\mathcal{D}$ as in **Lemma 1** together with a "short" basis $B$ of $\Lambda$ in polynomial time s.t. there is no algorithm which can find a vector shorter than $\sqrt{n}$ in $\Lambda$ over $\mathcal{D}$ w.p. greater than $n^{-c}$, for sufficiently large $n$ and any $c>0$.

As we see, **Theorem 2** clearly gives us a way to **construct a random instance of a hard problem** ($\mathrm{SBP}_\gamma$). A short basis means $\lVert \mathrm{b_i} \rVert\leq n\sqrt{n},i\in[n]$, where $B=\\{\mathrm{b_1},\mathrm{b_2},\ldots,\mathrm{b_n}\\}$. In the next, we concretely define the class of "random" lattices required by the above results.

## The SIS problem

In this section, we take a deeper dive into the special class of random lattices given by Ajtai'96[^ajtai96], where it was shown how to

- Construct a family of one-way functions (based on the earlier family of random lattices as seen in Lemma 1), s.t.,
- If we invert any function from this family of functions with non-negligible probability, it implies that we can solve any instance of the $\mathrm{SVP}_\gamma$ for $\gamma=O({n^c}),c>1$.

Therefore, by the previous discussion, we see that the above construction implies an _average-case to worst-case reduction_. **GGH11**[^gold11] later extended the analysis of **Ajtai96** to show that the family of one-way functions is also collision-resistant, which is a stronger and more useful property for cryptographic applications.

We now define the SIS problem and state a lemma (without proof) of its hardness.

## Short Integer Solution ($\mathrm{SIS}_{n,m,q,\beta}$)

> Let $A$ be a **uniformly random matrix** , i.e. , $A=\\{a_0| a_1 | \ldots | a_{m-1}\\}$
> consists of $m$ uniformly random vectors $a_i\in\mathbb{Z}^n_q,i\in[m]$. Find a nontrivial $x\in\mathbb{Z}^m$, s.t. $\|x\|\leq\beta$ and $Ax\equiv 0\mod{q}$.

Here $A\sim\mathbb{Z}_{q}^{n\times m}$ where $\mathbb{Z}^n_q$ is the set of all $n$-dimensional integer vectors modulo $q$, i.e., $\mathbb{Z}^n_q=\{\left\langle x_1,\ldots, x_n \right\rangle\}$, where $x_i\in\{0,1,\ldots,q-1\}$ for all $i\in[n]$.

We also note here that without the constraint $\|x\|\leq\beta$, the $\mathrm{SIS}$ is easy to solve using _Gaussian elimination_.

### Hardness of $\mathrm{SIS}$

> For any $m = \mathrm{poly}(n)$, any $\beta > 0$, and any sufficiently large $q \geq \beta n^c$ (for any constant $c >0$), solving $\mathrm{SIS}({n,m,q,\beta})$ with nonnegligible probability is at least as hard as
> solving $GapSVP_\gamma$ and ${SIVP}_\gamma$ for some $\gamma = \beta \cdot O(\sqrt{n})$ with a high probability in the worst-case scenario.

Now we turn our attention to the construction of **GGH11**[^gold11] based on the hardness of $\mathrm{SIS}$.

### A specific CRHF construction (GGH11)

We define a **Collision-Resistant Hash function** (CRHF) as follows:

- Set $m>n\frac{\log{q}}{\log{d}}$.
- **Key:** A matrix $A$ chosen uniformly at random from $\mathbb{Z}^{m\times n}_q$.
- **Hash function:** Define a **Shrinking function** (shrinking since the domain is greater than the range): $f_A:\{0,\ldots, d-1\}^m\xrightarrow{}\mathbb{Z}^n_q$ s.t. $f_A(x)=Ax\mod q$.
- **Goal:** Find $x,x^{\prime}\in\{0,1\}^m$ s.t. $f_A(x)=f_A(x^{\prime})$.

Note that finding a solution to the collision problem yields a solution $z=x-x^\prime$ to the $\mathrm{SIS}$ problem as $0=f_A(x)-f_A(x^{\prime})=Ax-Ax^\prime=Az\equiv 0\mod{q}$.

> We now define a class of random lattices known as $q$-ary lattices and connect it to the $\mathrm{SIS}$ problem.

## $q$-ary Lattices at last!

> Given $A\sim \mathbb{Z}^{n\times m}_q$, $q$-ary lattices $\Lambda_q^\perp(A)$ are defined as
> $$\Lambda_q^\perp(A)=\\{z\in\mathbb{Z}^m:Az=0\mod{q}\\}.$$

We note that the randomness of $\Lambda_q^\perp(A)$ stems from the randomness of $A$ itself. $\Lambda_q^\perp(A)$ contains all vectors that are orthogonal modulo $q$ to the rows of $A$, i.e. $\Lambda_q^\perp(A)$ corresponds to the code whose parity check matrix is $A$.

Here, we see that we have successfully **characterized a lattice in terms of a parity check matrix** $A$ _instead of a basis_. The class of $q$-ary lattices is the class of random lattices required in **Lemma 1** and **Theorem 2**. We end this article with another lemma by Ajtai96 and some properties of $q$-ary lattices which connects the average-case hardness guarantees with worst-case guarantees.

### Lemma 2 (Ajtai96)

> Finding short $z\in\Lambda_q^\perp(A)$ s.t. $\left|{z}\right|\leq \beta < q$, implies solving $\mathrm{GapSVP}_{\beta\sqrt{n}}$ on any n-dimensional lattice.

### Properties of $q$-ary Lattices

- A $q$-ary lattice $L$ satisfies $q\mathbb{Z}^n \subseteq L \subseteq \mathbb{Z}^n$ for $q\in\mathbb{Z}$.
- Any integer lattice $\mathcal{L}\subseteq\mathbb{Z}^n$ is a $q$-ary lattice for some $q$, e.g., whenever q is an integer multiple of the determinant $\mathrm{det}(\mathcal{L})$. We are only interested when $q$ is much smaller than $\left|{\mathrm{det}(L)}\right|$.
- The following two problems are equivalent:
  - Finding a short vector in $\Lambda_q^\perp(A)$ s.t. $A\sim \mathbb{Z}^{n\times m}_q$.
  - Finding a short solution to a set of $n$ random equations modulo $q$ in $m$ variables.
- The dual of any $q$-ary lattice is also a $q$-ary lattice. We represent the dual of a $q$-ary lattice $\Lambda_q^\perp(A)$ using the notation $\Lambda_q(A)$, which is defined as $$\Lambda_q(A)=\\{z\in\mathbb{Z}^m:z=A^Ts\mod{q},\,s\in\mathbb{Z}^n\\}.$$
  - Here $\Lambda_q(A)$ is the code generated by the rows of $A$, i.e., $A$ itself is the generator matrix of the code. Contrast this with $\Lambda_q^\perp(A)$ where $A$ is the parity check matrix.

## References

[^ajtai96]: **Ajtai96:** M. Ajtai. 1996. Generating hard instances of lattice problems (extended abstract). In Proceedings of the twenty-eighth annual ACM symposium on Theory of Computing (STOC '96). Association for Computing Machinery, New York, NY, USA, 99–108. https://doi.org/10.1145/237814.237838

[^shor95]: **Shor95:** Peter W. Shor. 1997. Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer. SIAM J. Comput. 26, 5 (Oct. 1997), 1484–1509. https://doi.org/10.1137/S0097539795293172

[^ajtai99]: **Ajtai99:** Miklós Ajtai. 1999. Generating Hard Instances of the Short Basis Problem. In Proceedings of the 26th International Colloquium on Automata, Languages and Programming (ICAL '99). Springer-Verlag, Berlin, Heidelberg, 1–9.

[^gold11]: **GGH11:** O. Goldreich, S. Goldwasser, and S. Halevi. Collision-free hashing from lattice problems. Studies in Complexity and Cryptography. Miscellanea on the Interplay between Randomness and Computation: In Collaboration with Lidor Avigad, Mihir Bellare, Zvika Brakerski, Shafi Goldwasser, Shai Halevi, Tali Kaufman, Leonid Levin, Noam Nisan, Dana Ron, Madhu Sudan, Luca Trevisan, Salil Vadhan, Avi Wigderson, David Zuckerman, pages 30–39, 2011

[^BP23]: **BP23:** Huck Bennett and Chris Peikert. Hardness of the (Approximate) Shortest Vector Problem: A Simple Proof via Reed-Solomon Codes. In Approximation, Randomization, and Combinatorial Optimization. Algorithms and Techniques (APPROX/RANDOM 2023). Leibniz International Proceedings in Informatics (LIPIcs), Volume 275, pp. 37:1-37:20, Schloss Dagstuhl - Leibniz-Zentrum für Informatik (2023). [https://doi.org/10.4230/LIPIcs.APPROX/RANDOM.2023.37](https://doi.org/10.4230/LIPIcs.APPROX/RANDOM.2023.37)

[^BS99]: **BS99:** Johannes Blömer and Jean-Pierre Seifert. On the complexity of computing short linearly independent vectors and short bases in a lattice. In Proceedings of the Thirty-first Annual ACM Symposium on Theory of Computing, STOC ’99, pages 711–720, New York, NY, USA, 1999. ACM.

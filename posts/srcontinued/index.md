---
title: "Self-Reducibility (Part 2)"
date: 2025-02-08T11:51:18+05:30
draft: false
tags:
  [
    reductions,
    p-np,
    eth,
    self-reducibility,
    search-to-decision,
    factoring,
    primality,
    TFNP,
  ]
categories: [toc, complexity]
---

> _This post assumes basic familiarity with Turing machines, P, NP, NP-completeness, decidability, and undecidability. The reader is referred to the book by Sipser, or the book by Arora and Barak for any formal definitions that have been skipped in this post. Without further ado, let's dive in._

> This is the second part of an earlier post on [Self Reductions](../selfreductions/index.md). Since the two posts are meant to be perused in order, please check out the earlier post for any definitions/concepts not covered in this post.

---

# Which search problems are (not) known to be self-reducible?

**The one-line asnwer:** Self-reducibility is precluded in cases where the decision version is easy while the search version is hard.

For example, consider the `Factoring` problem:

- **The Factoring Decision problem:** Given a natural number $n$, decide if $n$ is prime.
- **The Factoring Search problem:** Given (the binary representation of) a natural number $n$, produce all of its factors.

Many important classes of cryptosystems such as RSA[^R1] are based on the hardness of the `Factoring Search problem`.[^R2] On the other hand, the `Factoring Decision problem` (also known as the `Primality testing problem`) has long been known to computationally tractable.[^primality] Hence, `Factoring` does not appear to be straightforwardly self-reducible.

> If **EE** $\neq$ **NEE**,[^EE] then there exists a language in **NP** that is not self-reducible. **[Bellare and Goldwasser'94]**

Following the above result, Beame et al. (1998)[^beame98] showed the existence of various search problems in **FNP** that are not computationally equivalent to their decision versions. This is particularly important when a solution for the search problem is **guaranteed to exist** (but hard to find).

---

> You can choose to stop here. The rest of the post is an aimless ramble on how to characterize hardness in search problems (even when solutions are guaranteed to exist), which is a surprisingly messy affair!

---

One of the research directions on the notion of self-reducible problems is to characterise their complexity. Even though decisional complexity is well understood at an undergraduate level, the complexity of search problems is strictly a graduate level topic due to the sheer amount of prerequisites involved. I will now attempt to provide an introduction to the complexity landscape of **NP**-search problems and state a few results connected to self-reducibility and downward-self-reducibility of search problems.

# Taxonomy of NP search problems

The complexity class **TFNP** consists of all search problems in **FNP** that are total in the sense that **a solution is guaranteed to exist**.

A straightforward example is an optimization problem over a domain such that every point in the domain is a feasible solution such as minimizing the function $(x-3)^2$ over $\mathbb{R}$.

Another interesting (nonstandard) example is finding the minimum cost permutation of a string. Given a cost function $c:[n]\mapsto\mathbb{R}$, find the permutation $\pi\in S_n$[^symmetric] that minimizes the cost function as follows: $\underset{\pi\in S_n}{\min} \sum_{i=1}^n c(i)\pi(i).$

For example, consider the cost $c=(1,0,2)$. The permutation $(2, 1, 3)$ has cost $8$, while the permutation $(1, 3, 2)$ has cost $5$. Notably, _every_ permutation has an associated cost, so as long as the output is a permutation, the solution to the above optimization problem is feasible.

More formally, $R\in$**TFNP**$\iff R\in$**FNP** and $R$ is total, i.e., $\forall x\in\Sigma_{in}, \exists y\in\Sigma_{out}$ s.t. $(x,y)\in R$.

Recall that `SATSearch` $\in$ **FNP**, but note that `SATSearch` $\notin$ **TFNP**, since a formula may be unsatisfiable. Using the totality property of **TFNP**, it is straightforward to show that **TFNP** $=$ **FNP** $\cap$ **coFNP**.

As we have seen in the case of decision problems, the notion of **NP-completeness** plays a huge role in establishing relative hardness results among many problems of interests, and has a beautiful relationship with the concept of reductions. One might naturally ask whether a similar connection might be made w.r.t. **FNP-complete** problems and self-reductions!

> If **NP** $\neq$ **coNP** there is no **FNP-complete** problem in **TFNP**.

Since we consider a **P** $\neq$ **NP** to be a reasonable assumption, it is very likely that **NP** $\neq$ **coNP**. What then is a notion of a _hard_ total search problem? In other words, how do we then characterize the hardness of efficiently verifiable total search problems?

Another way to look at this question is as follows: Can we formally provide examples of search problems that are (for some notion of hardness) the hardest in **TFNP**?

At this point, we list some interesting candidate computational problems known to be in **TFNP** that are not known to be in **FP**:

- `NASHx`: Finding a mixed Nash equilibrium of a game with $x$ players.
- `Brouwer`/`Kakutani`: Finding Brouwer/Kakutani fixed points for continuous functions.[^Brouwer][^Kakutani]
- `Factoring`: Finding a (or all) prime factors of a number $n\geq 2$.
- `SetCover`: Finding a minimum Set Cover.

> Do any of the above problems claim the crown of completeness in TFNP?

Unfortunately, it is believed that **TFNP** has [no complete problems](../reductions/index.md#completeness) since it is a **semantic class**![^semantic]

Hence, in order to characterize the notion of hardness in total search problems, various syntactic subclasses have been defined in an attempt to classify the many diverse problems that belong to **TFNP**.

Recall that **TFNP** problems have the following two characteristics - **(a)** any solution can be checked efficiently _(the NP property)_, and **(b)** there always exists at least one solution _(the totality property)_. The syntactic subclasses are defined based on the combinatorial principle used to argue totality in **TFNP**. In other words, each subclass of **TFNP** has a corresponding existence proof principle (for example, an instance of a circuit or graph), _one that when applied in a general context, does not yield a polynomial-time algorithm_.

## Important subclasses of TFNP

We define two important subclasses of **TFNP** in this post: **PLS** and **PPAD** (along with a whole host of others in the footnotes section).

The complexity class **PLS** (also known as **Polynomial Local Search**), is a subclass of **TFNP** function problems which contains problems that are guaranteed to have a solution because of the lemma that "every finite directed acyclic graph has a sink."

> _Remark:_ The graph instance above may be exponentially large. For a finer intuition see the description of **EOL**[^EOL] in the footnotes.

**PLS** captures problems of finding a local minimum of an objective function $f$, in contexts where any candidate solution $x$ has a local neighbourhood within which we can readily check for the existence of some other point having a lower value of $f$. One of the motivations behind defining **PLS** was to capture the notion of problems with existing local optimum in **NP-hard problems** like `TSP`. Since a **PLS** problem always has a local optimum, it therefore always a solution (as the set of solutions is finite). Hence, using the above definitions, we have:

> **FP** $\subseteq$ **PLS** $\subseteq$ **TFNP** $\subseteq$ **FNP**.

**Remark:** From our discussions above, it may be unclear why search problems in **FP** have to be _total_. To see why, consider $R\in$ **FP** and fix a special string $y_0$ s.t. $\forall x\in\Sigma_{in}^{\*}$ s.t. $(x,y_0)\notin R$. An easy way to construct $y_0$ is to append every $y\in\Sigma_{out}^{\*}$ with a $1$, and set $y_0$ as the all zero string.

Examples of **PLS-complete problems** include search versions of `Set-Cover`, `Metric-TSP`, and `Weighted Independent-Set` (among many many others).

Another subclass of **TFNP** is the complexity class **PPAD**. **PPAD** is defined as the set of functions in **TFNP** that reduce in polynomial time to the `End-Of-Line (EOL)` problem.[^EOL] In other words, a problem is complete for **PPAD** if it belongs to **PPAD** and if **EOL** reduces in polynomial time to that problem. **PPAD** is contained in **PPA** $\cap$ **PPP** [^PPA][^PPP] and could be regarded as the directed version of the class **PPA**.[^PPA]

`NASH2` $\in$ **PPAD**, and `NASH3` is **PPAD-complete**. The `Brouwer` and `Kakutani` problems are also in **PPAD**.

Problems in **PLS** can be solved with local improvement algorithms, while problems in **PPAD** admit "optimality equations" that characterize solutions as fixed points.

> **PPAD** and **PLS** are believed to be strictly incomparable.[^beame98][^oppenheim]

The complexity class Continuous Local Search **CLS** = **PPAD** $\cap$ **PLS**.[^KKT][^CLS][^EOL] `Gradient Descent` is in **CLS**.

The following diagram ([appropriated from this talk](https://www.youtube.com/watch?v=as720_SRpY0)) captures the above discussion in a nutshell.

![TFNP problem landscape](TFNP.jpg)

## Complexity of downward-self-reducible search problems

[In an earlier post](../selfreductions/index.md) we saw that every downward self-reducible decision problem is in **PSPACE**. The following result was recently shown, as an analogue for search problems.

> Every downward self-reducible total search problem is in **PLS**. [^harsha23]

Hence **PLS** is in some senses the functional analogue of **PSPACE**. Harsha et al. (2023) [^harsha23] also show that most natural **PLS-complete** problems are downward self-reducible. We end with an important open question by Harsha et al. (2023) [^harsha23]:

> Is `Factoring` downward self reducible?

If `Factoring` is downward self-reducible, then `Factoring`$\in$**UEOPL**$\subseteq$**PPAD**$\cap$**PLS** [^harsha23].

The complexity class **UniqueEOPL** (Unique End of Potential Line) captures search problems with the property that their solution space forms an _exponentially_ large line with increasing cost.[^EOPL][^UEOPL] From one candidate solution we can calculate another candidate solution in polynomial time. The end of that line is the (unique) solution of the search problem. This implies (according to a whole host of complexity theoretic assumptions) that **no efficient factoring algorithm exists using the factorization of smaller numbers**.

---

# Footnotes

[^semantic]: A complexity class is called a **semantic class** if the Turing Machine (TM) defining this class has a property that is undecidable. See [Papadimitrou's original paper](https://www.karlin.mff.cuni.cz/~krajicek/papadim1.pdf) and [this Stackexchange link](https://cstheory.stackexchange.com/questions/1233/semantic-vs-syntactic-complexity-classes) for a more formal discussion on this topic. In a nutshell, promise classes such as **RP**, **ZPP**, **BPP** are semantic.

[^PPP]: The existence of solutions for problems in **complexity class PPP:** (also known as Polynomial Pigeonhole Principle) is guaranteed by the pigeonhole principle: if $n$ balls are placed in $m < n$ bins then at least one bin must contain more than one ball.

[^EOL]: **EOL** is the class of problems which can be reduced to the `EOL` problem instance: Given a exponentially large directed graph consisting of lines and cycles on the vertex set $[2^𝑛]$, find any sink of the graph assuming vertex 1 is the source and every vertex has in and out degree at most 1. Note that we overload the notation **EOL** to refer to both the problem and the complexity class.

[^CLS]: The **EOL** class is a combinatorially defined alternative to the complexity class **CLS** (Continuous Local Search), which contains Gradient Descent and various fixed point problems. **CLS** is the smallest known subclass of **TFNP** not known to be in **P**, and hardness results for it imply hardness results for **PPAD** and **PLS** simultaneously.

[^EOPL]: One interesting subclass of **EOL** is **End-Of-Potential-Line** (**EOPL**) where we add the following constraint addition to the `EOL` problem instance: we are also given a potential function that increases along each edge. It is known that the `EOPL` problem is complete for **PPAD** $\cap$ **PLS**. Hence **EOPL** = **CLS**, suggesting an equivalence between purely combinatorially defined search problems and real-valued continuous optimisation problems. [See this thesis](https://ora.ox.ac.uk/objects/uuid:67e2d80b-76bf-4b49-9b7d-8bbd91633dd7) for a detailed perspective on this equivalence.

[^UEOPL]:
    If the graph instance in the `EOPL` problem has a unique sink, then the problem (and the related complexity class) is known as **UEOPL**. It is an open question if the `UEOPL` is complete for **PPAD** $\cap$ **PLS**.[^harsha23]
    Once again, we note that we overload the notations **EOPL** and **UEOPL** to refer to both the problems and their corresponding complexity class. 

[^Brouwer]: **Brouwer's fixed-point theorem** states that for any continuous function $f$ mapping a nonempty compact convex set to itself, there is a point $x_0$ such that $f(x_0)=x_0$.

[^Kakutani]: The **Kakutani fixed point theorem** is a generalization of the Brouwer fixed point theorem to set-valued functions. By [Weller's Theorem](https://en.wikipedia.org/wiki/Weller%27s_theorem), Kakutani's fixed-point theorem is used in proving the existence of cake allocations that are both envy-free and Pareto efficient.

[^KKT]: Finding a point where Gradient Descent terminates is equivalent to finding a KKT point—when the domain is bounded. Computing a KKT point of a continuously differentiable function over $[0, 1]^2$ is complete for **PPAD** $\cap$ **PLS**.

[^R1]: **The RSA problem:** Find $M$ given the public key $(n,e)$ and a cipher text $C\equiv M^e\mod n$. [See the wiki for more details.](https://en.wikipedia.org/wiki/RSA_cryptosystem)

[^R2]: If we can solve the factoring problem then we can solve the RSA problem by factoring the modulus n. Hence, Factoring $\implies$ RSA.

[^primality]: The seminal result of Agarwal, Kayal, and Saxena showed that this problem is in **P**. See [this writeup](https://www.tcs.tifr.res.in/~jaikumar/Papers/AKS-revised.pdf) for more details on the result.

[^EE]: **EE** equals DTIME($2^{2^{O(n)}}$).

[^harsha23]: Prahladh Harsha, Daniel Mitropolsky, and Alon Rosen. Downward Self-Reducibility in TFNP. ITCS 2023. [DOI](https://doi.org/10.4230/LIPIcs.ITCS.2023.67).

[^PPA]:
    The **Complexity class PPA** (also known as **Polynomial Parity Argument**) captures computational search problems whose totality is rooted in the handshaking lemma for undirected graphs: "all graphs of maximum degree 2 have an even number of leaves."
    More precisely, **PPA** captures search problems for which there is a polynomial-time algorithm that, given any string, computes its 'neighbor' strings (of which there are at most two). Then given a leaf string (i.e. one with only one neighbor), the problem is to output another leaf string.

[^beame98]:
    Paul Beame, Stephen Cook, Jeff Edmonds, Russell Impagliazzo, and Toniann
    Pitassi. 1998. The Relative Complexity of NP Search Problems. J. Comput. System
    Sci. 57, 1 (1998), 3–19. https://doi.org/10.1145/225058.225147

[^oppenheim]: Josh Buresh-Oppenheim, Tsuyoshi Morioka: **Relativized NP Search Problems and Propositional Proof Systems**. CCC 2004: 54-67.

[^symmetric]: See [symmetric groups](https://en.wikipedia.org/wiki/Symmetric_group).

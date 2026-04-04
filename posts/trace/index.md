---
title: "The Matrix Trace"
date: 2025-03-08T12:03:46+05:30
draft: false
tags: [linear algebra, quantum computing, matrix analysis, math]
---

# A Prelude to this post

I was introduced to the notion of the **trace of a square matrix** as early as the eleventh grade, but never fully appreciated the nuances attached to this seemingly innocuous concept until I took a _second_ course in Linear algebra! Funnily, the reason I even took the second course was because I was struggling **with** the intuition behind certain concepts such as density matrices and measurements in basic quantum computing and quantum information theory!

In hindsight, the lack of a deep dive into topics like trace very early on is perhaps intended by design. The computational aspects of matrices such as determinants and invertibility are crucial to a lot of school-level and undergraduate cs, physics, and maths, while a first course in linear algebra is supposed to gently handhold your way as you make your own connections between abstract concepts like vector spaces and other subjects like abstract algebra and analysis. We start this post with the first time any student might run into a deep think about the notion of trace!

# The Trace (First Definitions)

Let us start with two definitions of trace, and a series of quizzes.

> **Definition 1 (Trace of a Linear Operator):** Let $V$ be a vector space over an algebraically closed field $\mathbb{F}$ [^algclosure], and $A:V\mapsto V$ be a linear operator [^linmap] on $V$. The trace of $A$ is defined as $\mathrm{tr}(A)=\sum_{i=1}^{n}\lambda_i(A)$, where the $\lambda_i(A)$'s are the eigenvalues of $A$ (counted with algebraic multiplicity).

> **Definition 2 (Trace of a Matrix):** Let $M$ be an $n\times n$ square matrix. The trace of $M$ is defined as $\mathrm{tr}(M)=\sum_{i=1}^{n}M(i,i)$, where $M(i,j)$ is the $(i,j)$th entry of $M$. Hence the trace is the sum of diagonal entries of $M$.

Here is a small exercise for the readers at this point: Let $V$ be finite-dimensional, and let $B_1$ and $B_2$ be two different bases of $V$ s.t. the corresponding matrix representations of $A$ are $M_1$ and $M_2$.[^bounded] Prove that $$\sum_{i=1}^{n}M_1(i,i)=\sum_{i=1}^{n}M_2(i,i)=\sum_{i=1}^{n}\lambda_i(A).$$

Before proving the above statement in full generality, try assuming the following simplifying assumptions:

1. $V$ is a finite-dimensional inner product space[^innerproduct] (this gives us access to orthonormal bases), and
2. $A$ is Hermitian with distinct eigenvalues (this gives us access to the Spectral Theorem[^spectral]).[^quantum]

Let us pause at this moment and reflect on a few things. What does the above exercise actually tell us? Succinctly put, under sufficiently well-behaved conditions (finite-dimensional operators/bounded operators), Definitions 1 and 2 are equivalent. Note that the following observations follow immediately from the equivalence between Definitions 1 and 2.

1. Most importantly it tells us that the trace of an operator is an invariant quantity, much like its determinant!

2. The sum of eigenvalues of an operator is equivalent to the sum of diagonal entries of any of its matrix representations!

In the following sections, we will prove the equivalence between Definitions 1 and 2, along with the above observations.

## A third definition of Trace via the Characteristic Polynomial

We start by relating the eigenvalues of an operator to the entries of any of its matrix representations by way of the characteristic polynomial.[^charpoly] Let $A$ be a linear operator on an $n$-dimensional vector space $V$. Let $B$ be a basis of $V$, and denote the matrix representation of $A$ w.r.t. $B$ as $M_B$. Let $M_B = \begin{bmatrix}a_{11}&\ldots& a_{1n}\\ \vdots&\ddots&\vdots \\ a_{i1}& a_{ii}& a_{in} \\ \vdots&\ddots&\vdots \\ a_{n1}&\ldots& a_{nn}\end{bmatrix}$. The characteristic polynomial of $M_B$ is as follows:

$$p(M_B) = \det(M_B-\lambda\cdot I) = \prod_{i=1}^n (a_{ii} - \lambda) + \text{terms of degree }\leq n-2$$

$$\implies p(M_B) = (-1)^n \big(\lambda^n - \textcolor{red}{\Bigg(\sum_{i=1}^n a_{ii}\Bigg)}  \,\lambda^{n-1} + \dots + (-1)^n \det M_B\big)$$

$$\implies p(M_B) = (-1)^n \big(\lambda^n - \textcolor{red}{(\mathrm{tr}\, M_B)} \,\lambda^{n-1} + \dots + (-1)^n \det M_B\big)\,.\;\; \text{\small(by Definition 2)}$$

> **Exercise:** Check for yourself that the coefficient of the degree 0 term of the characteristic polynomial is indeed $\det M_B$.

Recall that if a polynomial $p(x)$ has roots $\{r_i\}$, then the polynomials $\{x-r_i\}_i$ divide $p(x)$.[^factor] Also recall that by definition, the roots of the characteristic polynomial are the eigenvalues of $A$.[^charpoly] Hence, $p(M_B)=\prod_i (x-\lambda_i)$. By [Vieta's formula](https://en.wikipedia.org/wiki/Vieta%27s_formulas), given a monic polynomial[^monic] $$p(x)=x^n+ \sum_{i<n}c_{i}x^{i}$, $c_{n-1}=-\sum_{i} r_i.$$ Hence, we have

$$\textcolor{red}{\Bigg(\sum_{i=1}^n a_{ii}\Bigg)} = \textcolor{red}{(\mathrm{tr}\, M_B)} = \sum_{i=1}^{n} \lambda_i.\;\; \text{\small(Hence Definitions 1 and 2 are equivalent)}$$

> **Definition 3 (Trace via Characteristic Polynomial):** The trace of a matrix is the coefficient (up to a sign) of the degree $n-1$ term of its characteristic polynomial.

It is also straightforward to show that the **trace is invariant** using arguments about the polynomial coefficients. A linear algebraic way of showing it is as follows:

Let $B,C$ be different bases of $V$. Denote the matrix representations of $A:V\mapsto V$ w.r.t. $B,C$ as $M_B,M_C$ respectively. By definition, $M_B$ and $M_C$ are **similar** matrices with $S$ being the (invertible) change of basis matrix from $B$ to $C$.

> $$p(M_C) = \det(M_C - \lambda I) = \det(S\cdot M_B\cdot S^{-1} - S\cdot \lambda I\cdot S^{-1})$$

> $$\implies p(M_C)= \det(S\cdot (M_B-\lambda I)\cdot S^{-1}) = \det(S)\cdot p(M_B)\cdot\det(S^{-1})$$

> $$\implies p(M_C)= p(M_B).$$

Hence, the characteristic polynomial is invariant under change of basis. This implies that **the roots of the characteristic polynomial are invariant under basis transformations**. Therefore, the trace (the sum of the roots of the characteristic polynomial by Definition 1) is also invariant under basis change. This also closes the loop on the exercise from earlier: we have now proved the full equivalence $\sum_i M_1(i,i) = \sum_i M_2(i,i) = \sum_i \lambda_i(A)$ in complete generality.

> We note that the above arguments can also be used to show that the determinant is invariant under basis change. More generally, the $n+1$ coefficients of the characteristic polynomial of an $n\times n$ matrix — of which the trace (degree $n-1$ coefficient) and determinant (degree $0$ coefficient) are two — are all similarity invariants. We leave it as a small exercise for the reader to verify this from the argument above.

## A fourth definition of Trace via the Jordan Normal Form

Since the characteristic polynomial of a bounded operator is invariant under basis change, we consider it to be a canonical representation of the operator. A different way of proving that the trace of a bounded operator is invariant under basis change is to define the trace via a different canonical/basis-independent representation of linear operators: the **Jordan normal form**.

> Note that this view gives us a definition that allows us to understand why trace is the **sum of the eigenvalues counted along with algebraic multiplicities**.

Let $A:V\mapsto V$ be a linear operator on a finite dimensional vector space $V$ over a field $\mathbb{F}$, s.t. all eigenvalues of $A$ lie in $\mathbb{F}$.[^algclosure] Let the eigenvalues of $A$ along with their algebraic multiplicity be denoted by $\{\lambda_i, m_i\}$. The Jordan normal form of $A$ is denoted as $J_A$, and it is a block diagonal matrix as follows:

$$J_A = \begin{bmatrix} B_{\lambda_1,m_1} & 0&\ldots &0 \\ 0& B_{\lambda_2,m_2}&\ldots &0 \\ 0&\ddots&\ddots& 0 \\ 0&\ldots&\ldots& B_{\lambda_k,m_k}\end{bmatrix},$$

where each block $B_{\lambda_i,m_i}$ is an upper-triangular matrix of dimension $m_i\times m_i$, with the diagonal entries each being $\lambda_i$ and every super-diagonal entry (corresponding to the coordinates $(i,i+1)$) being $1$.[^block] We denote the $i$th block of the Jordan matrix below, where we assume that $\lambda_i=\lambda$ and $m_i=3$.

$$B_{\lambda,3} = \begin{bmatrix}\lambda& 1& 0 \\ 0&\lambda& 1 \\ 0&0&\lambda\end{bmatrix}.$$

---

> **Digression on Jordan Blocks**

Note that $B_{\lambda,3} e_1 = \lambda e_1$, $B_{\lambda,3} e_2 = e_1+\lambda e_2$, and $B_{\lambda,3} e_3 = e_2+\lambda e_3$. Let $B_\lambda=B_{\lambda,3}-\lambda\cdot I$. This gives us $B_{\lambda} e_1 = 0$, implying that $e_1$ is an eigenvector of $B_{\lambda,3}$ with eigenvalue $\lambda$ (recall [^charpoly]), along with the following relations on $e_2$ and $e_3$.

$$B_{\lambda} e_2 = e_1\,\implies {\big(B_{\lambda}\big)}^2 e_2=0\,,$$

$$B_{\lambda} e_3 = e_2\,\implies {\big(B_{\lambda}\big)}^3 e_3=0\,.$$

We denote $e_2$ and $e_3$ as _generalized eigenvectors_ of $B_{\lambda,3}$. One can similarly extend the above argument to any $B_{\lambda_i,m_i}$ to obtain a set of generalized eigenvectors $\{e_1,\ldots,e_{m_i}\}$. Note that the set of generalized eigenvectors is independent. This indicates that there is a basis of generalized eigenvectors that spans the subspace on which $B_{\lambda_i,m_i}$ is an operator.[^block]

> The characteristic polynomial tells us the eigenvalues and the dimension of each generalized eigenspace, which is the algebraic multiplicity of the eigenvalue in the Jordan form.

---

We now state the following theorems without proof.

> Every square matrix over an algebraically closed field[^algclosure] is similar to a matrix in Jordan normal form, i.e., for every $A$, $\exists S$ s.t. $J=S^{-1}\cdot A\cdot S$ is in Jordan normal form.[^answer]

It turns out that every matrix representation of $A$ is similar to the Jordan Normal Form of $A$.[^jnf] Since we have already seen that the characteristic polynomial of $A$ remains invariant under similarity transformations, we can focus on defining the trace solely via Jordan Normal Forms.

> **Definition 4 (Trace via Jordan Normal Forms):** The trace of an operator is the sum of the diagonal entries of its Jordan Normal Form.

---

## Definition 5: Trace via an Orthonormal Basis (Dirac Notation)

We now give a fifth definition of trace that is particularly natural in the setting of finite-dimensional inner product spaces, and is the one most frequently encountered in quantum mechanics and quantum information theory. We adopt **Dirac (bra-ket) notation**: a vector $v \in V$ is written $\ket{v}$, and its dual (the conjugate-linear functional it induces via the inner product) is written $\bra{v}$, so that the inner product of $u$ and $v$ is $\braket{u|v}$.

Let $V$ be an $n$-dimensional inner product space over $\mathbb{C}$, and let $B = \{\ket{1}, \ldots, \ket{n}\}$ be any orthonormal basis (ONB) of $V$.

> **Definition 5 (Trace via an ONB):** Let $A : V \mapsto V$ be a linear operator. The trace of $A$ is defined as
> $$\mathrm{tr}(A) = \sum_{i=1}^{n} \bra{i} A \ket{i}.$$

Let $\{\ket{i}\}$ be a complete ONB of a inner product space $V$. It is easy to show that $I = \sum_i \ket{i}\bra{i}$. Then for any linear operator $A : V \mapsto V$ we can write its trace as:

$$\mathrm{tr}(A) = \mathrm{tr}(A \cdot I) = \mathrm{tr}\!\left(A \sum_i \ket{i}\bra{i}\right) = \sum_i \mathrm{tr}(A \ket{i}\bra{i}) = \sum_i \bra{i} A \ket{i},$$

where in the last step we used the **cyclic property** of trace (which we will shortly): $\mathrm{tr}(A \ket{i}\bra{i}) = \mathrm{tr}(\ket{i}\bra{i} A) = \bra{i}A\ket{i}$.

**Connection to Definition 2.** Each term $\bra{i} A \ket{i}$ is exactly the $(i,i)$-entry of the matrix representation of $A$ in the basis $B$, since the $(i,j)$-entry of that matrix is $\bra{i} A \ket{j}$ by definition. So summing the diagonal terms gives $\sum_i M_B(i,i)$, which is Definition 2.

**Independence of the choice of ONB.** We already know from our earlier arguments that the trace is basis-independent, but let us see this directly in Dirac notation. Let $C = \{\ket{e_1}, \ldots, \ket{e_n}\}$ be a second ONB. The change of basis is effected by a **unitary** matrix $U$ (since both bases are orthonormal), so $\ket{e_i} = \sum_j U_{ji} \ket{j}$. Then:

$$\sum_i \bra{e_i} A \ket{e_i} = \sum_i \sum_{j,k} U_{ji}^* U_{ki} \bra{j} A \ket{k} = \sum_{j,k} \underbrace{\left(\sum_i U_{ji}^* U_{ki}\right)}_{(U^\dagger U)_{jk} = \delta_{jk}} \bra{j} A \ket{k} = \sum_j \bra{j} A \ket{j}.$$

---

## The Geometric Picture of Trace

We digress for a moment to reflect on the geometric picture of the determinant of an operator. Consider any orthonormal basis $B$ of a finite-dimensional inner-product space $V$. One can visualise the action of an operator $A$ on $V$ as transforming the cube (of volume $1$) formed by the basis vectors into a parallelopiped. A geometric interpretation of the determinant of an operator $A$ is the (signed) volume of the parallelopiped formed by the transformed basis vectors under action of $A$. Since we started with the cube of normalized basis vectors with volume $1$, the determinant captures the _amount of distortion_ induced by the operator $A$. Keeping in mind the above picture, here are two questions for the reader:

1. What is the significance of the volume of the parallelopiped being **signed**?
2. What is the geometric interpretation of non-invertible/singular operators?

Unlike the determinant, however, it is not immediately clear to us what the physical/geometric interpretation of trace would be. Assuming that the operator has distinct eigenvectors, we know that each individual eigenvalue represents the scaling factor of the corresponding eigenvector. We revisit this question a little later.

---

## Properties of the Trace

We now establish the fundamental algebraic properties of trace, that are ubiquitous in quantum information, functional analysis, and representation theory.

Let $A, B : V \mapsto V$ be linear operators on a finite-dimensional vector space $V$, and let $\alpha, \beta \in \mathbb{F}$.

### Linearity

> **Proposition (Linearity):** $\mathrm{tr}(\alpha A + \beta B) = \alpha\, \mathrm{tr}(A) + \beta\, \mathrm{tr}(B)$.

_Proof._ Fix any basis $B_0$ of $V$ and use Definition 2.
$$\mathrm{tr}(\alpha A + \beta B) = \sum_i (\alpha A + \beta B)(i,i) = \alpha \sum_i A(i,i) + \beta \sum_i B(i,i) = \alpha\, \mathrm{tr}(A) + \beta\, \mathrm{tr}(B). \quad \square$$

Linearity means that the trace is a **linear functional** [^functional] on the space of linear operators on $V$. We now introduce the following intuition, that we deepen later: A linear functional $f: V \mapsto \mathbb{F}$ is a _measurement_, i.e., $f$ takes any element in $V$ and outputs a scalar valued measurement! For example, if we consider the vector space of $n\times n$ matrices, the trace simply returns a scalar valued measurement of any element in this vector space.

### The Cyclic Property

> **Proposition (Cyclic Property):** $\mathrm{tr}(AB) = \mathrm{tr}(BA)$.

_Proof._ Fix a basis and use Definition 2 to expand the matrix product.
$$\mathrm{tr}(AB) = \sum_i (AB)(i,i) = \sum_i \sum_k A(i,k) B(k,i) = \sum_k \sum_i B(k,i) A(i,k) = \sum_k (BA)(k,k) = \mathrm{tr}(BA). \quad \square$$

The interchange of summation in the middle is the key step. Note that this **does not** say $\mathrm{tr}(AB) = \mathrm{tr}(A)\mathrm{tr}(B)$ since trace is not multiplicative! Rather, it says the trace is insensitive to the _order_ of two factors in a product.

By applying this repeatedly, we get the **cyclic property for longer products**:

$$\mathrm{tr}(ABC) = \mathrm{tr}(CAB) = \mathrm{tr}(BCA).$$

Note that in general $\mathrm{tr}(ABC) \neq \mathrm{tr}(BAC)$, i.e., only cyclic permutations preserve the trace, not arbitrary permutations. The cyclic property immediately implies something we have already used: **trace is invariant under similarity transformations**. If $M_C = S \cdot M_B \cdot S^{-1}$, then

$$\mathrm{tr}(M_C) = \mathrm{tr}(S \cdot M_B \cdot S^{-1}) = \mathrm{tr}(M_B \cdot S^{-1} \cdot S) = \mathrm{tr}(M_B).$$

This is a one-line proof of invariance, alternative to the characteristic polynomial argument we gave earlier.

### Trace as an Inner Product on Matrices

This is one of the most elegant and useful facts about the trace that connects linear algebra to the geometry of matrix spaces. We first define the **Hilbert-Schmidt inner product** (also called the Frobenius inner product) on the space $M_n(\mathbb{C})$ of $n \times n$ complex matrices as $\langle A, B \rangle_{\mathrm{HS}} = \mathrm{tr}(A^\dagger B),$ where $A^\dagger$ denotes the conjugate transpose of $A$.

Equipping the vector space $M_n(\mathbb{C})$ with this inner product turns it into a inner product space of dimension $n^2$. In this inner product space, the set of matrices $\{E_{ij}\}$ where $E_{ij}$ has a $1$ in position $(i,j)$ and $0$s elsewhere form an orthonormal basis: $\langle E_{ij}, E_{kl} \rangle_{\mathrm{HS}} = \delta_{ik}\delta_{jl}$.

There is a deeper connection here worth pausing on. We established earlier that the trace is a linear functional[^functional] on $M_n(\mathbb{C})$, i.e., it maps each matrix to a scalar in a linear way. The Hilbert-Schmidt inner product shows us that this linear functional has a concrete geometric realisation: for any fixed matrix $B$, the map $A \mapsto \langle B, A \rangle_{\mathrm{HS}} = \mathrm{tr}(B^\dagger A)$ is itself a linear functional on $M_n(\mathbb{C})$. In other words, every linear functional on $M_n(\mathbb{C})$ can be written as an inner product with some fixed matrix. This is an instance of the **Riesz Representation Theorem**[^riesz], which states that in any Hilbert space, every continuous linear functional arises as an inner product with a unique fixed vector. The trace, viewed through the Hilbert-Schmidt inner product, is the concrete realisation of this theorem in the matrix setting.

> **Note for the quantum computing reader:** The Hilbert-Schmidt inner product appears naturally when dealing with density matrices. The overlap between two density matrices $\rho$ and $\sigma$ is often measured by $\mathrm{tr}(\rho \sigma)$, which is exactly their Hilbert-Schmidt inner product when $\rho$ is Hermitian (so $\rho^\dagger = \rho$).

---

## Trace and Quantum Computing: Density Matrices, the Born Rule, and Partial Trace

### Pure States and Mixed States

In quantum mechanics, the state of a quantum system with an $n$-dimensional Hilbert space $\mathcal{H}$ is typically described by a unit vector $\ket{\psi} \in \mathcal{H}$ (a **pure state**). However, when we have incomplete information about the system (perhaps due to noise, or because the system is entangled with another) we need a more general description via a construct termed the **density matrix**.

> **Definition (Density Matrix):** A density matrix $\rho$ is a linear operator on $\mathcal{H}$ satisfying:
>
> 1. **Hermitian:** $\rho = \rho^\dagger$,
> 2. **Positive semidefinite:** $\bra{v}\rho\ket{v} \geq 0$ for all $\ket{v} \in \mathcal{H}$,
> 3. **Unit trace:** $\mathrm{tr}(\rho) = 1$.

The unit trace condition is a normalisation condition, analogous to requiring $\braket{\psi|\psi} = 1$ for pure states. A pure state $\ket{\psi}$ is represented by the density matrix $\rho = \ket{\psi}\bra{\psi}$; and has $\mathrm{tr}(\rho) = 1$ (using $\braket{\psi|\psi}=1$ and the cyclic property). A **mixed state** is a convex combination $\rho = \sum_k p_k \ket{\psi_k}\bra{\psi_k}$, where $p_k \geq 0$ and $\sum_k p_k = 1$. In other words, a mixed state is a convex combination/probabilistic ensemble of pure states. We now state the following fact without proof.

> **Purity of a quantum state:** A density matrix $\rho$ represents a pure state if and only if $\rho^2 = \rho$ (i.e., $\rho$ is a projector), equivalently iff $\mathrm{tr}(\rho^2) = 1$. For a mixed state, $\mathrm{tr}(\rho^2) < 1$. The quantity $\mathrm{tr}(\rho^2)$ is called the **purity** of the state.

### The Born Rule via Trace

The **Born rule** is the fundamental postulate that connects the mathematical formalism of quantum mechanics to measurable probabilities. Suppose we perform a measurement on a system described by density matrix $\rho$. A measurement is described by a collection of **measurement operators** $\{M_k\}$ satisfying the completeness relation $\sum_k M_k^\dagger M_k = I$. The probability of obtaining outcome $k$ is:

$$p(k) = \mathrm{tr}(M_k^\dagger M_k \, \rho).$$

In a projective measurement (where $M_k = \Pi_k$ are orthogonal projectors onto eigenspaces of some observable $\hat{O} = \sum_k \lambda_k \Pi_k$). Here, the probability of obtaining outcome $k$ this simplifies to:

$$p(k) = \mathrm{tr}(\Pi_k \rho).$$

The expected value (expectation) of the observable $\hat{O}$ in state $\rho$ is then:

$$\langle \hat{O} \rangle_\rho = \sum_k \lambda_k\, p(k) = \sum_k \lambda_k \, \mathrm{tr}(\Pi_k \rho) = \mathrm{tr}\!\left(\sum_k \lambda_k \Pi_k \cdot \rho \right) = \mathrm{tr}(\hat{O}\,\rho),$$

where we used linearity of trace and the definition $\hat{O} = \sum_k \lambda_k \Pi_k$. Every measurable quantity is therefore expressible as a trace. This is precisely why the invariance and linearity of trace are so important in physics: probabilities and expectation values are independent of the choice of basis used to describe the Hilbert space!

### The Partial Trace

One of the most important (and inherently quantum-mechanical) uses of trace is the notion of a **partial trace**, which allows us to extract the state of a _subsystem_ from a larger composite system.

Let $\mathcal{H} = \mathcal{H}_A \otimes \mathcal{H}_B$ be a bipartite Hilbert space (a composite of systems $A$ and $B$), with $\dim \mathcal{H}_A = m$ and $\dim \mathcal{H}_B = n$. Let $\{\ket{i}_A\}$ and $\{\ket{j}_B\}$ be ONBs for $\mathcal{H}_A$ and $\mathcal{H}_B$ respectively. Any operator $\rho$ on $\mathcal{H}$ has a block structure in the basis $\{\ket{i}_A \otimes \ket{j}_B\}$.

> **Definition (Partial Trace over $B$):** The **reduced density matrix** of subsystem $A$, obtained by tracing out $B$, is
> $$\rho_A = \mathrm{tr}_B(\rho) = \sum_{j=1}^{n} (I_A \otimes \bra{j}_B)\, \rho\, (I_A \otimes \ket{j}_B).$$

We "trace over" the $B$ index by setting $j = j'$ and summing just like an ordinary trace, but only over the $B$ subsystem. Note that $\rho_A$ as defined above is itself a valid density matrix (Hermitian, positive semidefinite, unit trace), given that $\rho$ is a valid density matrix.

**Why does this matter?** Consider two qubits ($\mathcal{H}_A \cong \mathcal{H}_B \cong \mathbb{C}^2$) in the **Bell state** $\ket{\Phi^+} = \frac{1}{\sqrt{2}}(\ket{00} + \ket{11})$. The joint density matrix is $\rho = \ket{\Phi^+}\bra{\Phi^+}$, a pure state. But computing $\rho_A = \mathrm{tr}_B(\rho)$ gives:

$$\rho_A = \frac{1}{2}\ket{0}\bra{0} + \frac{1}{2}\ket{1}\bra{1} = \frac{I}{2},$$

the **maximally mixed state** which has $\mathrm{tr}(\rho_A^2) = \frac{1}{2} < 1$. This is the mathematical signature of **quantum entanglement**: even though the joint state is pure (maximally certain), the reduced state of each qubit alone is maximally mixed (maximally uncertain).

---

## The Geometric Picture of Trace (Revisited)

Recall the geometric picture of the determinant: an operator $A$ maps the unit hypercube formed by basis vectors to a parallelopiped, and $\det(A)$ captures the (signed) volume of this parallelopiped. In particular:

1. The **sign** of $\det(A)$ captures orientation-reversal: a negative determinant means $A$ flips the handedness of the basis.
2. A **singular operator** ($\det(A) = 0$) collapses the hypercube to a lower-dimensional object — the image has zero volume, reflecting that $A$ is not injective.

What, then, is the geometric meaning of the trace?

### Infinitesimal Volume Change

The cleanest geometric interpretation of trace comes from thinking about **infinitesimal deformations** of the identity. Consider the one-parameter family of operators $A(t) = I + tB$ for small $t \in \mathbb{R}$. Then by the characteristic polynomial argument, we have $\det(I + tB) = \prod_i (1 + t\lambda_i) = 1 + t\sum_i \lambda_i + O(t^2) = 1 + t\cdot\mathrm{tr}(B) + O(t^2)$.

Geometrically: if you perturb the identity by a small amount $tB$, the **first-order change in volume** (i.e., in the determinant) is exactly $t \cdot \mathrm{tr}(B)$. The trace of $B$ is thus the **infinitesimal volume distortion rate** induced by $B$. This can be made even more precise.

For a smooth family of invertible operators $A(t)$ with $A(0) = I$, we have by Jacobi's formula: [^jacobi]

$$\frac{d}{dt}\det(A(t))\bigg|_{t=0} = \mathrm{tr}\!\left(A'(0)\right).$$

### Trace as a Sum of Eigenvalue Scalings

If $A$ is diagonalisable with eigenvalues $\lambda_1, \ldots, \lambda_n$ (counted with multiplicity), the operator stretches its eigenvectors by factors $\lambda_i$. The trace $\sum_i \lambda_i$ is therefore the **total signed stretching** across all eigendirections. The determinant $\prod_i \lambda_i$ is the _multiplicative_ volume distortion; the trace is the _additive_ version of the same idea, to first order.

To see why "first order" is the right frame: note that for a _scalar_ $a$, $(1 + \epsilon a) \approx e^{\epsilon a}$ for small $\epsilon$. For a matrix, the analogous statement is that $\det(e^{\epsilon A}) = e^{\epsilon \,\mathrm{tr}(A)}$, since $\det(e^A) = e^{\mathrm{tr}(A)}$ exactly. Hence, the trace is the **infinitesimal generator** of the determinant under the matrix exponential.

> **Exercise:** Prove that $\det(e^A) = e^{\mathrm{tr}(A)}$ for any square matrix $A$, using the Jordan normal form.

[^linmap]: **Linear Operator:** Let $V$ be a vector space over some field $\mathbb{F}$. A function $A:V\mapsto V$ is a linear operator on $V$ if $\forall \lambda,\sigma\in\mathbb{F}$ and $\forall v,w\in V$, $A(\lambda v + \sigma w) = \lambda A(v) + \sigma A(w)$.

[^bounded]: **Matrix Representation:** A linear operator on an infinite-dimensional vector space will not have a matrix representation if it is not _bounded_. For the purposes of our discussion, requiring that $V$ is finite-dimensional suffices and also avoids unnecessary complications.

[^spectral]: **Spectral Theorem:** If $A$ is a Hermitian operator (i.e., $A=A^{\dagger}$) on a finite-dimensional vector space $V$, then $A=\sum_{i=1}^{n} \lambda_i v_i^{\dagger}\cdot v_i$, where $\lambda_i$ are real eigenvalues of $A$ corresponding to the eigenvectors $v_i$, which form an orthonormal basis of $V$. Note that the eigendecomposition of $A$ is not unique if the eigenvalues are not distinct. Equivalently, $A=U\Lambda U^{\dagger}$, where $U$ is a unitary matrix whose columns are $v_i$ and $\Lambda$ is the diagonal matrix with $\lambda_i$ as its entries. This form allows us to succinctly express powers of $A$ as $(A)^k=U(\Lambda)^k U^{\dagger}$, for any $k>0$.

[^innerproduct]: **Linear Independence vs Orthonormality:** Recall that for general vector spaces, the only property of basis vectors available to us is linear independence. Sometimes, it is desirable if we could add more structure to the basis set. An inner product space is a vector space equipped with the notion of an inner product function. This allows us to capture the notion of _angles_ between vectors. The immediate consequence of note is that we can define a set of orthonormal basis vectors for any vector space equipped with an inner product.

[^quantum]: Interestingly, these restrictions suffice for the purposes of quantum computation and quantum information theory. The general proof of the equivalence between Definitions 1 and 2 is given in the section on the characteristic polynomial above.

[^charpoly]: **Characteristic Polynomial and Eigenvalues:** The characteristic polynomial of an $n\times n$ matrix $M$ is $p(M) = \det(M - \lambda\cdot I_{n\times n})$. Its roots are the eigenvalues of $M$, since for any $\lambda_i$ s.t. $p(M)=0$, we have $\det(M - \lambda_i\cdot I)=0$ which implies that $(M - \lambda_i\cdot I)$ has a non-trivial null space, say $N_i$. Now, any $v_i\in N_i$ is an eigenvector of $M$ with eigenvalue $\lambda_i$ as $(M - \lambda\cdot I)v=0\implies Mv_i=\lambda_i v_i$, implying that $\lambda_i$ is an eigenvalue of $M$ w.r.t. $v_i$. Note that any non-trivial null space of $(M - \lambda_i \cdot I)$ is an eigenspace of $M$.

[^factor]: This is known as the [Factor Theorem of polynomials](https://en.wikipedia.org/wiki/Factor_theorem).

[^jnf]: **Similarity and JNF:** Let $A=P\cdot J_A \cdot P^{-1}$ and $C=Q\cdot A \cdot Q^{-1}$. Then, $C=T\cdot J_A \cdot T^{-1}$, where $T=QP^{-1}$ is an invertible change of basis matrix. Hence, $C$ is similar to $J_A$. Also by definition, $J_A$ is the JNF of $C$.

[^answer]: [An elegant proof of the theorem.](https://math.stackexchange.com/a/4901247/120548)

[^block]: **Generalized Eigenspaces:** Each block $B_{\lambda_i,m_i}$ of the JNF of a bounded linear operator $A:V\mapsto V$ represents the generalized eigenspace of $A$ corresponding to the eigenvalue $\lambda_i$. More precisely, $V$ decomposes as a direct sum $V = \bigoplus_{i=1}^{k} \ker(A - \lambda_i I)^{m_i}$, where each summand is the generalized eigenspace of dimension $m_i$.

[^algclosure]: **Algebraic Closure:** Definition 1 requires that the eigenvalues of $A$ exist in $\mathbb{F}$, which holds when $\mathbb{F}$ is algebraically closed (e.g., $\mathbb{C}$). If $\mathbb{F}$ is not algebraically closed (e.g., $\mathbb{R}$), the characteristic polynomial may not split completely over $\mathbb{F}$, and some eigenvalues may be absent. In such cases, one can extend $\mathbb{F}$ to its algebraic closure (for example, extending $\mathbb{R}$ to $\mathbb{C}$) and apply Definition 1 there. Definition 2 (sum of diagonal entries) is always well-defined regardless of the field.

[^monic]: **Monic Polynomial:** In algebra, a monic polynomial is a non-zero univariate polynomial in which the leading coefficient (the coefficient of the nonzero term of highest degree) is equal to $1$.

[^functional]: **Functional:** Let $V$ be a vector space over a field $\mathbb{F}$. A functional is a function $f: V \mapsto \mathbb{F}$ that maps elements of $V$ to scalars in $\mathbb{F}$. A _linear_ functional additionally satisfies $f(\alpha u + \beta v) = \alpha f(u) + \beta f(v)$ for all $\alpha, \beta \in \mathbb{F}$ and $u, v \in V$.

[^riesz]: **Riesz Representation Theorem:** Let $\mathcal{H}$ be a Hilbert space over $\mathbb{F}$, and let $f: \mathcal{H} \mapsto \mathbb{F}$ be a continuous linear functional. Then there exists a unique $u \in \mathcal{H}$ such that $f(v) = \langle u, v \rangle$ for all $v \in \mathcal{H}$. In finite dimensions, continuity is automatic, so every linear functional on a finite-dimensional inner product space arises this way.

[^jacobi]: The **matrix-log derivative** formula (also known as Jacobi's formula) formula is the matrix analogue of the chain rule for logarithms. Recall that, for scalar functions, $\frac{d}{dt}\log f(t) = f'(t)/f(t)$. For operators, the corresponding statement is $\frac{d}{dt}\log\det(A(t)) = \mathrm{tr}\!\left(A(t)^{-1} A'(t)\right).$

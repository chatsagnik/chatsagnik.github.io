---
title: "An Introduction to Algorithmic Robust Statistics"
date: 2026-04-01T00:00:00+05:30
draft: false
tags: [robust statistics, Huber contamination, linear regression, f-divergences, total variation distance, measure theory]
---

> _This post assumes familiarity with basic measure-theoretic probability, linear algebra, and some exposure to statistical estimation. The content was inspired by [Ankit](https://ankitp.net)'s 2026 course on [Algorithmic Robust Statistics](https://ankitp.net/RobustStats_S26). All inaccuracies, mistakes, and blunders are solely my responsibility._

---

## Introduction

In statistics, a standard assumption is that data are drawn i.i.d. from some distribution $P_{w_\star}$. In practice, this assumption rarely holds exactly — data pipelines corrupt entries, sensors malfunction, and the true data-generating process is often more complicated than the assumed model. The field of **robust statistics** asks if we can design estimators that continue to work well even when the i.i.d. assumption holds only approximately.

More precisely, robustness formalizes the idea that small perturbations in the input data should not lead to large changes in the estimator output. If two datasets are close, $D \approx D'$, then $A(D) \approx A(D')$, where $A$ is the estimator mapping data to an output. In particular, the estimator should be insensitive to a small fraction of corrupted samples.

The **algorithmic** angle sharpens this further: we not only want robust estimators to exist, but want them to be efficiently computable.

---

## A Running Example: Linear Regression

Given a dataset $T = \{(x_i, y_i)\}_{i=1}^n$ where $x_i \in \mathbb{R}^d$ and $y_i \in \mathbb{R}$, we seek to predict $y$ from $x$. In many applications, a linear relationship is assumed:

$$Y = X^\top w_\star + Z, \quad \text{where} \quad \mathbb{E}[Z \mid X] = 0.$$

Here $w_\star$ is the true underlying relationship between features and response, while $Z$ captures noise and unmodeled effects.[^noise] The goal is to estimate $w_\star$ from $T$.

### The i.i.d. Assumption

Under the idealized model, $(x_i, y_i) \overset{iid}{\sim} P_{w_\star}$. Two natural questions arise:

- Does this assumption hold exactly, or only approximately?
- If only approximately, does the estimator remain stable?

For the first question, the answer is almost always: only approximately. There are three distinct failure modes.

**Gross outliers (sparse corruption).** A small fraction $\epsilon > 0$ of data points are arbitrarily corrupted: $(x_i, y_i) \to (x_i', y_i')$, where the corrupted points may be adversarially chosen.

**Bounded errors (dense noise).** A large fraction of points are slightly perturbed: $(x_i, y_i) \approx (x_i', y_i')$. No single point is catastrophically wrong, but the aggregate deviation is non-negligible.

**Model misspecification.** The assumed linear relationship simply does not hold. As the saying goes, "all models are wrong, but some are useful."[^box] For example, assuming $X \sim \mathcal{N}(\mu, \Sigma)$ with a linear response, i.e. $Y = X^\top w_\star$, is common practice even when the true covariates are not known to be Gaussian or the true relationship is not known to be linear.

### Instability of OLS

The answer to the second question is uncomfortable. The Ordinary Least Squares estimator,

$$\hat{w}_{\mathrm{OLS}} = \arg\min_w \sum_{(x_i, y_i) \in T} (y_i - x_i^\top w)^2,$$

is extremely sensitive to corruptions. Suppose an adversary wishes to force the learner to recover $w_{\mathrm{adv}} \in \mathbb{R}^d$ instead of the true $w_\star$. The adversary injects a single point $(\tilde{x}, \tilde{y})$ into the dataset, choosing $\tilde{x}$ with very large norm and setting $\tilde{y} = \tilde{x}^\top w_{\mathrm{adv}}$. Since squared loss grows quadratically with the residual, the term $(\tilde{y} - \tilde{x}^\top w)^2$ dominates the entire objective for large $\|\tilde{x}\|$, and the minimizer is forced to satisfy $\tilde{x}^\top w = \tilde{y} = \tilde{x}^\top w_{\mathrm{adv}}$, i.e. $\hat{w}_{\mathrm{OLS}} = w_{\mathrm{adv}}$. Since $w_{\mathrm{adv}}$ is arbitrary, a single corrupted point suffices to send the estimator anywhere in $\mathbb{R}^d$. Classical estimators like OLS rely heavily on the exact correctness of the i.i.d. assumption. Robust statistics seeks estimators whose performance degrades gracefully when this assumption is only approximately satisfied.

---

## Contamination Models

To formalize deviations from the ideal i.i.d. model, we introduce different notions of how the observed distribution $P$ may differ from the true distribution $P_*$.

### Huber Contamination Model

The Huber model captures **sparse corruption**: only a small fraction of the data is unreliable, but those corrupted points can be arbitrarily bad.

$$P = (1-\epsilon)P_* + \epsilon Q,$$

where $Q$ is an arbitrary (possibly adversarial) distribution and $\epsilon$ is the contamination fraction.

### Strong Contamination Model

Draw a clean sample $S \sim P_*^n$. An adversary inspects the entire sample and replaces up to $\epsilon n$ points arbitrarily. Let $T$ denote the observed dataset. Then $|S \cap T| \geq (1-\epsilon)n.$

This is stronger than Huber contamination: the adversary sees the clean data before choosing corruptions and can respond adaptively. It is often used to derive worst-case robustness guarantees.

### Total Variation Contamination

Samples are drawn i.i.d. from $P$, where $d_{TV}(P, P_*) \leq \epsilon$. Recall that

$$d_{TV}(P, P_*) = \sup_A |P(A) - P_*(A)| = \inf_\pi \Pr_{(X,Y)\sim\pi}(X \neq Y),$$

where the infimum is over all couplings[^coupling] $\pi$ with marginals $P$ and $P_*$. TV distance measures the largest probability discrepancy over all measurable events, or equivalently, the minimum probability that two random variables drawn from $P$ and $P_*$ can be made to differ. A small TV distance means the two distributions are nearly indistinguishable.

One could also study robustness under other notions of distance that capture different aspects of distributional closeness — Kolmogorov distance focuses on CDFs, while Wasserstein distance incorporates the geometry of the space. The choice of distance influences both the difficulty of the problem and the type of robustness guarantees achievable.

### Kolmogorov Contamination Model

The Kolmogorov distance between $P$ and $P_*$ is defined as the supremum of the discrepancy between their CDFs:

$$d_K(P, P_*) := \sup_{t \in \mathbb{R}} |F_P(t) - F_{P_*}(t)|,$$

where $F_P$ and $F_{P_*}$ are the cumulative distribution functions of $P$ and $P_*$ respectively. The Kolmogorov contamination class of radius $\epsilon$ is

$$\mathcal{K}^\epsilon(P_*) := \{P \mid d_K(P, P_*) \leq \epsilon\}.$$

### Wasserstein Contamination Model

Let $P$ and $P_*$ have finite $k$-th moments. The Wasserstein contamination class of radius $\rho$ is

$$\mathcal{W}_k^\rho(P_*) := \{P \mid W_k(P, P_*) \leq \rho\}.$$

### General Probability Metric Contamination Model

More generally, given any probability metric[^probmetric] $d(\cdot, \cdot)$ and radius $\epsilon > 0$, one can define a contamination class

$$\mathcal{B}_d^\epsilon(P_*) := \{P \mid d(P, P_*) \leq \epsilon\}.$$

The TV, Kolmogorov, and Wasserstein contamination models are all instances of this general framework. The choice of metric influences both the difficulty of the estimation problem and the type of robustness guarantees achievable.

---

## Relationships Between Models

Huber contamination, TV distance, and strong contamination are closely related and often lead to comparable robustness guarantees. Although defined differently (distribution-level vs. sample-level) they all capture the idea that an $\epsilon$ fraction of the data may be corrupted. In many settings, results proved under one model transfer to the others up to constant factors.

The notation $C \implies C'$ between two contamination models has a precise meaning in terms of adversaries. Suppose adversary $\mathcal{A}$ operates under model $C$, and adversary $\mathcal{A}'$ operates under model $C'$. Then $C \implies C'$ means that any corruption producible by $\mathcal{A}$ under $C$ is also a valid corruption under $C'$, i.e. $\mathcal{A}'$ is at least as powerful as $\mathcal{A}$. As a consequence, any estimator that is robust against $\mathcal{A}'$ (i.e. robust under $C'$) is automatically robust against $\mathcal{A}$ (i.e. robust under $C$). In other words, robustness guarantees transfer from stronger models to weaker ones for free.

### Huber $\Rightarrow$ TV
**Proposition.** $P = (1-\epsilon)P_* + \epsilon Q \implies d_{TV}(P, P_*) \leq \epsilon.$

**Proof.** For any measurable set $A$,

$$\begin{aligned} P(A) - P_*(A) &= \epsilon\bigl(Q(A) - P_*(A)\bigr). \end{aligned}$$

Taking absolute values and using $|Q(A) - P_*(A)| \leq 1$ (since both are probabilities in $[0,1]$), we get $|P(A) - P_*(A)| \leq \epsilon$. Taking the supremum over $A$ gives $d_{TV}(P, P_*) \leq \epsilon.$ $\square$

### TV $\Rightarrow$ Huber-type Decomposition

**Proposition.** If $d_{TV}(P, P_*) \leq \epsilon$, then there exist distributions $P_{\mathrm{good}}$ and $Q$ and a number $\epsilon' \leq \epsilon$ such that $P = (1-\epsilon')P_{\mathrm{good}} + \epsilon' Q,$ $P_{\mathrm{good}} \ll P_*,$ and $\forall A$, $P_{\mathrm{good}}(A) \leq \frac{1}{1-\epsilon'} P_*(A)$.

**Proof.** Define $\mu = P + P_*$. Since $P \ll \mu$ and $P_* \ll \mu$, the Radon–Nikodym theorem[^rn] gives densities[^density] $p = dP/d\mu$ and $p_* = dP_*/d\mu$ defined $\mu$-a.e. Set $\epsilon' := d_{TV}(P, P_*) \leq \epsilon$ and define
$$r(x) := \min\{p(x), p_*(x)\} \leq p_*(x) \quad \mu\text{-a.e.}$$
Using the identity $\min(a,b) = \frac{a+b-|a-b|}{2}$,

$$\begin{aligned} \int r \, d\mu &= \frac{1}{2}\left(\int p \, d\mu + \int p_* \, d\mu - \int |p - p_*| \, d\mu\right) = 1 - \frac{1}{2}\int |p - p_*| \, d\mu = 1 - \epsilon'. \end{aligned}$$

Define
$$p_{\mathrm{good}}(x) := \frac{r(x)}{1-\epsilon'}, \quad q(x) := \frac{p(x) - r(x)}{\epsilon'},$$
so that $p = (1-\epsilon')p_{\mathrm{good}} + \epsilon' q$. Let $P_{\mathrm{good}}$ and $Q$ be the corresponding distributions. Since $r(x) \leq p_*(x)$ $\mu$-a.e.,

$$P_{\mathrm{good}}(A) = \int_A p_{\mathrm{good}} \, d\mu \leq \frac{1}{1-\epsilon'} \int_A p_* \, d\mu = \frac{P_*(A)}{1-\epsilon'}, \quad \therefore \quad P_{\mathrm{good}} \ll P_*. \quad \square$$

This shows that if $d_{TV}(P, P_*) \leq \epsilon$, at most an $\epsilon$ fraction of the probability mass can behave arbitrarily, while the remaining $(1-\epsilon)$ fraction comes from a re-weighted $P_*$ that is almost "clean." In other words, TV closeness forces an approximate Huber decomposition.

### TV $\Rightarrow$ Approximate Strong Contamination (w.h.p.)

**Proposition.** Let $P, Q$ be distributions on a measurable space $(\mathcal{X}, \mathcal{F})$ with $d_{TV}(P, Q) \leq \epsilon/2$. Then for any $n$, samples $Y_i \sim Q$ can be realized as a strongly adversarially corrupted version of $X_i \sim P$ with contamination fraction at most $\epsilon$, with probability at least $1 - e^{-cn\epsilon}$ for some constant $c > 0$.

**Proof.** By the coupling characterization of TV distance,

$$d_{TV}(P, Q) = \inf_{\pi \in \Pi(P,Q)} \Pr_{(X,Y) \sim \pi}(X \neq Y).$$

Since $d_{TV}(P, Q) \leq \epsilon/2$, there exists a coupling $\pi$ such that $\Pr_\pi(X \neq Y) \leq \epsilon/2$.

We now lift to $n$ samples. Draw $(X_i, Y_i) \overset{iid}{\sim} \pi$ and consider the indicator $Z_i := \mathbf{1}[X_i \neq Y_i]$. Then $Z_i \sim \mathrm{Ber}(p)$ where $p := \Pr_\pi(X \neq Y) \leq \epsilon/2$, and

$$S_n := \sum_{i=1}^n Z_i \sim \mathrm{Binomial}(n, p).$$

**Claim:** $\{Y_i\}$ is obtained from $\{X_i\}$ by modifying exactly $S_n$ samples.

**Proof of Claim.** Define the index set $I := \{i \in [n] : X_i \neq Y_i\}$. By definition $|I| = S_n$. For all $i \notin I$, $Y_i = X_i$, and for all $i \in I$, $Y_i$ takes some arbitrary value. Note that $S_n$ is the Hamming distance between the two sequences $\{X_i\}$ and $\{Y_i\}$. $\square$

It remains to show $S_n \leq \epsilon n$ with high probability. We want $S_n \leq \epsilon n$. Recall $X \sim \mathrm{Binomial}(n, p)$, so $\mathbb{E}[Z_i] = p$ and $\mathbb{E}[S_n] = np$. By a Chernoff bound with $\delta = 1$,

$$\Pr\left(S_n \geq (1+\delta) \mathbb{E}[S_n]\right) \leq \exp\!\left(-\frac{\delta^2}{2+\delta} \mathbb{E}[S_n]\right).$$

Substituting $\delta = 1$ and $\mathbb{E}[S_n] = np \leq n\epsilon/2$,

$$\Pr(S_n \geq \epsilon n) \leq \exp\!\left(-\frac{n\epsilon}{6}\right).$$

Therefore $\Pr(S_n \leq \epsilon n) \geq 1 - \exp(-n\epsilon/6)$, i.e. the contamination fraction is at most $\epsilon$ with high probability. $\square$

Combining with the earlier results, we obtain the following chain of inclusions w.h.p.:

$$\mathrm{Huber}(\epsilon) \equiv \mathrm{TV}(\epsilon) \subseteq \mathrm{SAC}\!\left((1+\delta)\frac{\epsilon}{2}\right), \qquad \mathcal{C}_{KL}(\mathcal{B}_0, \epsilon) \subseteq \mathrm{TV}\!\left(\sqrt{\frac{\epsilon}{2}}\right) \subseteq \mathrm{SAC}\!\left((1+\delta)\sqrt{\frac{\epsilon}{2}}\right).$$

### Distortion and $f$-Divergence Contamination

More generally, given a distortion function $d$, define the contamination class

$$\mathcal{C}_d(P_*, \epsilon) := \{\rho : d(\rho, P_*) \leq \epsilon\}.$$

The key quantity linking a distortion-based contamination class to the strong contamination model is the **distortion function**

$$g_d(\epsilon) := \sup_{P \in \mathcal{C}_d(P_*, \epsilon)} d_{TV}(P, P_*).$$

For TV contamination, $g(\epsilon) = \epsilon$. For KL contamination, Pinsker's inequality gives $g(\epsilon) = \sqrt{\epsilon/2}$. More generally, for any $f$-divergence contamination class, $g_d(\epsilon)$ quantifies how much TV distance the adversary can induce with distortion budget $\epsilon$. Combined with the TV $\Rightarrow$ SAC result above, any $f$-divergence contamination class $\mathcal{C}_d(P_*, \epsilon)$ can simulate the strong adversarial contamination model w.h.p.

---

# Footnotes

[^rn]: The Radon–Nikodym theorem states that if $\nu$ is a $\sigma$-finite measure and $\mu$ is a $\sigma$-finite measure with $\nu \ll \mu$ (i.e. $\nu$ is absolutely continuous[^ac] with respect to $\mu$, meaning $\mu(A) = 0 \implies \nu(A) = 0$), then there exists a measurable function $f \geq 0$ such that $\nu(A) = \int_A f \, d\mu$ for all measurable $A$. This $f$ is unique $\mu$-a.e. and is called the Radon–Nikodym derivative, written $f = d\nu/d\mu$.

[^density]: A density of a distribution $P$ with respect to a dominating measure $\mu$ is the Radon–Nikodym derivative $p = dP/d\mu$. It satisfies $P(A) = \int_A p \, d\mu$ for all measurable $A$, and $\int p \, d\mu = 1$. When $\mu$ is the Lebesgue measure, $p$ is the familiar probability density function. Here $\mu = P + P_*$ dominates both $P$ and $P_*$, so both densities $p$ and $p_*$ exist and satisfy $p, p_* \geq 0$ and $\int p \, d\mu = \int p_* \, d\mu = 1$.

[^ac]: A measure $\nu$ is absolutely continuous with respect to a measure $\mu$, written $\nu \ll \mu$, if every set that has $\mu$-measure zero also has $\nu$-measure zero: $\mu(A) = 0 \implies \nu(A) = 0$. Intuitively, $\nu$ cannot assign positive mass to regions that $\mu$ considers negligible. In our setting, $P \ll \mu$ and $P_* \ll \mu$ hold trivially since $\mu = P + P_*$: any set with $\mu(A) = 0$ must have both $P(A) = 0$ and $P_*(A) = 0$.

[^coupling]: A coupling of two distributions $P$ and $P_*$ is a joint distribution $\pi$ on $\mathcal{X} \times \mathcal{X}$ whose marginals recover $P$ and $P_*$, i.e. $\pi(A \times \mathcal{X}) = P(A)$ and $\pi(\mathcal{X} \times A) = P_*(A)$ for all measurable $A$. Intuitively, a coupling is a way of constructing two random variables $X \sim P$ and $X' \sim P_*$ on the same probability space, possibly with dependence between them.

[^probmetric]: A probability metric is a metric on the space of probability distributions over a measurable space $(\mathcal{X}, \mathcal{F})$. Formally, $d(\cdot, \cdot)$ satisfies non-negativity ($d(P, Q) \geq 0$), identity of indiscernibles ($d(P, Q) = 0 \iff P = Q$), symmetry ($d(P, Q) = d(Q, P)$), and the triangle inequality ($d(P, R) \leq d(P, Q) + d(Q, R)$) for all distributions $P, Q, R$. TV, Kolmogorov, and Wasserstein distances are all examples, though they induce different topologies on the space of distributions.

[^noise]: The condition $\mathbb{E}[Z \mid X] = 0$ says the noise is mean-zero *conditional* on the features — the model is correct on average for any given $x$, but the noise may still depend on $x$ in other ways (e.g., its variance may scale with $\|x\|$). A stronger assumption, often made for cleaner theory, is $Z \perp X$ with $\mathbb{E}[Z] = 0$: the noise is entirely independent of the features, not just uncorrelated with them conditionally. The weaker condition suffices for OLS consistency; the stronger one is needed for, e.g., valid prediction intervals.

[^box]: The longer form of the quote, due to George E. P. Box and Norman Draper, reads: "The fact that the polynomial is an approximation does not necessarily detract from its usefulness because all models are approximations. Essentially, all models are wrong, but some are useful." Box, G. E. P.; Draper, N. R. (1987). *Empirical Model-Building and Response Surfaces*. John Wiley & Sons. p. 424.
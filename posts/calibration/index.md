---
title: "Calibration, Distance, and Amplification"
date: 2026-01-14T00:00:00+05:30
draft: false
tags: [calibration, online learning, sequential prediction, distance-to-calibration, omniprediction, boosting]
---

> _This post covers three connected ideas: what calibration is and why it matters, how to measure and achieve low distance-to-calibration (following Arunachaleswaran, Collina, Roth, and Shi, [SODA 2025](https://arxiv.org/abs/2402.11410)), and why calibration does more work than its definition lets on (following Casacuberta, Gopalan, Kanade, and Reingold, [2025](https://arxiv.org/abs/2504.15206)). I assume basic familiarity with probability and expectation._

---

## What is Calibration?

In classical supervised learning, a learning algorithm is provided with a set of labeled instances $\{x,y\}$ which are sampled i.i.d. from an unknown joint distribution $\mathcal{D}^\star$ over an labeled-instance space $\mathcal{Z}=\mathcal{X}\times\{0,1\}$. The output of the learning algorithm is a predictor $f : \mathcal{X} \to [0,1]$ that tries to model the Bayes optimal $p^\star(x) = \mathbb{E}[y^\star \mid x]$. 

The trouble is that we never get to _see_ $p^\star$ directly. Instead, we only observe only discrete outcomes. Therefore,  we cannot simply check how close $f$ is to $p^\star$ under some distance measure. Instead of asking whether $f \approx p^\star$, one can ask whether $f$ is _indistinguishable_ from $p^\star$ by certain statistical tests. Dawid (1982)[^dawid] formalized this for binary prediction. 

> Given samples $(x, y) \sim \mathcal{D}$ over $\mathcal{X} \times \{0,1\}$ and a predictor $f : \mathcal{X} \to [0,1]$, we say $f$ is **perfectly calibrated** if for all $v$ with $\mathrm{Pr}(f(x) = v)>0$, $\mathbb{E}_{\mathcal{D}}\left[y \mid f(x) = v\right] = v.$ [^almost]

Perfect calibration is a statement of indistinguishability between the world the predictor hypothesizes and the world that actually unfolds.[^gopalan] For example, if a perfectly calibrated predictor $f$ says that there is a "70% chance of rain on Mondays," any observer would agree that it actually rained 70% of the time on Mondays. In other words, given a perfectly calibrated predictor $f$, the real world $(f(x), y)$ and the hypothetical world $(f(x), y')$, where $y' \sim \mathrm{Ber}(f(x))$ are _distributed identically_.

### Calibrated Predictors simplify Decision Making

Consider a scout at La Masia, Barcelona's famous youth academy, using a model $p$ to predict the probability that a kid makes it as a professional. The scout's commission structure penalises false positives (signing a kid who does not make it) at a cost of $0.1$, and false negatives (missing a kid who then goes on to lead Espanyol to a treble) at a cost of $0.9$. If the scout had access to a Bayes optimal predictor $p^\star$, the rational strategy is simple: sign any kid $x$ whenever $p^\star(x) \geq 0.1$.

However, since the scout only has access to an imperfect model $p\neq p^\star$, the decision making process is more complicated. Should they still use the same threshold of 0.1, or adjust their cutoff to compensate for the model's errors? In general, the answer depends on _how_ $p$ fails. Does $p$ systematically overrate certain attributes/features, underrates others, or both?

If our scout had the guarantee that their model $p$ was perfectly calibrated (although not the Bayes optimal), they could stick to the simple optimal scouting strategy $p(x)\geq 0.1$, since it is guaranteed that the expected loss the scout suffers is _exactly_ what they would have suffered even if they had access to the Bayes optimal predictor $p^\star$. Now the question becomes: How would our scout know if their predictor is perfectly calibrated?

### Calibrated Predictors are Empirically Verifiable

How would the owners verify that the scout is not making avoidable lapses in judgement? Suppose they send an auditor to evaluate the performance of the scout a few seasons later. The auditor does not have access to $p^\star$, does not know the scout's cost structure, and does not care about it. All the auditor has is a spreadsheet: for each kid, the scout's (model $p$'s) predicted probability and whether they eventually turned professional. The auditor's check is simple: do the kids rated at $70\%$ make it roughly $70\%$ of the time? What about those rated at $30\%$? If $p$ is perfectly calibrated, it always passes these audits since $\mathbb{E}_{\mathcal{D}}\left[y \mid f(x) = v\right] = v$ for all $v$. 

> Perfect calibration is a property that can be falsified from predictions and outcomes alone. 

This makes calibration an especially attractive notion of correctness in settings where the ground truth $p^\star$ is never revealed!

---

## How Far Are We From Calibration?

Suppose the auditor runs their check and the model fails. Now what? Our scout needs a way to quantify _how far_ their model is from being perfectly calibrated. To study
this rigorously, we adopt a theoretical framework that makes no assumptions on how the labels $y^{1:T}$ are generated. At each round $t \in [T]$, the predictor commits to $p^t \in [0,1]$, and then $y^t \in \{0,1\}$ is revealed. Note that we do not place any restrictions on how $y^t$ is chosen. This is equivalent to assuming the worst case: an adversary who picks $y^t$ online with full knowledge of the predictor's strategy.[^adversary] Any algorithm that keeps miscalibration low in this worst-case sense automatically does so when the labels happen to be i.i.d. from $\mathcal{D}^\star$, since that is just a special case. 

The remaining subtlety is what to compare $p$ against. A predictor $p$ and a perfectly calibrated predictor $p^\star$ may be making systematically different forecasts on entirely different inputs. Comparing our scout's model against a perfectly calibrated scout evaluating kids in Manchester is meaningless since they are playing entirely different games! The right comparison is against a perfectly calibrated scout who faced _the same kids, in the same order_, that our scout did. Formally, this means comparing $p^{1:T}$ against the set of perfectly calibrated predictors on the same label sequence $y^{1:T}$.

### Expected Calibration Error

The classical measure is **Expected Calibration Error (ECE)**.[^ece] One can think of **ECE** as a modified notion of regret. For each prediction value $p$ used at least once, the inner sum accumulates the signed prediction errors on the rounds where that value was predicted. The outer absolute value and sum then measure the total signed bias across all prediction values.

$$\mathrm{ECE}(p^{1:T},\, y^{1:T}) = \sum_{p \in [0,1]} \left\lvert \sum_{t=1}^{T} \mathbb{1}_{\{p^t = p\}} \cdot (p^t - y^t) \right\rvert.$$

Two landmark results shaped our understanding of how ECE grows with $T$:

- **Foster & Vohra (1998)**: ECE can be kept to $O(T^{2/3})$.
- **Qiao & Valiant (2021)**: ECE must grow as $\Omega(T^{1/2 + \varepsilon})$ for any $\varepsilon > 0$, ruling out $O(\sqrt{T})$ rates.

So $O(\sqrt{T})$ ECE is provably impossible. This is a striking contrast to online convex optimization, where $\Theta(\sqrt{T})$ regret is achievable! ECE also has another major issue: it is discontinuous. Nudging a prediction from $0.300$ to $0.301$ changes which term of the sum it contributes to, potentially causing a dramatic jump in ECE even though the prediction itself barely changed. A good measure of miscalibration should be stable: a small perturbation to $p$ should produce only a small change in the measured error.

### Distance-to-Calibration

Błasiok, Gopalan, Hu, and Nakkiran[^blasiok] proposed a cleaner ground-truth notion: the **distance-to-calibration**, defined as the $\ell_1$ distance from $p^{1:T}$ to the nearest perfectly calibrated predictor on $y^{1:T}$:

$$\mathrm{CalDist}(p^{1:T},\, y^{1:T}) = \min_{q^{1:T} \in \mathcal{C}(y^{1:T})} \left\lVert p^{1:T} - q^{1:T} \right\rVert_1,$$

where $\mathcal{C}(y^{1:T}) = \left\{ q^{1:T} \mid \mathrm{ECE}(q^{1:T}, y^{1:T}) = 0 \right\}$ is the set of all perfectly calibrated predictors on the same label sequence. Unlike ECE, CalDist is continuous by construction — a small perturbation to $p$ can only move it a small distance from the calibrated set.

A useful fact due to Qiao & Valiant (2024) pins down the relationship between the two:

> **Lemma** [Qiao & Valiant '24]: For any $p^{1:T}$ and $y^{1:T}$, $$\mathrm{CalDist}(p^{1:T}, y^{1:T}) \leq \mathrm{ECE}(p^{1:T}, y^{1:T}).$$

So low ECE implies low CalDist, but not vice versa. Since CalDist is a weaker requirement, one might hope that CalDist might be achievable at better rates. Indeed, Qiao & Valiant (2024) showed that $O(\sqrt{T})$ CalDist _is_ achievable. However, their proposed algorithm runs in $2^{2^T}$ time!


### An Elementary $O(\sqrt{T})$ Algorithm

Arunachaleswaran, Collina, Roth, and Shi (SODA 2025)[^arunachaleswaran] give  an _elementary_, _efficient_ algorithm that achieves $O(\sqrt{T})$ CalDist! The key idea in their construction is a _discretization_ of the prediction space due to Gupta and Ramdas (2022)[^gupta].

Fix $m > 0$ and let $\mathcal{B}_m = \{0, 1/m, \ldots, 1\}$, the uniform grid of $m+1$ points over $[0,1]$, with $p_i = i/m$. Define the **look-ahead bias** of a predictor $\tilde{p}$ on prediction value $p$ through round $t$ as

$$\alpha_{\tilde{p}^{1:t}}(p) = \sum_{s=1}^{t} \mathbb{1}_{\{\tilde{p}^s = p\}} \cdot [\tilde{p}^s - y^s].$$

When $\alpha > 0$, the predictor has historically over-predicted on rounds where it output $p$; when it is negative, it has under-predicted.

Suppose there is an algorithm that cheats by accessing delaying its predictions by one turn. At round $t$, the **One-Step-Ahead (OSA)** algorithm [Gupta & Ramdas '22] first observes $y^t$, then identifies two adjacent grid points $p_i, p_{i+1}$ with $\alpha(p_i) \leq 0$ and $\alpha(p_{i+1}) \geq 0$, and predicts whichever of the two is closer to $y^t$. This keeps the bias for every grid point bounded in absolute value by $1$ throughout, giving $\mathrm{ECE}(\tilde{p}^{1:T}, y^{1:T}) \leq m + 1$ by a clean inductive argument.[^osa_proof]

The **Almost-One-Step-Ahead (AOSA)** algorithm removes the cheat. At round $t$, AOSA finds the same bracketing pair $p_i, p_{i+1}$[^ivt] but commits to an _arbitrary_ choice between them as the actual prediction $p^t$, before seeing $y^t$. Only after $y^t$ is revealed does it update an internal shadow sequence $\tilde{p}^t$ (the OSA choice), used purely for bias tracking.

Since $|p_i - p_{i+1}| = 1/m$ (by definition of the grid), the actual prediction $p^t$ and the shadow prediction $\tilde{p}^t$ differ by at most $1/m$ at every round. A triangle inequality then finishes the job:

$$\mathrm{CalDist}(p^{1:T}, y^{1:T}) \leq \underbrace{\left\lVert p^{1:T} - \tilde{p}^{1:T} \right\rVert_1}_{\leq\, T/m} + \underbrace{\mathrm{CalDist}(\tilde{p}^{1:T}, y^{1:T})}_{\leq\, \mathrm{ECE}(\tilde{p}^{1:T}, y^{1:T})\, \leq\, m+1} \leq \frac{T}{m} + m + 1.$$

Setting $m = \sqrt{T}$ balances the two terms and gives the following remarkable result:

> **Theorem** [Arunachaleswaran, Collina, Roth, Shi '25]: AOSA guarantees $\mathrm{CalDist}(p^{1:T}, y^{1:T}) \leq 2\sqrt{T} + 1$ against any adversarial label sequence.

## But Global Calibration Is Blind to Subgroups

At this point, our scout at La Masia has an efficient predictor that achieves near-optimal CalDist. Suppose the auditor runs their global check and the model passes. Does this mean the scout's model is reliable?

Not necessarily. The global check aggregates over _all_ kids the model rated at $70\%$. It says nothing about whether the model is calibrated _within_ specific subgroups. Maybe among kids from smaller academies, those rated at $70\%$ only make it $40\%$ of the time. In other words, it is possible that the model is systematically overconfident for that subgroup, but this is masked by being equally underconfident for kids from larger academis. The global numbers balance out and the model passes the audit, even though it is making systematic errors on identifiable subgroups.

A more demanding auditor would ask: For every identifiable subgroup $S \subseteq \mathcal{X}$ defined by playing position, home region, academy size, or any other attribute, do the kids in $S$ rated at $70\%$ make it roughly $70\%$ of the time? This is the condition of **multicalibration**, introduced by Hébert-Johnson, Kim, Reingold, and Rothblum (2018).[^hkrr]

> **Multicalibration** [HKRR '18]: Given a family of subgroups $\mathcal{C}$, a predictor $f$ is $\mathcal{C}$-multicalibrated if for every $c \in \mathcal{C}$ and every prediction value $v$,
> $$\mathbb{E}_{\mathcal{D}}\left[y \mid f(x) = v,\, c(x) = 1\right] \approx v.$$

Multicalibration strictly strengthens calibration: a globally calibrated predictor can fail badly within subgroups, but a multicalibrated predictor is calibrated on every subgroup in $\mathcal{C}$ simultaneously. The catch is computational since achieving multicalibration from scratch requires solving a learning problem for each subgroup, which compounds rapidly as $|\mathcal{C}|$ grows. Global calibration, by contrast, is cheap: AOSA achieves it online with an algorithm simple enough to state in a paragraph.

---

## Calibration Amplification

This raises a natural question: if global calibration is cheap and multicalibration is expensive, is there something in between that gets us most of the way there at lower cost?

**Multiaccuracy** is a weaker condition than multicalibration. It requires only that predictions are _accurate on average_ within each subgroup, without demanding per-value calibration within the subgroup. Formally, for every $c \in \mathcal{C}$,

$$\mathbb{E}_{\mathcal{D}}\left[y - f(x) \mid c(x) = 1\right] \approx 0.$$

Multiaccuracy is considerably cheaper to achieve than multicalibration, since it only pins down the mean prediction within each subgroup. But on its own, it is also considerably weaker since there are settings where a multiaccurate predictor fails in ways that a multicalibrated one would not.

The surprising finding of Casacuberta, Gopalan, Kanade, and Reingold (2025)[^casacuberta] is that combining global calibration with multiaccuracy (a notion they call **calibrated multiaccuracy**) substantially amplifies the power of multiaccuracy alone, recovering most of the implications previously thought to require full multicalibration while remaining computationally cheaper.

The intuition is that the two properties are doing complementary jobs. Multiaccuracy corrects for group-level biases in the mean, but places no constraint on the overall scale of predictions, which is handled by global calibration that ensures predictions are not systematically shifted up or down in aggregate. To understand why this combination is powerful, we note that both multiaccuracy and multicalibration can be achieved via a boosting-style algorithm that uses a **weak agnostic learner** for $\mathcal{C}$ as its primitive: an oracle that finds, for any reweighted distribution, a hypothesis in $\mathcal{C}$ with non-trivial correlation with the labels. Multicalibration requires strictly more boosting rounds and produces more complex predictors than multiaccuracy. Calibrated multiaccuracy sits in between: it requires the same number of oracle calls as multiaccuracy, but the addition of global calibration is enough to unlock significantly stronger guarantees.

Concretely, calibrated multiaccuracy recovers two families of implications previously thought to require full multicalibration. The first is **omniprediction** [Gopalan et al., ITCS '22][^omni]: a single predictor $f$ that can be efficiently post-processed to minimize any loss function in a broad class (all decomposable convex losses satisfying mild Lipschitz conditions), simultaneously competing with the best hypothesis in $\mathcal{C}$ for each loss. Calibrated multiaccuracy suffices for omniprediction via the Loss OI framework [Gopalan et al., ITCS '23][^lossoi], whereas full multicalibration was previously required for the stronger swap omniprediction guarantee. The second is **hardcore distributions**: given a function $f$ that is hard for $\mathcal{C}$ to predict, one can extract a subset of inputs (a hardcore distribution) on which $f$ is maximally hard. Multiaccuracy alone yields hardcore distributions of density only half the optimal; a weighted version of calibrated multiaccuracy achieves optimal density [CGKR '25][^casacuberta].

> **What does calibrated multiaccuracy _not_ recover?** Multicalibration implies **swap agnostic learning** and the strongest known form of the Impagliazzo Hardcore Lemma (IHCL$^{++}$) [Casacuberta, Dwork, Vadhan '25][^cdv]. These require the full per-value, per-subgroup calibration condition and cannot be recovered from calibrated multiaccuracy alone. Hence, multicalibration strictly dominates calibrated multiaccuracy, which strictly dominates multiaccuracy in turn.

---

## Towards a Sextuple via Calibration

Barcelona's hunt for a sixth Champions League title was, in short, a calibration
problem all along.

---

# Footnotes

[^dawid]: A. P. Dawid. The well-calibrated Bayesian. _Journal of the American Statistical Association_, 1982.

[^almost]: In other words, $f$ is perfectly calibrated if $\mathbb{E}_{\mathcal{D}}\left[y \mid f(x)\right] = f(x)$ almost surely. If $f$ is a discrete predictor, $f$ is perfectly calibrated if $\forall v \in \operatorname{supp}(f(X))$, $\mathbb{E}[y \mid f(X) = v] = v.$

[^gopalan]: P. Gopalan and S. Haghtalab. Calibration through the Lens of Indistinguishability. arXiv:2509.02279, 2025. The indistinguishability framing of calibration in this section draws on their survey.

[^ece]: The ECE defined here is the _sequential_ ECE appropriate for the online prediction setting. In the statistical learning setting it is usually defined as an integral over prediction values rather than a sum.

[^blasiok]: J. Blasiok, P. Gopalan, L. Hu, and P. Nakkiran. When does Optimizing a Proper Loss Yield Calibration? NeurIPS, 2023.

[^gupta]: C. Gupta and A. Ramdas. Top-label calibration and multiclass-to-binary reductions. ICLR, 2022.

[^ivt]: More precisely, the bias function $\alpha_{\tilde{p}^{1:t-1}}(\cdot)$ is defined on the discrete grid $\mathcal{B}_m$, and a discrete IVT argument — noting that consecutive grid points can differ in bias by at most $1$ — guarantees the existence of such a bracketing pair.

[^arunachaleswaran]: E. Arunachaleswaran, N. Collina, A. Roth, and M. Shi. An Elementary Predictor Obtaining $2\sqrt{T}+1$ Distance-to-Calibration. _SODA_, 2025.

[^osa_proof]: The inductive argument: at round $t_1$, OSA produces $p_i$ upon seeing $y^{t_1}$, so $|\alpha_{\tilde{p}^{1:t_1}}(p_i)| = |p_i - y^{t_1}| \leq 1$. Inductively, if $|\alpha_{\tilde{p}^{1:t-1}}(p_i)| \leq 1$ and the look-ahead bias is $\leq 0$, OSA chooses $p_i$ again when $p_i - y^t \geq 0$ to balance the bias, and switches otherwise. In either case $|\alpha_{\tilde{p}^{1:t}}(p_i)| \leq \max(|\alpha_{\tilde{p}^{1:t-1}}(p_i)|,\, |p_i - y^t|) \leq 1$. Summing over $\mathcal{B}_m$ gives $\mathrm{ECE} \leq m+1$.

[^hkrr]: U. Hébert-Johnson, M. P. Kim, O. Reingold, and G. N. Rothblum. Multicalibration: Calibration for the (Computationally-Identifiable) Masses. _ICML_, 2018.

[^casacuberta]: S. Casacuberta, P. Gopalan, V. Kanade, and O. Reingold. How Global Calibration Strengthens Multiaccuracy. arXiv:2504.15206, _FOCS_ 2025.

[^adversary]: This is sometimes called an _oblivious_ adversary when the label sequence $y^{1:T}$ is fixed in advance, and an _adaptive_ adversary when $y^t$ can depend on $p^1, \ldots, p^{t-1}$. The AOSA result holds against the adaptive adversary, which is the stronger guarantee.

[^omni]: P. Gopalan, A. T. Kalai, O. Reingold, V. Sharan, and U. Wieder.
Omnipredictors. _ITCS_, 2022.

[^lossoi]: P. Gopalan, L. Hu, M. P. Kim, O. Reingold, and U. Wieder. Loss
Minimization through the Lens of Outcome Indistinguishability. _ITCS_, 2023.

[^cdv]: S. Casacuberta, C. Dwork, and S. Vadhan. Complexity-Theoretic Implications of Multicalibration. _STOC_, 2024.

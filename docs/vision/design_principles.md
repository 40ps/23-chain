# 23-chain Design Principles

**Title:** Design Principles

**Version:** 0.2.1

**Status:** Accepted Draft

**Authority:** Normative

**Owner:** Wolfgang Lohmann

**Maintainer:** 23-chain Project

**License:** MIT

**Depends On:** P1, V1, Proof Levels, Computation Models

---

# 1. Purpose

This document defines a small set of **cross-cutting design principles** for 23-chain. The principles are intended to guide how the project evaluates research propositions, considers alternative mechanisms, derives requirements, makes architectural choices, designs experiments, and evolves project knowledge.

Their distinctive role is to turn the existing project's research-first position and semantic distinctions into **criteria for evaluating future choices**. They do not replace the documents that define those concepts or make any technical result true by declaration.

In particular:

- **Project Vision (V1)** defines the project's purpose, priorities, and scope.
- **Proof Levels** defines assurance categories and their separation from trust assumptions.
- **Computation Models** defines semantic terms and conditions for computation, execution, realization, and enforcement claims.
- **Research Questions** defines what is to be investigated and what evidence the inquiry seeks.
- **Design Principles** guides *how candidate approaches and decisions are assessed* across those areas.

A principle is not a research result, a system requirement, a concrete architectural decision, or an implementation prescription. Its normative force applies to the **quality and discipline of reasoning and decisions**, not to the outcome of an open research question.

# 2. Scope and Interpretation

The project remains **research-first**, with Bitcoin SV (BSV) as the primary protocol and experimental environment. The project does not assume in advance that Bitcoin/BSV can fully realize a specified machine, provide a particular proof level, or outperform alternative systems.

These principles apply proportionately to:

- research designs, hypotheses, and results;
- computation and state representations;
- proposed Bitcoin mechanisms and experiments;
- assurance and trust analyses;
- derivation of requirements and architecture;
- technology comparisons and knowledge evolution.

Not every investigation must deliver a production-ready implementation, a formal impossibility proof, or the strongest proof level. A properly qualified negative, partial, bounded, or inconclusive result remains valid research.

The canonical definitions in P1, V1, Proof Levels, Computation Models, and applicable machine specifications remain authoritative. If a principle is read as changing one of those definitions, the proper action is to clarify the principle or explicitly initiate a controlled change at the conceptual source—not to silently override an existing definition.

# 3. Design Principles

## DP-1 — Semantic Fidelity

**Principle:** Evaluate a proposed computational realization against the independently specified semantics of the computation model and, where relevant, the particular machine and computation instance. Do not redefine the target computation to match a convenient representation or implementation mechanism.

**Rationale:** A mechanism can successfully record, demonstrate, or validate a narrow aspect of an execution while failing to preserve the computation it claims to realize.

**Application:**

- Identify the relevant model, machine, instance, and computational state before making realization claims.
- Explain how any encoding, representation, or transition mechanism preserves the required semantics, including relevant state completeness and transition correctness.
- State whether a bound is inherent to the specified model or introduced by the proposed construction.
- Distinguish evidence for a particular execution from evidence for a bounded machine, complete machine, or general model realization.

**Boundary:** This principle does not require that every experiment attempt Complete Machine Realization. It requires an honest description of *which* semantics and realization scope the experiment supports. Specific equivalence criteria and realization definitions remain those of **Computation Models** and the relevant machine specification.

## DP-2 — Claim Precision and Evidence Proportionality

**Principle:** Formulate each material technical claim at no greater strength than is supported by its stated assumptions and available evidence.

**Rationale:** Terms such as *executed*, *verified*, *enforced*, *universal*, and *complete* refer to different properties. Confusing them can make a finite demonstration appear to prove a general capability.

**Application:**

- Specify the claim's object: property, transition, execution prefix, computation instance, machine, or computation model.
- State the protocol environment, relevant initial conditions, resource limits, and conditions under which the claim holds.
- Describe the evidence type and its reach: formal argument, construction, reproducible experiment, counterexample, or limitation analysis.
- Clearly distinguish demonstrated, conditional, hypothesized, inconclusive, and not-yet-investigated propositions.
- Apply the established Proof Levels framework property by property; do not use L0–L4 as a general ranking of system quality.
- Preserve negative findings and limitations rather than presenting the absence of a known solution as a proved impossibility.

**Boundary:** This principle does not prescribe a single research method or evidence format. It does not imply that a higher proof level is always preferable or that a single positive test establishes complete realization.

## DP-3 — Explicit Trust Boundaries

**Principle:** Identify the actors, components, information sources, cryptographic assumptions, and protocol conditions on which each material computation or assurance claim depends.

**Rationale:** The level at which a property is recorded, replayed, verified, or enforced does not by itself determine the trust required for the overall claim.

**Application:**

- Analyze proof level and trust model as separate dimensions.
- Distinguish dependencies necessary for **safety/correctness** from those necessary for **liveness/progression**.
- Identify what is externally supplied, what is independently reproducible, what is verified, and what remains trusted.
- Describe data-availability and verifier assumptions where material.
- State the scope of any enforced property rather than presenting the surrounding system as unconditionally trustless.

**Boundary:** Dependence on an external actor is not automatically a flaw or a disqualification. The relevant question is *which responsibility or property* depends on that actor, and whether this changes the advertised computation claim.

## DP-4 — Computational Causality and Role Separation

**Principle:** When assessing a computation-execution claim, distinguish the parties that propose or advance transactions from the mechanism that determines the computationally valid successor.

**Rationale:** Transaction progression, representation, verification, and computational determination can occur in different places. Merely recording a proposed successor or verifying a different predicate does not necessarily execute the original computation model.

**Application:**

- Identify separately who constructs/proposes a candidate, who advances the transaction sequence, and what determines the correct successor under the specified transition semantics.
- For a claimed **Full Computation Execution**, apply the complete-semantic criteria in **Computation Models**; do not substitute generic validation of a candidate.
- In a **Candidate-Output Full Computation Execution** claim, require independent evaluation of the **complete transition semantics** by Bitcoin and acceptance only of a candidate equivalent to the correct successor state/output under those semantics.
- Distinguish a verifier evaluating evidence about a transition from Bitcoin executing the original transition relation itself.
- Distinguish proof or enforcement of a property from Full Computation Enforcement of a complete specified transition.

**Boundary:** This principle does **not** require all constructions to provide Full Computation Execution. Recording, replay, verification, property-specific enforcement, and external execution remain legitimate research subjects when classified correctly. External transaction construction does not by itself prevent Bitcoin from being the source of computational determination.

## DP-5 — Evidence Before Architecture

**Principle:** Ground binding requirements, architectural commitments, and implementation decisions in explicit, proportionate research evidence and articulated rationale rather than allowing an existing prototype or preferred mechanism to predetermine research conclusions. Exploratory implementations may precede such evidence when they are undertaken to produce or test it.

**Rationale:** 23-chain follows the knowledge progression from Philosophy and Vision through Research, Requirements, Architecture, Implementation, and Validation. Demonstrations serve the inquiry rather than setting its limits.

**Application:**

- Keep research hypotheses separate from accepted requirements or architectural decisions.
- Permit exploratory prototypes and implementation experiments to generate evidence or test hypotheses, without treating their design choices as binding requirements or architecture.
- Prefer experiments that can distinguish competing explanations or expose limitations, not only illustrate expected success.
- Keep significant assumptions and decision rationale traceable to the relevant conceptual documents.
- When knowledge changes, initiate clarification at its conceptual origin and review downstream dependencies.
- Treat the historical prototype as evidence and provenance, not as automatic current architecture.

**Boundary:** This is **not** a rigid prohibition on building before research is complete and not a mandatory waterfall sequence. Exploratory prototypes, implementation experiments, and rapid iteration are legitimate means of inquiry. What requires adequate evidence and explicit rationale is the **promotion** of their assumptions or design choices into binding requirements or architectural commitments. The principle does not independently define governance procedures.

## DP-6 — Technology-Neutral Evaluation

**Principle:** Assess proposed techniques and platforms by explicit, comparable criteria rather than by presumed superiority of a favored system, while preserving the project's established BSV-first research focus.

**Rationale:** Different technologies may realize, verify, or enforce different computational properties under different assumptions. A useful comparison must respect these differences rather than merely apply the same labels.

**Application:**

- Preserve the same underlying question when comparing technologies, but map its terms to each system's actual semantics and mechanisms.
- Record differences in state, computation, verification, enforcement, protocol rules, resources, and trust assumptions.
- Keep claims scoped to the specific protocol environment or implementation studied.
- Allow evidence to favor an alternative system or mechanism for a particular objective.
- Distinguish reusable **questions and evaluation concepts** from nontransferable **technical results**.

**Boundary:** This principle does not authorize research programs on Ethereum, BTC with BitVM mechanisms, or other systems. Such comparisons remain future, separately scoped decisions. Technology neutrality concerns evaluation, not an obligation to investigate every technology equally or abandon BSV as the primary environment.

# 4. Using the Principles

These principles provide **evaluation criteria**. The following illustrative review questions are **optional guidance**, not a mandatory new checklist or governance workflow. For a future research proposal or candidate architecture, reviewers can ask:

| Principle | Illustrative review question |
|---|---|
| DP-1 Semantic Fidelity | Which computation semantics and realization scope are preserved, and where do bounds arise? |
| DP-2 Claim Precision | What exactly is claimed, under what assumptions, and what does the evidence establish? |
| DP-3 Trust Boundaries | Which external actors and assumptions matter for correctness versus progression? |
| DP-4 Computational Causality | What determines the computational successor, as distinct from proposing or validating a candidate? |
| DP-5 Evidence Before Architecture | Which accepted concepts or research results justify this choice, and what remains a hypothesis? |
| DP-6 Technology-Neutral Evaluation | Are comparisons made on the same question with each technology's distinct semantics and constraints stated? |

A tension between principles must be identified and reasoned about in context; the order DP-1 through DP-6 is not a priority or scoring order. The document does not introduce a quantitative quality metric.

# 5. Relationship to the First Concrete Investigation

The initial concrete case is the **Wolfram (2,3) Machine Specification**, machine 596440, under the existing project's Computation Models framework. It illustrates rather than defines the general principles.

For example, a proposal to realize a Wolfram machine step on Bitcoin would need to consider the machine's full specified state and transition semantics, its representation, the source of the valid successor, the proof level of each asserted property, its trust and protocol assumptions, and the exact scope of the resulting claim.

The Wolfram specification retains authority over its own machine identity, states, tape semantics, transition rules, and the qualifications associated with Alex Smith's universality construction. Nothing in this document modifies that machine specification. No conclusion is drawn here that Bitcoin/BSV completely realizes Wolfram 596440 or is Turing complete.

# 6. Explicit Non-Claims and Non-Decisions

These principles do **not**, by themselves, establish that Bitcoin/BSV:

- completely realizes Wolfram 596440 or another machine;
- provides Full Computation Execution, Full Computation Enforcement, or Bitcoin-Driven Machine Evolution;
- realizes arbitrary Turing machines or the general Turing-machine model;
- is Turing complete;
- supports a particular mechanism in any given protocol era.

Nor do they:

- choose a Script, UTXO, state-encoding, covenant, or verification architecture;
- set implementation requirements, benchmarks, or resource budgets;
- establish a new proof level or change definitions in Proof Levels or Computation Models;
- make the research-results worksheet in Research Questions a mandatory process;
- promote any historical prototype, unapproved requirement, or provisional idea to current architecture;
- mandate a cross-chain comparison program.

# 7. Dependencies and Catalog Placement

**Authoritative conceptual foundations and direct dependencies:**

- P1 — Project Index: knowledge-first document organization, conceptual origin, evolution and reading order.
- V1 — Project Vision: fundamental inquiry, research-first priorities, Bitcoin SV focus, comparative perspective, and prototype boundary.
- Proof Levels: assurance categories, mixed-level properties, and separation from trust models.
- Computation Models: semantic preservation, computational determination, realization scope, and limits of generalization.

**Related canonical references (not direct dependencies):**

- Research Questions v0.3.0: the six current research areas and prospective cross-technology reuse. Its `Accepted Draft / Normative` classification is unaffected by this document.
- Wolfram (2,3) Machine Specification: the first concrete machine-specific investigation case; not a direct dependency of the general Design Principles framework.

**Catalog placement:** `docs/vision/design_principles.md`, with status `Accepted Draft`, authority `Normative`, and direct dependencies **P1, V1, Proof Levels, Computation Models**. No Document ID is assigned. These principles are normative **evaluation and decision-discipline criteria**, not technical results, requirements, architectural commitments, or new governance procedures.

**Conceptual layer versus repository directory:** P1 refers to Design Principles as an example in the **Philosophy** knowledge layer; P2 places this document under `docs/vision/`. The former describes its *conceptual role*, while the latter specifies its *repository location*. This distinction does not by itself alter the project's knowledge hierarchy or require a P1 edit.

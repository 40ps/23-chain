# 23-chain Proof Levels

**Title:** Proof Levels  
**Version:** 0.1.0  
**Status:** Accepted Draft  
**Authority:** Normative  
**Owner:** Wolfgang Lohmann  
**Maintainer:** 23-chain Project  
**License:** MIT  
**Depends On:** P1, V1

---

# Purpose

This document defines a conceptual framework for describing the assurance associated with computation claims in 23-chain.

The framework distinguishes between computation that is local, recorded, replayable, verified, or enforced.

Its purpose is to make statements about computation claims precise. In particular, it prevents blockchain recording, independent replay, technical verification, and Bitcoin enforcement from being treated as equivalent forms of assurance.

The term **Proof Levels** refers to these different forms of assurance. It does not imply that every level constitutes a mathematical or cryptographic proof.

Proof levels describe how a specific claim or property is supported. They do not define the computation itself and do not by themselves define the trust model of a system.

---

# Computation Claims and Assurance

23-chain studies computation claims of the general form:

> A computation correctly transformed one state into another according to a specified computation model.

A computation claim may contain multiple properties.

For example, separate properties may concern:

- the identity of an input state;
- the identity of an output state;
- the relationship between input and output state;
- the application of a transition rule;
- the ordering of transitions;
- commitments to state or computation data;
- authorization of a transition.

Different properties of the same computation claim may receive different forms of assurance.

Proof levels therefore apply to **specific claims or properties**, not automatically to an entire application, protocol, transaction chain, or system.

---

# Proof Level and Trust Model

A proof level describes the mechanism by which a specified claim or property is recorded, replayed, verified, or enforced.

A trust model describes the assumptions that remain necessary for accepting the claim.

These are related but distinct dimensions.

A higher proof level does not automatically imply:

- less overall trust;
- greater security;
- greater completeness;
- lower verification cost;
- better system design.

Any analysis using a proof level should therefore also identify the relevant trust assumptions.

These may include assumptions about actors, software, data availability, cryptographic primitives, protocol semantics, external computation, or the relationship between an enforced property and the broader computation claim.

---

# L0 — Local

At L0, the relevant computation or claim exists locally and no blockchain record is used to provide assurance for it.

The computation may be executed, inspected, tested, or reproduced locally.

Bitcoin provides no relevant evidence for the classified property.

L0 does not imply that the computation is incorrect or unverifiable. It means only that blockchain-based recording, verification, or enforcement is not part of the assurance mechanism being classified.

---

# L1 — Recorded

At L1, information relevant to the computation claim is recorded or committed on the blockchain.

The blockchain may provide evidence concerning properties such as:

- existence;
- ordering;
- inclusion of data or commitments;
- association between transactions or states.

Recording does not by itself establish that the claimed computation was executed correctly.

In particular:

> **Recorded does not mean verified.**

A transaction containing a claimed state, result, hash, or other commitment may establish that the information was recorded without establishing that the transition producing it was valid according to the computation model.

---

# L2 — Replayable

At L2, the available evidence is sufficient for an independent verifier to reconstruct or re-execute the relevant computation and compare the result with the claim.

The verifier therefore does not need to trust the claimant's assertion that the computation was performed correctly.

Verification at L2 is based on replay of the relevant computation semantics.

Conceptually, L2 answers:

> Is enough information available for an independent party to perform the relevant computation again and check the claim?

The replay mechanism, required data, computation model, and remaining trust assumptions should be stated explicitly.

Replayability does not imply that Bitcoin itself verifies or enforces the computation.

---

# L3 — Verified

At L3, a specified property is evaluated by an explicit verification mechanism whose classification does not depend solely on re-executing the computation as the L2 replay procedure.

The verifier evaluates an explicit acceptance condition rather than merely accepting the claimant's execution.

Conceptually, L3 answers:

> Given this claim and its evidence, does the defined verification mechanism accept the specified property?

L3 does not require Bitcoin itself to perform the verification.

It also does not require verification to be computationally cheaper than replay.

A construction does not become L3 merely because an L2 replay implementation returns a boolean verification result.

L2 replay may itself verify a result in the ordinary sense of the word. The term **Verified** at L3 is therefore a taxonomy label with the more specific meaning defined in this document.

Whether a more precise long-term name for L3 is desirable may be evaluated after practical use of the framework.

---

# L4 — Enforced

At L4, validity of a specified property of the computation claim is a necessary condition for the corresponding Bitcoin state transition under the enforcement mechanism being analyzed.

Conceptually, L4 answers:

> Must this property hold for the corresponding Bitcoin state transition to satisfy the relevant enforcement conditions?

An L4 classification MUST state exactly which property is enforced.

Enforcement of one property does not imply enforcement of the complete computation claim.

For example, a mechanism may enforce a relationship between commitments, authorization conditions, or another property while leaving some computation semantics to external execution or verification.

L4 therefore ranges from enforcement of specific properties to the possibility of enforcement of a complete specified computation transition.

The latter is of particular research interest to 23-chain, but whether a computation is completely represented or executed cannot be determined by the proof-level taxonomy alone. That requires a precise definition of the relevant computation model and its semantics.

L4 does not automatically mean trustless.

Trust assumptions may remain concerning protocol semantics, cryptographic primitives, software, data availability, or whether the enforced property adequately represents the broader computation claim.

---

# Full Computation Enforcement

Full Computation Enforcement is a particularly strong and important case within L4. It is not a separate proof level.

It refers to a construction in which Bitcoin enforcement covers the complete specified transition semantics of the computation model for the classified transition.

This concept does not require that an entire multi-step computation occur inside a single transaction.

For a state machine, for example, a computation may progress across multiple Bitcoin state transitions while each individual model transition is fully executed and enforced according to the specified semantics.

Whether a construction qualifies as Full Computation Enforcement depends on the definition of the computation model.

The proof-level framework therefore does not independently decide whether a Bitcoin construction preserves the complete semantics of a model.

That responsibility belongs to the project's computation-model specification and subsequent research.

---

# Levels Are Not a Quality Ranking

The notation L0 through L4 provides a useful progression of assurance mechanisms, but it must not be interpreted as a universal quality ranking.

A system classified at L4 for a narrow property may provide less useful assurance about the overall computation than a system that provides comprehensive replayability at L2.

Likewise, a verified property at L3 may depend on assumptions that are irrelevant to a different L2 construction.

Comparisons should therefore state:

1. the computation claim being analyzed;
2. the specific property being classified;
3. the applicable proof level;
4. the mechanism providing that level;
5. the remaining trust assumptions.

Only then can different constructions be meaningfully compared.

---

# Mixed-Level Systems

A single system or experiment may contain properties at multiple proof levels.

For example, one property may be recorded, another independently replayable, and another enforced by Bitcoin.

It is therefore generally insufficient to describe an entire system simply as "L2", "L3", or "L4" without identifying the classified properties.

A system-level summary may be useful for communication, but it must not obscure materially different assurance mechanisms within the system.

---

# Relationship to Computation Models

Proof levels do not determine what constitutes a complete computation.

A computation-model specification must define the relevant semantics, including what constitutes state and what makes a state transition valid.

Only against such a specification can research determine whether Bitcoin:

- represents the required state;
- executes the required transition semantics;
- provides evidence sufficient for replay;
- verifies specified properties;
- enforces specified properties;
- or enforces the complete specified computation transition.

A failure to find a construction providing complete realization does not by itself demonstrate that complete realization is impossible.

Claims of limitation or impossibility require evidence appropriate to their scope and strength.

---

# Relationship to Research

The proof-level framework provides terminology for subsequent research; it does not predetermine research results.

23-chain may investigate how proof levels vary across:

- computation models;
- Bitcoin protocol capabilities;
- transaction and Script constructions;
- verification mechanisms;
- enforcement mechanisms;
- trust assumptions.

Both positive and negative results are valid.

A computation model may prove fully realizable under stated Bitcoin conditions, partially realizable, or subject to demonstrated limitations.

Such conclusions belong to the relevant research artifacts rather than to this taxonomy.

---

# Scope Boundaries

This document does not:

- define a specific computation model;
- determine whether Wolfram (2,3) or another model can be fully realized by Bitcoin;
- define concrete Bitcoin Script constructions;
- classify the historical prototype;
- compare Bitcoin protocol eras;
- define quantitative security metrics;
- claim that higher proof levels are always preferable;
- claim that L4 eliminates all trust assumptions.

Those questions belong to computation-model specifications, research artifacts, prototype analysis, and subsequent project work.

---

# Evolution

The L0–L4 terminology originates from the project's early conceptual work and is retained because it provides a useful initial framework.

The taxonomy may be refined if practical application exposes ambiguity or missing distinctions.

In particular, the long-term terminology for L3 and the internal distinction between property enforcement and Full Computation Enforcement may be revisited if research demonstrates that a more precise classification provides material value.

Changes should preserve the underlying distinctions between recording, replay, verification, enforcement, and trust rather than optimizing terminology in isolation.

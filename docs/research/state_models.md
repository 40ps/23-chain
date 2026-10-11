# 23-chain — State Models

**Title:** State Models

**Version:** 0.2.1

**Status:** Accepted Draft

**Authority:** Normative

**Owner:** Wolfgang Lohmann

**Maintainer:** 23-chain Project

**License:** MIT

**Depends On:** P1, V1, Computation Models, Research Questions

---

## 1. Purpose

Investigate the relationships among **semantic computational state**, **representations and encodings**, **serialization**, **state commitments**, **data and witness availability**, **state-transition continuity**, and **the state recorded or enforced by a concrete host system**.

The purpose of this document is to establish research questions, analysis dimensions, and evidence boundaries. It does **not** define a universal serialization, a Bitcoin state architecture, a UTXO arrangement, a commitment format, or a selected implementation.

The research scope is **computation-model-independent** at the conceptual level. Research about a concrete encoding or host mechanism must identify the applicable computation model, machine or instance and target environment.

**Bitcoin/BSV is the first host-system context**, consistent with the accepted project scope. Potential later examination of other technologies requires separate decisions and semantic mapping; no such workstream is opened here.

## 2. Foundation and authority boundary

The following concepts are **already governed by existing accepted foundation documents** and are *not newly defined by this document*:

- **Computation Models:** computational state contains the information needed for subsequent evolution; completeness is semantic, not structural; encoding may differ from model state; finite representation does not necessarily impose a fixed semantic bound; semantic preservation and realization scope must be stated explicitly.
- **Proof Levels:** recording, replaying, verifying, and enforcing a stated property are distinct; the proof level is property-specific and separate from the trust model.
- **Wolfram (2,3) Machine Specification:** the first example machine has computational state \(s=(q,h,\tau)\), with \(q\in\{1,2\}\), \(h\in\mathbb Z\), and \(\tau:\mathbb Z\to\{0,1,2\}\); its tape is semantically bi-infinite, and its complete Machine Step includes reading, writing, moving, and updating machine state.
- **Research Questions:** particularly RQ-1 (independent computational determination), RQ-2 (realization scope and state semantics), RQ-3 (proof and enforcement), RQ-4 (trust/causality), and RQ-6 (protocol/resources).
- **Design Principles:** DP-1 semantic fidelity, DP-2 evidence-proportional claims, DP-3 trust boundaries, DP-4 computational causality, DP-5 evidence before architecture, and DP-6 technology-neutral evaluation.

**Direct dependencies:** P1, V1, Computation Models and Research Questions. Proof Levels and Design Principles are relevant conceptual references; the Wolfram specification is used as the first case-specific machine reference. Their relevance does not automatically make them direct document dependencies.

The document defines a research framework; its normative status applies to the framing and limitations of the inquiry, not to unproven conclusions or any particular state encoding.

## 3. Analytical objects to keep distinct

The following is an **investigative vocabulary**, not an attempt to replace canonical definitions or establish a new mandatory taxonomy.

| Object / aspect | Research role | Critical boundary |
|---|---|---|
| **Semantic computational state** | What information the computation semantics require at a particular point | Defined by the computation model/machine, not by the chosen host encoding |
| **Computation instance / initial configuration** | Which admissible initial conditions identify the investigated run | One instance is not the entire machine domain |
| **State representation / encoding** | How semantically relevant information is mapped to an artifact or host representation | Encoding need not resemble the abstract state structurally |
| **Serialization** | How a representation is turned into bytes or another transport/storage form | A serialization format is not itself the semantic state definition |
| **Commitment / reference** | How a representation or claim about it is bound to an identifier or digest | A commitment alone neither provides data nor proves transition correctness |
| **Available state data / witness** | What information the mechanism can access to determine or verify a transition | A referenced but unavailable datum cannot simply be assumed accessible |
| **Host-system/ledger state** | Which information the underlying system maintains, validates, or accepts | Host-system state and abstract computational state need not be identical |
| **State transition relation** | How validity of an abstract successor corresponds to a represented successor | Storing consecutive snapshots is not itself independent computation execution |

**Open research question:** Which of these aspects belong in a single generalized formal state-model framework, and which are better treated as properties of a concrete representation or host-system mechanism? In particular, a machine-defined semantic state, a representation that denotes it, and the host-system information required to evaluate a transition must not be treated as interchangeable objects.

## 4. Research dimensions and questions

The identifiers below are **internal research-question labels**, not formal Document IDs or a new computation-model taxonomy.

### SM-RQ-1 — Semantic State and State Completeness

**Question:** Given a specific computation model, machine and instance, what information is semantically necessary to determine a valid successor, and when does a representation contain or unambiguously determine that information?

Points of investigation:

- Distinguish a complete semantic state from a partial observation, projection, snapshot, digest, or proof about that state.
- Identify required state variables and their dependencies without introducing host-specific fields as abstract requirements.
- Define the admissible state domain and any assumptions concerning unknown, implicit, external, or default-valued portions.
- Clarify what must be available to the *determining* mechanism versus what may be independently reconstructed or supplied as a witness.

**Non-claim:** A compact digest or a storage location does not automatically constitute a complete or usable computational state.

### SM-RQ-2 — Encoding, Decoding, and Semantic Equivalence

**Question:** Under which conditions does an encoding preserve the intended semantic state and the transition behavior relevant to a stated realization claim?

Points of investigation:

- Define an applicable relation between abstract states and encoded states **for an explicitly identified admissible state domain**; determine whether unique decoding, observational equivalence, or another explicitly justified criterion is needed for the claimed scope.
- Examine canonical versus noncanonical encodings, multiple representations of the same state, and potential ambiguity.
- Separate formal encoding/decoding correctness from byte-level serialization compatibility.
- Analyze how a representation change or reserialization can be demonstrated not to change computation semantics.

**Schematic research relation (not an established Bitcoin result or new axiom):** For a specified admissible state domain, encoding and equivalence relation, investigate under which conditions a host transition would preserve

\[
T_B(E(s)) \equiv E(T_M(s)).
\]

This relation already occurs conceptually in **Computation Models**. Here the research concerns its encoding-side assumptions, not a redefinition of Full Computation Execution. The meaning and domain of \(T_B\), the admissible states, and the equivalence \(\equiv\) must be specified for each concrete realization being investigated. No such Bitcoin transition mapping, equivalence, or semantic preservation is established by stating this relation.

**Non-claim:** Bytewise equality, injectivity, or one uniquely mandated format is not universally established as necessary; any such condition would have to follow from a specifically defined claim.

### SM-RQ-3 — Finite, Sparse, and Unbounded-State Representations

**Question:** When can a finite or sparse representation describe a particular valid state of a model with potentially unbounded semantic state growth without silently imposing a new computational bound?

Points of investigation:

- Conditions under which absent entries have an unambiguous, instance-defined meaning. Distinguish **all abstractly admissible configurations** from a narrower **effectively describable or reachable instance class**; do not assume every bi-infinite tape function admits a finite description.
- Dynamic expansion, previously unused positions, negative indices, and changes of representational extent.
- Difference between bounded resources **for one realized transition** and fixed restrictions on the allowable semantic state space or future transitions.
- Evidence needed for one demonstrated execution versus bounded, complete-machine, or model realization claims.

**Non-claim:** An arbitrary configuration over an infinite domain is automatically finitely encodable, or a finite demonstration proves indefinite capacity.

### SM-RQ-4 — Commitments, Availability, and Proof/Trust Boundaries

**Question:** What do stored data, commitments, witnesses, and validation predicates actually establish about state identity, completeness, availability and successor correctness?

Points of investigation:

- Binding/reference properties versus actual data availability and interpretability.
- Which state fragments must be available for reconstructing, independently evaluating, verifying, or enforcing a claimed transition. Distinguish a cryptographically binding reference from a mechanism that can actually retrieve and interpret the committed data.
- Whether external providers are required for safety/correctness, liveness/progression, availability, or some combination.
- Property-specific Proof Level versus Trust Model, including failure and withholding cases.

**Non-claim:** A valid commitment, witness check, or verification computation necessarily means Bitcoin executed the original computation model.

### SM-RQ-5 — Transition Continuity, Identity, and Causal Locus

**Question:** How can successive represented states be linked to one another and to the applicable transition semantics without treating ledger ordering or external proposals as computational determination?

Points of investigation:

- Identify a claimed predecessor, successor, instance identity and applicability of transition semantics. A continuity marker or state commitment identifies an asserted relation but does not alone establish its semantic correctness.
- Assess whether a represented successor can be substituted, replayed in an incompatible context, or attached to an incorrect predecessor.
- Distinguish transition validity, lineage/continuity, ordering, and external progression.
- Distinguish Derived-Output Execution, Candidate-Output Full Computation Execution, and verification of evidence about externally computed successors.

**Critical boundary:** For Candidate-Output **Full Computation Execution**, Bitcoin must **independently evaluate the complete transition semantics** and accept an external candidate only if equivalent to the correct successor state/output. A partial or generic candidate check cannot substitute for that criterion.

### SM-RQ-6 — Host-System Mapping, Resources, and Protocol Scope

**Question:** Which constraints arise when translating an abstract state and its transition into a particular host system, and how do those constraints affect the supported semantic claim?

Points of investigation:

- Possible mappings to Bitcoin/BSV transaction and UTXO data, Script-visible information and off-chain witnesses **without selecting any one mapping**.
- Available state, data size, transaction validation cost, storage/retention, growth, and economic implications.
- Protocol-era assumptions and consensus/policy distinctions where relevant.
- Difference between a bounded engineering demonstration and a semantics-preserving realization over the full claimed domain.

**Non-claim:** Any proposed Bitcoin/UTXO encoding has already been found feasible, complete, efficient or universally transferable.

## 5. First concrete investigation — Wolfram TM 596440

This section **uses** rather than changes the accepted Wolfram Machine Specification.

The abstract state is:

\[
s=(q,h,\tau),\qquad q\in\{1,2\},\ h\in\mathbb Z,\ \tau:\mathbb Z\rightarrow\{0,1,2\}.
\]

The transition reads \(\tau(h)\), applies the machine's unique rule, writes at the previous head position, moves by \(-1\) or \(+1\), and enters the specified next internal state. All other tape cells remain unchanged. No intrinsic halt is specified.

**Initial case questions:**

1. What assumptions about \(\tau_0\) belong to a chosen computation instance? Can a finite description determine the complete initial tape under those assumptions?
2. How can a candidate encoding represent \(q\), an unbounded integer head coordinate \(h\), and the relevant contents of \(\tau\) without selecting a bounded head/tape domain by accident?
3. If unrepresented cells have a default value, **what instance-specific assumption licenses that value?** Symbol `0` is not intrinsically a privileged blank in the machine transition rules.
4. What data must a mechanism access to derive/independently evaluate the complete next \((q',h',\tau')\), rather than just computing a transition-table tuple?
5. How would a representation establish that tape cells not written by the Machine Step remain unchanged?
6. What happens when the head enters a previously unmaterialized position, including positions on either side of a finite represented region?
7. What would be demonstrated by one step or a finite prefix, and what additional evidence would be necessary for a stronger realization scope?
8. How could serialization, commitments, witness data or UTXO progression be investigated *later* without presuming they determine the computation?

**Deliberately not selected:** array/string encoding, integer encoding, Merkle construction, UTXO layout, Script algorithm, transaction protocol, external storage scheme, or default tape initial condition. Candidate designs may be compared in subsequent research, but are not chosen here.

## 6. Illustrative evidence approach — not a mandatory procedure

One possible future case study could describe:

- **Semantic target:** model/machine, instance, valid state domain and exact transition.
- **Encoding candidate:** representation format and mapping assumptions.
- **Preservation claim:** what semantic information can be reconstructed or unambiguously determined; defined equivalence.
- **Mechanism:** what data a prospective host can access and what it can compute or verify.
- **Failure tests:** missing witness, ambiguous defaults, incorrect successor, wrong predecessor, state-space expansion, out-of-range position, and insufficient resources.
- **Outcome:** supported / conditional / refuted / inconclusive, with exact bounds and separate trust/proof properties.

This is a discussion aid rather than an accepted methodology, checklist, or project governance rule.

## 7. Relationship to future research

**State Models** should explain representation and state-related semantic risks that later **Computation on Bitcoin**, **Proof Taxonomy**, and **Protocol Evolution** investigations may rely upon. It should **not** preempt the independent questions of computational causality, enforcement, protocol-era feasibility, or real-world costs.

An eventual technology comparison (Ethereum, BTC with BitVM, etc.) could reuse state-model questions only with new host-specific semantics, assumptions and evidence. This document does not authorize a cross-technology research workstream.

## 8. Explicit non-claims

Nothing in this document establishes that Bitcoin/BSV:

- represents every valid state of Wolfram 596440;
- correctly executes or enforces its complete transition semantics;
- supports unbounded state evolution for the machine;
- realizes the full machine or Smith's qualified universality construction;
- fully executes or enforces arbitrary computation;
- realizes a general computation model; or
- is Turing complete.

No implementation architecture, new proof level, project requirement, or repository governance mechanism is adopted.

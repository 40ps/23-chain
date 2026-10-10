# 23-chain Research Questions

**Title:** Research Questions

**Version:** 0.3.0

**Status:** Accepted Draft

**Authority:** Normative

**Owner:** Wolfgang Lohmann

**Maintainer:** 23-chain Project

**License:** MIT

**Depends On:** P1, V1, Proof Levels, Computation Models

---

## 1. Purpose

Define the questions that guide 23-chain research and the evidence needed to evaluate possible claims about computation on Bitcoin/BSV. The questions are **investigative**, not statements of demonstrated feasibility, requirements, design principles, or architecture.

This document makes explicit which conclusions a study can and cannot support. It provides a bridge from the established Project Vision, Proof Levels, Computation Models, and initial Wolfram Machine Specification to later research artifacts.

## 2. Research Position and Scope

23-chain is a research-first project investigating computational expressiveness and the possibility of proving, verifying, executing, and enforcing computation in Bitcoin-style transaction and Script systems.

The research framework is **computation-model-independent** at its highest level. A concrete Machine Specification and Computation Instance must be named when claims require machine-level semantics. The Wolfram (2,3) machine 596440 is the first concrete reference, not the definition of the project's general computation model or an already accepted product architecture.

The research must preserve the distinctions established in the current foundation:

- Computation Model; Machine Specification; Computation Instance; execution and finite execution prefix; Execution Realization; Bounded Machine Realization; Complete Machine Realization; general Model Realization.
- Representation, execution, verification, and enforcement.
- Proof Level and Trust Model; L2 Replayable and L3 Verified; L4 Enforced and Full Computation Enforcement.
- External transaction progression and computational determination.
- Derived-Output and Candidate-Output Execution.
- Verification computation and execution of the original computation model.
- Finite state encoding and bounded computational semantics.
- Universality of a reference machine under specified construction assumptions and general computation capability of Bitcoin.

### Technology-Specific Scope and Future Transferability

The Research Questions are investigated **initially in the context of Bitcoin/BSV**. Their conceptual distinctions may also serve as a basis for **future research into other technologies** (for example Ethereum or BTC with BitVM-based mechanisms). Such later work is **not in the present scope** and is neither approved nor required by this document.

Any transfer of the questions to another technology requires an **explicit mapping** of that technology’s computation and execution semantics, mechanisms, proof and enforcement properties, trust assumptions, resource bounds, and applicable protocol context. The same question can provide a comparative reference point, but **answers, proof levels, causal claims, and feasibility conclusions cannot be transferred without new evidence and a scope-specific evaluation**. Technology-specific subquestions and investigation artifacts may therefore differ while preserving the common conceptual question.

This provision establishes **future analytical reuse**, not an assumption of equivalence or a decision to establish a cross-technology comparison program.

Research may investigate negative, conditional, partial, or infeasible outcomes. Such outcomes are legitimate results.

## 3. Research Method and Claim Discipline

The following are **analytical considerations** for evaluating future research claims. They help frame the questions; they are **not mandatory workflow rules**, a research-results policy, or new project governance. A later methodology artifact may establish procedures separately if authorized.

A research investigation may benefit from identifying, where applicable:

1. **Object of the claim:** computation model, machine specification, instance, step, finite execution prefix, bounded realization, complete machine realization, or broader model.
2. **Exact semantics:** transition relation/function, relevant computational state, inputs, initial conditions, and applicable termination or stopping convention.
3. **Bitcoin environment:** protocol era, relevant transaction and Script capabilities, resource constraints, and assumptions.
4. **Mechanism and causal locus:** what Bitcoin determines independently; what external actors supply; what is merely represented, replayed, checked, or enforced.
5. **Assurance:** proof level for each claimed property and separate trust assumptions; mixed-level results should be described per property.
6. **Evidence:** formal argument, executable construction, reproducible experiment, counterexample, or limitation analysis; identify what each establishes.
7. **Scope and non-claims:** exact supported conclusion, limits of generalization, and unresolved dependencies.

A finite experiment cannot by itself demonstrate an unbounded or complete realization. An execution trace is not automatically a proof of correct execution. A verifier for a claim does not automatically execute the underlying computation model. An externally proposed successor state is not automatically externally *determined* computation.

For **Candidate-Output Full Computation Execution**, Bitcoin must independently evaluate the **complete transition semantics** and accept an externally supplied candidate only when it is equivalent to the correct successor state/output under those semantics. Generic candidate validation is insufficient. External transaction construction or progression is not, by itself, computational determination.

## 4. Primary Research Questions

**Area separation:** RQ-1 asks **what computational semantics Bitcoin independently determines**. RQ-4 asks **which external actors, dependencies, and trust assumptions are involved** and how they affect the causal claim. These are connected perspectives, but they must not be treated as interchangeable research questions. RQ-6 supplies **cross-cutting protocol and resource constraints** that should be considered when investigating any other RQ area; it is not a separate implementation phase.

### RQ-1 — Computational Capability and Determination

**Primary question:** Which classes of computation, or which precisely defined computational operations, can Bitcoin independently determine under explicitly stated semantics and environmental assumptions?

**Motivation:** Recording results, checking assertions, and independently determining a computational successor are distinct activities.

**Scope:** Computation-model-independent definition of computational determination and the semantics independently evaluated; then machine- and instance-specific evaluation. Allocation of external-actor responsibility and trust assumptions belongs primarily to RQ-4.

**Supporting questions:**
- RQ-1.1: What necessary and sufficient conditions distinguish computation execution from representation, replay, and verification?
- RQ-1.2: Which part of the complete transition semantics is independently evaluated by Bitcoin when a successor is derived or externally proposed?
- RQ-1.3: Under what conditions can Derived-Output Execution or Candidate-Output Full Computation Execution be established?
- RQ-1.4: What semantic evidence distinguishes independent determination of a correct successor from merely accepting a candidate under a partial predicate?

**Assumptions to disclose:** Exact computation semantics; Script and transaction environment; data and state availability. Actor dependencies and external progression are examined explicitly under RQ-4.

**Evidence sought:** Formal semantic correspondence; concrete execution mechanism; adversarially chosen invalid successors rejected under the complete semantics; reproducible traces or proofs.

**Dependencies:** Computation Models; machine-specific semantics for concrete claims; protocol analysis where relevant.

**Non-claims:** Transaction inclusion, successful validation of a partial predicate, or an off-chain computed result alone does not establish Full Computation Execution.

### RQ-2 — Realization Scope and State Semantics

**Primary question:** Under which conditions can a computation model, machine, or instance be represented and realized on Bitcoin, and what is the precise scope of each realization claim?

**Motivation:** A single transition, a bounded demonstration, a complete machine, and a general model realization support different conclusions.

**Scope:** State completeness, state encoding, semantic preservation, progression, and realization scope.

**Supporting questions:**
- RQ-2.1: Which components of the computational state must be available or committed for a correct successor to be determined?
- RQ-2.2: When does a finite encoding preserve the semantics of an unbounded model, and when does it impose a genuine bound?
- RQ-2.3: How are no-spurious-transition and completeness properties established?
- RQ-2.4: What distinguishes Execution Realization, Bounded Machine Realization, and Complete Machine Realization in a concrete construction?
- RQ-2.5: How do state growth, data availability, and transaction progression affect the claimed realization?

**Assumptions to disclose:** Initial state/instance; state representation; permitted external storage or witnesses; resource model.

**Evidence sought:** Encoding/decoding definitions; semantic preservation argument; coverage and limitation proofs; concrete counterexamples to incomplete state encodings.

**Dependencies:** Computation Models; later State Models research; concrete Machine Specification.

**Non-claims:** A finite execution prefix is not a complete machine realization. Finite representation is not automatically bounded semantics, and a finite representation does not automatically preserve unbounded semantics.

### RQ-3 — Proof, Verification, and Enforcement

**Primary question:** Which computational properties can be recorded, replayed, verified, or enforced on Bitcoin, and what evidence and trust assumptions support each claim?

**Motivation:** The established proof levels classify distinct forms of assurance, not a simple quality ladder.

**Scope:** Property-specific assurance, verification mechanisms, enforcement mechanisms, and their relationship to execution.

**Supporting questions:**
- RQ-3.1: What exactly is the property asserted at each proof level, and who can check it?
- RQ-3.2: Which properties are replayable at L2 but lack independent verification at L3?
- RQ-3.3: What is actually enforced at L4, and when would Full Computation Enforcement be justified?
- RQ-3.4: Can a system exhibit different proof levels for different properties or stages?
- RQ-3.5: When does a verifier's computation fail to constitute execution of the original computation model?

**Assumptions to disclose:** Verifier inputs, trusted parties, availability, cryptographic and protocol assumptions, enforcement scope.

**Evidence sought:** Explicit predicates; verifier/enforcement specification; soundness or correctness argument; failure and adversarial cases.

**Dependencies:** Proof Levels; Computation Models; later Proof Taxonomy research.

**Non-claims:** L4 for one property is not automatically Full Computation Enforcement. L3 verification is not automatically Full Computation Execution.

### RQ-4 — Trust, External Actors, and Computational Causality

**Primary question:** How do external actors, data sources, and progression mechanisms affect the trust model and the location of computational determination?

**Motivation:** Transaction builders can be necessary for progression without being authoritative for the computational result.

**Scope:** Actor roles, supplied inputs and witnesses, dependencies, failure modes, safety versus liveness, and the trust/causal implications of external progression. RQ-1 addresses the independent semantic determination itself.

**Supporting questions:**
- RQ-4.1: Which inputs and witnesses are supplied externally, and which assertions are trusted rather than independently established?
- RQ-4.2: Which actors supply candidate successors, witnesses, precomputed data, and transaction progression, and what must remain untrusted for an RQ-1 execution claim?
- RQ-4.3: Which trust assumptions are necessary for safety versus liveness?
- RQ-4.4: Can external progression be separated from computational determination in each proposed construction?
- RQ-4.5: How do candidate generation, data availability, and off-chain precomputation alter the claim boundary?

**Assumptions to disclose:** Honest or adversarial participants; external services; data availability; transaction propagation and inclusion assumptions.

**Evidence sought:** Actor/causality diagrams, explicit threat assumptions, invalid-candidate tests, safety/liveness separation.

**Dependencies:** Computation Models; Proof Levels; concrete Bitcoin mechanisms.

**Non-claims:** An external builder does not necessarily disqualify Bitcoin execution; equally, on-chain acceptance does not alone prove independent computational determination.

### RQ-5 — Universality and Generalization

**Primary question:** What additional premises and demonstrations are required to generalize from a concrete machine realization to claims about broader computational capability?

**Motivation:** Universality of a machine and realizability of that machine on Bitcoin are logically distinct claims.

**Scope:** Quantifier discipline, universality constructions, instance classes, initial-condition requirements, and transfer of realizability results.

**Supporting questions:**
- RQ-5.1: What exact universality theorem or construction is relied upon, and under which initial-condition and encoding assumptions?
- RQ-5.2: If a universal machine is completely realized on Bitcoin, which further properties must be preserved for any broader inference?
- RQ-5.3: Which limitations of the Bitcoin realization invalidate or restrict a universality transfer?
- RQ-5.4: What separates realization of one universal machine from realization of arbitrary machines or a general Computation Model?
- RQ-5.5: What claim, if any, could rigorously justify describing Bitcoin itself as Turing complete?

**Assumptions to disclose:** Universality theorem, encoding/decoding, admissible instances, resources, progression, semantic preservation.

**Evidence sought:** Explicit implication chain with premises; constructive reductions; counterexamples or limitations; independent review of quantifiers.

**Dependencies:** Computation Models; machine-specific universality evidence; RQ-1 and RQ-2 results.

**Non-claims:** Smith's qualified universality result for Wolfram 596440 is not itself a Bitcoin capability claim. Neither a finite demonstration nor an unspecified “universal-machine realization” establishes Bitcoin Turing completeness.

### RQ-6 — Protocol Capabilities and Resource Constraints

**Primary question:** How do protocol-specific features, transaction semantics, Script capabilities, and resource bounds affect which computational claims can be realized?

**Motivation:** Feasibility depends on the actual protocol environment, not an abstractly assumed Bitcoin feature set.

**Scope:** A **cross-cutting constraint domain** for RQ-1 through RQ-5: protocol eras, Bitcoin/BSV distinctions where relevant, transaction and UTXO mechanisms, resource usage, and scaling. This area does not assume that a particular architecture or research sequence has already been selected.

**Supporting questions:**
- RQ-6.1: Which protocol features are required by a proposed mechanism, and in which environments are they available?
- RQ-6.2: What are the relevant limits on state representation, Script evaluation, transaction size, and validation cost?
- RQ-6.3: Which limits are implementation-specific, policy-specific, consensus-related, or inherent to the proposed realization?
- RQ-6.4: How do cost and resource growth depend on the number of machine steps and represented state size?
- RQ-6.5: How should protocol-era comparisons be made without transferring conclusions between incompatible environments?

**Assumptions to disclose:** Protocol version/era, consensus versus policy conditions, node/validation environment, resource metrics.

**Evidence sought:** Versioned specifications; reproducible feasibility tests; resource analysis; clearly scoped negative results.

**Dependencies:** Later Protocol Evolution and Computation on Bitcoin research; concrete mechanism.

**Non-claims:** Feasibility in one protocol era, configuration, or test environment does not establish feasibility across all Bitcoin/BSV environments.

## 5. Initial Investigation Case — Wolfram (2,3) Machine 596440

The first concrete research case **illustratively applies** the general RQs to the **canonical Wolfram (2,3) Machine Specification**. It does not redefine that specification, limit the general questions to Turing machines, or make Wolfram 596440 a prerequisite for researching other computation models. The general RQs remain independently meaningful; this first case only supplies concrete semantics for their initial investigation.

**Machine identity and semantics:** states `{1,2}`, alphabet `{0,1,2}`, bi-infinite tape, computational state `(q,h,τ)`, and six defined transitions. A Machine Step includes reading, selecting the transition, writing, moving, and entering the next state. The machine has no intrinsic halting state. Symbol `0` is not intrinsically a blank symbol. An externally chosen finite stopping point is not a machine halt.

**Illustrative investigation sequence (proposal, not result):**

1. Choose and document a concrete Computation Instance and its admissible initial state.
2. Define a state encoding and show which aspects of `(q,h,τ)` it preserves.
3. Specify a proposed Bitcoin mechanism for one transition, including all external inputs.
4. Test whether the mechanism independently evaluates the **complete** transition semantics and excludes incorrect successors.
5. Characterize the proof level, trust assumptions, and computational causal locus.
6. Investigate extension from one step to finite prefixes and separately to any stronger realization scope.
7. Examine resource growth and protocol dependence.
8. Only then consider whether a universality-related inference is warranted under Alex Smith's specific construction and initial-condition framework.

**Research caution:** The six transition rules, tape semantics, and Smith-related universality qualifications remain governed by the canonical Wolfram specification. No replacement transition table or new universality assertion is introduced here.

## 6. Optional Research Worksheet — Informative Example

The following table is an **optional illustrative worksheet**, included only to expose what supporting evidence might look like. It is **not** a required form, a canonical evidence standard, or a new governance rule. Its eventual location (here, a later research methodology, or nowhere) remains open.

A future investigation *could* record:

| Field | Illustrative information |
|---|---|
| Question ID | RQ identifier and precise subquestion |
| Target | Model / machine / instance / property |
| Claim under test | Exact proposed proposition and quantifiers |
| Assumptions | Protocol, participants, input and initial-state conditions |
| Mechanism | Computation, representation, verification, and enforcement roles |
| Evidence | Formal proof, experiment, reproducible construction, or counterexample |
| Result | Supported / refuted / conditional / inconclusive / not investigated |
| Scope | Single step, finite prefix, bounded or complete realization, etc. |
| Trust and proof level | Property-specific assurance and independent trust model |
| Limitations | Missing evidence, resources, generalization restrictions |
| Follow-up | Open dependency or next investigation |

These result categories and fields are **non-binding examples**. They must not be used to reject a study for procedural non-compliance, and must not be presented as accepted CA policy. Any mandatory methodology would require a separate explicit decision.

## 7. Relationship to Existing and Planned Artifacts

**Existing canonical foundation:**
- P1 — Project Index: project navigation and structure.
- P2 — Document Catalog: lifecycle classification and catalog entry for Research Questions.
- V1 — Project Vision: project-level purpose and inquiry.
- Proof Levels: assurance distinctions.
- Computation Models: normative computation and realization terminology.
- Wolfram (2,3) Machine Specification: first concrete machine semantics.

**Planned follow-on research:** Computation on Bitcoin, Proof Taxonomy, State Models, and Protocol Evolution. Research Questions should guide these investigations, not prematurely replace their detailed work.

**Catalog classification:** P2 lists `Research Questions` at `docs/vision/research_questions.md` as `Accepted Draft` / `Normative`, with direct dependencies P1, V1, Proof Levels, and Computation Models.

**Dependency boundary:** P1 and V1 provide project context; Computation Models and Proof Levels supply established terms and distinctions used throughout the general questions. The Wolfram Machine Specification is authoritative for the **first concrete case**, but its inclusion in Section 5 does **not** make it a direct normative dependency of the general Research Questions artifact.

## 8. Explicit Non-Claims

This document does **not** establish that Bitcoin/BSV:

- completely realizes Wolfram 596440;
- provides Full Computation Execution;
- provides Full Computation Enforcement;
- provides Bitcoin-Driven Machine Evolution;
- realizes arbitrary Turing machines or the general Turing-machine model;
- is Turing complete.

Nor does it establish that any specific state encoding, transaction mechanism, protocol era, or external progression pattern is sufficient. These are subjects for investigation.

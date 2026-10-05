# 23-chain Computation Models

**Title:** Computation Models  
**Version:** 0.1.0  
**Status:** Accepted Draft  
**Authority:** Normative  
**Owner:** Wolfgang Lohmann  
**Maintainer:** 23-chain Project  
**License:** MIT  
**Depends On:** P1, V1, Proof Levels

---

# Purpose

This document defines the conceptual framework used by 23-chain to describe computation models and claims about their realization using Bitcoin.

Its purpose is to make precise what is meant when the project states that Bitcoin represents, executes, verifies, or enforces a computation.

The framework separates:

- an abstract computation model;
- a particular machine specification;
- a computation instance;
- an execution of that instance;
- a Bitcoin realization.

This separation is necessary because demonstrating one concrete execution does not by itself establish realization of the machine that produced it, and realization of one machine does not by itself establish realization of an entire computation model.

The framework also defines the conditions under which 23-chain may describe a computation as being executed by Bitcoin rather than merely recorded, externally computed, or verified.

---

# Computation Model

A computation model defines the semantic rules governing a class of computations.

At a minimum, a computation model must make it possible to determine:

- what constitutes a computational state;
- how an initial state or valid initial configuration is established;
- what constitutes a valid transition between states;
- which outputs, observations, or termination conditions are relevant where applicable.

An abstract representation may be written conceptually as:

\[
M = (S, I, T, O)
\]

where:

- \(S\) describes the state space;
- \(I\) describes initialization conditions;
- \(T\) describes transition semantics;
- \(O\) describes relevant observations or results.

This notation is illustrative rather than a requirement that every computation model use exactly these components.

Additional concepts such as input alphabets, halting conditions, nondeterminism, concurrency, or other model-specific semantics may be required.

The computation model MUST be defined independently of its Bitcoin realization.

A model MUST NOT be reduced or redefined merely to fit what a particular Bitcoin construction can conveniently represent or execute.

---

# Machine Specification

A machine specification defines a particular machine within a computation model.

For a Turing-machine model, for example, a machine specification may define concepts such as:

- the set of machine states;
- the tape alphabet;
- the transition function;
- distinguished states or symbols;
- other parameters required by the selected Turing-machine definition.

A machine specification determines the transition semantics of that particular machine.

Wolfram's universal (2,3) Turing machine is the initial reference machine for 23-chain.

It provides the first concrete machine against which the framework can be applied, but it does not define the limits of the framework or of the project.

The complete specification of Wolfram (2,3) belongs to dedicated model-specific work rather than to this general framework.

---

# Computation Instance

A computation instance combines a machine specification with the initial conditions required for a particular computation.

Conceptually:

\[
C = (M, s_0)
\]

where \(M\) is the relevant machine specification and \(s_0\) is an initial computational state, possibly including model-specific input or configuration.

Different computation instances of the same machine may produce different executions.

Claims concerning one computation instance MUST NOT automatically be generalized to all instances of the machine.

---

# Execution

An execution is a sequence of computational states related by the transition semantics of the machine:

\[
s_0 \rightarrow s_1 \rightarrow s_2 \rightarrow \dots
\]

such that each represented transition satisfies the applicable transition semantics.

A finite experiment may observe only:

\[
s_0 \rightarrow s_1 \rightarrow \dots \rightarrow s_n
\]

Successful execution of such a finite sequence establishes evidence concerning the transitions actually demonstrated under the stated conditions.

It does not by itself establish that the implementation supports every possible state, transition, initial configuration, or future execution of the machine.

---

# Computational State

A computational state contains the information required by the computation model to determine its subsequent evolution.

The required state is model-dependent.

For a deterministic Turing machine, for example, relevant state may include the internal machine state, head position, and tape configuration.

A Bitcoin representation does not need to encode the computational state in the same form used by the abstract model.

It MAY use a different representation provided that the represented information is semantically sufficient and the relationship to the model state is precisely defined.

---

# State Completeness

A Bitcoin state representation is complete with respect to a computation model when it contains or unambiguously determines all information required to establish the relevant computational state and its subsequent transition semantics.

State completeness is therefore a semantic property rather than a requirement for literal structural identity between the abstract state and its Bitcoin encoding.

A representation that omits information required to determine a valid next computational state is not a complete representation of that state.

A commitment to state information is not automatically equivalent to making the committed state available to the mechanism that must execute or verify its transition semantics.

The required distinction between representation, availability, verification, and enforcement must be stated for the construction being analyzed.

---

# Unbounded Models and Finite States

A computation model may permit unbounded growth while each particular state reached after a finite number of transitions remains finitely describable.

An unbounded Turing tape therefore does not by itself imply that every represented machine state requires an infinite physical representation.

A finite encoding may completely represent a particular current state if the model semantics determine the remainder of the state unambiguously.

However, a Bitcoin construction MUST NOT be described as realizing an unbounded machine if it silently introduces a fixed bound that changes the machine's transition semantics.

If a construction supports only a bounded state space, that limitation must be stated.

A construction claiming realization of an unbounded model must address how valid future transitions that require previously unused state capacity remain representable and executable.

---

# State Encoding

Let:

\[
E:S_M\rightarrow S_B
\]

denote an encoding from states of a machine \(S_M\) into their Bitcoin representations \(S_B\).

The encoding need not preserve the visual or structural form of the original machine state.

It must preserve the semantic information required by the realization claim.

Different encodings may therefore represent the same computation model while making different tradeoffs concerning transaction structure, Script evaluation, data availability, cost, scalability, or verification.

Those implementation tradeoffs do not by themselves change the computation model.

---

# Transition Semantics

For a machine transition:

\[
s \xrightarrow{T_M} s'
\]

the machine specification determines whether \(s'\) is a valid successor of \(s\).

A Bitcoin construction may interact with this transition in different ways.

It may:

- record \(s\) and \(s'\);
- make the transition independently replayable;
- verify a specified property of the transition;
- execute some or all of the transition semantics;
- enforce some or all of the transition semantics.

These distinctions correspond to different claims and MUST NOT be treated as interchangeable.

The Proof Levels framework defines the applicable assurance terminology.

---

# Semantic Preservation

A Bitcoin realization preserves a machine transition when the Bitcoin mechanism and state encoding maintain the relevant semantics of the machine.

For complete transition realization, the intended relationship can be expressed conceptually as:

\[
T_B(E(s)) \equiv E(T_M(s))
\]

where:

- \(T_M\) is the machine transition semantics;
- \(E\) is the state encoding;
- \(T_B\) is the transition behavior realized by the Bitcoin mechanism.

The equivalence used in this relation must be defined according to the semantics of the model and representation.

Literal byte equality is not required unless the particular representation makes it relevant.

The essential requirement is that the Bitcoin transition preserves the specified computational meaning.

---

# No Spurious Computational Transitions

Complete semantic realization requires more than showing that valid machine transitions can be represented.

The Bitcoin mechanism must also prevent represented computational transitions that violate the applicable machine semantics when enforcement of those semantics is part of the realization claim.

An external transaction constructor MUST NOT be able to select an arbitrary successor state and have it accepted as a valid machine transition when that successor violates the specified transition semantics.

For deterministic machines, the accepted represented successor must correspond to the successor determined by the machine transition function.

---

# Bitcoin Execution

Recording the result of an externally executed computation does not mean that Bitcoin executed the computation.

Likewise, verifying evidence concerning a computation is not automatically equivalent to executing the original computation model.

23-chain describes Bitcoin as executing a specified computation transition only when evaluation under the stated Bitcoin mechanism applies the relevant transition semantics to the represented input state such that the computational result is determined by that evaluation rather than accepted on the basis of an externally trusted computation result.

Execution claims are always relative to a stated Bitcoin protocol model and its available transaction, Script, and enforcement semantics.

---

# Transaction Progression and Computational Determination

The actor that advances a transaction chain need not be the actor or mechanism that determines the computational result.

An external actor may:

- construct a transaction;
- provide required transaction inputs;
- submit or broadcast the transaction;
- trigger the next step of a computation.

These activities do not by themselves make that actor the computational authority for the state transition.

An external stepper may therefore provide **progression** while Bitcoin provides **computational determination**.

In the strongest form of Bitcoin-driven execution considered by 23-chain, the external stepper is required only to advance the transaction chain, while Bitcoin Script evaluates the complete specified transition semantics and determines the valid next computational state.

Bitcoin enforcement then prevents a successor inconsistent with those semantics from being accepted as the corresponding computational transition.

The external stepper is therefore a liveness dependency without necessarily being a computational trust dependency.

---

# Candidate Outputs

A transaction builder may in some constructions need to include a candidate representation of the next state.

This does not necessarily mean that the next computational state was externally determined for purposes of the realization claim.

If Bitcoin independently evaluates the complete relevant transition semantics from the prior state and accepts the candidate only when it corresponds to the complete result of that evaluation, the external candidate does not need to be trusted as the source of computational correctness.

The distinction is therefore between:

- who constructs or proposes the output representation; and
- what mechanism determines whether that output is the result required by the computation model.

These roles MUST NOT be conflated.

---

# Verification Computation versus Model Execution

A mechanism may verify evidence about a computation without executing the original computation model.

For example, a verifier may conceptually evaluate:

\[
V(s,s',\pi)\rightarrow\{true,false\}
\]

where \(\pi\) is evidence concerning a claimed transition.

This is distinct from evaluating:

\[
T_M(s)\rightarrow s'
\]

according to the transition semantics of the computation model itself.

Executing a verifier can provide strong assurance and may participate in Bitcoin enforcement.

It does not by itself establish that Bitcoin executed the computation model whose transition is being verified.

---

# Full Computation Execution

Bitcoin fully executes a specified computation transition when, under the stated Bitcoin protocol model, the evaluated Bitcoin semantics realize the complete specified transition semantics of the computation model for that transition without relying on an externally trusted result for any semantically required part of the transition.

Full Computation Execution may take at least two forms.

## Derived-Output Execution

In Derived-Output Execution, Bitcoin evaluation applies the complete relevant transition semantics to the represented input state and derives the computational successor state.

Conceptually:

\[
T_B(E(s)) \rightarrow E(s')
\]

where \(s'=T_M(s)\).

This is the most direct form of Bitcoin computational determination.

## Candidate-Output Execution

In Candidate-Output Execution, an external transaction builder supplies a candidate successor representation \(E(s'_c)\).

Bitcoin nevertheless independently evaluates the complete relevant transition semantics and accepts the candidate as the computational successor only when:

\[
E(s'_c)\equiv E(T_M(s))
\]

The external actor may therefore construct or propose the candidate without being trusted to determine computational correctness.

Candidate-Output Execution qualifies as Full Computation Execution only when Bitcoin evaluates the complete transition semantics relevant to the claim.

Merely evaluating a proof, commitment, abbreviated predicate, or other verifier concerning an externally computed transition does not by itself qualify as Full Computation Execution of the original model.

Such a construction may provide strong verification or enforcement under the Proof Levels framework while remaining distinct from execution of \(T_M\).

Full Computation Execution does not require an entire multi-step computation to occur within one transaction.

A computation may progress through a sequence:

\[
E(s_0)\rightarrow E(s_1)\rightarrow E(s_2)\rightarrow\dots
\]

where each Bitcoin transition realizes one complete machine transition.

An external stepper may still be required to advance the sequence.

If the stepper controls when the next transition is attempted but cannot control which successor state is computationally valid, this does not by itself weaken the Full Computation Execution claim.

---

# Full Computation Enforcement

Full Computation Enforcement is the case in which Bitcoin both realizes the complete specified transition semantics and makes satisfaction of those semantics necessary for acceptance of the corresponding Bitcoin state transition.

It is therefore a specific and particularly strong case of L4 — Enforced as defined by the Proof Levels framework.

A Full Computation Enforcement claim requires:

- complete representation of the computational state required by the transition;
- evaluation of the complete specified transition semantics;
- semantic preservation between machine and Bitcoin transitions;
- prevention of model-inconsistent represented successor transitions;
- explicit statement of the Bitcoin protocol conditions under which enforcement holds;
- explicit statement of remaining trust assumptions.

Full Computation Enforcement does not imply that all possible aspects of the surrounding system are trustless.

---

# Bitcoin-Driven Machine Evolution

Bitcoin-driven Machine Evolution is a **research pattern**, not an additional realization scope or proof level.

It describes a construction in which external actors are required only for progression while Bitcoin evaluates the complete specified transition semantics and determines and enforces each successive computational state.

Conceptually:

\[
E(s_n)
\xrightarrow[\text{external progression}]{\text{Bitcoin evaluation and enforcement}}
E(s_{n+1})
\]

with:

\[
s_{n+1}=T_M(s_n)
\]

determined by the machine semantics realized by Bitcoin.

For a Turing-machine construction satisfying the required state-completeness and semantic-preservation conditions, this pattern may support a claim that Bitcoin executes the state transitions of the specified Turing machine while an external stepper advances the transaction chain.

Whether any particular Bitcoin construction actually satisfies these conditions is a research result and is not established by this framework.

---

# Scope of Realization Claims

Claims about Bitcoin realization must identify their semantic scope.

At minimum, 23-chain distinguishes the following scopes.

## Execution Realization

An Execution Realization claim states that Bitcoin correctly realized a particular demonstrated execution or finite sequence of transitions under stated conditions.

This claim is limited to the execution demonstrated.

## Bounded Machine Realization

A Bounded Machine Realization claim states that a Bitcoin construction realizes the transition semantics of a specified machine only within an explicitly bounded computational domain.

Such bounds may include restrictions on state size, tape extent, input domain, execution length, or other computational limits not present in the original machine specification.

The bounds MUST be stated explicitly.

A Bounded Machine Realization MUST NOT be presented as a Complete Machine Realization when those bounds alter the computational domain or transition possibilities of the specified machine.

## Complete Machine Realization

A Complete Machine Realization claim states that the construction realizes the specified machine's transition semantics for every computational state and transition within the domain defined by the machine specification, subject only to explicitly stated environmental or Bitcoin protocol conditions that do not alter those machine semantics.

A fixed computational bound introduced by the Bitcoin construction that is not part of the machine specification prevents the construction from qualifying as a Complete Machine Realization of that machine.

Successful testing of many states or executions is not by itself sufficient to establish Complete Machine Realization.

The claim requires evidence appropriate to the full semantic domain being claimed.

## Model Realization

A Model Realization claim states that a Bitcoin construction realizes a claimed class of machines belonging to a computation model.

This is stronger than realization of one particular machine.

The supported class and its limitations MUST be defined explicitly.

A Model Realization claim MUST NOT be inferred solely from successful realization of one machine, including a universal machine.

---

# Limits of Generalization

Successful realization of one execution does not establish realization of the machine.

A Bounded Machine Realization does not establish Complete Machine Realization.

Successful realization of one machine does not establish realization of the computation model.

Conceptually:

\[
\text{Execution demonstrated}
\not\Rightarrow
\text{Complete Machine realized}
\not\Rightarrow
\text{Model realized}
\]

Claims MUST be stated at the strongest scope actually supported by the available evidence and no stronger.

A bounded demonstration of an otherwise unbounded machine may establish an Execution Realization or Bounded Machine Realization result without establishing Complete Machine Realization.

---

# Realizability Results

For a specified computation model or machine and a specified Bitcoin protocol model, research may find that the target is:

- fully realizable under the stated conditions;
- realizable only for a defined subset or bounded domain;
- representable but not fully executable by Bitcoin;
- verifiable or enforceable without Bitcoin executing the original transition semantics;
- subject to identified limitations;
- or, where sufficiently established, not fully realizable under the stated conditions.

Both positive and negative results are valid research outcomes.

Failure to discover a construction is not an impossibility result.

Claims that a model or machine cannot be fully realized require evidence appropriate to the scope and strength of the negative claim.

---

# Protocol Dependence

Bitcoin execution and realization claims are relative to protocol capabilities.

A construction may be possible under one set of Script, transaction, signature, or other protocol semantics and unavailable under another.

Research using this framework MUST therefore identify the protocol assumptions relevant to the result.

The framework itself does not determine which historical or current Bitcoin protocol configuration provides the required capabilities.

That belongs to protocol-specific research.

---

# Relationship to Proof Levels

Computation Models and Proof Levels answer different questions.

Computation Models defines:

> What computation is being claimed, and what would constitute preservation or execution of its semantics?

Proof Levels defines:

> What form of assurance supports a particular claim or property concerning that computation?

A construction may therefore provide high assurance about a limited property without executing the complete computation model.

Conversely, an execution claim must still state how correctness is evidenced or enforced.

The two frameworks are complementary and MUST NOT be collapsed into a single classification.

---

# Initial Reference Machine

Wolfram's universal (2,3) Turing machine is the initial reference machine for 23-chain.

The project will use it to investigate questions including:

- complete state representation;
- transition execution;
- semantic preservation;
- replayability and verification;
- enforcement;
- Bitcoin-driven Machine Evolution;
- Full Computation Execution;
- Full Computation Enforcement;
- protocol-dependent realizability.

This document does not establish that any of these properties have already been achieved.

A dedicated specification must define the Wolfram (2,3) machine precisely enough for such claims to be tested.

Other computation models and machine specifications may subsequently be introduced where they expose additional research questions or provide useful comparison.

---

# Scope Boundaries

This document does not:

- provide the complete formal specification of Wolfram (2,3);
- establish that Bitcoin can fully realize Wolfram (2,3);
- establish that Bitcoin can realize arbitrary Turing machines;
- classify a concrete Bitcoin construction;
- classify the historical prototype;
- select a Bitcoin Script architecture;
- define protocol-era capabilities;
- define proof levels;
- prove universality, realizability, or impossibility;
- prescribe implementation architecture.

Those responsibilities belong to model-specific specifications, Proof Levels, protocol research, prototype analysis, architecture, and subsequent experimental work.

---

# Evolution

This framework is intended to provide stable terminology for computation-model research while allowing model-specific formalization to evolve.

Future work may refine the formal representation of computation models, state equivalence, transition preservation, or realization scope when practical research demonstrates that additional precision is required.

Such refinements should preserve the core distinctions between:

- model and realization;
- machine and execution;
- bounded and complete machine realization;
- representation and execution;
- verification and execution;
- progression and computational determination;
- derived-output and candidate-output execution;
- finite demonstration and general realization;
- positive evidence and impossibility claims.

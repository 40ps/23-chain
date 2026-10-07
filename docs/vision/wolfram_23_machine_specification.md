# Wolfram (2,3) Machine Specification

**Version:** 0.1.0  
**Status:** Accepted Draft  
**Authority:** Normative  
**Owner:** Wolfgang Lohmann  
**Maintainer:** 23-chain Project  
**License:** MIT  
**Depends On:** P1, V1, Computation Models

## 1. Purpose

This document specifies the initial reference machine used by 23-chain: Wolfram Turing Machine 596440, commonly referred to in the project as the Wolfram (2,3) Turing Machine.

The purpose of this specification is to provide a precise, Bitcoin-independent definition of the machine against which later representation, execution, replay, verification, enforcement, and realizability claims can be evaluated.

This document distinguishes:

- the externally defined reference machine;
- the project's normative formalization of its computational state and execution semantics;
- computation instances of that machine;
- external evidence concerning the machine's computational universality.

This document does not define a Bitcoin realization of the machine.

---

## 2. Reference Identity

The initial reference machine of 23-chain SHALL be Wolfram Turing Machine 596440.

The reference machine has:

\[
Q=\{1,2\}
\]

as its set of machine states and

\[
\Gamma=\{0,1,2\}
\]

as its tape alphabet.

The machine SHALL preserve the state labels, tape-symbol labels, movement convention, and six transition rules of the external Wolfram reference.

The machine is a specific 2-state, 3-symbol Turing machine. It SHALL NOT be treated as synonymous with either the general Turing-machine computation model or the class of all 2-state, 3-symbol Turing machines.

---

## 3. Transition Function

The machine transition function is

\[
\delta:
Q\times\Gamma
\rightarrow
Q\times\Gamma\times\{-1,+1\}.
\]

The six transition rules are:

| Current State | Read Symbol | Next State | Write Symbol | Move |
|---|---:|---:|---:|---|
| 1 | 0 | 2 | 1 | Right |
| 1 | 1 | 1 | 2 | Left |
| 1 | 2 | 1 | 1 | Left |
| 2 | 0 | 1 | 2 | Left |
| 2 | 1 | 2 | 2 | Right |
| 2 | 2 | 1 | 0 | Right |

For formal purposes:

\[
Left=-1,\qquad Right=+1.
\]

Exactly one transition rule is defined for every pair in \(Q\times\Gamma\).

The transition function is therefore deterministic and total over the valid state-symbol domain.

---

## 4. Computational State

A computational state of the reference machine SHALL be defined as

\[
s=(q,h,\tau),
\]

where:

\[
q\in Q
\]

is the current machine state,

\[
h\in\mathbb Z
\]

is the current tape-head position, and

\[
\tau:\mathbb Z\rightarrow\Gamma
\]

is the complete semantic tape configuration.

A computational state is a semantic concept rather than a particular serialization or storage representation.

Any concrete representation MAY encode \(q\), \(h\), and \(\tau\) differently, but it MUST contain or unambiguously determine all information required to determine the next computational state.

No particular finite serialization, base-3 representation, Bitcoin representation, or historical prototype state format forms part of this definition.

---

## 5. Tape Semantics

The machine tape SHALL be modeled as a bi-infinite sequence of cells indexed by the integers:

\[
\tau:\mathbb Z\rightarrow\{0,1,2\}.
\]

The semantic tape has no fixed left or right boundary.

The transition semantics themselves do not require a distinguished blank symbol.

Where a computation instance specifies a conventional blank region using symbol `0`, cells in that region SHALL have tape value `0`.

A blank cell remains a semantic tape cell. Blank SHALL NOT mean that the cell does not exist.

A concrete representation MAY represent the tape finitely, sparsely, symbolically, or incrementally, provided that the representation unambiguously determines the required tape contents and preserves the semantics of the represented computation instance.

A representation intended to preserve the unbounded machine semantics MUST permit the represented computational state to evolve without introducing a hidden fixed left or right tape boundary.

Finite physical or serialized representation of a particular state SHALL NOT by itself imply that the semantic Turing-machine tape is finite.

Rules such as treating every unrepresented cell as symbol `0` are valid only where the computation instance actually defines those cells as `0`.

The following concepts SHALL remain distinct:

\[
\text{semantic tape}
\neq
\text{initial tape configuration}
\neq
\text{encoding of that configuration}.
\]

---

## 6. Machine Step

Let

\[
s=(q,h,\tau)
\]

be a valid computational state.

The symbol read by the machine is

\[
a=\tau(h).
\]

If

\[
\delta(q,a)=(q',b,d),
\]

then one Machine Step produces

\[
T_M(s)=s'=(q',h+d,\tau'),
\]

where

\[
\tau'(i)=
\begin{cases}
b,&i=h\\
\tau(i),&i\neq h.
\end{cases}
\]

A Machine Step SHALL therefore consist of:

1. reading the tape symbol at the current head position;
2. selecting the unique transition rule determined by the current machine state and read symbol;
3. writing the rule's output symbol at the current head position;
4. moving the head exactly one cell in the specified direction;
5. entering the rule's next machine state.

All tape cells other than the cell at the previous head position SHALL remain unchanged by that Machine Step.

The complete Machine Step is the transition

\[
s\rightarrow T_M(s).
\]

Merely selecting or evaluating

\[
(q,\tau(h))\mapsto(q',b,d)
\]

does not by itself constitute the complete state transition. The resulting tape update, head movement, and machine-state update are part of the computational semantics.

---

## 7. Determinism

Because exactly one transition rule exists for every valid pair

\[
(q,a)\in Q\times\Gamma,
\]

the next computational state is uniquely determined for every valid computational state.

Thus,

\[
s_{n+1}=T_M(s_n)
\]

is deterministic.

No external actor is required to choose among multiple valid successor states in the abstract machine semantics.

---

## 8. Computation Instance

A computation instance SHALL consist of the machine specification together with a complete initial computational state:

\[
C=(M,s_0),
\]

where

\[
s_0=(q_0,h_0,\tau_0).
\]

The machine specification itself SHALL NOT prescribe a single universal initial tape configuration, head position, or initial computational state unless such a condition is explicitly defined for a particular computation instance.

Consequently, the following are distinct computation instances of the same machine:

- a blank-tape run;
- a demonstration run;
- a test or validation configuration;
- an initial condition used as part of a universality construction.

A head position such as

\[
h_0=0
\]

MAY be selected as an indexing convention for a computation instance or representation. Position `0` has no special computational privilege in the abstract machine.

In particular:

\[
\text{Wolfram TM 596440}
\neq
\text{Wolfram TM 596440 with a particular }s_0.
\]

---

## 9. Execution Sequence

The execution of a computation instance

\[
C=(M,s_0)
\]

SHALL be the state sequence generated by repeated application of the machine transition function:

\[
s_{n+1}=T_M(s_n),\qquad n\geq0.
\]

Thus:

\[
E(C)=(s_0,s_1,s_2,\ldots).
\]

Each adjacent pair

\[
(s_n,s_{n+1})
\]

SHALL constitute exactly one Machine Step.

The reference machine has no intrinsic halting state in its specified transition system.

A finite experiment or realization MAY operate on or observe only a finite execution prefix

\[
(s_0,s_1,\ldots,s_N).
\]

Termination of such an experiment SHALL NOT be interpreted as an intrinsic halt of the reference machine.

Demonstrating a finite execution prefix establishes only the execution scope actually demonstrated. It does not by itself establish Complete Machine Realization as defined by Computation Models.

---

## 10. Reference Semantics and Representation

The normative machine semantics are independent of their concrete representation.

A representation MAY differ structurally from the abstract state

\[
(q,h,\tau)
\]

provided that it preserves the information and transition semantics required by this specification.

A representation SHALL NOT silently redefine the machine by introducing computational restrictions absent from the reference semantics.

In particular, implementation convenience SHALL NOT justify silently introducing:

- a fixed tape boundary;
- a reduced transition domain;
- omitted computational state;
- externally supplied semantic results that replace the specified transition computation;
- a different transition function.

Questions concerning whether a representation preserves the reference semantics SHALL be evaluated using the semantic-preservation concepts defined by Computation Models.

---

## 11. Universality

For the purposes of 23-chain, Wolfram Turing Machine 596440 SHALL be treated as computationally universal under the universality result and initial-condition framework established by Alex Smith and accepted for the Wolfram 2,3 Turing Machine Research Prize.

This universality result is a property established for the reference machine under the conditions of that construction.

It SHALL NOT be interpreted as establishing that:

- every initial configuration is universal;
- blank-tape execution is itself universal;
- an arbitrary finite nonblank region surrounded by otherwise blank tape is sufficient for unbounded universal computation;
- every finite execution demonstrates universality.

Claims relying specifically on the machine's universality MUST distinguish the fixed transition semantics of machine 596440 from the initial-condition encoding and interpretation required to emulate other computation.

Where 23-chain relies on Smith's unbounded universality construction, the relevant initial-condition assumptions and encoding or decoding conditions MUST be identified rather than silently replaced by a simpler finite-input assumption.

---

## 12. Universality Construction Is Not Machine Semantics

The normative semantics of Wolfram Turing Machine 596440 consist of the machine definition specified by this document, including its:

- state set;
- tape alphabet;
- tape semantics;
- transition function;
- computational-state definition;
- Machine Step semantics.

Alex Smith's universality construction SHALL be treated as external evidence establishing a property of this machine.

The encodings, cyclic-tag-system simulation, initial-condition construction, decoding procedures, and other machinery used in the universality proof SHALL NOT be incorporated into the six transition rules or into the definition of a Machine Step.

A 23-chain experiment MAY use a universality construction as a computation instance, validation target, or research instrument, but any such additional construction MUST be identified explicitly.

Therefore:

\[
\text{machine semantics}
\neq
\text{universality construction}.
\]

---

## 13. Relationship to Computation Models

This specification instantiates distinctions defined by Computation Models.

For this document:

- the general Turing-machine formalism is a computation model;
- Wolfram Turing Machine 596440 is a Machine Specification;
- \(C=(M,s_0)\) is a Computation Instance;
- \((s_0,\ldots,s_N)\) is a finite execution prefix;
- a Bitcoin construction for the machine would be a Bitcoin Realization whose scope must be stated separately.

Successful execution of one or more computation instances SHALL NOT by itself be generalized into Complete Machine Realization or Model Realization.

Likewise, the known universality of machine 596440 SHALL NOT by itself establish any claim concerning the computational capability of Bitcoin.

---

## 14. Relationship to Proof Levels

This document defines what constitutes the relevant computation and its correct state transition.

It does not assign a Proof Level to any Bitcoin realization.

A later construction MAY record, make replayable, verify, or enforce properties concerning Machine Steps or execution sequences. Such assurance claims SHALL be classified separately under Proof Levels.

Correct specification of the computation and assurance concerning execution of that computation SHALL NOT be collapsed into a single concept.

---

## 15. Bitcoin Research Boundary

This specification makes no claim that Bitcoin or BSV currently:

- represents every valid computational state of machine 596440;
- executes its complete Machine Step semantics;
- supports unbounded machine evolution;
- realizes the initial-condition semantics required by the universality construction;
- provides Full Computation Execution;
- provides Full Computation Enforcement;
- provides Bitcoin-Driven Machine Evolution;
- realizes arbitrary Turing machines;
- realizes the Turing-machine computation model.

Whether and under what protocol, resource, trust, and representation assumptions any such claims can be established is a research question.

In particular, the following implication is NOT established by this specification:

\[
\text{Bitcoin realization of machine 596440}
\Rightarrow
\text{Bitcoin is Turing complete}.
\]

The validity and necessary qualifications of any such capability claim require separate analysis.

---

## 16. Prototype Boundary

Historical 23-chain prototype representations and execution mechanisms are not normative definitions of this machine.

In particular, any historical representation resembling

`{state}|{headPosition}|{tapeBase3}`

SHALL be treated as a prototype-specific encoding unless separately demonstrated to preserve the semantics required by this specification.

No historical prototype is classified by this document as satisfying the current Computation Models framework.

---

## 17. External Evidence Boundary

The identity and transition rules of Wolfram Turing Machine 596440 originate from the external Wolfram reference.

The machine's universality is supported by Alex Smith's universality result.

These external facts SHALL remain distinguishable from 23-chain's own normative formalization choices, including the explicit computational-state tuple, state-completeness requirements, realization boundaries, and relationship to the project's Computation Models and Proof Levels.

Where later research depends materially on details of the universality construction rather than merely on the established universality result, those details SHOULD be traced to the relevant external source rather than inferred from this specification.

---

## 18. Scope Boundaries

This version intentionally does not define:

- a Bitcoin state encoding;
- a Script representation;
- transaction structure;
- UTXO state architecture;
- tape serialization;
- state commitments;
- proof construction;
- verifier construction;
- protocol-era capabilities;
- resource bounds or transaction costs;
- a compiler from another computation model;
- Smith's universality construction in full;
- a Bitcoin implementation architecture;
- a claim that the historical prototype satisfies this specification.

These concerns belong to later research, requirements, architecture, or implementation artifacts.

---

## 19. Evolution

Future revisions MAY refine notation, external-source traceability, validation procedures, or machine-specific research requirements.

They SHOULD preserve the core distinctions established here:

\[
\text{Computation Model}
\neq
\text{Machine Specification}
\neq
\text{Computation Instance}
\neq
\text{Execution Sequence}
\neq
\text{Bitcoin Realization}.
\]

They SHOULD also preserve the distinction:

\[
\text{Reference Machine Semantics}
\neq
\text{Universality Construction}
\neq
\text{Bitcoin Capability Claim}.
\]

Any revision that changes the reference transition semantics, computational-state semantics, tape semantics, or interpretation of the external universality result constitutes a substantive conceptual change and requires architectural review.

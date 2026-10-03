# 23-chain Project Vision

**Document ID:** V1  
**Title:** Project Vision  
**Version:** 0.1.0  
**Status:** Accepted Draft  
**Authority:** Normative  
**Owner:** Wolfgang Lohmann  
**Maintainer:** 23-chain Project  
**License:** MIT  
**Depends On:** P1

---

# Purpose

23-chain exists to investigate and demonstrate **computation claims using Bitcoin SV as its primary protocol and experimental environment**.

The project studies how computation, state transitions, Bitcoin transactions and Script, proof and verification mechanisms, protocol capabilities, and trust assumptions interact.

Its purpose is not merely to record that a computation occurred. The project seeks to understand what a computation claim means, what evidence can support it, how it can be verified or enforced, and what assumptions are required for that claim to hold.

BSV is the project's primary environment of investigation. Other systems and approaches may be studied as comparison targets where doing so improves understanding of the design space.

---

# Fundamental Inquiry

The fundamental object of inquiry in 23-chain is a claim of the form:

> A computation correctly transformed one state into another according to a specified computation model.

This formulation separates the computation claim itself from any particular implementation or proof mechanism.

A state transition may be simulated, recorded, replayed, verified, or enforced in different ways. These approaches provide different forms of evidence and may require different trust assumptions.

23-chain investigates those distinctions rather than assuming that representing a computation on a blockchain is equivalent to proving or enforcing it.

---

# Project Direction

23-chain is a research project first.

Its priorities are:

1. scientific and technical understanding;
2. demonstration and educational clarity;
3. product and user-experience concerns.

These priorities establish an ordering, not an exclusion. Demonstration and product concerns remain legitimate where they serve the higher-priority research objectives.

Demonstrations should serve the research rather than determine it. Implementations should make accepted concepts concrete and testable rather than redefine them.

The project may produce interactive software, visualizations, transaction experiments, verification mechanisms, or other executable artifacts, but such artifacts exist in service of the underlying research questions.

---

# Computation and Bitcoin

23-chain treats computation and Bitcoin as parts of an integrated research problem.

The project is concerned with the relationship between:

- computation models;
- state and state transitions;
- representation of computation in transactions;
- Bitcoin Script and transaction semantics;
- verification and enforcement mechanisms;
- protocol capabilities and constraints;
- proof models;
- trust assumptions.

These dimensions should not be separated in a way that removes the relationship the project exists to investigate.

Architectural modularity may separate responsibilities in an implementation, but the research problem remains concerned with how those responsibilities interact.

---

# Reference Computation Model

The project's initial reference computation model is **Wolfram's universal (2,3) Turing machine**.

Wolfram (2,3) provides:

- continuity with the origin of 23-chain;
- a compact and deterministic state-transition system;
- a concrete universal computation model;
- a basis for repeatable experiments involving state, transactions, verification, and protocol capabilities.

It does not define the conceptual limits of 23-chain.

Other computation models may be introduced when they expose research questions or properties that the initial reference model does not expose sufficiently.

The selection, definition, and comparison of computation models belong to the project's dedicated computation-model work.

---

# Proof and Trust

23-chain distinguishes between representing a computation and establishing that a computation claim should be accepted.

The project therefore investigates questions such as:

- What evidence exists for a claimed state transition?
- Who or what can independently verify that evidence?
- Which properties are enforced by protocol or Script?
- Which properties require replay or external verification?
- Which actors, systems, or assumptions must be trusted?
- How do different proof or enforcement mechanisms change those trust requirements?

The project does not assume that there is a single notion of proof suitable for every experiment or objective.

A dedicated proof framework will define these distinctions more precisely.

---

# Protocol as a Research Dimension

Bitcoin protocol capabilities form part of the experimental space of 23-chain.

Changes in areas such as Script capabilities, transaction semantics, signature behavior, or protocol constraints can affect which computation and proof constructions are possible, practical, or understandable.

Protocol evolution may therefore be studied by asking how different protocol capabilities change the construction and verification of computation claims.

The purpose of such comparison is analytical rather than historical or ideological.

Detailed protocol-era analysis belongs to dedicated research work.

---

# Comparative Perspective

BSV is the primary protocol and experimental environment of 23-chain, but the project does not assume that BSV or any particular BSV-based construction must be superior for every objective.

Alternative Bitcoin approaches, proof systems, blockchain systems, or computation-verification mechanisms may provide useful comparison targets.

Comparisons should identify the relevant differences in computation, state, proof, protocol, and trust assumptions rather than reduce the analysis to platform advocacy.

The project must remain capable of finding that another approach is better suited to a particular objective when the evidence supports that conclusion.

---

# Scope Boundaries

23-chain is not defined as:

- a Turing-machine visualization project;
- a blockchain logging demonstration;
- a specific covenant implementation;
- a particular Script construction;
- a particular proof mechanism;
- a product whose existing implementation defines the research direction;
- an advocacy project whose purpose is to establish the superiority of one blockchain system.

These are possible techniques, experiments, artifacts, or applications within the project, but none of them individually defines its purpose or scope.

The historical prototype remains valuable as provenance and as a source of experimental experience. It does not define the target architecture or the limits of the current project.

---

# Relationship to Subsequent Documents

This vision establishes the long-term direction of 23-chain.

It intentionally does not fully define:

- proof levels or a proof taxonomy;
- computation-model specifications;
- concrete research questions;
- detailed protocol comparisons;
- prototype implementation history;
- system requirements;
- software architecture;
- implementation design.

Those responsibilities belong to subsequent project documents.

The purpose of this separation is to allow the project to refine its research, requirements, and implementation while preserving a stable statement of why 23-chain exists and what it seeks to understand.

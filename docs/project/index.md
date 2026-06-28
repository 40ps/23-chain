# 23-chain Project Index

**Document ID:** P1
**Title:** Project Index
**Version:** 0.1.0
**Status:** Accepted Draft
**Authority:** Normative
**Owner:** Wolfgang Lohmann
**Maintainer:** 23-chain Project
**License:** MIT
**Last Updated:** 2026-06-28
**Depends On:** —
**Used By:** All project documentation

---

# Purpose

This document serves as the primary entry point to the 23-chain repository.

It explains how the repository is organized, how its documents relate to each other, and how contributors and AI assistants should navigate the project's knowledge base.

23-chain is developed as a **knowledge-first research project**. Software implementations are derived from documented concepts rather than defining them.

---

# Repository Philosophy

The project follows a concept-driven development process.

Knowledge progresses through the following layers:

```text
Philosophy
    ↓
Vision
    ↓
Research
    ↓
Requirements
    ↓
Architecture
    ↓
Implementation
    ↓
Validation
```

Each layer builds upon the previous one.

Whenever significant new insights emerge, changes shall be applied at their conceptual origin before propagating to dependent layers.

---

# Documentation Structure

The repository is organized into several major documentation categories.

## Philosophy

Defines the fundamental principles governing the project.

Examples include:

* Design Principles
* Project Governance

---

## Vision

Explains why the project exists and defines its long-term direction.

Typical documents include:

* Project Vision
* Proof Levels
* Computation Models
* Research Questions
* Prototype Baseline

---

## Research

Contains the conceptual investigations supporting the project's vision.

Examples include:

* Computational expressiveness
* Proof taxonomy
* State models
* Protocol evolution

Research documents provide the scientific foundation from which requirements are derived.

---

## Requirements

Requirements describe the expected capabilities of the system.

They are derived from the vision and research documents rather than from existing implementations.

---

## Architecture

Architecture specifies how the requirements are realized.

Architectural decisions shall remain traceable to the requirements that motivated them.

---

## Implementation

Implementation contains executable software and supporting tooling.

Implementation must not redefine the project's vision, terminology, or architectural decisions.

---

## Validation

Validation demonstrates that both research claims and software implementations satisfy their intended objectives.

Validation may include:

* automated testing
* replay
* verification
* demonstrations
* reproducibility studies

---

# AI-assisted Development

The repository is designed to support collaboration between human contributors and AI assistants.

Roles, workflows, prompts, governance, and project memory are maintained separately within the `.ai` directory.

Repository artifacts are authoritative.

Conversations are temporary working sessions whose knowledge should eventually migrate into repository artifacts.

---

# Incubation

Ideas that are considered valuable but intentionally remain outside the current project scope are maintained separately.

Incubated ideas may later become:

* research topics
* future milestones
* independent repositories
* archived concepts

Incubation preserves valuable ideas without expanding the project's current scope prematurely.

---

# Reading Order

New contributors are encouraged to explore the repository in the following order:

1. Project Index
2. Project Vision
3. Design Principles
4. Proof Levels
5. Research Documents
6. Requirements
7. Architecture
8. Implementation

---

# Evolution Policy

The repository is expected to evolve continuously.

When conceptual changes become necessary, updates shall begin at the originating conceptual document before dependent documents are reviewed.

This process preserves consistency throughout the project's knowledge architecture.

---

# Scope

This document defines **how the repository is organized**.

It does **not** define:

* the project vision
* the research questions
* the software architecture
* implementation details

Those topics are specified in their respective documents.

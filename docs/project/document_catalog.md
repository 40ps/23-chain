# 23-chain Document Catalog

**Document ID:** P2  
**Title:** Document Catalog  
**Version:** 0.1.0  
**Status:** Accepted Draft  
**Authority:** Normative  
**Owner:** Wolfgang Lohmann  
**Maintainer:** 23-chain Project  
**License:** MIT  
**Depends On:** P1

---

# Purpose

This document provides the central catalog of the current and planned canonical knowledge artifacts of the 23-chain project.

It identifies the role of each document, its location, its current lifecycle status and authority, and its direct conceptual dependencies.

The catalog is intended to help contributors, reviewers, repository maintainers, and AI assistants navigate the project's knowledge structure without treating repository file presence or Git tracking state as equivalent to project authority.

This catalog is an index of project knowledge. It does not duplicate or replace the authoritative content of the documents it references.

---

# Catalog Principles

## Conceptual origin

Project knowledge belongs in the document responsible for the corresponding concept.

The catalog describes where knowledge belongs; it does not become an alternative source of truth for that knowledge.

When a significant concept changes, the change begins at its conceptual origin and dependent artifacts are subsequently reviewed for consistency.

## Status and authority

Document status and document authority are separate dimensions.

**Status** describes the lifecycle state of a document.

**Authority** describes its project-level normative or epistemic role.

This version of the catalog does not define a complete status or authority taxonomy. Values recorded here reflect the known state of the corresponding documents or their planned role.

For planned documents whose authority has not yet been determined, the catalog records `TBD` rather than inferring an authority classification.

## Repository presence and authority

The presence of a file in the repository does not by itself establish that the file represents current canonical project knowledge.

The repository contains historical prototype, research, requirements, architecture, and implementation artifacts that predate the current knowledge-first project structure.

These artifacts may be retained for provenance, historical analysis, or reference without defining current project direction.

Likewise, working or continuity artifacts may exist outside the committed repository state without thereby becoming canonical project knowledge.

## Catalog scope

This catalog primarily covers documents that form, or are planned to form, the current canonical project knowledge structure.

Historical artifacts, working communication, continuity material, implementation artifacts, and incubating ideas do not need individual entries unless their relationship to the canonical knowledge structure requires explicit documentation.

A planned document appearing in this catalog establishes its intended place in the knowledge structure. It does not establish content, authority, dependencies, or implementation decisions beyond what is explicitly recorded.

---

# Document Catalog

| ID | Document | Path | Purpose | Status | Authority | Depends On |
|---|---|---|---|---|---|---|
| P1 | Project Index | `docs/project/index.md` | Primary repository entry point and definition of the project's knowledge-first documentation structure. | Accepted Draft | Normative | — |
| P2 | Document Catalog | `docs/project/document_catalog.md` | Catalog of current and planned canonical project knowledge artifacts and their direct dependencies. | Accepted Draft | Normative | P1 |
| — | Project Governance | `docs/project/governance.md` | Define project roles, decision authority, review responsibilities, and governance principles. | Planned | TBD | TBD |
| V1 | Project Vision | `docs/vision/project_vision.md` | Define why 23-chain exists, its intended direction, scope, and primary objectives. | Accepted Draft | Normative | P1 |
| — | Design Principles | `docs/vision/design_principles.md` | Define principles governing research, architecture, implementation, and project evolution. | Planned | TBD | TBD |
| — | Proof Levels | `docs/vision/proof_levels.md` | Define the project's conceptual framework for recording, replay, verification, enforcement, and associated trust assumptions. | Accepted Draft | Normative | P1, V1 |
| — | Prototype Baseline | `docs/vision/prototype_baseline.md` | Describe the historical prototype, what it demonstrated, its limitations, and which assumptions must not define the new architecture. | Planned | TBD | TBD |
| — | Computation Models | `docs/vision/computation_models.md` | Define the role of computation models within 23-chain and the use of Wolfram (2,3) as the initial reference model. | Accepted Draft | Normative | P1, V1, Proof Levels |
| — | Wolfram (2,3) Machine Specification | `docs/vision/wolfram_23_machine_specification.md` | Define the Wolfram (2,3) reference machine and its machine-step semantics for use as the initial concrete computation reference. | Accepted Draft | Normative | P1, V1, Computation Models |
| — | Research Questions | `docs/vision/research_questions.md` | Define the research questions that guide investigation and evidence collection. | Accepted Draft | Normative | P1, V1, Proof Levels, Computation Models |
| — | Glossary | `docs/research/glossary.md` | Establish precise terminology used across computation, state, proof, protocol, and trust research. | Planned | TBD | TBD |
| — | Computation on Bitcoin | `docs/research/computation_on_bitcoin.md` | Investigate computation claims and computational expressiveness in Bitcoin-style transaction and Script systems. | Planned | TBD | TBD |
| — | Proof Taxonomy | `docs/research/proof_taxonomy.md` | Develop the formal distinctions between recording, replay, verification, enforcement, proof models, and trust models. | Planned | TBD | TBD |
| — | State Models | `docs/research/state_models.md` | Investigate representation, serialization, commitments, determinism, and other state-model concerns. | Planned | TBD | TBD |
| — | Protocol Evolution | `docs/research/protocol_evolution.md` | Investigate how relevant Bitcoin/BSV protocol capabilities and historical changes affect computation and proof constructions. | Planned | TBD | TBD |
| — | Requirements | `docs/requirements.md` | Define system requirements derived from accepted vision and research. | Planned | TBD | TBD |
| — | Architecture | `docs/architecture.md` | Define how accepted requirements are realized by the system architecture. | Planned | TBD | TBD |

---

# Historical and Reference Material

23-chain retains historical artifacts where they provide useful provenance, evidence, or context.

Historical material may include:

- the original Buildathon/Replit prototype;
- prototype source code and implementation documentation;
- earlier requirements and architecture drafts;
- original prompts and prompt extraction material;
- retrospectives;
- repository reset and assumption-review artifacts.

Retention does not imply current normative authority.

Where historical material materially affects current project reasoning, an appropriate current canonical document should explain that relationship rather than requiring readers to infer current project direction from legacy artifacts.

The planned Prototype Baseline is intended to provide a controlled bridge between historical prototype material and the current knowledge structure.

---

# Working and Continuity Material

Working communication, session handovers, repository integration reports, review notes, and similar artifacts support project operation but are not canonical merely because they exist in or alongside the repository.

Important knowledge originating in such material should migrate to the appropriate canonical document when accepted.

---

# Dependency Interpretation

`Depends On` records direct conceptual dependencies relevant to understanding or maintaining a document.

It is not intended to represent every possible reference between documents.

A dependency is recorded only when it has been established. `TBD` means that the dependency relationship has not yet been determined; it must not be inferred solely from document order or conceptual-layer membership.

Reverse dependencies are not maintained manually in this version of the catalog.

If dependency maintenance later becomes burdensome, tooling may derive reverse relationships or perform impact analysis from the forward dependency information.

---

# Evolution

This catalog should evolve as the canonical knowledge structure develops.

New documents should be added when their conceptual responsibility becomes sufficiently clear.

The catalog should not create documents merely to complete a theoretical hierarchy.

Identifiers, authority classifications, and dependencies for planned documents should be assigned when there is sufficient project evidence to do so rather than being invented for catalog completeness.

Historical artifacts should not be removed solely because they are no longer authoritative. Their organization and labeling may be improved as the new canonical structure matures and clearer separation becomes useful.

Any future restructuring should preserve useful provenance while making the distinction between current canonical knowledge and historical/reference material clear.

# Project Assumptions and Direction Corrections

This file captures intentional corrections and future direction.
These assumptions override accidental conclusions derived from
historical prompts or hackathon implementations.

## A1 Historical prompt limitations

The original prompt is a historical source.
It is not automatically authoritative.

Implemented behavior may intentionally differ.

## A2 Hackathon constraints

The project originated from a one-day hackathon.

Current implementation may contain:

- shortcuts
- temporary architecture
- demo assumptions
- implementation leakage

These are not automatically future requirements.

## A3 Primary project goal

The primary goal is comparison of representations of the same
Turing Machine across protocol evolution stages.

The implementation itself is only part of the experiment.

## A4 Protocol evolution

Multiple protocol stages are expected.

Examples:

- local simulation
- record-only BSV
- stronger validation variants
- Chronicle-aware versions
- future BTC variant

## A5 Dry Run mode

Dry Run is an intentional product capability.

It is not a workaround.

## A6 BSV library isolation

BSV dependencies may lag protocol evolution.

Facade/adapter boundaries should isolate:

- Chronicle support
- transaction builders
- broadcast mechanisms

## A7 Broadcast providers

Future support for user-provided API keys should be possible.

Broadcasting should not be tightly coupled to a single provider.

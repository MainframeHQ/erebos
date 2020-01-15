---
title: Data structures
---

Erebos provides additional data structures and APIs built on top of Swarm, in the following packages:

- [`Feed list`](feed-list.md) implements append-only lists on top of raw Swarm feeds.
- [`Document synchronization`](doc-sync.md) uses CRDTs to synchronize JSON data from multiple sources.
- [`Timeline`](timeline-api.md) implements the [Timeline protocol specification](timeline-spec.md), a singly-linked list of JSON payloads using Swarm feeds.

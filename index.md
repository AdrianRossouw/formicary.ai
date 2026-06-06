---
layout: default
title: What survives the agent
description: Applied research on whether regulated-software discipline makes AI-generated code last.
---

<div class="masthead">
  <p class="kicker masthead__eyebrow">The thesis &middot; pre-experiment</p>
  <h1 class="masthead__title">What survives the agent</h1>
  <p class="masthead__deck">borrowing regulated-software discipline to make AI code last</p>
  <p class="masthead__byline mono">Adrian Rossouw &middot; June 2026 &middot; working notes</p>
</div>

{% include epistemic.html
  label="Epistemic status"
  status="Thesis, pre-experiment"
  confidence="Working hypothesis, not yet tested"
  last_revised="June 2026"
  note="This is a statement of the question Formicary is investigating, not a report of findings. The first experiment is in design; no trials have run yet. What follows is the reasoning that led to the question. Expect it to change as real data arrives."
%}

<hr class="rule-mark">

<article id="essay" class="prose">

<p class="lede">You can build a working SaaS application in a weekend with an AI agent now. That is new, and on its own it is a party trick. The interesting question about AI-assisted software is not what gets shipped on Sunday night. It is what the code looks like in year three, when the original author is gone, when the requirements have drifted twice, when something has broken in production and somebody has to figure out what the agent was thinking when it wrote the function that is now on fire.</p>

That is the long tail of software. It is where most of the cost lives, where most of the value lives, and where AI-assisted code currently fails worst. A weekend prototype that nobody can maintain is not a productivity gain. It is technical debt at unprecedented velocity. If AI is going to matter for software in a way that compounds, it has to make the long tail better, not just the launch faster.

There is a body of practice that has been quietly working on this problem for thirty years, and almost nobody in the AI tooling space is reading it. The regulated-software industries (medical devices, aviation, pharma, finance) have spent decades accumulating answers to the question of how a fallible builder can be made to produce trustworthy, maintainable software. Most of those answers are not about the software itself. They are about the *process* that produces it: change control, design review, configuration management, training records, management review, supplier qualification, corrective action. The standards that govern these industries are largely process documents. They describe the activity of building, not the build.

That is, in itself, the central insight of regulated software. These industries discovered, the hard way, that reliable software is downstream of a reliable process, and that no amount of cleverness in the developer compensates for an uncontrolled environment around the developer. Process-as-substrate-for-quality is not bureaucratic overhead. It is the thing.

But not all of regulated practice is process. A non-trivial subset is artifact-shaped: encoded in the deliverables themselves, not in the activity that produces them. Requirement IDs and traceability matrices. EARS-syntax requirements. The structure of a software requirements specification. Hazard analysis documents. Software-of-unknown-provenance registers. Verification records that follow a particular form. Commit conventions that link change to requirement to test. These artifacts exist because, for the human builders the standards were originally written for, the alternative was unreliable. Memory fails. Context evaporates. Software outlives the people who wrote it. The artifact-shaped clauses encode techniques that survived because they made the work durable.

This is where AI agents become measurable, and it is the surface area of this site. Formicary tests the artifact-shaped subset of regulated-industry standards against AI agents under controlled conditions. It does not test process clauses, because those govern organisations rather than builders, and AI agents do not have organisations behind them. Whether a notified body would accept an agent-produced design history file is not a question for me; it is a question for a notified body. What I can do is test, with measurement, whether AI agents can be scaffolded to produce the artifact-shaped outputs that the artifact-shaped clauses require. That is a smaller claim than "AI can do regulated software." It is also a defensible one, and one the field has argued about far more than it has measured.

Within that scope, my bet is the following. The artifact-shaped techniques regulated industries have accumulated are good *prompting technology*. They make AI-generated software more consistent, more inspectable, and more maintainable, especially across the long tail where AI-assisted code currently breaks down. A REQ-ID is a structural constraint that makes an agent's output traceable in ways that survive the agent. EARS syntax gives you requirements an agent can verify itself against. Hazard analysis is a structured red-team brief, and it produces stronger threat coverage than ad-hoc prompting ever will. The reason these techniques have stayed inside regulated industries is not that they are bad ideas elsewhere. It is that, for human builders, they are expensive. AI changes that arithmetic. A discipline that used to cost a senior engineer two days now costs an agent twenty minutes and a code review. The knowledge barrier remains; the cost barrier is gone.

A note on the position I am writing from. I have spent the last five years as VP of Information Systems and Product at Renalytix, leading the technology organisation behind an FDA De Novo-authorized AI diagnostic, running a software group under ISO 13485 and ISO 27001, and shipping production EHR integrations with major US health systems. Before that, nearly seven years at NearForm in delivery architecture and technical direction. I know which clauses of these standards live in artifacts and which live in management review meetings, because I have been audited under both. That is the qualification this site requires: not deep clause-by-clause expertise on the standards themselves, but the lived experience of knowing where the testable surface ends. The clause-depth work, the actual experiments, are where my own learning happens too. This is applied research, in public, by someone who has run the regulated organisations these standards govern, but who has not previously had the leverage to test the artifact-shaped subset of them against an agent at experimental scale. AI provides the leverage. Formicary is the work.

None of this is happening in a vacuum, and some of it is already happening well. Spec-driven development has become the mainstream answer to unreliable agent output: write the specification first, then let it drive the plan, the tasks, and the code. Tooling like GitHub's Spec-Kit has turned spec-as-source from a fringe idea into a standard workflow with a large following. That movement has more or less settled the general question. Structured artifacts make agents more reliable. So the useful question now is not whether, but which. Spec-driven development leans on the specification and little else, while the wider vocabulary the regulated industries spent thirty years building, requirement IDs, traceability, EARS syntax, hazard analysis, has barely entered agent workflows at all. The question I care about is narrow and practical: of those techniques, which ones actually improve outcomes, and by how much?

The first experiment, Gen 001, tests the lowest-cost technique with the most obvious transfer beyond regulated industries: requirement IDs. The substrate is the backend of a small recipe application. The point is not to build it once and score it, but to put it through a fixed sequence of changes, the way a real product drifts and gets refactored over time, and to watch what survives. The same sequence runs under different scaffolding variants: one gives the agent a flat specification, another adds REQ-IDs to the spec, a third adds REQ-IDs plus references to them in the agent's instructions and commit conventions. Each variant is run multiple times, because agent runs vary and an effect only means something against that noise.

Two things get measured, and keeping them apart matters. The first is whether the scaffolding maintains itself: do the requirement links still hold after the changes, do commits still carry REQ-IDs, does traceability survive contact with churn. On its own that proves little, because adding REQ-IDs trivially makes REQ-IDs present; the question is whether they last. The second, and the one that actually justifies the technique, is whether any of that buys something worth having: code that still works, earlier requirements that still pass after later changes are layered on top. The interesting result is whether those move together, the scaffolded variants keeping both their traceability and their function while the flat one loses both. If they come apart, if the links survive but the software does not, that is also a finding, and a more useful one than confirming the bet. Connecting the mechanism to the payoff is the hard part, and it is what I am still designing.

Designing that scorer suite is the current work, and it is the hard part. Deciding what counts as a requirement being *satisfied* rather than merely *referenced* is where conformance measurement stops being mechanical and starts requiring judgement. Most of what passes for AI evaluation right now is benchmark theatre; if I cannot defend the scorer, the numbers are noise. So I am isolating the irreducibly semantic judgement to the smallest possible surface, scoring everything around it deterministically, and validating the judge against a hand-scored gold set before trusting it across trials. I would rather get the evaluation defensible before running a single trial than generate numbers I cannot stand behind. Where exactly conformance scoring stops being mechanical is, in itself, one of the findings.

It is a deliberately unsurprising experiment. I do not expect it to overturn anyone's intuition. I expect it to produce numbers (effect sizes, variance estimates, conditions under which the technique helps and conditions under which it does not) for a question that almost everyone in the AI tooling space has an opinion on but very few have measured. The contribution is the measurement, not the discovery. The field currently has a glut of novelty and a famine of receipts. I would rather publish honest results on obvious questions than novel speculation on hard ones.

If requirement IDs turn out to be worth the trouble, the obvious next techniques are EARS-syntax requirements, traceability matrices, and hazard analysis. Each would be its own experiment, run against the same scorer suite, written up the same way: what it tested, what it left out, what it found. But that is contingent on the first one earning it. I am not committing to a programme or a calendar. I am running one experiment. If it is useful, I will run another.

The first experiment is in design, and its evaluation is what I am building now. I will write up what I find, when I find it. Working notes, in public.

<p class="masthead__byline mono">Adrian Rossouw, June 2026</p>

</article>

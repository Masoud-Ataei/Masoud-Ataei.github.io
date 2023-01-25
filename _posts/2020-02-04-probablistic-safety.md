---
layout: post
title: Probabilistic Safety Constraints
date:   2020-02-04
categories: papers
---


<img style="float:right" src="/images/mjkhojas-probablistic-safety.svg" />
How do you ensure safety when the robot behavior is only known with uncertainty?
We propose Probabilistic Safety Constraints for High Relative Degree System
Dynamics. We show how to learn a system with a Bayesian Learning method that
keeps track of uncertainty while ensuring safety upto an acceptable risk factor,
for example, 99.999%.
We use the framework of Control Barrier Functions and extend it to higher-order
relative degree systems while propagating uncertainty in model dynamics to the
safety constraints.

 This paper focuses on learning a model of system dynamics online while satisfying safety constraints. Our motivation is to avoid offline system identification or hand-specified dynamics models and allow a system to safely and autonomously estimate and adapt its own model during online operation. Given streaming observations of the system state, we use Bayesian learning to obtain a distribution over the system dynamics. In turn, the distribution is used to optimize the system behavior and ensure safety with high probability, by specifying a chance constraint over a control barrier function. 
[Paper](https://arxiv.org/abs/1912.10116)
[Bibtex](publications/mypub_bib.html#khojasteh2020probabilistic)

<div class="bibtexitem" style="clear:both" >
Mohammad Javad Khojasteh*, Vikas Dhiman*, Massimo Franceschetti, Nikolay Atanasov
"Probabilistic Safety Constraints for Learned High Relative Degree System Dynamics"
</div>

## Presentation in ITA on Feb 4
<div class="row">
<iframe width="600" height="400"
  src="https://wecacuee.github.io/BayesCBF-presentation-html/index.html" ></iframe>
</div>

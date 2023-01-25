---
layout: post
title: Safe control  synthesis with uncertain dynamics and constraints
date:   2022-03-03
categories: papers
---

<img style="float:right;width:200px" src="/images/long2022safe-control-traj.png" />
[This paper](https://arxiv.org/abs/2202.09557) considers safe control synthesis for dynamical systems in the presence of uncertainty in the dynamics model and the safety constraints that the system must satisfy. Our approach captures probabilistic and worst-case model errors and their effect on control Lyapunov function (CLF) and control barrier function (CBF) constraints in the control-synthesis optimization problem. We show that both the probabilistic and robust formulations lead to second-order cone programs (SOCPs), enabling safe and stable control synthesis that can be performed efficiently online. We evaluate our approach in PyBullet simulations of an autonomous robot navigating in unknown environments and compare the performance with a baseline CLF-CBF quadratic programming approach. 

[Paper](https://arxiv.org/abs/2202.09557)
[Bibtex](publications/mypub_bib.html#long2022safe)

<div class="bibtexitem" style="clear:both" >
Kehan Long, Vikas Dhiman, Melvin Leok, Jorge Cortés, and Nikolay Atanasov. Safe control synthesis with uncertain dynamics and constraints. Preprint on https://arxiv.org/abs/2202.09557, 2022.
</div>


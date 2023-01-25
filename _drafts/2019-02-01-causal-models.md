---
layout: post
title: Causality
date:   2019-02-01
categories: statistics
---

How is causality useful in developing AI?

# What is causality

* It was hard to define causality.
* People stumbled on correlation. 
* But correlation was not causality.
* Perhaps causality does not exists?

# History

* Statistics started as a search for causality. Correlation was result of a
  failure to find causality.
* Correlation is not causation, so perhaps causation does not exists. The dogma
  persisted.
* When Stewall Wright, presented his [paper][ titled "Correlation and Causation" in 1921,
  immediate backlash from the statistics. The dogma persisted.
  Stewall's definition of causality was in contrast to correlation.

> The degree of correlation between two variables can be calculated by
> well-known methods, but when it is found it gives merely the resultant of all
> connecting paths of influence.

> ... a method of measuring the direct influence along each separate path in such a
> system and thus of finding the degree to which variation of a given effect is
> determined by each particular cause.
  
* Fischer gave the world Randomized Control Trials as gold standard of testing
  causality.
* Does smoking cause cancer? Reasonable evidence existed, but statisticians lead
  by Fischer fought back. Correlation does not imply causation. After 20 years of 
  debate common sense won and Fischer lost.
* Different communities independently invented some version of Stewall Wright's
  methodology.
* Debate is somewhat settled. We have do-calculus now.

# Contemporary understanding causality

## Definition of causality

## Graphical method of computing degree of causality

* Assume causal relationships
* Collect evidence
* Compute the effect of changing the cause while keeping everything else
  constant.
  
## Axioms of do-calculus

## Randomized control trials as do-calculus

## Back-door criterion and Front-door criterion

# Is causality useful?

# Causal discovery

# Causality and artificial intelligence

# References

[pearl2018why]: http://bayes.cs.ucla.edu/jp_home.html
* [1][pearl2018why] The Book of Why, Judea Pearl. 2018


[lecturesshalizi]: http://www.stat.cmu.edu/~cshalizi/402/
* [2][lecturesshalizi] C. Shalizi lectures on statistics. 

[kollerPGM]: https://mitpress.mit.edu/books/probabilistic-graphical-models
* [3][kollerPGM] Probabilistic Graphical Models. Daphne Koller and Nir Friedman. 2009

[wright1921correlation]: https://naldc.nal.usda.gov/download/IND43966364/PDF
* [4][wright1921correlation] Correlation and Causation. Stewall Wright. 1921

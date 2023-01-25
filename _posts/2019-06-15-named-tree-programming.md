---
layout: post
title:  "Named-tree programming style"
date:   2019-06-15
categories: programming-notes
---

Named-tree programming is a natural Pythonic functional programming paradigm. It
encourages thinking of functions and classes as sub-trees in a bigger tree.

Thinking of a computer program as a tree is not new. It was pioneered by LISP
and lisp like languages. However, the S-expressions of LISP encouraged unnamed
trees that reduced their accessibility for modification.

The modern programming language Python explicitly relies on dictionaries as variable
namespaces. It also depends on keyword arguments as default arguments for functions
that can be accessed as dictionaries. This naturally encourages a named-tree based
programming style.

This programming style aims for flexibility and not safety. It trusts the
programmer and allows the programmer to modularize the program while
keeping it flexible.

# Problem: Choice of configuration language

The common choices of configuration language are JSON, XML and Protocol Buffers.
The desirable properties of these languages are that they must be serializable
into human readable and editable text format. But why not use a programming
language like Python or LISP for saving the configuration. Why distinguish between
a configuration language and a programming language? All configuration languages
are a subset of programming languages.

# Problem: Passing configuration arguments deep into the functions of functions.

A bad way of passing arguments to embedded functions

``` python
def foo(a = 1, b = 3, c = 2):
    x = a*2
    # this is just bad, you are expanding the parent functions argument list just to
    # pass them to the next function. If you modify the signature of `bar` later on,
    # you will also need to modify the signature of `foo`.
    return bar(x = x, b = b, c = c)
```

A better way is to pass the underlying function as a dictionary.

``` python
def foo(a = 1, bar_kw = dict(b = 3, c= 2)):
    x = a*2
    # This is much better with respect to flexibility of `bar` signature.
    return bar(x = x, **bar_kw)
```

An even better way is to consider the `bar`, the function itself a
part of configuration.

``` python
from functools import partial

bar_b3_c2 = partial(bar, b = 3, c = 2)

def foo(a = 1, bar_ = bar_b3_c2):
    x = a*2
    # This is even better because the user of `foo` can replace bar_ with an
    # arbitrary function that accepts `x` as argument.
    return bar_(x = x)
```

## Solution: recpartial

``` python
from kwplus.functools import recpartial

foo_b3_c2 = recpartial(foo,
              {"bar.b": 3, "bar.c": 2})

```

# Program-Configuration relation

This terminology was pioneered by website backends. Model-View-Configuration based
separation emphasizes the separation of the viewing of the website, the model of the
website and its configuration. 

Named-tree programming emphasizes not only the separation between configuration
and rest of the program but also emphasizes the recursive nature of program and
configuration. If we think of all programs as trees, then the functionality
provided by the programming language and standard libraries are the leaf nodes.
Every function is configuration of functions at the lower level. Hence the top-level
configuration is the should also be written in the same programming language and
should indicate that it can be build upon.

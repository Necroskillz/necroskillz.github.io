---
layout: post
title: Generate repositories for Entity framework data model with Ctrl+S
description:
modified: 2010-06-19
tags: [Entity Framework, NecroNetToolkit]
comments: true
---
I already explained how to make repositories simpler, by deriving from
generic base. But the fact you need to create a repository for each
entity in the data model still seemed like too much repetitive work. So
I inspired by T4MVC and created a T4 file to generate repositories.

Basically what I do is get the project that the template file is in,
search that project for all .edmx files, use Linq to XML to get entity
type names and entity set names from conceptual models section, then
iterate over entity sets in each file and generate the repositories.

Obviously this is specific to NecroNet Toolkit and will only work with
unit of work and repository base form the toolkit. But you could make
more complicated template file, to just generate repositories with all
methods you need without the need of any third party libraries (no way
I’m doing that though, so far I’m happy with the way unit of work +
repositories in NecroNet Toolkit work).

One final note is that the template generates partial classes and
partial interfaces, so you can extend it with you custom methods if you
need.

You can download the code along with NecroNetToolkit from github -
<http://github.com/Necroskillz/NecroNetToolkit>.

Exact link to the T4 template:
<http://github.com/Necroskillz/NecroNetToolkit/blob/master/T4Templates/Repositories.tt>

Reference articles:
-   [Generic repository for Entity
    Framework](http://www.necronet.org/archive/2010/04/10/generic-repository-for-entity-framework.aspx)
-   [Unit of Work pattern in
    NecroNetToolkit](http://www.necronet.org/archive/2010/06/19/unit-of-work-pattern-in-necronettoolkit.aspx)

---
layout: post
title: Generic repository for Entity Framework
description:
modified: 2010-04-10
tags: [Entity Framework, NecroNetToolkit]
comments: true
---
The repetition of code in repositories I was previously writing got me
thinking – is there a way to simplify and abstract this up the
inheritance tree. Just to give you the idea of what it can do, here is
the actual interface I’m using now:

```csharp
public interface IRepository<TEntity> where TEntity : class
{
    IEnumerable<TEntity> GetEnumerable();
    IEnumerable<TEntity> GetEnumerable(Expression<Func<TEntity, bool>> predicate);
    IEnumerable<TEntity> GetEnumerable<TKey>(Expression<Func<TEntity, TKey>> keySelector, bool ascending = true);
    IEnumerable<TEntity> GetEnumerable<TKey>(Expression<Func<TEntity, bool>> predicate, Expression<Func<TEntity, TKey>> keySelector, bool ascending = true);

    IList<TEntity> GetList();
    IPagedList<TEntity> GetPagedList(int index, int pageSize);
    ISortedPagedList<TEntity> GetSortedPagedList(int index, int pageSize, string sortKey, string sortDirection);

    IList<TEntity> GetList(Expression<Func<TEntity, bool>> predicate);
    IPagedList<TEntity> GetPagedList(Expression<Func<TEntity, bool>> predicate, int index, int pageSize);
    ISortedPagedList<TEntity> GetSortedPagedList(Expression<Func<TEntity, bool>> predicate, int index, int pageSize, string sortKey, string sortDirection);

    TEntity Get(Expression<Func<TEntity, bool>> predicate);

    void Add(TEntity entity);

    void Remove(Expression<Func<TEntity, bool>> predicate);
    void Remove(TEntity entity);
    void RemoveRange(Expression<Func<TEntity, bool>> predicate);

    int Count(Expression<Func<TEntity, bool>> predicate);
    int Count();
}
```

It’s basically everything you need from a repository – CRUD methods,
various lists and count. Now the question is how to implement this to
work with any entity set of any object context. The one thing you need
to know and can deduce from anywhere is the name of entity set you’re
working with. I solved this using an attribute I would place on the
inherited repositories:

```csharp
[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = false)]
public class EntitySetNameAttribute : Attribute
{
    public EntitySetNameAttribute(string name)
    {
        EntitySetName = name;
    }

    public string EntitySetName { get; set; }
}
```

Now that I have a way of finding out the name of the entity set, I can
start working on the repository itself. Another thing I need to
initialize the repository is the type of the object context I’m using. I
used a generic parameter for that, because I will be reducing these as I
inherit more specific types (I will demonstrate that later). Now here’s
how declaration looks like:

```csharp
public abstract class UltimateEntityRepositoryBase<TObjectContext, TEntity> : IRepository<TEntity>
    where TEntity : class
    where TObjectContext : ObjectContext
```

Now I have everything I need, so let’s see the initialization code:

```csharp
private static PropertyInfo _entitySetPropertyInfo;

protected abstract TObjectContext ObjectContext { get; }

protected ObjectSet<TEntity> EntitySet
{
    get
    {
        if(_entitySetPropertyInfo == null)
        {
            Initialize();
        }
        return _entitySetPropertyInfo.GetValue(ObjectContext, null) as ObjectSet<TEntity>;
    }
}

private void Initialize()
{
    object[] attributes = GetType().GetCustomAttributes(typeof(EntitySetNameAttribute), false);
    if(attributes == null || attributes.Length > 1 || attributes.Length == 0)
    {
        throw new InvalidOperationException("Invalid EntitySetName attribute setup.");
    }

    string entitySetName = ((EntitySetNameAttribute)attributes.First()).EntitySetName;
    _entitySetPropertyInfo = typeof(TObjectContext).GetProperty(entitySetName);

    if(_entitySetPropertyInfo == null)
    {
        throw new InvalidOperationException("Invalid entity set name.");
    }
}
```

Let’s go over this real quick. I have a static property info about the
entity set I’m working with and I need to initialize it, so I can use
the EntitySet property to get the actual property from object context
(notice that ObjectCotext property is abstract, and to be specified
later, because at this point it’s not clear where you get your object
context from – could be a new one, from some kind of manager (e.g. unit
of work pattern), through dependency injection, or some other method)).
The Initialize method is simple – just get the EntitySetName attributes
on the repository, find out the name of the entity set, and get the
property info from type of the object context. It’s only necessary to do
that once for each repository per app domain restart – hence the static
property info field.

With the repository initialized, I have access directly to the entity
set property, and I can perform queries on top of it. Here’s an example
of how it’s done:

```csharp
public virtual IList<TEntity> GetList()
{
    return EntitySet.ToList();
}

public virtual IList<TEntity> GetList(Expression<Func<TEntity, bool>> predicate)
{
    return EntitySet.Where(predicate).ToList();
}
```

And so on… you get the drift. I implement all the methods from the
interface like that… really simple.  Now that I got the base completed,
and I want to start developing a new application with entity framework,
I can do that (for simplicity):

```csharp
public class MyRepositoryBase<TEntity> : UltimateEntityRepositoryBase<MyEntities, TEntity>
    where TEntity : class
{
    protected override MyEntities ObjectContext
    {
        get
        {
            return (MyEntities)UnitOfWork.CurrentContext;
        }
    }
}
```

This is how I would do it (using unit of work to manage my object
context), you can replace it with any other way you might be using to
get object context in your application. The repository is almost ready
now; all that’s left is to create concrete types. And this can be
literally done with a snap of your fingers. You declare an interface:

```csharp
public interface IProductRepository : IRepository<Product>
{
}
```

And an implementation:

```csharp
[EntitySetName("Products")]
public class ProductRepository : MyRepositoryBase<Product>, IProductRepository
{
}
```

And that’s it! If you need some special methods in your repository, you
can just declare them in the concrete class, and use either the entity
set property or the whole object context. Also, notice that (after few
refactorings) the repository does no work whatsoever with the object
context - all it does is get the entity set property. So what I like to
do with my unit of work implementation (also part of NecroNetToolkit -
there will be a post on it later) is use dependency injection to inject
these repositories to controllers (in case of mvc) and use singleton
scope. That way I only create one of each repository, and only thing
that's changing is the object context within unit of work manager and
the entity property will always fetch from the current context.

The source code is available on github:
<http://github.com/Necroskillz/NecroNetToolkit>

Side note: Source code is for entity framework 4, but can be modified to
work with EF1 as well.

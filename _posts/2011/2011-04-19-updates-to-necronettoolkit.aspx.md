---
layout: post
title: Updates to NecroNetToolkit
description:
modified: YYYY-04-DD
tags: [NecroNetToolkit, Entity Framework]
comments: true
---
I’m updating NecroNetToolkit at the moment, mainly because of the
[release of Entity Framework
4.1](http://blogs.msdn.com/b/cesardelatorre/archive/2011/04/14/entity-framework-4-1-just-released.aspx),
so I wanted to write about the changes and show you some things that are
now possible. The main update concerns the repository base classes, as I
needed to add support for Entity Framework Code First.

That proved a little harder that I initially thought, because the .emdx
model classes use ObjectContext, and therefore each set is represented
by IObjectSet&lt;TEntity&gt;, but code first uses new wrapper class
called DbContext in which sets are represented by IDbSet&lt;TEntity&gt;.
These are not compatible, in fact they even have different method naming
(Add – AddObject, Remove – DeleteObject).

After some consideration I came up with an adapter that will be used by
the repository to communicate with the data store. I’m talking about the
repository at the top of the inheritance tree. It will have no clue
about what data store is used. In previous version, it used
IObjectSet&lt;TEntity&gt; interface to access data, so it was tightly
coupled with entity framework – that is no longer the case, this is the
reason why I changed the name of the namespace from EntityFramework to
Data.

Let’s see some code now, shall we? Here’s the adapter:

```csharp
public interface IEntityOperator<TEntity> 
{
     void AddEntity(TEntity entity);
     void RemoveEntity(TEntity entity);
     IQueryable<TEntity> GetConfiguredQuery(QueryConfig config);
     IQueryable<TEntity> GetQuery();
}
```

```csharp
public abstract class EntityOperatorBase<TEntity, TDataStore> : IEntityOperator<TEntity> 
{
     protected Func<TDataStore> GetStore;

     protected EntityOperatorBase(Func<TDataStore> getStore) 
     {
         GetStore = getStore;
     }

     public abstract void AddEntity(TEntity entity);

     public abstract void RemoveEntity(TEntity entity);

     public abstract IQueryable<TEntity> GetConfiguredQuery(QueryConfig config);

     public abstract IQueryable<TEntity> GetQuery();
}
```

The methods are pretty straight forward – add, remove, read – configured
query is something I have to use
[Include](http://msdn.microsoft.com/en-us/library/gg696450%28v=vs.103%29.aspx).
The interesting part for me is how I get access to the data store.
Remember that instance of this class is a property in the repository,
where you also have a property with you DbSet, ObjectSet or whatever you
use to store your data. So I’m creating this adapter class in the
repository, and passing a delegate that returns a reference to a data
store.

You can check out how I implemented these to fit .edmx and code first
based repositories on
[github](https://github.com/Necroskillz/NecroNetToolkit/tree/master/Source/NecroNet.Toolkit/Data/Repositories).
But for now, I will show you how to create your own repository based on
a different data store. I added this to the toolkit, it’s a in memory
repository I thought might be useful for unit testing purposes.

```csharp
public class MemoryEntityOperator<TEntity> : EntityOperatorBase<TEntity, IList<TEntity>>
{
     public MemoryEntityOperator(Func<IList<TEntity>> getStore) : base(getStore)
     {
     }

     public override void AddEntity(TEntity entity)
     {
         GetStore().Add(entity);
     }

     public override void RemoveEntity(TEntity entity)
     {
         GetStore().Remove(entity);
     }

     public override IQueryable<TEntity> GetConfiguredQuery(QueryConfig config)
     {
         return GetQuery();
     }

     public override IQueryable<TEntity> GetQuery()
     {
         return GetStore().AsQueryable();
     }
}
```

```csharp
public class MemoryRepository<TEntity> : UltimateRepositoryBase<TEntity> where TEntity: class
{
     private readonly List<TEntity> _data = new List<TEntity>();

     private IEntityOperator<TEntity> _operator;

     protected override IEntityOperator<TEntity> Operator
     {
         get
         {
             return _operator ?? (_operator = new MemoryEntityOperator<TEntity>(() => _data));
         }
     }

     public override void Clear()
     {
         _data.Clear();
     }
}
```

With that much code, you get [all the capabilities of the
repository](https://github.com/Necroskillz/NecroNetToolkit/blob/master/Source/NecroNet.Toolkit/Data/Repositories/Base/IRepository.cs),
with data store of your choice (in this case a in memory list).

---
layout: post
title: Unit of Work pattern in NecroNetToolkit
description:
modified: 2010-06-19
tags: [Entity Framework, NecroNetToolkit]
comments: true
---
I’m not going to explain the pattern and implementation here. There is
an
[article](http://nhforge.org/wikis/patternsandpractices/nhibernate-and-the-unit-of-work-pattern.aspx)
where the pattern and implementation is explained with full code you can
download. You notice it’s an implementation for NHibernate, so I rewrote
it to make it work with Entity Framework instead. I also made it more
general, so I could use it with any data model.

Usage is very simple. First, create a partial class of your object
context, and make it implement `IObjectContext` interface.

```csharp
public partial class MyEntities : IObjectContext
{
}
```

Next, you need to create a factory which will supply object contexts.
You are required to implement `Create` method from `IObjectContextFactory`
interface.

```csharp
public class MyEntitiesFactory : IObjectContextFactory
{
    public IObjectContext CreateObjectContext()
    {
        return new MyEntities();
    }
}
```

Once you have this set up, make this call at application startup
(Global.asax, App.xaml, etc…).

```csharp
UnitOfWork.Setup(typeof(MyEntitiesFactory));
```

You are now ready to start using Unit of Work. There are several ways to
use it. Most basic one it just use a using statement.

```csharp
using(UnitOfWork.Start())
{
    // do stuff with data
}
```

Or if you want to commit changes back to the database

```csharp
using(var scope = UnitOfWork.Start())
{
    // do stuff with data
    scope.Flush();
}
```

In a MVC application, I prefer to start unit of work at beginning of a
request, and dispose it when request ends. I like to use base controller
for that.

```csharp
private const string InitializedKey = "ControllerBase.Initialized";

private const string DisposedKey = "ControllerBase.Disposed";

private static bool Initialized
{
    get
    {
        return Local.Data[InitializedKey] != null;
    }
    set
    {
        Local.Data[InitializedKey] = value;
    }
}

private static bool Disposed
{
    get
    {
        return Local.Data[DisposedKey] != null;
    }
    set
    {
        Local.Data[DisposedKey] = value;
    }
}

protected override void Initialize(RequestContext requestContext)
{
    if(!Initialized)
    {
        UnitOfWork.Start();
        Initialized = true;
    }

    base.Initialize(requestContext);
}

protected override void Dispose(bool disposing)
{
    if(disposing && !Disposed)
    {
        UnitOfWork.Current.Dispose();
        Disposed = true;
    }

    base.Dispose(disposing);
}

protected void Persist()
{
    UnitOfWork.Current.Flush();
}
```

If you set it up this way, you can just access data any time when
controller exists, and everything is done automatically. You only have
to call Persist method when you want to commit data to the database.

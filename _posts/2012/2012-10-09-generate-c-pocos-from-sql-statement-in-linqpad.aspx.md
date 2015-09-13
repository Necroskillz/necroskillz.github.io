---
layout: post
title: Generate C# POCOs from SQL statement in LINQPad
description:
modified: YYYY-10-DD
tags: [LINQPad, SQL]
comments: true
---
Recently I’ve been optimizing some complex processes that have been
taking to long to execute using Entity Framework.The code in question
has been written by someone else when deadline was imminent and hasn’t
been touched since.

Usually u had a foreach, and inside of that was a few single gets (first
or default), extensive use of navigation properties and finally a
SaveChanges call in some cases. Iterating this way across thousands of
records is painfully slow. You can achieve much faster overall
performance by preloading the data first, then running the foreach on
data in memory. Of course not using Entity Framework because it will
generate crazy queries once theres a few let and select statements and
has slow mapping to objects.

I decided to try out [dapper](http://code.google.com/p/dapper-dot-net/)
to load the data, but it became repetitive to make classes for results
of the queries over and over again. So I made this little extension for
[LINQPad](http://www.linqpad.net/) (place in My Extensions and F5 to
compile) to generate POCO classes base on any SQL. It can handle stored
procedures, multiple result sets, nullable data types.

```csharp
public static class LINQPadExtensions
{
    private static readonly Dictionary<Type, string> TypeAliases = new Dictionary<Type, string> {
        { typeof(int), "int" },
        { typeof(short), "short" },
        { typeof(byte), "byte" },
        { typeof(byte[]), "byte[]" },
        { typeof(long), "long" },
        { typeof(double), "double" },
        { typeof(decimal), "decimal" },
        { typeof(float), "float" },
        { typeof(bool), "bool" },
        { typeof(string), "string" }
    };
    
    private static readonly HashSet<Type> NullableTypes = new HashSet<Type> {
        typeof(int),
        typeof(short),
        typeof(long),
        typeof(double),
        typeof(decimal),
        typeof(float),
        typeof(bool),
        typeof(DateTime)
    };

    public static string DumpClass(this IDbConnection connection, string sql)
    {
        if(connection.State != ConnectionState.Open)
            connection.Open();
            
        var cmd = connection.CreateCommand();
        cmd.CommandText = sql;
        var reader = cmd.ExecuteReader();
                        
        var builder = new StringBuilder();
        do
        {
            if(reader.FieldCount <= 1) continue;
        
            builder.AppendLine("public class Info");
            builder.AppendLine("{");
            var schema = reader.GetSchemaTable();
                        
            foreach (DataRow row in schema.Rows)
            {
                var type = (Type)row["DataType"];
                var name = TypeAliases.ContainsKey(type) ? TypeAliases[type] : type.Name;
                var isNullable = (bool)row["AllowDBNull"] && NullableTypes.Contains(type);
                var collumnName = (string)row["ColumnName"];
                
                builder.AppendLine(string.Format("\tpublic {0}{1} {2} {{ get; set; }}", name, isNullable ? "?" : string.Empty, collumnName));
            }
            
            builder.AppendLine("}");
            builder.AppendLine();            
        } while(reader.NextResult());
        
        return builder.ToString();
    }
}
```

Usage:

```csharp
this.Connection.DumpClass("select * from SomeTable")
```

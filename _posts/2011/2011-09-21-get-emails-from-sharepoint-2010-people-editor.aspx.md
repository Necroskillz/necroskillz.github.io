---
layout: post
title: Get emails from SharePoint 2010 people editor
description:
modified: YYYY-09-DD
tags: [SharePoint 2010]
comments: true
---
I’ve recently implemented a feature that was supposed to send emails to
all users selected by multi people picker in SharePoint, in one of our
projects. Of course SharePoint groups as well as AD groups could be
selected too.

It’s not extremely hard to do, but it’s handy to have it up for other
coworkers and peoples use.

```csharp
public static class SPFieldUserValueCollectionExtensions
{
    public static IEnumerable<string> GetAllEmails(this SPFieldUserValueCollection collection, SPWeb web)
    {
        var emails = new HashSet<string>();

        foreach (var item in collection)
        {
            if (item.User == null)
            {
                try
                {
                    // is it a SharePoint group?
                    var group = web.SiteGroups.GetByID(item.LookupId);
                    emails.AddEmailsFromSPGroup(group);
                }
                catch
                {
                    // ad group
                    var group = web.EnsureUser(item.LookupValue);
                    emails.AddIfNotNull(group.Email);
                }
            }
            else
            {
                emails.AddIfNotNull(item.User.Email);
            }
        }

        return emails;
    }

    private static void AddEmailsFromSPGroup(this HashSet<string> emails, SPGroup group)
    {
        if (!string.IsNullOrEmpty(group.DistributionGroupEmail))
        {
            emails.Add(group.DistributionGroupEmail);
        }
        else
        {
            foreach (SPUser user in group.Users)
            {
                emails.AddIfNotNull(user.Email);
            }
        }
    }

    private static void AddIfNotNull(this HashSet<string> set, string s)
    {
        if(!string.IsNullOrEmpty(s))
        {
            set.Add(s);
        }
    }
}
```

So basically you iterate through a SPFieldUserValueCollection, checking
if User property is null first. If it is, it means one of two things:
either it’s a SharePoint group or it’s an AD group that wasn’t loaded
into SharePoint yet. If the group is found in SiteGroups, it’s a
SharePoint group, otherwise AD group must be loaded using EnsureUser
method.

Also for SharePoint group, if DistributionGroupEmail property is not
set, the code drills into the group, and adds emails of all members.

One thing this method doesn’t do is drill into AD groups when email is
not set on that group. While it would be possible to do this, it is way
easier to convince customer to setup distribution emails on AD groups or
pass it onto your IT department (or theirs).

If your data doesn’t come from built in people picker field, but rather
from custom form with people picker, you can parse content into
SPFieldUserValueCollection like this:

```csharp
var mailUsers = new SPFieldUserValueCollection();
mailUsers.AddRange(from PickerEntity entity in UsersEditor.ResolvedEntities
             select
             new SPFieldUserValue(web, Convert.ToInt32(entity.EntityData["SPUserID"] ??
                                            entity.EntityData["SPGroupID"]),
                                  (string) entity.EntityData["AccountName"]));

emails = mailUsers.GetAllEmails(elevatedWeb).ToList();
```

Run with elevated privileges to access the SiteGroup property.

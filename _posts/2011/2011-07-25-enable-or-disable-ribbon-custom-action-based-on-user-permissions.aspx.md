---
layout: post
title: Enable or disable ribbon custom action based on user permissions
description:
modified: 2011-07-25
tags: [SharePoint 2010, SharePoint ecmascript]
comments: true
---
It’s been a while since I wrote something. That’s because I’ve been busy
at my new job (student no longer :() learning SharePoint 2010. Needless
to say it was quite the transition from nice, neat, clean way I was used
to from MVC to SharePoint where, well… a lot of thing don’t work and you
have to ‘hack’ a lot ;). But enough about my issues you don’t need to be
concerned with. Let’s have a look at the problem at hand.

Consider following scenario: you have to develop a custom action (a
ribbon button), that will only be enabled for certain content type and
only for a user who has the permission to edit that particular item
(each item in the list can have different permissions). This button will
be in a list view ribbon (e.g. AllItems.aspx). As you highlight
different items, that button will change state to either enabled or
disabled (greyed out) based on that criteria.

Creating the button itself is easy enough (nothing is easy in
SharePoint, but easy enough). Just create an empty element and write
CAML for custom ribbon button:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
    <CustomAction Location="CommandUI.Ribbon" Id="Ribbon.Documents.EditCheckout.DoSomething">
        <CommandUIExtension>
            <CommandUIDefinitions>
                <CommandUIDefinition Location="Ribbon.Documents.EditCheckout.Controls._children">
                    <Button Id="Ribbon.Documents.EditCheckout.DoSomethingButton"
                        Image32by32="/_layouts/images/ctor32.png" TemplateAlias="o1"
                        Command="DoSomething_Command"
                        LabelText="Do something"
                        ToolTipTitle="Do something" ToolTipDescription="Does something" />
                </CommandUIDefinition>
            </CommandUIDefinitions>
        </CommandUIExtension>
    </CustomAction>
</Elements>
```

That places the button to EditCheckout ribbon group of document
libraries.

Now for the harder part. First I tried to check all criteria for
enabling the button in javascript (canHandleCommand function in my [page
component](http://www.wictorwilen.se/Post/Creating-a-SharePoint-2010-Ribbon-extension-part-2.aspx)).
I could find out how many items was selected (and enable the button only
if a single item was selected) and I could also find out what is the
content type of currently selected item. What I couldn’t find out was
how to check if user has some permission for that item. I asked around
in my company, at [stack
overflow](http://stackoverflow.com/questions/6692877/sharepoint-2010-enable-custom-ribbon-button-only-if-user-has-permission-to-edit),
but nobody seemed to know what to do.

One suggestion I got was to use Rights attribute on the custom action,
but that doesn’t work with the page component (the canHandleCommand
would override it) and I don’t think it can change the state of the
button as you click through the items (not completely sure though).

After a few days I came up with a ‘hack’ (yes, let’s call it that). I
created an application page in Layouts mapped folder, that reads some
POST parameters (id) and outputs either True (if item is of required
content type and user has edit permissions for that item) or false
otherwise. Then I use jQuery to ‘call’ that application page with
\$.post and depending on the result I can enable or disable the button.

I use this code for `canHandleCommand`. Useful trick to first do some
asynchronous action before deciding whether to enable the button or not
I picked up
[here](http://blog.mastykarz.nl/sample-code-asynchronously-checking-ribbon-command/).

```js
canHandleCommand: function (commandId) {
    switch (commandId) {
        case 'DoSomething_Command':
            var ids = SomeNamespace.UI.SomePageComponent.getSelectedIds(); // gets array of 'id' of selected items

            var selectionChanged = false;
            if (ids.length != this.previousIds.length) {
                selectionChanged = true;
            } else {
                for (var index in ids) {
                    if (ids[index] != this.previousIds[index]) {
                        selectionChanged = true;
                    }
                }
            }

            if (selectionChanged) {
                this.enabledStatusChecked = false;
            }

            this.previousIds = ids;

            if (!this.enabledStatusChecked) {
                this.checkIsEnabled(ids);
            }

            return this.isEnabled;
    }

    return false;
},
checkIsEnabled: function (ids) {
    this.enabledStatusChecked = true;
    this.isEnabled = false;

    if (ids.length != 1) {
        return;
    }

    var id = ids[0];

    var context = SP.ClientContext.get_current();
    var webUrl = context.get_url();
    var component = this;

    $.post(webUrl + "/_layouts/<Your folder>/_service.aspx", { method: 'hasEditPermission', data: id }, function (data) {
        if (data == "True") {
            component.isEnabled = true;
        }

        RefreshCommandUI();
    });
},
```

You can see I make sure that selection hasn’t changed and also whether
the checking method already ran or not, and then start the method that
does the remote call. I do this because once the remote call is
finished, I’m calling `RefreshCommandUI()` function that invokes
canHandleCommand again.

Now the remote page is actually pretty simple.

```csharp
public partial class _Service : LayoutsPageBase
{
    private const string MethodParameter = "method";
    private const string DataParameter = "data";

    protected void Page_Load(object sender, EventArgs e)
    {
        if(Request.RequestType != "POST")
        {
            var web = SPContext.Current.Web;
            Response.Redirect(web.Url);
            return;
        }

        var method = Request.Form[MethodParameter];
        var data = Request.Form[DataParameter];
        Response.Clear();

        switch (method)
        {
            case "hasEditPermission":
                CheckEditPermission(Convert.ToInt32(data));
                break;
        }

        Response.End();
    }

    private void CheckEditPermission(int id)
    {
        var web = SPContext.Current.Web;
        var list = web.Lists.GetList("<Your list id>", false); // or however else you get your list
        var item = list.GetItemById(id);

        if(item.ContentType.Parent.Id != "<Your content type id>")
        {
            Response.Write(false);
            return;
        }

        if(item.DoesUserHavePermissions(SPBasePermissions.EditListItems))
        {
            Response.Write(true);
            return;
        }

        Response.Write(false);
    }
}
```

I have the switch there in case I wanted to add some more remote
methods.

This may not be the most elegant solution ever, but when it comes to
sharepoint, you take whatever works. I try not to use complete nonsense
or bad practice stuff, but sometimes there are just no good ways to
implement something in sharepoint (or all the good ways don’t work ;)).

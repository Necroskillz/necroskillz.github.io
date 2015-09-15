---
layout: post
title: NecroNetToolkit Mail API
description:
modified: 2010-07-05
tags: [NecroNetToolkit]
comments: true
---
In a lot of web projects, you need to send out emails. It may be to
notify user that his registration has been successful, his order has
been received etc. as well as notify site administrator about various
events. There are some mail toolkits out there, but none are really what
I would like for my MVC oriented toolkit. What I mean is that I like to
create partial views as templates for my emails. Other than that, the
mail api will be able to send text mails (optionally formatted), mainly
as a last resort, because I like sending emails in html much better.
So I started with this interface:

```csharp
public interface IMailBot : IDisposable
{
    event EventHandler<EmailSendingCompletedEventArgs> SendingCompleted;

    void SendHtmlMail(string to, string subject, string templateView, object model);
    void SendMassHtmlMail(IEnumerable<string> to, string subject, string templateView, object model);

    void SendTextMail(string to, string subject, string body);
    void SendTextMail(string to, string subject, string bodyTemplate, params object[] args);

    void SendMassTextMail(IEnumerable<string> to, string subject, string body);
    void SendMassTextMail(IEnumerable<string> to, string subject, string bodyTemplate, params object[] args);
}
```

Notice the event handler – you’ve probably guessed by now that all mails
will be sent asynchronously. It takes very long time to send an email,
and if you were to send it synchronously, it would block until the email
is sent, preventing the user from viewing content until that mail is
sent. This is very bothersome, so I would not suggest sending emails
synchronously if you really don’t have a good reason to. In the handler
event args, there are these properties:

-   Success (bool, whether or not the email was sent without error),
-   To (IEnumerable of MailAddress)
-   Subject (string)
-   Body (string)
-   Exception (Exception, if any occurred during sending mail (null
    on success))

You might be wondering how I render the view into string. Well, I found
this handy method on the internet some time ago:

```csharp
private static string RenderPartialToString(string controlName, object model)
{
    var viewData = new ViewDataDictionary(model);
    var viewPage = new ViewPage { ViewData = viewData };
    var control = viewPage.LoadControl(controlName);
    
    viewPage.Controls.Add(control);
    
    var builder = new StringBuilder();
    using(var stringWriter = new StringWriter(builder))
    {
        using(var textWriter = new HtmlTextWriter(stringWriter))
        {
            viewPage.RenderControl(textWriter);
        }
    }

    return builder.ToString();
}
```

Some restrictions apply for this obviously, for example there is no
HttpContext, so you have to do all that stuff (like generating urls) in
your controller, and pass it into the view in model. But for emails it’s
not that big of a deal.

For asynchronous sending, I’m using TPL (Task Parallel Library), because
I can manage it easier, and I also found that `SmtpClient`’s `SendAsync`
methods are weird (read: I tried them and the email didn’t get sent at
all). So with TPL I have more control over it. You may have noticed that
`IMailBot` is also `IDisposable`, because I want to dispose `SmtpClient` when
I’m done with it (that sends QUIT message to SMTP server). Here is how I
implemented this:

```csharp
private int _queuedMails;
private bool _disposed;

public void Dispose()
{
    if(_queuedMails == 0)
    {
        if(SmtpClient != null)
        {
            SmtpClient.Dispose();
        }
    }
    else
    {
        _disposed = true;
    }
}

private void SendAsync(MailMessage message) 
{
    _queuedMails++;
    Task.Factory.StartNew(() => SmtpClient.Send(message)).ContinueWith(t =>
    {
        _queuedMails--;
        RaiseSendingCompleted(!t.IsFaulted, message.To, message.Subject, message.Body, t.Exception);
        message.Dispose();
        CheckDispose();
    });
}

private void CheckDispose()
{
    if(_queuedMails == 0 && _disposed)
    {
        if(SmtpClient != null)
        {
            SmtpClient.Dispose();
        }
    }
}
```

Notice that the `SmtpClient` is disposed after `Dispose` is called and all
mail is sent.

You can imagine other methods from the `IMailBot` interface just create a
`MailMessage` and pass it to `SendAsync` method.

Another matter is to configure the mail bot. You can configure the
SmtpClient the same way you are used to, in system.net section of
web.config. I wanted to add a little more, so I took a look at some open
source mail toolkit some Czech MVP guy did a while back, called
[Altairis Mail Toolkit](http://altairismailtoolkit.codeplex.com/) and
basically used the very same code for my configuration section. You can
configure from, sender and reply to address; body and subject encoding;
and I added section where you can enable SSL.

```csharp
<configSections>
    <section name="necroNetToolkit.Mail" type="NecroNet.Toolkit.Mail.NecroNetToolkitMailConfigurationSection, NecroNet.Toolkit"/>
</configSections><system.net>
    <mailSettings>
        <smtp deliveryMethod="Network">
            <network defaultCredentials="false" host="smtp.example.com" password="SecretPassword" userName="noreply@yourdomain.com"/>
        </smtp>
    </mailSettings>
</system.net>
<necroNetToolkit.Mail>
    <from address="noreply@yourdomain.com" displayName="Some Name" displayNameEncoding="UTF-8"/>
    <replyTo address="noreply@yourdomain.com" displayName="Some Name" displayNameEncoding="UTF-8"/>
    <sender address="noreply@yourdomain.com" displayName="Some Name" displayNameEncoding="UTF-8"/>
    <encoding body="UTF-8" subject="UTF-8"/>
    <host useSsl="true"/>
</necroNetToolkit.Mail>
```

You don’t have to specify all of this. The ‘from’ tag with ‘address’
attribute is bare minimum. All encodings default to UTF-8.

```xml
<necroNetToolkit.Mail>
    <from address="noreply@yourdomain.com />
</necroNetToolkit.Mail>
```

In my opinion, keys to a good mailer component are two things: interface
and asynchronous mail sending. On top of that you can add things like
globalization and other stuff like that. You can very easily hook this
up with your favorite dependency injection framework. I use ninject as
an example:

```csharp
container.Bind<IMailBot>().To<MailBot>().InRequestScope().OnDeactivation(m => m.Dispose());
```

**Update 5/7/2010:**

I didn’t have time to finish this yesterday; I didn’t even realize I
should put in some example of usage to be honest. Well, here we go. I’m
not going to explain the SendTextMail methods, these are pretty much
self-explanatory. Instead, I will give you an example about how to use
the SendHtmlMail methods. First, create a view model like you would in
any other view. Note that you have to supply all urls for action links
and other stuff that uses HttpContext from the controller.

```csharp
public class CommentEmailModel
{
    public string PostTitle { get; set; }
    public string CommenterName { get; set; }
    public string PostUrl { get; set; }
    public string CommentUrl { get; set; }
} 
```

Then create a partial view as a template for the email message.

```xml
<%@ Control Language="C#" Inherits=" ViewUserControl<CommentEmailModel>" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> <html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Comment notification</title>
</head>
<body style="font-size: 13px; font-family: 'Trebuchet MS' ,
      'Lucida Sans Unicode' , 'Lucida Grande' , 'Lucida', Arial, Verdana,
      sans-serif;">
        Hey,
    <p>
        <%:Model.CommenterName %> has posted a comment to your post '<a href="<%:Model.PostUrl %>"><%:Model.PostTitle %></a>'.
    </p>
    <p>
        You can view it here: <a href="<%:Model.CommentUrl %>"><%:Model.CommentUrl %></a>
    </p>
    <p>
        This message has been automatically generated. Please do not reply.
    </p>
</body>
</html>
```

All you have to do now is to create a view model, and supply relative
path to the view to the mail bot.

```csharp
_mailBot.SendHtmlMail("someone@example.com", "some subject", "~/Views/Shared/EmailTemplates/Template.ascx", new CommentEmailModel { … }); 
```

Or if you use T4MVC:

```csharp
_mailBot.SendHtmlMail("someone@example.com", "some subject", MVC.Shared.Views.EmailTemplates.Template, new CommentEmailModel { … });
```

You can download NecroNetToolkit for free on github:
<http://github.com/Necroskillz/NecroNetToolkit>.

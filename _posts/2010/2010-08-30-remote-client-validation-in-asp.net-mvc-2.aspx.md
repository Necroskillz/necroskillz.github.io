---
layout: post
title: Remote client validation in ASP.NET MVC 2
description:
modified: YYYY-08-DD
tags: [ASP.NET MVC, jquery, validation]
comments: true
---
Halfway trough implementing some validation I needed to check on the
server by hand in javascript, I realized that
[xVal](http://xval.codeplex.com/) (client-side validation framework I
used earlier) had something called remote validation rules. I googled
around a bit for a solution I could use with built-in MVC validation and
found [this article from Brad
Wilson](http://bradwilson.typepad.com/blog/2010/01/remote-validation-with-aspnet-mvc-2.html)
implementing exactly that. I went trough the comments and it turns out
that there is a RemoteAttribute class in Mvc Futures assembly
(Microsoft.Web.Mvc.AspNet4 to be exact). It surprised me a little that
there was no adapter for this attribute, but fortunately it’s simple
enough to write it.

```csharp
public class RemoteAttributeAdapter : DataAnnotations4ModelValidator<RemoteAttribute>
{
    public RemoteAttributeAdapter(ModelMetadata metadata,
                                  ControllerContext context,
                                  RemoteAttribute attribute) :
        base(metadata, context, attribute) { }
}
```

Then you need to hook it up at application start:

```csharp
DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof (RemoteAttribute), typeof (RemoteAttributeAdapter));
```

I’m good with that. What I didn’t like though, is the client javascript
bit. Although it validates the field and displays error message, it
doesn’t stop the form from being submitted if there is an error.

Original code (in Mvc futures file MicrosoftMvcRemoteValidation.js):

```js
Sys.Mvc.ValidatorRegistry.validators.remote = function(rule) {
    var url = rule.ValidationParameters.url;
    var parameterName = rule.ValidationParameters.parameterName;
    var message = rule.ErrorMessage;
 
    return function(value, context) {
        if (!value || !value.length) {
            return true;
        }
 
        if (context.eventName != 'blur') {
            return true;
        }
 
        var newUrl = ((url.indexOf('?') < 0) ? (url + '?') : (url + '&'))
                     + encodeURIComponent(parameterName) + '=' + encodeURIComponent(value);
 
        var completedCallback = function(executor) {
            if (executor.get_statusCode() != 200) {
                return;
            }
 
            var responseData = executor.get_responseData();
            if (responseData != 'true') {
                var newMessage = (responseData == 'false' ? message : responseData);
                context.fieldContext.addError(newMessage);
            }
        };
 
        var r = new Sys.Net.WebRequest();
        r.set_url(newUrl);
        r.set_httpVerb('GET');
        r.add_completed(completedCallback);
        r.invoke();
        return true;
    };
};
```

My version (using jquery):

```js
Sys.Mvc.ValidatorRegistry.validators.remote = function (rule) {
    var url = rule.ValidationParameters.url;
    var parameterName = rule.ValidationParameters.parameterName;
    var message = rule.ErrorMessage;

    return function (value, context) {
        if (!value || !value.length) {
            return true;
        }

        if (context.eventName != 'blur' && context.eventName != 'submit') {
            return true;
        }

        var newUrl = ((url.indexOf('?') < 0) ? (url + '?') : (url + '&'))
                     + encodeURIComponent(parameterName) + '=' + encodeURIComponent(value);

        var valid = false;

        $.ajax({
            url: newUrl,
            async: false,
            success: function (data) {
                if (data != 'True') {
                    valid = false;
                    var newMessage = (data == 'False' ? message : data);
                    context.fieldContext.addError(newMessage);
                }
                else {
                    valid = true;
                }
            },
        });

        return valid;
    };
};
```

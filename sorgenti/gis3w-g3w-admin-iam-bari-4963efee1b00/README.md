# OpenID Connect Authentication for Bari IAM

This Django application is a small module that contains the OpenID Connect customizations
for Bari IAM SSO.

It has no models or views and it is just a tiny wrapper around the Mozilla
Django OpenID Connect library (`mozilla-django-oidc`).

## OpenID Provider Configuration

The OP should list all valid callbacks, which includes all the possible supported language
prefixes, for example, assuming that this application is installed on the website `https://www.mysuite.com`
and the active languages are `it`, `en`, `de`, the callbacks would become:

+ `https://www.mysuite.com/it/mozilla_django_oidc/callback/`
+ `https://www.mysuite.com/en/mozilla_django_oidc/callback/`
+ `https://www.mysuite.com/de/mozilla_django_oidc/callback/`

## Installation

The implementation is based on `mozilla-django-oidc` https://mozilla-django-oidc.readthedocs.io/
which is the only additional requirement and can be installed with:

```bash
$ pip install mozilla-django-oidc
```

This application is supposed to be stored in the `iam_bari` directory, right under the `g3w-admin`
directory:

```text
├── g3w-admin
│   ├── iam_bari
```

In your `local_settings.py` (or equivalent settings file) you must add the following extra applications:

```python
G3WADMIN_LOCAL_MORE_APPS = [
    # .... more apps
    # Include IAM bari and dependencies
    'mozilla_django_oidc',  # Must be loaded after auth
    'iam_bari',
]
```

## Configuration

1. Check the `settings.py` file in the main folder.
2. Set the environment variables `OIDC_RP_CLIENT_ID` and `OIDC_RP_CLIENT_SECRET` as indicated
   by https://mozilla-django-oidc.readthedocs.io/en/stable/settings.html#OIDC_RP_CLIENT_ID and
   https://mozilla-django-oidc.readthedocs.io/en/stable/settings.html#OIDC_RP_CLIENT_SECRET


> ⚠ **pay attention to the security options** in `settings.py` the default values are
> totally insecure and only suitable for development.


## Customization

The `login.html` custom template is stored in the `overrides` folder, together with a custom authentication
backend where the users are created from the OpenID claims.

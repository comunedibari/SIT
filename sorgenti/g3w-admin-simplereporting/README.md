# SIMPLE REPORTING MODULE

A simple module to get reporting from customers.

## Install

### Clone module
```
git clone https://<bitbucket_user>@bitbucket.org/gis3w/g3w-admin-simplereporting.git
mv g3w-admin-simplereporting g3w-admin/simplereporting
```

### Add to settings

```python
G3WADMIN_LOCAL_MORE_APPS = [
        ...
        'editing', # EDITING MODULE IS REQUIRED
        'simplereporting'
        ...
    ]
```

**Activate editing for ANONYMOUS USER !**
```python
EDITING_ANONYMOUS = True
```

### Add menu items
```bash
python3 manage.py sitetree_resync_apps simplereporting
```
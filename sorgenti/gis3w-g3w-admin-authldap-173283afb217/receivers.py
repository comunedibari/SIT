from django.dispatch import receiver
from django_auth_ldap.backend import populate_user, logger
from core.signals import pre_show_user_data
from usersmanage.models import Userbackend, Group as AuthGroup
from usersmanage.configs import G3W_VIEWER1, G3W_EDITOR1, G3W_EDITOR2
import logging

@receiver(populate_user)
def add_backend2user(sender, **kwargs):
    """
    Receiver to add backend type to user
    """

    user = kwargs['user']
    ldap_user = kwargs['ldap_user']


    if user.pk is None:
        user.save()

    if hasattr(user, 'userbackend'):
        user.userbackend.backend = 'ldap'
        user.userbackend.save()
    else:
        Userbackend(user=user, backend='ldap').save()

    try:
        logger.debug(ldap_user.attrs['memberof'])
    except:
        pass

    # Add role
    # ==================================================================================================
    # Editor Level 1
    if 'memberof' in ldap_user.attrs and "CN=SIT-Editor1,OU=Urbanistica ed Edilizia Privata,OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it" in \
            ldap_user.attrs['memberof']:
        AuthGroup.objects.get(name=G3W_EDITOR1).user_set.add(user)
        AuthGroup.objects.get(name=G3W_VIEWER1).user_set.add(user)

    # Editor Level 2
    elif 'memberof' in ldap_user.attrs and "CN=SIT-Editor2,OU=Urbanistica ed Edilizia Privata,OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it" in \
            ldap_user.attrs['memberof']:
        AuthGroup.objects.get(name=G3W_EDITOR2).user_set.add(user)
        AuthGroup.objects.get(name=G3W_VIEWER1).user_set.add(user)
        try:
            AuthGroup.objects.get(pk=37).user_set.add(user)
        except:
            pass

    else:
        AuthGroup.objects.get(name=G3W_VIEWER1).user_set.add(user)
        try:
            AuthGroup.objects.get(pk=37).user_set.add(user)
        except:
            pass

    '''
    # Viewer Level 1
    if "CN=Domain Users,CN=Users,DC=comba,DC=comune,DC=bari,DC=it" in ldap_user.attrs['memberof']:
        AuthGroup.objects.get(name=G3W_VIEWER1).user_set.add(user)

    
    #if not user.is_superuser:
    if "CN=SIT-Amministratori,OU=Urbanistica ed Edilizia Privata,OU=Utenti,DC=comba,DC=comune,DC=bari,DC=it" in \
            ldap_user.attrs['memberof']:
        AuthGroup.objects.get(name=G3W_EDITOR1).user_set.add(user)
        AuthGroup.objects.get(name='Editors del Comune di Bari').user_set.add(user)
    else:
        AuthGroup.objects.get(name=G3W_VIEWER1).user_set.add(user)
        AuthGroup.objects.get(name='Visualizzatori del Comune di Bari').user_set.add(user)
    '''

    return True


@receiver(pre_show_user_data)
def get_user_premissions(sender, **kwargs):

    user = kwargs['user']

    if not hasattr(sender, 'userbackend'):
        return None

    if sender.userbackend != 'ldap':
        return None

    if user.is_superuser and user.is_staff:
        return [
            'add_user',
            'change_user',
            'delete_user'
        ]
    else:
        return []

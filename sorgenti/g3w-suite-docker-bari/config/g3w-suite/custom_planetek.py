from django.utils.translation import ugettext_lazy as _

def login_logout_client_spid(request):
    '''
    Funzione specifica per planetek per aggiungere il pulsante accedi e logu per spid sul client
    :param request: requets django object
    :return: dict
    '''
    from django.conf import settings

    if request.user.is_authenticated: # and 'spid_name' in request.session:
        return None
        return {
            'url': 'https://egov.ba.it/Shibboleth.sso/Logout?return={}://{}/logout/?next=/'.format(
                request.scheme,
                request.get_host(),
            ),
            'title': 'Logout',
        }
    else:
        return {
            'url': settings.SPID_LINK,
            'title': _('Access')
        }

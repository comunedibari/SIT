from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from django.contrib.auth import login, logout

import re

class SpidAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):

        if request.user.is_authenticated:
            logout(request)
            u = User.objects.get(username='osensei')
            login(request, user=u, backend=settings.AUTHENTICATION_BACKENDS[0])


class SpidUserLogOutMiddleware(MiddlewareMixin):
    """
    Middleware for Planetek project: replace logout url for map client for user spid
    """
    def process_template_response(self, request, response):

        if hasattr(response, 'context_data') and \
                response.context_data and \
                'group_config' in response.context_data and \
                request.user.username == settings.G3WSUITE_SPID_USER:
            logout_url = '"logout_url":"https://sit.egov.ba.it/Shibboleth.sso/Logout?return={}://{}/logout/?next=/"'.\
                format(
                request.scheme,
                request.get_host()
            )
            response.context_data['group_config'] = re.sub('"logout_url":"[a-zA-z0-9-_=\\/\?]+"',
                                                           logout_url, response.context_data['group_config'])

        return response



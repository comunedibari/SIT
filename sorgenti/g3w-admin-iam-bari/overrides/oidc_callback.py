import time

from mozilla_django_oidc.views import OIDCAuthenticationCallbackView


class G3WOIDCCallbackClass(OIDCAuthenticationCallbackView):
    def get(self, request):
        time.sleep(1)
        return super().get(request)
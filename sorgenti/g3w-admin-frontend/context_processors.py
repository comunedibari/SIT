
from urllib.parse import quote

from django.conf import settings

def add_return_address(request):

    return {
        'return_address': quote(request.get_raw_uri()),

    } 
from rest_framework.exceptions import APIException
from cadastre.api.permissions import CadastrePermission
from cadastre.models import Config


class CadastreApiViewMixin(object):
    """
    Generic API view mixin to get and validate foglio and numero get parameters
    """

    permission_classes = (CadastrePermission,)

    def get(self, request, project_id):

        #if 'numero' not in request.GET or 'foglio' not in request.GET or 'sezione'not in request.GET:
            #raise APIException('You have to set foglio and numero get and sezione parameters')

        if 'numero' not in request.GET or 'foglio' not in request.GET:
            raise APIException('You have to set foglio and numero in parameters')

        self.foglio = request.GET['foglio'].zfill(4)
        self.numero = request.GET['numero'].replace('+', '').strip().zfill(5)
        self.sezione = request.GET.get('sezione', '')

        # For ORACLE case
        if self.sezione == 'NULL':
            self.sezione = ''

        # get codice_comune for querying:
        self.codice_comune = Config.objects.get(project_id=project_id).codice_comune



from rest_framework.permissions import BasePermission
from usersmanage.configs import *
from usersmanage.utils import get_users_for_object
from cadastre.models import Config


class CadastrePermission(BasePermission):
    """
    Allows access only to users have permission edit_cadastre_association on project
    """

    def has_permission(self, request, view):

        # get project from Cadastre config
        project = Config.objects.get(project_id=view.kwargs['project_id']).project

        # if is a editor of project can pass
        editors = get_users_for_object(project, 'change_project', [G3W_EDITOR1, G3W_EDITOR2])
        if request.user in editors:
            return True
        return request.user.has_perm('qdjango.edit_cadastre_association', project)
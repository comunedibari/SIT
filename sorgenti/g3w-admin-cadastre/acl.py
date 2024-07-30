from guardian.shortcuts import *
from .models import Config
from usersmanage.configs import *
from usersmanage.utils import get_users_for_object
from cadastre.models import Config


def check_for_user(user, **kwargs):
    """
    Check if user has grant on project
    :param user:
    :param kwargs:
    :return:
    """
    try:

        # get project from Cadastre config
        project = Config.objects.get(project_id=kwargs['project_id']).project

        # if is a editor of project can pass
        editors = get_users_for_object(project, 'change_project', [G3W_EDITOR1, G3W_EDITOR2])
        if user in editors:
            return True
        return user.has_perm('qdjango.edit_cadastre_association', project)

    except Exception:
        return False

    return True
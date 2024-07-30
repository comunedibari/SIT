from django.conf import settings

class CadastreRouter(object):
    """
    A router to control all database operations on models in the
    auth application.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read auth models go to internet.
        """
        if model._meta.app_label == 'cadastre':
            if model._meta.model_name in ('config', 'configlayer', 'configusercadastre', 'configimportcxf', 'transformcatasto'):
                return None
            return settings.CADASTRE_DATABASE
        return None

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth models go to iternet.
        """
        if model._meta.app_label == 'cadastre':
            if model._meta.model_name in ('config', 'configlayer', 'configusercadastre', 'configimportcxf', 'transformcatasto'):
                return None
            return settings.CADASTRE_DATABASE
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):

        if app_label == 'cadastre':
            if model_name in ('config', 'configlayer', 'configusercadastre', 'configimportcxf', 'transformcatasto'):
                return db == 'default'
            else:
                return db == settings.CADASTRE_DATABASE
        else:
            if db == settings.CADASTRE_DATABASE:
                return False
            return None


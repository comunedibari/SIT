from django.apps import AppConfig
from django.db.models.signals import post_migrate


def addTriggerTablesFunction(sender, **kwargs):

    # add new permission type if is not present
    if kwargs['using'] == 'default':

        from django.contrib.contenttypes.models import ContentType
        from django.contrib.auth.models import Permission
        from qdjango.models import Project

        content_type = ContentType.objects.get_for_model(Project)
        p = Permission.objects.get_or_create(
            codename='edit_cadastre_association',
            name='Can edit cadastre association',
            content_type=content_type,
        )


class cadastreConfig(AppConfig):

    name = 'cadastre'
    verbose_name = 'Cadastre'

    def ready(self):

        # import signal handlers
        import cadastre.receivers

        # add postmigrate receivers for table triggers
        post_migrate.connect(addTriggerTablesFunction, sender=self)


from django.apps import AppConfig


class SimplereportingConfig(AppConfig):
    name = 'simplereporting'
    verbose_name = 'Simple Reporting System'

    def ready(self):

        # import signals receivers
        import simplereporting.receivers

        # Update default module settings
        from django.conf import settings
        from simplereporting import settings as sr_settings

        for a in dir(sr_settings):
            if not a.startswith('__') and not hasattr(settings, a):
                setattr(settings, a, getattr(sr_settings, a))

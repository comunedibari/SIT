from django.apps import AppConfig


class EleprofileConfig(AppConfig):
    name = 'eleprofile'

    def ready(self):

        # import signal handlers
        import eleprofile.receivers


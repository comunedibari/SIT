from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from catalog.models import Catalog
from catalog.api.views import make_data


class Command(BaseCommand):
    help = 'Scan catalogs and regenerates them'

    def handle(self, *args, **options):

        for c in Catalog.objects.filter(is_valid=False):
            records = len(c.regenerate())
            self.stdout.write(self.style.SUCCESS(
                f'Successfully regenerated catalog #{c}, records: {records}'))

            # refresh cache DCAT
            if 'catalog' in settings.CACHES:
                make_data(c)
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully regenerated DCAT(POD) cache #{c}'))




from import_export import resources
from cadastre.models import *


class CategorieCatastaliResource(resources.ModelResource):
    class Meta:
        model = CategorieCatastali
        import_id_fields = ('categoria',)


class QualitaTerreniResource(resources.ModelResource):
    class Meta:
        model = QualitaTerreni
        import_id_fields = ('qualita',)


class CodiciDirittoResource(resources.ModelResource):
    class Meta:
        model = CodiciDiritto
        import_id_fields = ('codice_diritto',)


class IstatCodiciUiResource(resources.ModelResource):
    class Meta:
        model = IstatCodiciUi
        import_id_fields = ('codice_comune_formato_numerico',)

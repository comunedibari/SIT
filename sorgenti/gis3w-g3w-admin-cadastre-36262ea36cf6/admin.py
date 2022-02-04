from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .ie.resources import *
from .models import *


class CategorieCatastaliAdmin(ImportExportModelAdmin):
    model = CategorieCatastali
    resource_class = CategorieCatastaliResource
    list_display = ('categoria', 'descrizione')
admin.site.register(CategorieCatastali, CategorieCatastaliAdmin)


class SezioniCensuarieAdmin(ImportExportModelAdmin):
    model = SezioniCensuarie
    list_display = ('tipo', 'provincia', 'codice_comune', 'sezione', 'descrizione')
admin.site.register(SezioniCensuarie, SezioniCensuarieAdmin)


class QualitaTerreniAdmin(ImportExportModelAdmin):
    model = QualitaTerreni
    resource_class = QualitaTerreniResource
    list_display = ('qualita', 'descrizione')
admin.site.register(QualitaTerreni, QualitaTerreniAdmin)


class CodiciDirittoAdmin(ImportExportModelAdmin):
    model = CodiciDiritto
    resource_class = CodiciDirittoResource
    list_display = ('codice_diritto', 'descrizione')
admin.site.register(CodiciDiritto, CodiciDirittoAdmin)


class CodiciPartitaAdmin(ImportExportModelAdmin):
    model = CodiciPartita
    list_display = ('tipo', 'partita', 'descrizione')
admin.site.register(CodiciPartita, CodiciPartitaAdmin)


class TipiNoteAdmin(ImportExportModelAdmin):
    model = TipiNota
    list_display = ('tipo', 'nota', 'descrizione')
admin.site.register(TipiNota, TipiNoteAdmin)


class ParticelleAdmin(admin.ModelAdmin):
    model = Particella
    list_display = ('id_particella', 'progressivo', 'codice_comune', 'sezione',
                    'foglio', 'numero', 'denominatore', 'subalterno')
admin.site.register(Particella, ParticelleAdmin)


class CaratteristicheParticelleAdmin(admin.ModelAdmin):
    model = CaratteristicheParticella
    list_display = ('id_particella', 'progressivo', 'codice_comune', 'sezione',
                    'id_mutazionale_iniziale', 'id_mutazionale_finale')
admin.site.register(CaratteristicheParticella, CaratteristicheParticelleAdmin)


class DeduzioniParticelleAdmin(admin.ModelAdmin):
    model = DeduzioniParticella
    list_display = ('id_particella', 'progressivo', 'codice_comune', 'sezione',
                    'simbolo')
admin.site.register(DeduzioniParticella, DeduzioniParticelleAdmin)


class RiserveParticelleAdmin(admin.ModelAdmin):
    model = RiserveParticella
    list_display = ('id_particella', 'progressivo', 'codice_comune', 'sezione',
                    'codice', 'partita')
admin.site.register(RiserveParticella, RiserveParticelleAdmin)


class PorzioniParticelleAdmin(admin.ModelAdmin):
    model = PorzioniParticella
    list_display = ('id_particella', 'progressivo', 'codice_comune', 'sezione',
                    'id_porzione', 'qualita', 'classe')
admin.site.register(PorzioniParticella, PorzioniParticelleAdmin)


class PersoneFisecheAdmin(admin.ModelAdmin):
    model = PersonaFisica
    list_display = ('id_soggetto', 'codice_comune', 'cognome', 'nome', 'sesso',
                    'data_nascita', 'codice_fiscale')
admin.site.register(PersonaFisica, PersoneFisecheAdmin)


class PersoneGiuridicheAdmin(admin.ModelAdmin):
    model = PersonaGiuridica
    list_display = ('id_soggetto', 'codice_comune', 'denominazione',
                    'codice_fiscale_piva')
admin.site.register(PersonaGiuridica, PersoneGiuridicheAdmin)


class TitolaritaAdmin(admin.ModelAdmin):
    model = Titolarita
    list_display = ('id_immobile', 'id_particella', 'codice_comune', 'id_soggetto',
                    'codice_diritto', 'id_mutazionale_iniziale',
                    'id_mutazionale_finale')
admin.site.register(Titolarita, TitolaritaAdmin)


class UnitaImmobiliariAdmin(admin.ModelAdmin):
    model = UnitaImmobiliare
    list_display = ('id_immobile', 'progressivo', 'codice_comune', 'sezione',
                    'categoria', 'classe', 'id_mutazionale_iniziale',
                    'id_mutazionale_finale')
admin.site.register(UnitaImmobiliare, UnitaImmobiliariAdmin)


class UtilitaComuniUIAdmin(admin.ModelAdmin):
    model = UtilitaComuniUI
    list_display = ('id_immobile', 'progressivo', 'codice_comune', 'sezione',
                    'sezione_urbana', 'foglio', 'numero', 'denominatore', 'subalterno')
admin.site.register(UtilitaComuniUI, UtilitaComuniUIAdmin)


class IdentificativiImmobiliariAdmin(admin.ModelAdmin):
    model = IdentificativiImmobiliari
    list_display = ('id_immobile', 'progressivo', 'codice_comune', 'sezione',
                    'sezione_urbana', 'foglio', 'numero', 'denominatore', 'subalterno')
admin.site.register(IdentificativiImmobiliari, IdentificativiImmobiliariAdmin)


class IndirizziAdmin(admin.ModelAdmin):
    model = Indirizzi
    list_display = ('id_immobile', 'progressivo', 'codice_comune', 'sezione',
                    'toponimo', 'indirizzo', 'codice_strada')
admin.site.register(Indirizzi, IndirizziAdmin)


class RiserveUIAdmin(admin.ModelAdmin):
    model = RiserveUI
    list_display = ('id_immobile', 'progressivo', 'codice_comune', 'sezione',
                    'codice_riserva', 'partita_iscrizione_riserva')
admin.site.register(RiserveUI, RiserveUIAdmin)


class RelazioneFabbricatiDOCFAAdmin(admin.ModelAdmin):
    model = RelazioneFabbricatiDOCFA
    list_display = ('protocollo', 'codice_comune', 'sezione', 'sezione_urbana',
                    'foglio', 'numero', 'denominatore')
admin.site.register(RelazioneFabbricatiDOCFA, RelazioneFabbricatiDOCFAAdmin)


class RelazioneUiuDOCFAAdmin(admin.ModelAdmin):
    model = RelazioneUiuDOCFA
    list_display = ('protocollo', 'id_uiu', 'codice_comune_uiu', 'sezione_uiu')
admin.site.register(RelazioneUiuDOCFA, RelazioneUiuDOCFAAdmin)


class DatiMDOCFAAdmin(admin.ModelAdmin):
    model = DatiMDOCFA
    list_display = ('docfa', 'id_uiu', 'codice_comune_uiu', 'sezione_uiu',
                    'progressivo_poligono', 'ambiente', 'superficie', 'altezza',
                    'altezza_max')
admin.site.register(DatiMDOCFA, DatiMDOCFAAdmin)


class PlanimetrieAdmin(admin.ModelAdmin):
    model = Planimetrie
    list_display = ('nome_file', 'numero', 'is_elaborato', 'docfa',
                    'id_uiu', 'formato', 'scala', 'path')
admin.site.register(Planimetrie, PlanimetrieAdmin)


class DOCFAAdmin(admin.ModelAdmin):
    model = DOCFA
    list_display = ('protocollo', 'path', 'fornitura', 'data_registrazione', 'periodo')
admin.site.register(DOCFA, DOCFAAdmin)


class PrmAdmin(admin.ModelAdmin):
    model = Prm
    list_display = ('codice_comune', 'tipo_fornitura', 'descrizione',
                    'is_aggiornamento', 'n_record', 'file', 'data_richiesta',
                    'data_elaborazione', 'data_registrazione', 'fogli_estratti')
admin.site.register(Prm, PrmAdmin)


class ImportDOCFAAdmin(admin.ModelAdmin):
    model = ImportDOCFA
    list_display = ('codice_comune', 'n_record', 'file', 'data_elaborazione', 'created' ,'n_docfa', 'n_planimetrie')
admin.site.register(ImportDOCFA, ImportDOCFAAdmin)


class IstatCodiciUiAdmin(ImportExportModelAdmin):
    model = IstatCodiciUi
    resource_class = IstatCodiciUiResource
    list_display = ('codice_comune_formato_numerico', 'codice_catastale_del_comune', 'denominazione_in_italiano')
admin.site.register(IstatCodiciUi, IstatCodiciUiAdmin)


class ImportCatastoAdmin(admin.ModelAdmin):
    model = ImportCatasto
    list_display = ('codice_comune', 'file', 'task_id')


admin.site.register(ImportCatasto, ImportCatastoAdmin)


class ConfigUserCadastreAdmin(admin.ModelAdmin):
    model = ConfigUserCadastre
    list_display = ('user', 'codice_comune')


admin.site.register(ConfigUserCadastre, ConfigUserCadastreAdmin)


class TransformCatastoAdmin(ImportExportModelAdmin):
    model = TransformCatasto
    list_display = ('foglio',)


admin.site.register(TransformCatasto, TransformCatastoAdmin)


class CadastreDataAccessLogAdmin(ImportExportModelAdmin):
    model = CadastreDataAccessLog
    list_display = ('created', 'user', 'type', 'msg')
    search_fields = (
        'user',
        'msg'
    )


admin.site.register(CadastreDataAccessLog, CadastreDataAccessLogAdmin)
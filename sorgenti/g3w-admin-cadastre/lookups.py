from django.db.models import Q
from ajax_select import register, LookupChannel
from .models import IstatCodiciUi


@register('cadastre_codice_comune')
class CadastreCodiceComune(LookupChannel):

    min_length = 3
    model = IstatCodiciUi

    def get_query(self, q, request):
        return self.model.objects.filter(Q(codice_catastale_del_comune__icontains=q) |
                                         Q(denominazione_in_italiano__icontains=q))

    def format_item_display(self, item):
        return u"<span class='cadastre_codice_comune'>{}</span>".format(item.codice_catastale_del_comune)

    def format_item_display(self, obj):
        return obj.codice_catastale_del_comune

    def get_result(self, obj):
        return obj.codice_catastale_del_comune

    def format_match(self, obj):
        return u"{} ({}) - {}".format(obj.denominazione_in_italiano, obj.denominazione_provincia,
                                      obj.codice_catastale_del_comune)

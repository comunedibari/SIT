from django.contrib import admin
from guardian.admin import GuardedModelAdmin
from .models import *


class ConfigsAdmin(GuardedModelAdmin):
    model = Configs
    list_display = ('title', 'project')
    search_fields = (
        'title',
        'project'
    )


admin.site.register(Configs, ConfigsAdmin)


class LayersAdmin(admin.ModelAdmin):
    model = Layers
    list_display = ('layer', 'catasto', 'config')
    search_fields = (
        'layer',
    )


admin.site.register(Layers, LayersAdmin)

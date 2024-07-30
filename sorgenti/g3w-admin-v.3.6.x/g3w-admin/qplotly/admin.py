from django.contrib import admin
from .models import QplotlyWidget

@admin.register(QplotlyWidget)
class QplotlyWidgetAdmin(admin.ModelAdmin):

    list_display = (
        'datasource',
        'project',
        'selected_features_only',
        'visible_features_only'
    )
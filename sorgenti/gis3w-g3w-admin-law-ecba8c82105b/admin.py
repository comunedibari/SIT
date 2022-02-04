from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from django.contrib.admin import ModelAdmin
from .models import Laws, Articles
from guardian.admin import GuardedModelAdmin


class LawsAdmin(GuardedModelAdmin):
    model = Laws
admin.site.register(Laws, LawsAdmin)
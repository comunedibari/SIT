from __future__ import unicode_literals
from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User, Group as AuthGroup
from model_utils import Choices
from model_utils.models import TimeStampedModel
from autoslug import AutoSlugField
from guardian.shortcuts import get_perms
from qdjango.models import Project, Layer
from usersmanage.models import User
from core.mixins.models import G3WACLModelMixins
from usersmanage.utils import getUserGroups, setPermissionUserObject
from usersmanage.configs import *
import os
import json

OUTPUT_FORMAT = {
    'template': Choices(
            ('odt', _('ODT')),
        ),
    'fusion': Choices(
            ('odt', _('ODT')),
            ('pdf', _('PDF')),
            ('doc', _('DOC')),
            ('docx', _('DOCX')),
        ),
}

MAP_IMAGE = Choices(
    ('map', _('Whole map')),
    ('layer', _('Only Cadastre Layer'))
)

def output_format_chioiches():
    """
    Return choices for confgi CDU output_format field
    :return:
    """
    return OUTPUT_FORMAT[getattr(settings, 'CDU_PLUGIN_ODT_DRIVER', 'template')]


def getOdtfilePath(instance, filename):
    """
    Custom name for uploaded odt template file.
    """
    cduTitle = slugify(instance.title)
    namefile, ext = filename.split('.')
    filename = '{}_{}.{}'.format(cduTitle, namefile, ext)
    return os.path.join('cdu_odt_file', filename)


class Configs(G3WACLModelMixins, TimeStampedModel):
    title = models.CharField(_('Title'), max_length=300, unique=True)
    description = models.TextField(_('Description'), blank=True)
    project = models.ForeignKey(Project, models.SET_NULL, null=True)
    odtfile = models.FileField(_('ODT Template file'), null=True, upload_to=getOdtfilePath)
    output_format = models.CharField(_('Results output format'), max_length=4, choices=output_format_chioiches(),
                                     null=True)
    map_image = models.CharField(_('Map image'), max_length=10, choices=MAP_IMAGE, null=True, default='map')
    slug = AutoSlugField(_('Slug'), populate_from='title', unique=True, always_update=True, blank=True)

    def __str__(self):
        return self.title

    def layer_catasto(self):
        """
        Return from layers layer with catasto property is true
        """
        try:
            return self.layers_set.filter(catasto=True)[0]
        except:
            return None

    def layers_against(self):
        """
        Return from layers layer with catasto property is true
        """
        return self.layers_set.filter(catasto=False)

    class Meta:
        permissions = (
            ('make_cdu', 'Can make CDU analisys'),
        )

    def _permissionsToEditor(self, user, mode='add'):
        """
        Add/Remove guardian permissions to Editor
        """
        setPermissionUserObject(user, self, permissions=[
            'change_configs',
            'delete_configs',
            'view_configs',
            'make_cdu'
        ], mode=mode)

    def _permissionsToViewers(self, users_id, mode='add'):
        """
        Add/Remove guardian permissions to Viewers
        """

        for user_id in users_id:
            setPermissionUserObject(User.objects.get(pk=user_id), self,
                                    permissions=['view_configs', 'make_cdu'], mode=mode)

    def _permissions_to_user_groups_editor(self, groups_id, mode='add'):

        for group_id in groups_id:
            auth_group = AuthGroup.objects.get(pk=group_id)
            setPermissionUserObject(auth_group, self,
                    permissions=['change_configs', 'delete_configs', 'view_configs', 'make_cdu'], mode=mode)

    def _permissions_to_user_groups_viewer(self, groups_id, mode='add'):

        for group_id in groups_id:
            auth_group = AuthGroup.objects.get(pk=group_id)
            setPermissionUserObject(auth_group, self, permissions=['view_configs', 'make_cdu'], mode=mode)


class Layers(models.Model):
    config = models.ForeignKey(Configs, models.CASCADE)
    layer = models.ForeignKey(Layer, models.CASCADE)
    alias = models.CharField(blank=True, max_length=300, null=True)
    fields = models.TextField()
    catasto = models.BooleanField(default=False)

    def __str__(self):
        return "{} -- {}".format(self.layer, self.config)

    def getFieldFoglio(self):
        return self.getLayerFieldsData()['foglio']

    def getFieldParticella(self):
        return self.getLayerFieldsData()['particella']

    def getFieldSezione(self):
        try:
            return self.getLayerFieldsData()['sezione']
        except:
            return None

    def getPlusFieldsCatasto(self):
        if 'plusFieldsCatasto' in self.getLayerFieldsData():
            return self.getLayerFieldsData()['plusFieldsCatasto']
        else:
            return []

    def getAliasFieldsCatasto(self):
        if 'aliasFieldsCatasto' in self.getLayerFieldsData():
            return self.getLayerFieldsData()['aliasFieldsCatasto']
        else:
            return {
                'foglio': 'Foglio',
                'particella': 'Particella',
                'sezione': 'Sezione'
            }

    def getLayerFieldsData(self):
        return eval(self.fields)


class CDUResult(TimeStampedModel):
    """
    Store CDU search and calculations results
    """

    config = models.ForeignKey(Configs, models.CASCADE)
    title = models.CharField(max_length=255)
    result = models.TextField()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

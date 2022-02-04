from django.db import models
from model_utils.models import TimeStampedModel
from django.utils.translation import ugettext_lazy as _
from autoslug import AutoSlugField
from core.mixins.models import G3WACLModelMixins
from usersmanage.configs import *
from usersmanage.utils import *


class Laws(G3WACLModelMixins, TimeStampedModel):
    name = models.CharField(_('Law name'), max_length=255)
    description = models.TextField(_('Law description'), blank=True)
    variation = models.CharField(_('Variation'), max_length=255, blank=True)
    fromdate = models.DateField(_('Valid from'))
    todate = models.DateField(_('Valid to'))
    slug = AutoSlugField(_('Slug'), populate_from='name', unique=True, always_update=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        permissions = (
            ('manage_articles', 'Can work on articles'),
        )

    @staticmethod
    def getJsList():
        jsdata = []
        laws = Laws.objects.all()
        for l in laws:
            jsdata.append({
                'id': l.pk,
                'name': l.name,
                'variation': l.variation
            })
        return jsdata

    def getArticlesNumber(self):
        return len(self.articles_set.all())

    def _permissionsToEditor(self, user, mode='add'):
        """
        Give guardian permissions to Editor
        """

        permissions = ['view_laws']
        user_groups = getUserGroups(user)
        if G3W_EDITOR1 in user_groups:
            permissions += [
                'change_laws',
                'delete_laws',
                'manage_articles'
            ]

        if G3W_EDITOR2 in user_groups:
            permissions += [
                'manage_articles'
            ]

        setPermissionUserObject(user, self, permissions=permissions, mode=mode)

    def _permissionsToViewers(self, users_id, mode='add'):
        """
        Give guardian permissions to Viewers
        """

        for user_id in users_id:
            setPermissionUserObject(User.objects.get(pk=user_id), self, permissions='view_laws', mode=mode)

    def _permissions_to_user_groups_editor(self, groups_id, mode='add'):
        for group_id in groups_id:
            setPermissionUserObject(AuthGroup.objects.get(pk=group_id), self, permissions=[
                'manage_articles',
                'view_laws',
            ], mode=mode)

    def _permissions_to_user_groups_viewer(self, groups_id, mode='add'):
        for group_id in groups_id:
            setPermissionUserObject(AuthGroup.objects.get(pk=group_id), self, permissions=[
                'view_laws'
            ], mode=mode)


class Articles(models.Model):
    number = models.CharField(_('Article number'), max_length=255)
    title = models.CharField(_('Title'), max_length=255, blank=True)
    comma = models.CharField(_('Article comma number'), max_length=255, blank=True)
    content = models.TextField(_('Article content'))
    law = models.ForeignKey(Laws, blank=True, null=True, on_delete=models.CASCADE)
    slug = AutoSlugField(_('Slug'), populate_from='number', unique=True, always_update=True, blank=True, null=True)
    correlate_articles = models.ManyToManyField('self', verbose_name=_('Correlate articles'), blank=True)

    def __str__(self):
        return _('Article')+" {}".format(self.number)
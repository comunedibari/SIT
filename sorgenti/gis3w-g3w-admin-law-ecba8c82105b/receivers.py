from core.signals import load_dashboard_widgets, load_css_modules
from django.dispatch import receiver
from django.template import loader, Context
from core.views import DashboardView
from core.signals import post_serialize_project
from qdjango.signals import load_qdjango_widgets_data, load_qdjango_widget_layer
from guardian.shortcuts import get_objects_for_user, get_anonymous_user
from .utils.data import get_dict_laws
from .models import Laws
from .api.serializers import LawWidgetSerializer
import json

@receiver(load_css_modules)
def getCssModules(sender, **kwargs):

    return 'law/css/law.css'


@receiver(load_dashboard_widgets)
def dashboard_widget(sender, **kwargs):

    if isinstance(sender, DashboardView):

        # condizione che abbia i permsessi sul project se non e admin01 o admin02
        context = {
            'user': sender.request.user
        }
        widget = loader.get_template('law/widgets/dashboard.html')
        return widget.render(context)


@receiver(load_qdjango_widgets_data)
def qdjango_widget_data(sender, **kwargs):

    context = kwargs['context']

    # build queryset by user
    laws = get_objects_for_user(sender.request.user, 'law.view_laws', Laws).order_by('name')

    context['laws_list'] = json.dumps(get_dict_laws(laws_queryset=laws))


@receiver(load_qdjango_widget_layer)
def qdjango_widget_project(sender, **kwargs):

    widget = kwargs['widget']
    ret = kwargs['ret']
    layer = kwargs['layer']

    if widget.widget_type == 'law':
        if 'law' not in ret:
            ret['law'] = []

        # check permission on law

        law_widget_data = LawWidgetSerializer(widget).data
        law_widget_data['options']['layerid'] = layer['id']

        ret['law'].append(law_widget_data)


@receiver(post_serialize_project)
def check_permissions(sender, **kwargs):
    """
    After serialization check permission on law can be watch by user
    """

    if kwargs['app_name'] != 'qdjango' or 'law' not in sender.data:
        return None

    # get laws by user
    laws_id = [l.pk for l in get_objects_for_user(kwargs['request'].user, 'law.view_laws', Laws) |
               get_objects_for_user(get_anonymous_user(), 'law.view_laws', Laws) ]

    data = {
        'operation_type': 'replace',
        'replace_path': 'law',
        'values': [],
    }
    for l in sender.data['law']:
        if l['options']['law_id'] in laws_id:
            data['values'].append(l)

    return data
from law.models import Laws
from qdjango.models import Widget, Project, Layer
import json


def get_dict_laws(laws_queryset=None):
    """
    Return dict data structure for django widgets
    :param laws_queryset:
    :return:
    """
    if not laws_queryset:
        laws_queryset = Laws.objects.all()

    data = []
    for l in laws_queryset:
        data.append({
            'id': l.pk,
            'name': l.name,
            'variation': l.variation
        })

    return data


def get_projects_by_law(law_id):
    """
    Return list of projects wher law is used
    :param law_id: 
    :return: 
    """

    # get every qdjango widget law type
    widgets = Widget.get_by_type('law')

    datasources = []
    for w in widgets:
        body = json.loads(w.body)
        if 'law_id' in body and law_id == body['law_id']:
            datasources.append(w.datasource)

    # get layers and qdjango project
    layers = Layer.objects.filter(datasource__in=datasources)

    projects = {}
    for l in layers:
        if l.project_id not in projects:
            projects[l.project_id] = {
                'project': l.project,
                'layers': [l]
            }
        else:
            projects[l.project_id]['layers'].append(l)

    return projects



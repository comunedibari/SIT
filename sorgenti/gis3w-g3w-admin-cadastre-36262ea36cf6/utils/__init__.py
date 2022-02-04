from django.conf import settings
from django.urls import reverse
from cadastre.models import Config, ConfigImportCxf
from cadastre.configs import CADASTRE_LAYERS

def get_celery_worker_status():
    '''
    Check if worker is running
    http://stackoverflow.com/a/8522470/566663
    '''
    ERROR_KEY = "ERROR"
    try:
        from celery.task.control import inspect
        insp = inspect()
        d = insp.stats()
        if not d:
            d = { ERROR_KEY: 'No running Celery workers were found.' }
    except IOError as e:
        from errno import errorcode
        msg = "Error connecting to the backend: " + str(e)
        if len(e.args) > 0 and errorcode.get(e.args[0]) == 'ECONNREFUSED':
            msg += ' Check that the RabbitMQ server is running.'
        d = { ERROR_KEY: msg }
    except ImportError as e:
        d = { ERROR_KEY: str(e)}
    return d


def getLayerCadastreIdByName(layerName, object=False):
    layers = Config.getData().project.layer_set.filter(origname=layerName)
    if len(layers) == 1:
        if object:
            return layers[0]
        else:
            return layers[0].qgs_layer_id
    else:
        return None


def get_data_for_widget_search(data_project):
    """
    Get data for build cadastre widget searches
    :param data_project: cadastre Config instance
    :return: qgs_layer_id of cadastre layer into project, queryurl search endpoint
    """

    layers = {d.origname: d for d in data_project.project.layer_set.all()}

    # get origname=table_name form config cxf
    config_cxf = ConfigImportCxf.objects.filter(codice_comune=data_project.codice_comune)

    if len(config_cxf) > 0:
        cadastre_layer_origname = config_cxf[0].db_table
    else:
        cadastre_layer_origname = list(CADASTRE_LAYERS.keys())[0]

    # Layer id
    # --------
    layer_id = layers[cadastre_layer_origname].qgs_layer_id

    # Build queryurl by G3W_CLIENT_SEARCH_ENDPOINT
    # --------------------------------------------
    if settings.G3W_CLIENT_SEARCH_ENDPOINT == 'ows':
        queryurl = reverse('cadastre-searchbycf', kwargs={'project_id': data_project.project.pk})
    else:
        queryurl = reverse('cadastre-searchbycf-api', kwargs={'project_id': data_project.project.pk,
                                                              'layer_id': layer_id})

    return layer_id, queryurl
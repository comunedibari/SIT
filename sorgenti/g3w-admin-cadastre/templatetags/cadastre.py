from __future__ import absolute_import
from django import template
from celery.result import AsyncResult
from celery import states
from django.utils.safestring import mark_safe
from cadastre.utils.data import comune_name_from_code
from cadastre.configs import CMD_TASK_ID_PREFIX


register = template.Library()

CELERY_STATE_MAPPING_BOOTSTRAP = {
    states.SUCCESS: 'label-success',
    states.PENDING: 'label-info',
    states.FAILURE: 'label-danger',
    states.REVOKED: 'label-warning',
    'NOT WORKING': 'label-warning',
    'UNKNOWN': 'label-info',
    'IMPORTED BY SCRIPT': 'label-success'
}


@register.filter()
def task_status_label(task_id):
    """
    Return status of a celery task with a label
    """
    if bool(task_id):

        if task_id[0:5] == CMD_TASK_ID_PREFIX:
            status = 'IMPORTED BY SCRIPT'
        else:
            res = AsyncResult(task_id)
            try:
                status = res.status
            except:
                status = 'UNKNOWN'
    else:
        status = 'NOT WORKING'
    return mark_safe("<span class='label {}'>{}</span>".format(CELERY_STATE_MAPPING_BOOTSTRAP[status], status))


@register.filter()
def task_status(task_id):
    """
    Return status of a celery task
    """
    if bool(task_id):
        if task_id[0:5] == CMD_TASK_ID_PREFIX:
            status = 'IMPORTED BY SCRIPT'
        else:
            res = AsyncResult(task_id)
            try:
                return res.status
            except:
                return 'UNKNOWN'
    else:
        return 'NOT WORKING'


@register.filter()
def code_to_comune_name(comune_code):
    """
    Return status of a celery task with a label
    """
    return mark_safe("<strong>{}</strong>".format(comune_name_from_code(comune_code)))
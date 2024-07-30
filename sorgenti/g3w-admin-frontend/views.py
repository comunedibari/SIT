from django.conf import settings
from django.views.generic import TemplateView
from django.views.generic.edit import BaseFormView
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login
from django.shortcuts import redirect
from guardian.shortcuts import get_objects_for_user
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from core.models import Group, GeneralSuiteData, MacroGroup
from core.mixins.views import AjaxableFormResponseMixin
from .configs import home_images_default
from collections import OrderedDict
import random
import os
import json
import logging

logger = logging.getLogger('django.request')

VALID_IMG_EXT = ('jpg', 'jpeg', 'png')

class LoginAjaxView(BaseFormView):

    form_class = AuthenticationForm

    def form_invalid(self, form):
        return JsonResponse({'status': 'error', 'errors_form': form.errors})

    def form_valid(self, form):
        auth_login(self.request, form.get_user())
        return JsonResponse({'status': 'ok', 'message': 'Login'})


@method_decorator(csrf_exempt, name='dispatch')
class FrontendAVBView(TemplateView):

    template_name = 'frontend/home.html'

    def post(self, request, *args, **kwargs):
        self.request = request
        return TemplateView.get(self, request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(FrontendAVBView, self).get_context_data(**kwargs)

        if self.request.session.get('spid_name', False):
            context['spid_name'] = self.request.session['spid_name']

        if self.request.session.get('spid_lastname', False):
            context['spid_lastname'] = self.request.session['spid_lastname']

        return context


class AssistenzaAVBView(FrontendAVBView):

    template_name = 'frontend/assistenza.html'


class IdpLoginView(TemplateView):

    template_name = 'frontend/idp-login.html'

    def get(self, request, *args, **kwargs):

        if request.user.is_authenticated:
            return redirect('frontend')

        return super(IdpLoginView, self).get(request, *args, **kwargs)



class WmsAVBView(TemplateView):

    template_name = 'frontend/wms.html'


@method_decorator(csrf_exempt, name='dispatch')
class FrontendView(TemplateView):

    template_name = 'frontend/index.html'

    def get(self, request, *args, **kwargs):
        self.request = request
        return TemplateView.get(self, request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.request = request
        return TemplateView.get(self, request, *args, **kwargs)

    def get_home_images(self):

        if hasattr(settings, 'FRONTEND_IMAGES_DIR') and settings.FRONTEND_IMAGES_DIR:

            # get every files into FRONTEND_IMAGES_DIR
            files = os.listdir(settings.FRONTEND_IMAGES_DIR)

            if 'images.json' in files:
                try:
                    with open(settings.FRONTEND_IMAGES_DIR + '/images.json') as conf_file:
                        default = False
                        home_images = json.loads(conf_file.read())
                except Exception as e:
                    logger.error(e.message)
                    home_images = home_images_default
                    default = True
            else:
                home_images = list()
                default = False
                for file in files:
                    ext = os.path.splitext(file)[1][1:]
                    if ext.lower() in VALID_IMG_EXT:
                        home_images.append(
                            {
                                'image': file,
                                'main_color': '#fff',
                                'main_title_color': '#fff',
                                'author': None,
                                'author_url': None,
                                'subtitle_color': '#fff'
                            },
                        )

            return (default, home_images)
        else:
            return (True, home_images_default)

    def get_context_data(self, **kwargs):
        cdata = super(FrontendView, self).get_context_data(**kwargs)

        if self.request.session.get('spid_name', False):
            cdata['spid_name'] = self.request.session['spid_name']

        if self.request.session.get('spid_lastname', False):
            cdata['spid_lastname'] = self.request.session['spid_lastname']

        # add anonimous user to the context data
        # we get groups with base on permissions
        cdata['anonimoususer'] = AnonymousUser()

        groups = get_objects_for_user(self.request.user, 'core.view_group', Group).order_by('order') \
                 | get_objects_for_user(cdata['anonimoususer'], 'core.view_group', Group).order_by('order')

        cdata['groups'] = OrderedDict()
        cdata['macrogroups'] = OrderedDict()
        tmp_macrogroups = dict()

        ordered_macrogroups = MacroGroup.objects.order_by('order').all()

        for group in groups:

            # check if group has macrogroup
            macrogroups = group.macrogroups.all()
            if len(macrogroups) > 0:
                for macrogroup in macrogroups:
                    if macrogroup not in tmp_macrogroups:
                        tmp_macrogroups.update({macrogroup: {'children': [group]}})
                    else:
                        if group not in tmp_macrogroups[macrogroup]['children']:
                            tmp_macrogroups[macrogroup]['children'].append(group)
            else:
                cdata['groups'].update({group: {'children': []}})

        # order macrogroups by
        for macrogroup in ordered_macrogroups:
            if macrogroup in tmp_macrogroups:
                cdata['macrogroups'][macrogroup] = tmp_macrogroups[macrogroup]
            else:
                cdata['macrogroups'][macrogroup] = OrderedDict()


        # get data from generaldata
        cdata['generaldata'] = GeneralSuiteData.objects.get()

        cdata['page_title'] = getattr(settings, 'G3WSUITE_CUSTOM_TITLE', 'G3W-SUITE')

        # get home images data
        home_images = self.get_home_images()

        if home_images[0]:
            cdata['home_image_path'] = '../../static/frontend/images/home/'
        else:
            cdata['home_image_path'] = settings.FRONTEND_IMAGES_URL

        cdata['home_image'] = random.choice(home_images[1])

        # richiesta di mauro per invio di post
        # kw=ZnJvbS
        if 'kw' in self.request.POST and self.request.POST['kw'] == 'ZnJvbS' or self.request.user.is_authenticated:
            cdata['can_login'] = True
        return cdata
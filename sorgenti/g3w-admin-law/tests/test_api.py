from django.urls import reverse
from rest_framework import status
from law.models import Laws, Articles
from django.contrib.auth.models import User
from .base import BaseLawTestCase
import os

CURRENT_PATH = os.getcwd()
TEST_BASE_PATH = '/law/tests/data/'
DATASOURCE_PATH = '{}{}'.format(CURRENT_PATH, TEST_BASE_PATH)


class APILawTests(BaseLawTestCase):

    def test_get_laws(self):

        url = reverse('law-api-articles-all')

        login = self.client.login(username='admin01', password='admin01')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Laws.objects.count())

        # test forbidden for post and put and delete
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        url = reverse('law-api-articles', kwargs={'law_id': 1})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        '''
        self.assertEquals(response.data, {'todate': '2017-12-10', 'name': u'Normativa regolamento URBANISTICO',
                                          'created': u'2017-10-25T07:23:44.081000Z',
                                          'modified': u'2018-01-04T10:29:44.440000Z', 'variation': u'',
                                          'slug': u'normativa-regolamento-urbanistico', 'fromdate': '2017-10-01', 
                                          u'id': 1, 'description': u''})
        '''

        # check response
        self.assertEquals(response.data['fromdate'], '2017-10-01')
        self.assertEquals(response.data['todate'], '2017-12-10')
        self.assertEquals(response.data['name'], u'Normativa regolamento URBANISTICO')
        self.assertEquals(response.data['variation'], u'')
        self.assertEquals(response.data['description'], u'')
        self.assertEquals(response.data['slug'], u'normativa-regolamento-urbanistico')

    def test_get_articles(self):

        # test article list
        # ===========================================
        url = reverse('law-article-api-articles-all')

        login = self.client.login(username='admin01', password='admin01')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Articles.objects.count())

        # test forbidden for post and put and delete
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        article_data = {'slug': u'4', 'title': u'Pippo', 'number': u'4', 'correlate_articles': [],
                        'content': u'<p>gli interventi di addizione agli insediamenti esistenti consentiti '
                                   u'anche\r\nall\u2019esterno del perimetro dei centri abitati;\r\n- gli ambiti interessati '
                                   u'da interventi di riorganizzazione del tessuto urbanistico;\r\n- gli interventi che, in ragione '
                                   u'della loro complessit\xe0 e rilevanza,\r\npresuppongono la preventiva approvazione di '
                                   u'Piani Attuativi o Interventi Edilizi\r\nDiretti Convenzionati;\r\n- il coordinamento con '
                                   u'la pianificazione comunale di settore;\r\n- la disciplina della perequazione urbanistica, '
                                   u'riferita a specifiche aree di\r\ntrasformazione e/o di riqualificazione degli assetti '
                                   u'insediativi;\r\n- il programma di intervento per l\u2019abbattimento delle barriere '
                                   u'architettoniche\r\ned urbanistiche, sulla base del censimento delle barriere '
                                   u'architettoniche\r\nnell\u2019ambito urbano e la determinazione degli interventi '
                                   u'necessari al loro\r\nsuperamento;\r\n- le infrastrutture da realizzare e le aree ad esse '
                                   u'destinate;\r\n- i beni sottoposti a vincolo ai fini espropriativi, ai sensi delle vigenti d</p>',
                        'comma': u'4', u'id': 2}

        url = reverse('law-article-api-articles', kwargs={'article_id': 2})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        for k in article_data.keys():
            self.assertEquals(response.data['slug'], article_data['slug'])

        # test article list
        # ===========================================
        url = reverse('law-article-api-articles-all')


        # test get >1 article
        response = self.client.get(
            '{0}?articles={1}'.format(url,
                              'nta-variante-ru-approvata-il-18052016,10,|nta-variante-ru-approvata-il-18052016,102,'))

        self.assertEqual(len(response.data), 2)
        self.assertEqual(int(response.data[0]['number']), 10)
        self.assertEqual(int(response.data[1]['number']), 102)

        # test pdf renderer
        response = self.client.get(
            '{0}?articles={1}&format=pdf'.format(url, 'nta-variante-ru-approvata-il-18052016,10,'))

        self.assertEqual(response.content_type, 'application/pdf')

        # try to load pdf
        pdf_data = open('{}{}'.format(DATASOURCE_PATH, 'response.pdf'), 'rb')
        d = pdf_data.read()
        pdf_data.close()

        # todo: to analyse better for compare pdf
        #self.assertEqual(response.content, d)


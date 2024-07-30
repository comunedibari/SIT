from django.template import loader
from rest_framework import renderers
try:
    from weasyprint import HTML as WeasyHTML, CSS as WeasyCSS
except:
    pass


class PDFRenderer(renderers.BaseRenderer):
    media_type = 'application/pdf'
    format = 'pdf'
    render_style = 'binary'

    def div_by_law(self, articles):
        """
        Division articles by law
        """
        ret = dict()
        for article in articles:
            slug = article['law']['slug']
            if slug not in ret:
                ret[slug] = [article]
            else:
                ret[slug].append(article)
        return ret

    def render(self, data, media_type=None, renderer_context=None):

        html = loader.get_template('law/api/article_pdf.html')
        html_error = loader.get_template('law/api/article_pdf_error.html')
        css = loader.get_template('law/api/article_pdf.css')

        context = data
        if isinstance(data, dict) and 'result' in data and not data['result']:
            pdf = WeasyHTML(string=html_error.render(context=context))
            renderer_context['response'].status_code = 200
        else:
            pdf = WeasyHTML(string=html.render(context={'data': self.div_by_law(context)}))

        css_pdf = WeasyCSS(string=css.render())

        pdf_document = pdf.render(stylesheets=[css_pdf])

        # add right content_type
        renderer_context['response'].content_type = 'application/pdf'

        return pdf_document.write_pdf()
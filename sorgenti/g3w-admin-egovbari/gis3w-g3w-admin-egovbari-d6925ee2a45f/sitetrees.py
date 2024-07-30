from sitetree.utils import item
from core.utils.tree import G3Wtree

# Be sure you defined `sitetrees` in your module.

sitetrees = (
    # Define a tree with `tree` function.
    G3Wtree('egovbari', title='OPENDATA', module='egovbari', items=[
      # Then define items and their children with `item` function.
      item('OPENDATA', '#', icon_css_class='fa fa-database', access_loggedin=True, children=[
        item('Consulta', 'http://opendata.egov.ba.it/', url_as_pattern=False, icon_css_class='fa fa-list',
             access_loggedin=True),
        item('Accedi', 'http://opendata.egov.ba.it/user/login', url_as_pattern=False, access_loggedin=True,
             icon_css_class='fa fa-key')
      ]),
    ]),

    G3Wtree('egovbari_en', title='OPENDATA', module='egovbari', items=[
        # Then define items and their children with `item` function.
        item('OPENDATA', '#', icon_css_class='fa fa-database', access_loggedin=True, children=[
            item('Consult', 'http://opendata.egov.ba.it/', url_as_pattern=False, icon_css_class='fa fa-list',
             access_loggedin=True),
        item('Login', 'http://opendata.egov.ba.it/user/login', url_as_pattern=False, access_loggedin=True,
             icon_css_class='fa fa-key')
        ]),
    ]),
)

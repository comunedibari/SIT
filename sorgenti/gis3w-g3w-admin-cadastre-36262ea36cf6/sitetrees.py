from sitetree.utils import item
from core.utils.tree import G3Wtree

def get_menu_items():
    return [
        item('Report', 'cadastre-dashboard', url_as_pattern=True, icon_css_class='fa fa-pie-chart',
             access_by_perms=['cadastre.add_config']),
        item('Configurazioni', 'cadastre-config', url_as_pattern=True, icon_css_class='fa fa-cog',
             access_by_perms=['cadastre.add_config'],
             children=[
                 item('Aggiungi configurazione', 'cadastre-config-add', in_menu=False,
                      url_as_pattern=True,
                      icon_css_class='fa fa-plus'),
                 item('Aggiorna configurazione {{ object.pk}}', 'cadastre-config-update object.pk',
                      url_as_pattern=True,
                      icon_css_class='fa fa-edit', in_menu=False),
             ]),
        item('Utenti e connessioni', 'cadastre-config-userdb', url_as_pattern=True, icon_css_class='fa fa-cog',
             access_by_perms=['cadastre.add_configusercadastre'],
             children=[
                 item('Aggiungi utente', 'cadastre-config-user-add', in_menu=False,
                      url_as_pattern=True,
                      icon_css_class='fa fa-plus'),
                 item('Aggiorna utente {{ object.pk}}', 'cadastre-config-user-update object.pk',
                      url_as_pattern=True,
                      icon_css_class='fa fa-edit', in_menu=False),
                 item('Aggiungi connessione', 'cadastre-config-cxf-db-conn-add', in_menu=False,
                      url_as_pattern=True,
                      icon_css_class='fa fa-plus'),
                 item('Aggiorna connessione {{ object.pk}}', 'cadastre-config-cxf-db-conn-update object.pk',
                      url_as_pattern=True,
                      icon_css_class='fa fa-edit', in_menu=False),
             ]),
        item('Carica CENSUARIO e CXF', 'cadastre-loaddata', url_as_pattern=True, icon_css_class='fa fa-upload',
             access_by_perms=['cadastre.add_prm'])
    ]


def get_en_menu_items():
    return [
        item('Report', 'cadastre-dashboard', url_as_pattern=True, icon_css_class='fa fa-pie-chart',
             access_by_perms=['cadastre.add_config']),
        item('Configurations', 'cadastre-config', url_as_pattern=True, icon_css_class='fa fa-cog',
             access_by_perms=['cadastre.add_config'],
             children=[
                 item('Add configuration', 'cadastre-config-add', in_menu=False,
                      url_as_pattern=True,
                      icon_css_class='fa fa-plus'),
                 item('Edit configuration {{ object.pk}}', 'cadastre-config-update object.pk',
                      url_as_pattern=True,
                      icon_css_class='fa fa-edit', in_menu=False),
             ]),
        item('Users and connections', 'cadastre-config-userdb', url_as_pattern=True, icon_css_class='fa fa-cog',
             access_by_perms=['cadastre.add_configusercadastre'],
             children=[
                 item('Add user', 'cadastre-config-user-add', in_menu=False,
                      url_as_pattern=True,
                      icon_css_class='fa fa-plus'),
                 item('Edit user {{ object.pk}}', 'cadastre-config-user-update object.pk',
                      url_as_pattern=True,
                      icon_css_class='fa fa-edit', in_menu=False),
                 item('Add connection', 'cadastre-config-cxf-db-conn-add', in_menu=False,
                      url_as_pattern=True,
                      icon_css_class='fa fa-plus'),
                 item('Edit connection {{ object.pk}}', 'cadastre-config-cxf-db-conn-update object.pk',
                      url_as_pattern=True,
                      icon_css_class='fa fa-edit', in_menu=False),
             ]),
        item('Upload CENSUAL DATA and CXF', 'cadastre-loaddata', url_as_pattern=True, icon_css_class='fa fa-upload',
             access_by_perms=['cadastre.add_prm'])
    ]

# Be sure you defined `sitetrees` in your module.
sitetrees = (
    # Define a tree with `tree` function.
    G3Wtree('cadastre', title='Catasto', module='cadastre', items=[
        # Then define items and their children with `item` function.
        item('CATASTO', '#', type_header=True, access_by_perms=['cadastre.add_prm']),
        item('Admin', '#', icon_css_class='fa fa-building', access_by_perms=['cadastre.add_prm'],
             children=get_menu_items())

    ]),
    G3Wtree('cadastre_en', title='Cadastre', module='cadastre', items=[
        # Then define items and their children with `item` function.
        item('CADASTRE', '#', type_header=True, access_by_perms=['cadastre.add_prm']),
        item('Admin', '#', icon_css_class='fa fa-building', access_by_perms=['cadastre.add_prm'],
             children=get_en_menu_items())
    ])
)


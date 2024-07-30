from sitetree.utils import item
from core.utils.tree import G3Wtree

sitetrees = (
  # Define a tree with `tree` function.
  G3Wtree('catalog', title='CATALOGO', module='catalog', items=[
      # Then define items and their children with `item` function.
      item('CSW', '#', type_header=True),
      item('Cataloghi', 'catalog:csw_index', icon_css_class='fa fa-list', children=[
          item('Aggiungi catalogo', 'catalog:create', url_as_pattern=True, icon_css_class='fa fa-plus',
               access_by_perms=['catalog.add_catalog']),
          item('Lista cataloghi', 'catalog:csw_index', url_as_pattern=True, icon_css_class='fa fa-list'),
          item('Agg. catalogo {{ object.name}}', 'catalog:update object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False),
          item('Record catalogo {{ object.name}}', 'catalog:detail object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False),
          item('Record {{ object.title}}', 'catalog:record_update object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False)
      ]),
  ]),

  G3Wtree('catalog_en', title='CATALOG', module='catalog', items=[
      # Then define items and their children with `item` function.
      item('CSW', '#', type_header=True),
      item('Catalogs', 'catalog:csw_index', icon_css_class='fa fa-list', children=[
          item('Add catalog', 'catalog:create', url_as_pattern=True, icon_css_class='fa fa-plus',
               access_by_perms=['catalog.add_catalog']),
          item('Catalogs list', 'catalog:csw_index', url_as_pattern=True, icon_css_class='fa fa-list'),
          item('Catalog update {{ object.name}}', 'catalog:update object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False),
          item('Catalog records {{ object.name}}', 'catalog:detail object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False),
          item('Record {{ object.title}}', 'catalog:record_update object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False)
      ]),
  ]),
)
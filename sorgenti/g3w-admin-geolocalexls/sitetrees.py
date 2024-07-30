from sitetree.utils import item
from core.utils.tree import G3Wtree

# Be sure you defined `sitetrees` in your module.
sitetrees = (
  # Define a tree with `tree` function.
  G3Wtree('geolocalexls', title='GEOLOCALIZZAZIONE', module='geolocalexls', items=[
      # Then define items and their children with `item` function.
      item('GEOLOCALIZZAZIONE', '#', type_header=True),
      item('Geolocalizzazione File', 'geolocalexls:geolocate', url_as_pattern=True, icon_css_class='fa fa-file-excel-o'),
  ]),

  G3Wtree('geolocalexls_en', title='GEOLOCATION', module='geolocalexls', items=[
      # Then define items and their children with `item` function.
      item('GELOCATION', '#', type_header=True),
      item('Gelocation File', 'geolocalexls:geolocate', url_as_pattern=True, icon_css_class='fa fa-file-excel-o'),
  ]),
)
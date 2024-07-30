from sitetree.utils import item
from core.utils.tree import G3Wtree

# Be sure you defined `sitetrees` in your module.
sitetrees = (
  # Define a tree with `tree` function.
  G3Wtree('eleprofile', title='PROFILO ALTIMENTRICO', module='eleprofile', items=[
      # Then define items and their children with `item` function.
      item('PROFILO ALTIMENTRICO', '#', type_header=True),
      item('Profili', '#', icon_css_class='fa fa-users', children=[
          item('Aggiungi profilo', 'eleprofile-project-add', url_as_pattern=True, icon_css_class='fa fa-plus',
               access_by_perms=['eleprofile.add_eleproproject']),
          item('Lista profili', 'eleprofile-project-list', url_as_pattern=True, icon_css_class='fa fa-list'),
          item('Agg. profilo', 'eleprofile-project-update object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False),
      ]),
  ]),

  G3Wtree('eleprofile_en', title='ELEVATION PROFILE', module='eleprofile', items=[
      # Then define items and their children with `item` function.
      item('ELEVATION PROFILE', '#', type_header=True),
      item('Profiles', '#', icon_css_class='fa fa-users', children=[
          item('Add profile', 'eleprofile-project-add', url_as_pattern=True, icon_css_class='fa fa-plus',
               access_by_perms=['eleprofile.add_eleproproject']),
          item('Profiles list', 'eleprofile-project-list', url_as_pattern=True, icon_css_class='fa fa-list'),
          item('Update profile', 'eleprofile-project-update object.pk', url_as_pattern=True, icon_css_class='fa fa-edit', in_menu=False),
      ]),
  ]),
)
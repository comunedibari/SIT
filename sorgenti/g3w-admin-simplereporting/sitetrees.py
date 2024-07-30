from sitetree.utils import item
from core.utils.tree import G3Wtree

# Be sure you defined `sitetrees` in your module.
sitetrees = (
  # Define a tree with `tree` function.
  G3Wtree('simplereporting', title='SEGNALATORE', module='simplereporting', items=[
      # Then define items and their children with `item` function.
      item('SEGNALATORE', '#', type_header=True),
      item('Segnalatori', '#', icon_css_class='fa fa-users', children=[
          item('Aggiungi segnalazione', 'simplereporting-project-add', url_as_pattern=True, icon_css_class='fa fa-plus',
               access_by_perms=['simplereporting.add_simplerepoproject']),
          item('Lista progetti', 'simplereporting-project-list', url_as_pattern=True, icon_css_class='fa fa-list'),
          item('Agg. progetto {{ object.project.title }}', 'simplereporting-project-update object.pk', url_as_pattern=True,
               icon_css_class='fa fa-edit', in_menu=False, alias='simplerepoproject-update'),
      ]),
  ]),

  G3Wtree('simplereporting_en', title='REPORTING SYSTEM', module='simplereporting', items=[
      # Then define items and their children with `item` function.
      item('REPORTING SYSTEM', '#', type_header=True),
      item('Reportign systems', '#', icon_css_class='fa fa-users', children=[
          item('Add reporting', 'simplereporting-project-add', url_as_pattern=True, icon_css_class='fa fa-plus',
               access_by_perms=['simplereporting.add_simplerepoproject']),
          item('Projects list', 'simplereporting-project-list', url_as_pattern=True, icon_css_class='fa fa-list'),
          item('Update project {{ object.project.title }}', 'simplereporting-project-update object.pk', url_as_pattern=True,
               icon_css_class='fa fa-edit', in_menu=False, alias='simplerepoproject-update'),
      ]),
  ]),
)
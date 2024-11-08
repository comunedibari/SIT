# Generated by Django 2.2.27 on 2022-04-28 13:39

from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0055_auto_20220427_1322'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalog',
            name='inspire_gemet_keywords',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('Addresses', 'Addresses'), ('Administrative units', 'Administrative units'), ('Agricultural and aquaculture facilities', 'Agricultural and aquaculture facilities'), ('Area management/restriction/regulation zones and reporting units', 'Area management/restriction/regulation zones and reporting units'), ('Atmospheric conditions', 'Atmospheric conditions'), ('Bio-geographical regions', 'Bio-geographical regions'), ('Buildings', 'Buildings'), ('Cadastral parcels', 'Cadastral parcels'), ('Coordinate reference systems', 'Coordinate reference systems'), ('Elevation', 'Elevation'), ('Energy resources', 'Energy resources'), ('Environmental monitoring facilities', 'Environmental monitoring facilities'), ('Geographical grid systems', 'Geographical grid systems'), ('Geographical names', 'Geographical names'), ('Geology', 'Geology'), ('Habitats and biotopes', 'Habitats and biotopes'), ('Human health and safety', 'Human health and safety'), ('Hydrography', 'Hydrography'), ('Land cover', 'Land cover'), ('Land use', 'Land use'), ('Meteorological geographical features', 'Meteorological geographical features'), ('Mineral resources', 'Mineral resources'), ('Natural risk zones', 'Natural risk zones'), ('Oceanographic geographical features', 'Oceanographic geographical features'), ('Orthoimagery', 'Orthoimagery'), ('open data', 'Open Data'), ('Population distribution — demography', 'Population distribution — demography'), ('Production and industrial facilities', 'Production and industrial facilities'), ('Protected sites', 'Protected sites'), ('Sea regions', 'Sea regions'), ('Soil', 'Soil'), ('Species distribution', 'Species distribution'), ('Statistical units', 'Statistical units'), ('Transport networks', 'Transport networks'), ('Utility and governmental services', 'Utility and governmental services')], help_text='una lista separata da virgole di parolechiave di tipo GEMET INSPIRE sul servizio (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, complexType inspireTheme_eng) | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#keyword">"<i>keyword</i>"</a>', max_length=1024, null=True, verbose_name='INSPIRE gemet keywords'),
        ),
        migrations.AlterField(
            model_name='record',
            name='distance_uom',
            field=models.CharField(blank=True, editable=False, help_text='Spatial resolution - Maps to pycsw:DistanceUOM', max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='distance_value',
            field=models.CharField(blank=True, editable=False, help_text='Spatial resolution - Maps to pycsw:DistanceValue', max_length=50, null=True),
        ),
    ]

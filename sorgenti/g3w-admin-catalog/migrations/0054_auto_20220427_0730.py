# Generated by Django 2.2.27 on 2022-04-27 07:30

from django.db import migrations, models
import django.db.models.deletion
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0053_auto_20220316_0914'),
    ]

    operations = [
        migrations.AlterField(
            model_name='catalog',
            name='inspire_contact_email',
            field=models.CharField(blank=True, help_text='the email address of entity responsible for the INSPIRE/RNDT metadata', max_length=255, null=True, verbose_name='Contact point: email'),
        ),
        migrations.AlterField(
            model_name='catalog',
            name='inspire_contact_organization',
            field=models.CharField(blank=True, help_text='il nome dell\'organizzazione reponsabile per gli INSPIRE/RNDT metadata | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#publisher">"<i>publisher</i>"</a>', max_length=255, null=True, verbose_name='Contact point: organization'),
        ),
        migrations.AlterField(
            model_name='catalog',
            name='inspire_contact_phone',
            field=models.CharField(blank=True, help_text='the telephone number of entity responsible for the INSPIRE/RNDT metadata', max_length=255, null=True, verbose_name='Contact point: phone'),
        ),
        migrations.AlterField(
            model_name='catalog',
            name='inspire_contact_url',
            field=models.CharField(blank=True, help_text='the URL of entity responsible for the INSPIRE/RNDT metadata', max_length=255, null=True, verbose_name='Contact point: URL'),
        ),
        migrations.AlterField(
            model_name='catalog',
            name='inspire_date',
            field=models.DateField(blank=True, help_text='date of INSPIRE metadata offering (in ISO 8601 format), maps to dateStamp', null=True, verbose_name='INSPIRE date'),
        ),
        migrations.AlterField(
            model_name='catalog',
            name='inspire_default_language',
            field=models.CharField(blank=True, choices=[('bul', 'bul'), ('cze', 'cze'), ('dan', 'dan'), ('dut', 'dut'), ('eng', 'eng'), ('est', 'est'), ('fin', 'fin'), ('fre', 'fre'), ('ger', 'ger'), ('gre', 'gre'), ('hun', 'hun'), ('gle', 'gle'), ('ita', 'ita'), ('lav', 'lav'), ('lit', 'lit'), ('mlt', 'mlt'), ('pol', 'pol'), ('por', 'por'), ('rum', 'rum'), ('slo', 'slo'), ('slv', 'slv'), ('spa', 'spa'), ('swe', 'swe')], default='ita', help_text='3 letter code of the default language (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, simpleType euLanguageISO6392B)', max_length=255, null=True, verbose_name='Default language'),
        ),
        migrations.AlterField(
            model_name='record',
            name='abstract',
            field=models.TextField(blank=True, help_text='Abstract data description | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#description">"<i>description</i>"</a>', null=True, verbose_name='Abstract'),
        ),
        migrations.AlterField(
            model_name='record',
            name='access_constraints',
            field=models.TextField(blank=True, null=True, verbose_name='Access constraints'),
        ),
        migrations.AlterField(
            model_name='record',
            name='access_constraints_inspire',
            field=models.ForeignKey(help_text='Select a access contraints from the list', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='catalog.InspireLimitationsOnPublicAccess', verbose_name='Access constraints'),
        ),
        migrations.AlterField(
            model_name='record',
            name='accuracy',
            field=models.FloatField(default=1.0, help_text='Positional accuracy in meters', verbose_name='2.1.5.2 Positional accuracy'),
        ),
        migrations.AlterField(
            model_name='record',
            name='bounding_box',
            field=models.TextField(blank=True, help_text='Data bounding box. Automatically calculated from layer', null=True, verbose_name='Bounding box'),
        ),
        migrations.AlterField(
            model_name='record',
            name='creation_date',
            field=models.DateField(blank=True, help_text='Data creation date | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#issued">"<i>issued</i>"</a>', null=True, verbose_name='Creation date'),
        ),
        migrations.AlterField(
            model_name='record',
            name='crs',
            field=models.CharField(blank=True, help_text='Data Coordinate reference system', max_length=255, null=True, verbose_name='Coordinate reference system'),
        ),
        migrations.AlterField(
            model_name='record',
            name='denominator',
            field=models.IntegerField(default=1000, help_text='General density data factor', verbose_name='Spatial resolution'),
        ),
        migrations.AlterField(
            model_name='record',
            name='distance_uom',
            field=models.CharField(blank=True, editable=False, help_text='Risoluzione spaziale- Maps to pycsw:DistanceUOM', max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='distance_value',
            field=models.CharField(blank=True, editable=False, help_text='Risoluzione spaziale - Maps to pycsw:DistanceValue', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='record',
            name='eu_license',
            field=models.ForeignKey(blank=True, help_text='Conditions applicable to access and use of spatial data sets and to related services and, where applicable, to the corresponding fees, in accordance with the law of article 5, paragraph 2, letter b), and of article 11, paragraph 2, letter f), of Directive 2007/2 / EC. ', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='catalog.EULicense', verbose_name='Usability constraints - data license'),
        ),
        migrations.AlterField(
            model_name='record',
            name='format',
            field=models.CharField(blank=True, help_text='Description about data format', max_length=50, null=True, verbose_name='Distribution format'),
        ),
        migrations.AlterField(
            model_name='record',
            name='identifier',
            field=models.CharField(db_index=True, help_text='File identifier - Maps to pycsw:Identifier', max_length=255, verbose_name='Identifier'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_contact_email',
            field=models.CharField(blank=True, help_text='Responsabile dei metadati - the email address of entity responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE contact email'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_contact_organization',
            field=models.CharField(blank=True, help_text='Responsabile dei metadati - the organization name responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#publisher">"<i>publisher</i>"</a>', max_length=255, null=True, verbose_name='INSPIRE contactor organization'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_contact_phone',
            field=models.CharField(blank=True, help_text='Responsabile dei metadati - the telephone number of entity responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE contact phone'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_contact_url',
            field=models.CharField(blank=True, help_text='Responsabile dei metadati - the URL of entity responsible for the INSPIRE/RNDT metadata, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE contact url'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_email',
            field=models.CharField(blank=True, help_text='Responsabile - the email address of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE owner contact email'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_organization',
            field=models.CharField(blank=True, help_text='Responsabile - INSPIRE the organization name of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE owner contact organization'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_phone',
            field=models.CharField(blank=True, help_text='Responsabile - the telephone number of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE owner contact phone'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_owner_contact_url',
            field=models.CharField(blank=True, help_text='Responsabile - the URL of the owner, inherited from catalog if left blank', max_length=255, null=True, verbose_name='INSPIRE owner contact url'),
        ),
        migrations.AlterField(
            model_name='record',
            name='inspire_use_limitation',
            field=models.TextField(blank=True, help_text='Use limitation - Restrictions on data usage and access, inherited from catalog - No conditions apply - if left blank', null=True, verbose_name='Use limitation'),
        ),
        migrations.AlterField(
            model_name='record',
            name='keywords',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('Addresses', 'Addresses'), ('Administrative units', 'Administrative units'), ('Agricultural and aquaculture facilities', 'Agricultural and aquaculture facilities'), ('Area management/restriction/regulation zones and reporting units', 'Area management/restriction/regulation zones and reporting units'), ('Atmospheric conditions', 'Atmospheric conditions'), ('Bio-geographical regions', 'Bio-geographical regions'), ('Buildings', 'Buildings'), ('Cadastral parcels', 'Cadastral parcels'), ('Coordinate reference systems', 'Coordinate reference systems'), ('Elevation', 'Elevation'), ('Energy resources', 'Energy resources'), ('Environmental monitoring facilities', 'Environmental monitoring facilities'), ('Geographical grid systems', 'Geographical grid systems'), ('Geographical names', 'Geographical names'), ('Geology', 'Geology'), ('Habitats and biotopes', 'Habitats and biotopes'), ('Human health and safety', 'Human health and safety'), ('Hydrography', 'Hydrography'), ('Land cover', 'Land cover'), ('Land use', 'Land use'), ('Meteorological geographical features', 'Meteorological geographical features'), ('Mineral resources', 'Mineral resources'), ('Natural risk zones', 'Natural risk zones'), ('Oceanographic geographical features', 'Oceanographic geographical features'), ('Orthoimagery', 'Orthoimagery'), ('open data', 'Open Data'), ('Population distribution — demography', 'Population distribution — demography'), ('Production and industrial facilities', 'Production and industrial facilities'), ('Protected sites', 'Protected sites'), ('Sea regions', 'Sea regions'), ('Soil', 'Soil'), ('Species distribution', 'Species distribution'), ('Statistical units', 'Statistical units'), ('Transport networks', 'Transport networks'), ('Utility and governmental services', 'Utility and governmental services')], help_text='Record keywords - a comma-seperated keyword list of GEMET INSPIRE theme keywords about the service (see http://inspire.ec.europa.eu/schemas/common/1.0/enums/enum_eng.xsd, complexType inspireTheme_eng) | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#keyword">"<i>keyword</i>"</a>', max_length=1024, verbose_name='2.3.6 Keywords'),
        ),
        migrations.AlterField(
            model_name='record',
            name='language',
            field=models.CharField(blank=True, choices=[('bul', 'bul'), ('cze', 'cze'), ('dan', 'dan'), ('dut', 'dut'), ('eng', 'eng'), ('est', 'est'), ('fin', 'fin'), ('fre', 'fre'), ('ger', 'ger'), ('gre', 'gre'), ('hun', 'hun'), ('gle', 'gle'), ('ita', 'ita'), ('lav', 'lav'), ('lit', 'lit'), ('mlt', 'mlt'), ('pol', 'pol'), ('por', 'por'), ('rum', 'rum'), ('slo', 'slo'), ('slv', 'slv'), ('spa', 'spa'), ('swe', 'swe')], default='eng', help_text='Data Language | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#language">"<i>language</i>"</a>', max_length=3, null=True, verbose_name='Language'),
        ),
        migrations.AlterField(
            model_name='record',
            name='lineage',
            field=models.TextField(blank=True, help_text='Descriptive text about process history and/or general quality of data', null=True, verbose_name='Lineage'),
        ),
        migrations.AlterField(
            model_name='record',
            name='modified_date',
            field=models.DateField(blank=True, help_text='Modified date | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#modified">"<i>modified</i>"</a>', null=True, verbose_name='Modified date'),
        ),
        migrations.AlterField(
            model_name='record',
            name='other_constraints',
            field=models.TextField(blank=True, null=True, verbose_name='Other constraints'),
        ),
        migrations.AlterField(
            model_name='record',
            name='publication_date',
            field=models.DateField(blank=True, help_text='Data publication date', null=True, verbose_name='Publication date'),
        ),
        migrations.AlterField(
            model_name='record',
            name='resource_language',
            field=models.CharField(blank=True, help_text='Language used for data - inherited from catalog if left blank', max_length=30, null=True, verbose_name='Language'),
        ),
        migrations.AlterField(
            model_name='record',
            name='revision_date',
            field=models.DateField(blank=True, help_text='Data revision date', null=True, verbose_name='Revision date'),
        ),
        migrations.AlterField(
            model_name='record',
            name='rndt_distributor_contact_email',
            field=models.CharField(blank=True, help_text='Data distributor - the email address of the distributor, inherited from catalog if left blank', max_length=255, null=True, verbose_name='Data distributor: email'),
        ),
        migrations.AlterField(
            model_name='record',
            name='rndt_distributor_contact_organization',
            field=models.CharField(blank=True, help_text='Data distributor - RNDT the organization name of the distributor, inherited from catalog if left blank', max_length=255, null=True, verbose_name='Data distributor: organization'),
        ),
        migrations.AlterField(
            model_name='record',
            name='rndt_distributor_contact_phone',
            field=models.CharField(blank=True, help_text='Data distributor - the telephone number of the distributor, inherited from catalog if left blank', max_length=255, null=True, verbose_name='Data distributor: phone'),
        ),
        migrations.AlterField(
            model_name='record',
            name='rndt_distributor_contact_url',
            field=models.CharField(blank=True, help_text='Data distributor - the URL of the distributor, inherited from catalog if left blank', max_length=255, null=True, verbose_name='Data distributor: URL'),
        ),
        migrations.AlterField(
            model_name='record',
            name='rndt_resource_maintenance_frequency',
            field=models.CharField(choices=[('annually', 'data is updated every year'), ('asNeeded', "data is updated as deemed necessary, applies to resources with 'completed' status"), ('biannually', 'data is updated twice each year \t'), ('biennially', 'resource is updated every 2 years \t'), ('continual', 'data is repeatedly and frequently updated \tuse for data that is updated at a greater than daily frequency'), ('daily', 'data is updated each day \t'), ('fortnightly', 'data is updated every two weeks \t'), ('irregular', 'data is updated in intervals that are uneven in duration \t'), ('monthly', 'data is updated each month \t'), ('notPlanned', "there are no plans to update the data, applies to resources with 'completed' status"), ('periodic', 'resource is updated at regular intervals, '), ('quarterly', 'data is updated every three months'), ('semimonthly', 'resource updated twice a monthly'), ('unknown', 'frequency of maintenance for the data is not known'), ('weekly', 'data is updated on a weekly basis')], default='unknown', help_text='Frequenza con la quale sono registrati gli aggiornamenti dei dati.', max_length=255, verbose_name='Frequenza di aggiornamento'),
        ),
        migrations.AlterField(
            model_name='record',
            name='security_constraints',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Security constraints'),
        ),
        migrations.AlterField(
            model_name='record',
            name='temporal_extent_begin',
            field=models.DateTimeField(blank=True, help_text='Start of data average time', max_length=255, null=True, verbose_name='Temporal extension: start'),
        ),
        migrations.AlterField(
            model_name='record',
            name='temporal_extent_end',
            field=models.DateTimeField(blank=True, help_text='End of data average time', max_length=255, null=True, verbose_name='Temporal extension: end'),
        ),
        migrations.AlterField(
            model_name='record',
            name='title',
            field=models.CharField(help_text='Title data | DCAT-US: <a href="https://resources.data.gov/resources/dcat-us/#title">"<i>title</i>"</a>', max_length=255, null=True, verbose_name='Title'),
        ),
        migrations.AlterField(
            model_name='record',
            name='topic_category',
            field=models.CharField(blank=True, choices=[('farming', 'Farming - Rearing of animals and/or cultivation of plants.'), ('biota', 'Biota - Flora and/or fauna in natural environment.'), ('boundaries', 'Boundaries - Legal land descriptions.'), ('climatologyMeteorologyAtmosphere', 'Climatology / Meteorology / Atmosphere - Processes and phenomena of the atmosphere.'), ('economy', 'Economy - Economic activities, conditions and employment.'), ('elevation', 'Elevation - Height above or below sea level.'), ('environment', 'Environment - Environmental resources, protection and conservation.'), ('geoscientificInformation', 'Geoscientific Information - Information pertaining to earth sciences.'), ('health', 'Health, health services, human ecology, and safety.'), ('imageryBaseMapsEarthCover', 'Imagery / Base Maps / Earth Cover.'), ('intelligenceMilitary', 'Intelligence / Military - Military bases, structures, activities.'), ('inlandWaters', 'Inland water features, drainage systems and their characteristics.'), ('location', 'Location - Positional information and services.'), ('oceans', 'Oceans - Features and characteristics of salt water bodies (excluding inland waters).'), ('planningCadastre', 'Planning / Cadastre - Information used for appropriate actions for future use of the land.'), ('society', 'Society - Characteristics of society and cultures.'), ('structure', 'Structure - Man-made construction.'), ('transportation', 'Transportation - Means and aids for conveying persons and/or goods.'), ('utilitiesCommunication', 'Utilities / Communication - Energy, water and waste systems and communications infrastructure and services.')], help_text='Main topic data', max_length=255, null=True, verbose_name='Topic category'),
        ),
        migrations.AlterField(
            model_name='record',
            name='usability_constraints',
            field=models.TextField(blank=True, help_text='Conditions applicable to access and use of spatial data sets and to related services and, where applicable, to the corresponding fees, in accordance with the law of article 5, paragraph 2, letter b), and of article 11, paragraph 2, letter f), of Directive 2007/2 / EC. ', null=True, verbose_name='Usability constraints'),
        ),
    ]
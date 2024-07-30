


if [ -z "$(ls -A /code)" ]; then
   echo "Cloning g3w-admin branch ${G3W_SUITE_BRANCH:-v.3.6.x} ..."
   git clone https://github.com/g3w-suite/g3w-admin.git --single-branch --branch ${G3W_SUITE_BRANCH:-v.3.6.x} /code && \
   cd /code
fi

cp /requirements_rl.txt .

# Override settings
pip3 install -r requirements_rl.txt
pip3 install -r requirements_huey.txt

# Caching, File manager, Qplotly, Openrouteservice
pip3 install -r /code/g3w-admin/caching/requirements.txt
pip3 install -r /code/g3w-admin/filemanager/requirements.txt
pip3 install -r /code/g3w-admin/qplotly/requirements.txt
pip3 install -r /code/g3w-admin/openrouteservice/requirements.txt

# Frontend
cd / && git clone -b planetek-bari https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-frontend.git && \
    mv /g3w-admin-frontend /code/g3w-admin/frontend

# Law
git clone -b v3.6.x https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-law.git && \
    mv /g3w-admin-law /code/g3w-admin/law && \
    pip3 install -r /code/g3w-admin/law/requirements.txt

# CDU
git clone -b planetek-bari-v3.6.x https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-cdu.git && \
    mv /g3w-admin-cdu /code/g3w-admin/cdu && \
    pip3 install -r /code/g3w-admin/cdu/requirements.txt

# Cadastre
git clone -b v3.6.x https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-cadastre.git && \
    mv /g3w-admin-cadastre /code/g3w-admin/cadastre && \
    pip3 install -r /code/g3w-admin/cadastre/requirements.txt

# Catalog
git clone -b rndt_2 https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-catalog.git && \
    mv /g3w-admin-catalog /code/g3w-admin/catalog && \
    pip3 install -r /code/g3w-admin/catalog/requirements.txt

# Authldap
git clone -b planetek https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-authldap.git && \
    mv /g3w-admin-authldap /code/g3w-admin/authldap && \
    pip3 install -r /code/g3w-admin/authldap/requirements.txt

# Egovbari
git clone https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-egovbari.git && \
    mv /g3w-admin-egovbari /code/g3w-admin/egovbari

# Geolocalxls
git clone https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-geolocalexls.git && \
    mv /g3w-admin-geolocalexls /code/g3w-admin/geolocalexls && \
    pip3 install -r /code/g3w-admin/geolocalexls/requirements.txt

# IAM Bari
git clone -b patch_callback https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-iam-bari.git && \
    mv /g3w-admin-iam-bari /code/g3w-admin/iam_bari && \
    pip3 install -r /code/g3w-admin/iam_bari/requirements.txt

# SimpleReporting
git clone https://wlorenzetti_reader:ATBBSJK9SwTLWEZ4GGeYZrtVJDqYC2BA7342@bitbucket.org/gis3w/g3w-admin-simplereporting.git && \
    mv /g3w-admin-simplereporting /code/g3w-admin/simplereporting && \
    pip3 install -r /code/g3w-admin/simplereporting/requirements.txt

# Eleprofile
git clone -b v1.0.0 https://github.com/g3w-suite/g3w-admin-elevation-profile.git && \
    mv /g3w-admin-elevation-profile /code/g3w-admin/eleprofile

# QProcessing
export DEB_PYTHON_INSTALL_LAYOUT=deb_system
pip3 install git+https://github.com/g3w-suite/g3w-admin-processing.git@v1.2.1-beta.0

# PORTAL FOR ALTAMURA
# -------------------------------------------------------------------
# Install not by pip for old setuptools version
# -------------------------------------------------------------------
#cd /
#
git clone -b v0.0.1 https://github.com/g3w-suite/g3w-admin-authjwt.git  g3w-admin-authjwt
pip3 install pyjwt==1.7.1
pip3 install djangorestframework-simplejwt==4.3.0
mv /g3w-admin-authjwt/authjwt /code/g3w-admin/authjwt
#
git clone -b cors-auth-bymacrogroup-filter https://wlorenzetti:FTmjvVJnmVWw3NVy8FKN@bitbucket.org/gis3w/g3w-admin-portal.git  g3w-admin-portal
pip3 install -r /g3w-admin-portal/requirements.txt
mv /g3w-admin-portal/portal /code/g3w-admin/portal
cd /code



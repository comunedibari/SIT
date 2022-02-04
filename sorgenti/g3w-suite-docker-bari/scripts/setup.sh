


if [ -z "$(ls -A /code)" ]; then
   echo "Cloning g3w-admin branch ${G3W_SUITE_BRANCH:-dev} ..."
   git clone https://github.com/g3w-suite/g3w-admin.git --single-branch --branch ${G3W_SUITE_BRANCH:-dev} /code && \
   cd /code
fi

cp /requirements_rl.txt .

# Upgrade pip
python3 -m pip install --upgrade pip==21.0.1

# Override settings
pip3 install -r requirements_rl.txt

# Front end
#TODO make this as generic so that we can install as many plugins as possible
#git submodule add -f https://wlorenzetti:--@bitbucket.org/gis3w/g3w-admin-portal.git  g3w-admin/portal
git submodule add -b planetek-bari -f https://bitbucket.org/gis3w/g3w-admin-frontend.git g3w-admin/frontend

# Caching
pip3 install -r /code/g3w-admin/caching/requirements.txt

# File manager
pip3 install -r /code/g3w-admin/filemanager/requirements.txt

# Qplotly
pip3 install -r /code/g3w-admin/qplotly/requirements.txt

# Openrouteservice
pip3 install -r /code/g3w-admin/openrouteservice/requirements.txt

# Law
git submodule add -f https://bitbucket.org/gis3w/g3w-admin-law.git g3w-admin/law && \
  pip3 install -r /code/g3w-admin/law/requirements.txt

# CDU
git submodule add -b planetek-bari-qgis-api -f https://bitbucket.org/gis3w/g3w-admin-cdu.git g3w-admin/cdu && \
  pip3 install -r /code/g3w-admin/cdu/requirements.txt

# Cadastre
git submodule add -b v.3.2.x -f https://wlorenzetti:***@bitbucket.org/gis3w/g3w-admin-cadastre.git g3w-admin/cadastre && \
  pip3 install -r /code/g3w-admin/cadastre/requirements.txt

# Catalog
git submodule add -f https://wlorenzetti:****@bitbucket.org/gis3w/g3w-admin-catalog.git g3w-admin/catalog && \
  pip3 install -r /code/g3w-admin/catalog/requirements.txt

# Authldap
git submodule add  -b planetek -f https://wlorenzetti:***@bitbucket.org/gis3w/g3w-admin-authldap.git g3w-admin/authldap && \
  pip3 install -r /code/g3w-admin/authldap/requirements.txt

# Egovbari
git submodule add  -f https://wlorenzetti:***@bitbucket.org/gis3w/g3w-admin-egovbari.git g3w-admin/egovbari

# Spid_redirect
git submodule add  -b planetek -f https://wlorenzetti:***@bitbucket.org/gis3w/g3w-admin-spid_redirect.git g3w-admin/spid_redirect

# Geolocalxls
git submodule add   -f https://wlorenzetti:***@bitbucket.org/gis3w/g3w-admin-geolocalexls.git g3w-admin/geolocalexls && \
  pip3 install -r /code/g3w-admin/geolocalexls/requirements.txt

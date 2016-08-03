[ -f ./app/js/sitesettings.js ]  && { echo "Error: you have a settings file! I will not upload."; exit 2; }                           
[ -f ./src/main/webapp/WEB-INF/config.properties ]  && { echo "Error: you have a settings file! I will not upload."; exit 2; }
rsync -zavr --no-perms app/ root@priocloud.com:/srv/www/dfds/app/
rsync -zavr --no-perms app/ root@priocloud.com:/srv/www/priocloud/app/

[ -f ./app/app.settings.js ]  && { echo "Error: you have a settings file! I will not upload."; exit 2; }                           
rsync -zavr --no-perms app/ root@priocloud.com:/srv/www/dfds/app/
rsync -zavr --no-perms app/ root@priocloud.com:/srv/www/priocloud/app/

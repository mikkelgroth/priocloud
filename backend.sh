cd priorest
mvn clean package
cd ..
scp priorest/target/*.war root@priocloud.com:/srv/priocloud/priorest/target/


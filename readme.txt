#########################
### DEPLOYMENT
#########################
#To deploy the frontend:
./frontend.sh

#To deploy the backend:
./backend.sh

#########################
### DEVELOPMENT
#########################
#To start a local development server
docker-compose -f docker-compose-dev.yml up -d

#To stop a local development server
docker-compose -f docker-compose-dev.yml down

#########################
### DATABASE
#########################
#to enter the database
docker exec -it mongo mongo priocloud

#to view all BUs
db.bu.find().pretty()

#to view a specific user
db.user.find({"email":"theisborg@gmail.com"}).pretty()

#to erase the entire database
db.dropDatabase()

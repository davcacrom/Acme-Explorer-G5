# development
export NODE_ENV=development
export PORT=8008
export mongoDBPort=27018
export mongoDBHostname=mongo
docker-compose -p acme-explorer-g5-development down

# production
export NODE_ENV=production
export PORT=8001
export DBPORT=27011
export mongoDBHostname=mongo
docker-compose -p acme-explorer-g5-production down
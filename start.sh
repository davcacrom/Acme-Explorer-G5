# development
export NODE_ENV=development
export PORT=8008
export mongoDBPort=27018
export mongoDBHostname=mongo
export mongoLog=mongodb1.log
export dataUrl=db2
export logsUrl=logs1
docker-compose -p acme-explorer-g5-development up --build -d

# production
export NODE_ENV=production
export PORT=8001
export DBPORT=27011
export mongoDBHostname=mongo
export mongoLog=mongodb2.log
export dataUrl=db2
export logsUrl=logs2
docker-compose -p acme-explorer-g5-production up --build -d
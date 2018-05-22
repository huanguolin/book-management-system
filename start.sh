#!/bin/bash 

CUR_DIR=`dirname $(readlink -f ${BASH_SOURCE[0]})`

service_path="${CUR_DIR}/service"
webapp_path="${CUR_DIR}/webapp"

cd "${service_path}" && npm run dev &
cd "${webapp_path}" && npm start 


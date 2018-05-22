#!/bin/bash 

CUR_DIR=`dirname $(readlink -f ${BASH_SOURCE[0]})`

service_path="${CUR_DIR}/service"

cd "${service_path}" && npm run dev


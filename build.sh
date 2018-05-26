#!/bin/bash 

CUR_DIR=`dirname $(readlink -f ${BASH_SOURCE[0]})`

webapp_path="${CUR_DIR}/webapp"

cd "${webapp_path}" && npm run build 


#!/bin/sh
#
# This is a utility script to facilitate the testing of the production frontend
# It supposes that both the frontend and compose repositories are in the same
# root folder.
# 
# If you use this script, *** DON'T FORGET ** to you modify the name of the 
# image to be used for the frontend in compose to : frontend-prod-test
#
echo ''
echo '# # # # # # # # # # # # # #'
echo '# Building new test image #'
echo '# # # # # # # # # # # # # #'
echo ''
docker build -t frontend-prod-test .
echo ''
echo '# # # # # # # # # # # # # #'
echo '# Restarting the frontend #'
echo '# # # # # # # # # # # # # #'
echo ''
(cd ../compose && ./geoimagenet-compose.sh up -d frontend)
echo ''
echo '# # # # # # # # # # # # # #'
echo '# Frontend building logs  #'
echo '# # # # # # # # # # # # # #'
echo ''
(cd ../compose && ./geoimagenet-compose.sh logs -f frontend)
echo ''
echo '# # # # # # # # # # # # # # # #'
echo '# Frontend finished building  #'
echo '# # # # # # # # # # # # # # # #'
echo ''

#!/bin/bash  
echo "Build"  
ng build --prod
#! option after --prod to fix bug in angularfire2. remember to try without this on future
echo "Service Worker"  
npm run sw
echo "Limpando produção"
rm -R producao/*
echo "Copiando produção"
cp -R dist/* producao/

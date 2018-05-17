#!/bin/bash  
echo "Build"  
ng build
echo "Service Worker"  
npm run sw
echo "Limpando produção"
rm -R producao/*
echo "Copiando produção"
cp -R dist/* producao/

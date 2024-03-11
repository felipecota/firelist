#!/bin/bash  
echo "Build"  
ng build --prod
echo "Limpando produção"
rm -R producao/*
echo "Copiando produção"
cp -R dist/* producao/
cp producao/index.html producao/404.html

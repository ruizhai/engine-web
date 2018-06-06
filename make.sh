cd web
npm run build
if [ $? -ne 0 ]; then
  exit -1
fi
cd ..
rm -r dist/static
cp -r web/dist dist/static
cd spring
mvn clean
mvn install
cd ..


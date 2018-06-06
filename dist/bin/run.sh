cd db/
sh h2.sh
cd ..

nohup java -jar src/engine-web-0.0.1-SNAPSHOT.jar > log/engine.log &

jps |grep Server |awk -F " " '{print $1}' |xargs kill -9 
jps |grep engine-web |awk -F " " '{print $1}' |xargs kill -9 

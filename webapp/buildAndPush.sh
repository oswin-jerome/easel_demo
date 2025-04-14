# docker build --platform linux/amd64 -t easel .
docker buildx build --platform linux/amd64 -t easel . --load
docker tag easel registry.oswinjerome.in/easel
docker push registry.oswinjerome.in/easel
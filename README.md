# software-2-typescript

## Generar llaves

```sh
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256

openssl rsa -in jwtRS256 -pubout -outform PEM -out jwtRS256.pub
```

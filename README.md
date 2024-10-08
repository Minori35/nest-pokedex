<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo
1. Clonar el repositorio
2. Ejecutar 
```
yarn install

```

3. Tener nest Cli instalado 
```
npm i -g @nest/cli

```

4. Levantar la base de datos 

```
docker-compose up -d

```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Ejecutar la aplicación en dev:yarn start:dev

8. Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed

```


# Production Build
1. Crear el archivo __.env.prod__ 

2. Llenar las variables de entorno para prod.

3. Construir la nueva imagen imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

https://gist.github.com/Klerith/e7861738c93712840ab3a38674843490

## Stack usado
* MongoDB
* Nest



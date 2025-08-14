## Random Password Generator

-  CICD demo | [YT](https://youtu.be/1hy1GaMuWFQ)
-  To run locally
   ```sh
   cd password-generator
   npm i
   npm run dev
   ```
- To run locally using docker
  ```sh
  # Old UI
  docker run --rm -d -p 8080:80 princebansal7/password-generator:v3 
  # New UI
  docker run --rm -d -p 8080:80 princebansal7/password-generator:v5
  ```
  then visit: [http://localhost:8080](http://localhost:8080)
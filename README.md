# Study Earn Backend
Backend service for the Study-Earn App

## Structure
The backend consists varous services that are responsible for different functionalities. The services are:
- **User Service**: Responsible for user management
- **Study Service**: Responsible for study management
- **Earn Service**: Responsible for earn management
- **Notification Service**: Responsible for notification management
- **Authentication Service**: Responsible for authentication and authorization


## Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework for Node.js
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for Node.js
- **Docker**: Containerization platform
- **Kubernetes**: Container orchestration platform
- **Helm**: Kubernetes package manager
- **Jest**: Testing framework
- **Supertest**: HTTP assertions library
- **ESLint**: Linting utility
- **Prettier**: Code formatter
- **Husky**: Git hooks

## Setup
1. Clone the repository
2. Install dependencies
    ```bash
    npm install
    ```
3. Rename `.env.example` to `.env` and update the environment variables
4. Start the server
    ```bash
    npm start
    ```
5. Run tests
    ```bash
    npm test
    ```
6. Lint code
    ```bash
    npm run lint
    ```

## Docker
1. Build the Docker image
    ```bash
    docker build -t study-earn-backend .
    ```
2. Run the Docker container
    ```bash
    docker run -p 3000:3000 study-earn-backend
    ```
3. Stop the Docker container
    ```bash
    docker stop <container_id>
    ```
4. Remove the Docker container
    ```bash
    docker rm <container_id>
    ```

## Kubernetes
1. Install Minikube
2. Start Minikube
    ```bash
    minikube start
    ```
3. Enable Ingress
    ```bash
    minikube addons enable ingress
    ```
4. Install Helm
5. Install the backend chart
    ```bash
    helm install study-earn-backend ./helm/study-earn-backend
    ```
6. Uninstall the backend chart
    ```bash
    helm uninstall study-earn-backend
    ```

## Documentation
The API documentation is available at `/api-docs` endpoint. The documentation is generated using Swagger.   

## Liscense
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
```

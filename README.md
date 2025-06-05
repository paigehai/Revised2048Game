# 🎮 2048 Game Web Application

This project is a simple web-based replication of the classic 2048 game. Players use arrow keys to merge matching numbers until they reach the 2048 tile. The project was designed and deployed with a complete CI/CD pipeline using industry-standard tools.

---

## 🛠 Technologies Used

- **Frontend:** JavaScript, HTML, CSS
- **Version Control:** Git & GitHub
- **Build Tool:** Maven
- **Testing:** Mocha (framework) & Chai (assertion library)
- **Code Analysis:** SonarQube
- **Deployment:** Docker & Docker Desktop
- **CI/CD:** Jenkins
- **Web Server:** Nginx (via Docker container)

---

## 📸 Jenkins Pipeline Overview

![Jenkins Pipeline](../image/CDCI.png)

### 🔄 Pipeline Stages

#### 1. Checkout SCM
Automatically retrieves source code from GitHub using Jenkins' SCM integration.

#### 2. Tool Install
Declares and installs all required tools (like Maven, Docker) using Jenkins tool configuration.

#### 3. Clone Repository
Uses the provided repository URL to clone the source files for execution.

#### 4. Build
Runs Maven to compile the application.  
**Output:** `BUILD SUCCESS` or `BUILD FAILURE`

#### 5. Test
Runs unit tests using Mocha and Chai.
- Tests include:
  - Game initialisation
  - Score updates
  - Restart functionality
  - Tile movement based on input
  - Game-over condition handling

#### 6. Build & Push Docker Image
Builds a Docker image and pushes it to Docker Hub for version control and artifact tracking.

#### 7. Code Quality Analysis
Uses SonarQube to analyse the codebase for bugs, security vulnerabilities, and code smells.

#### 8. Deploy to Container
Runs the built Docker image in a container including all required dependencies and runtime configs.

#### 9. Release to Production
Deploys the app using an Nginx reverse proxy server at `http://localhost:8070`.

#### 10. Monitoring and Alerting
Uses Docker Health Check to monitor the container’s health and ensure nginx is properly serving the app.

---

## 🧪 Testing Framework

- **Framework:** Mocha  
- **Assertions:** Chai  
- **Tests Run:**
  - Game initialisation
  - Score updating
  - Restart on click
  - Tile movement accuracy
  - Game over condition detection

Test dependencies are managed with:
- `pom.xml` (for Maven)
- `package.json` (for JS)

---

## 🚀 Deployment Tool & Test Environment

- **Tool:** Docker Desktop
- **Artifact:** Docker image pushed to Docker Hub
- **Test Environment:** Local Docker container

---

## 🎯 Release Management

- **Tool:** Docker container with Nginx reverse proxy
- **Production URL:** `http://localhost:8070`
- **Browser Compatibility:** Safari (macOS), Chrome, Edge, etc.
- **Monitoring:** Docker Health Check for service status

---

## 📬 Contact

**Author:** Paige Haines  
Feel free to raise an issue or submit a pull request for improvements!

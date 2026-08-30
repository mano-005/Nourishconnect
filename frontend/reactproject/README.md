# NourishConnect

NourishConnect is a full-stack food-donation application.

## Stack

- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Spring Boot 3.3.5
- Java: 21
- Database: H2 file database by default; MySQL can be configured with environment variables
- Authentication: JWT

## Project structure

- `frontend/React project` — React/Vite frontend
- `backend/nourishconnect` — Spring Boot REST API

## Run in VS Code

### 1. Prerequisites

Install:

- JDK 21 and make sure `java -version` shows 21
- Node.js 20+ and npm
- VS Code

Maven does not need to be installed separately because the backend includes the Maven Wrapper (`mvnw.cmd` on Windows and `mvnw` on macOS/Linux).

### 2. Open the correct folder

In VS Code, open the **`nourishconnect_f&B`** folder, not the `backend/nourishconnect` folder and not the `frontend/React project` folder.

### 3. Install frontend packages

Open a terminal:

```powershell
cd "frontend\React project"
npm install
```

### 4. Start the backend

Open a second terminal:

```powershell
cd "backend\nourishconnect"
.\mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:8080`.

### 5. Start the frontend

Open a third terminal:

```powershell
cd "frontend\React project"
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## Default admin account

The backend creates this account automatically on first startup:

- Email: `admin@nourishconnect.org`
- Password: `Admin@12345`

For a real deployment, change these values with `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

## Database

By default the application uses a local H2 file database:

```text
./data/nourishconnect
```

No MySQL installation is required for local development.

To use MySQL instead, set:

```text
DB_URL=jdbc:mysql://localhost:3306/nourishconnect
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Build checks

Frontend:

```powershell
cd "frontend\React project"
npm run build
```

Backend:

```powershell
cd "backend\nourishconnect"
.\mvnw.cmd clean test
```

## Important

The backend and frontend must both be running. If the frontend shows network errors, first check that the backend is running on port 8080.

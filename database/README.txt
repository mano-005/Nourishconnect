NourishConnect MySQL Setup

1. Open MySQL Workbench.
2. Open database/nourishconnect.sql.
3. Run the complete SQL script.
4. Open:
   backend/nourishconnect/src/main/resources/application.properties
5. Replace YOUR_MYSQL_PASSWORD with your MySQL root password.
6. Start the backend:
   cd backend/nourishconnect
   mvnw.cmd spring-boot:run
7. Start the frontend:
   cd frontend/reactproject
   npm run dev

Database:
  nourishconnect

Tables:
  users
  receiving_homes
  donations

Important:
The application originally used H2 by default. This fixed project changes
the Spring Boot datasource to MySQL. Hibernate ddl-auto=update will keep
the tables synchronized with the Java entities.

Default admin configured by the application:
  email: admin@nourishconnect.org
  password: Admin@12345

Change the admin password before production use.

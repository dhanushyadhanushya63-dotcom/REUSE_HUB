@echo off
title ReUseHub Spring Boot Backend - Port 8080
echo ========================================================
echo   Starting ReUseHub Java Spring Boot + MySQL Backend
echo ========================================================
echo 1. Ensure MySQL server is running on localhost:3306
echo 2. Execute database/database.sql in MySQL Workbench
echo 3. Starting Spring Boot application...
mvn spring-boot:run
pause

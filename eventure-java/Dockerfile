# Use an official Maven image to build the application
FROM maven:3.8.4-eclipse-temurin-17 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the project's pom.xml and source code to the container
COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn clean package

# Use a smaller JDK image to run the application
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the packaged jar file from the build stage
COPY --from=build /app/target/eventure-java-1.0-SNAPSHOT.jar /app/eventure-java.jar

# Expose the port the application runs on
EXPOSE 8080

# Specify the command to run the application
CMD ["java", "-jar", "eventure-java.jar"]

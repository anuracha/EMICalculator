# Use an OpenJDK image for Java 8 (as per your pom.xml)
FROM openjdk:8-jdk-alpine
VOLUME /tmp
# Copy the built jar into the container
ARG JAR_FILE=target/smartemicalculator-1.0-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
# Run the application
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

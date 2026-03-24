<<<<<<< HEAD
# Use a lightweight OpenJDK 8 base image (compatible with your Java 1.8 project)
FROM eclipse-temurin:8-jdk

# Add a volume pointing to /tmp to handle temporary application files
VOLUME /tmp

# Set the argument for the build JAR file location
# Based on your pom.xml, the artifact will be 'smartemicalculator-1.0-SNAPSHOT.jar'
ARG JAR_FILE=target/smartemicalculator-1.0-SNAPSHOT.jar

# Add the project's jar file to the container as 'app.jar'
ADD ${JAR_FILE} app.jar

# Inform Docker that the application listens on port 8080 at runtime
EXPOSE 8080

# Run the jar file when the container starts
# -Djava.security.egd is added to speed up startup on some cloud platforms
=======
# Use an OpenJDK image for Java 8 (as per your pom.xml)
FROM eclipse-temurin:8-jdk
VOLUME /tmp
# Copy the built jar into the container
ARG JAR_FILE=target/smartemicalculator-1.0-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
# Run the application
>>>>>>> 0f6c6aa7d41b303ddf1bc12091ae41f4fd800121
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

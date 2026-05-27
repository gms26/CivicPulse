@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM Begin all REM://
@echo off

set MVNW_VERBOSE=false

@REM Determine the directory of this script
set "WRAPPER_DIR=%~dp0"

@REM Check for maven-wrapper.jar or download it
set "WRAPPER_JAR=%WRAPPER_DIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%WRAPPER_DIR%.mvn\wrapper\maven-wrapper.properties"

@REM Determine Maven home directory
if not exist "%WRAPPER_JAR%" (
    echo Downloading Maven Wrapper...
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar' -OutFile '%WRAPPER_JAR%' }"
)

@REM Read the distribution URL from wrapper properties
for /f "tokens=1,2 delims==" %%a in (%WRAPPER_PROPERTIES%) do (
    if "%%a"=="distributionUrl" set "MAVEN_DIST_URL=%%b"
)

@REM Set up Maven installation
set "MAVEN_USER_HOME=%USERPROFILE%\.m2\wrapper"
if not exist "%MAVEN_USER_HOME%" mkdir "%MAVEN_USER_HOME%"

@REM Extract Maven version from URL for directory name
for %%i in (%MAVEN_DIST_URL%) do set "MAVEN_ZIP=%%~ni"
set "MAVEN_HOME=%MAVEN_USER_HOME%\%MAVEN_ZIP%"

@REM Download Maven if not present
if not exist "%MAVEN_HOME%" (
    echo Downloading Apache Maven...
    set "MAVEN_ZIP_FILE=%MAVEN_USER_HOME%\maven-dist.zip"
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%MAVEN_DIST_URL%' -OutFile '%MAVEN_ZIP_FILE%' }"
    echo Extracting Maven...
    powershell -Command "& { Expand-Archive -Path '%MAVEN_ZIP_FILE%' -DestinationPath '%MAVEN_USER_HOME%' -Force }"
    del "%MAVEN_ZIP_FILE%"
)

@REM Run Maven
"%MAVEN_HOME%\bin\mvn.cmd" %*

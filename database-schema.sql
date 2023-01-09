DROP DATABASE Kube;
CREATE DATABASE Kube;

use Kube;

CREATE TABLE KubeUpdateLogs (
    LogID int NOT NULL AUTO_INCREMENT,
    UpdateTimeStamp varchar(255),
    EnvironmentName varchar(255),
    ImageName varchar(255),
    TagName varchar(255),
    ConsoleMessage varchar(2048),
    PRIMARY KEY (LogID)
);

CREATE TABLE KubeUpdateErrorLogs (
    ErrorLogID int NOT NULL AUTO_INCREMENT,
    ErrorTimeStamp varchar(255),
    EnvironmentName varchar(255),
    ImageName varchar(255),
    TagName varchar(255),
    ConsoleMessage varchar(2048),
    PRIMARY KEY (ErrorLogID)
);


INSERT INTO KubeUpdateLogs (UpdateTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage)
VALUES (value1, value2, value3, ...);

INSERT INTO KubeUpdateErrorLogs (ErrorTimeStamp, EnvironmentName, ImageName, TagName, ConsoleMessage) VALUES ("${currentTimeStamp}", "${req.body.environment}", "atomportal - api", "${req.body.tag}", "${output}")`;

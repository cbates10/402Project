-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: graduatecentral
-- ------------------------------------------------------
-- Server version	5.5.62-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `accountId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`accountId`,`username`,`password`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table contains login information. Currently it is stored in plaintext and should be moved towards an encryption scheme.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'Admin','Admin');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogmapping`
--

DROP TABLE IF EXISTS `catalogmapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalogmapping` (
  `idCatalog` int(11) NOT NULL,
  `idCourses` int(11) NOT NULL,
  PRIMARY KEY (`idCatalog`,`idCourses`),
  KEY `courseFK_idx` (`idCourses`),
  CONSTRAINT `catalogFK` FOREIGN KEY (`idCatalog`) REFERENCES `catalognames` (`idCatalog`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `courseFK` FOREIGN KEY (`idCourses`) REFERENCES `courses` (`idCourses`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table allows catalogs to be mapped to specific courses. The idCatalog field is the id for the catalog and the idCourses is the id for the course included in the catalog.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogmapping`
--

LOCK TABLES `catalogmapping` WRITE;
/*!40000 ALTER TABLE `catalogmapping` DISABLE KEYS */;
INSERT INTO `catalogmapping` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(2,45),(2,46),(2,47),(2,48),(2,49),(2,50),(2,51),(2,52),(2,53),(2,54),(2,55),(2,56),(2,57),(2,58),(2,59),(2,60),(2,61),(2,62),(2,63),(2,64),(2,65),(2,66),(2,67),(2,68),(2,69),(2,70),(2,71),(2,72),(2,73),(2,74),(2,75),(2,76),(2,77),(2,78),(2,79),(2,80),(2,81),(2,82),(2,83),(2,84),(2,85),(2,86),(2,87),(2,88),(2,89),(2,90),(2,91),(2,92),(2,93),(2,94),(2,95),(2,96),(2,97),(2,98),(2,99),(2,100),(2,101),(2,102),(2,103),(2,104),(2,105),(2,106),(2,107),(2,108),(2,109),(2,110),(2,111),(2,112),(2,113),(2,114),(2,115),(2,116),(2,117),(2,118),(2,119),(2,120),(2,121),(2,122),(2,123),(2,124),(2,125),(2,126),(2,127),(2,128),(2,129),(2,130),(2,131),(2,132),(2,133),(2,134),(2,135),(2,136);
/*!40000 ALTER TABLE `catalogmapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalognames`
--

DROP TABLE IF EXISTS `catalognames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalognames` (
  `idCatalog` int(11) NOT NULL AUTO_INCREMENT,
  `catalogName` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idCatalog`,`catalogName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Catalog names are stored in this table. The name of a catalog is given an id that can be tied to other entities such as courses.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalognames`
--

LOCK TABLES `catalognames` WRITE;
/*!40000 ALTER TABLE `catalognames` DISABLE KEYS */;
INSERT INTO `catalognames` VALUES (1,'Computer Science'),(2,'Electrical Engineering'),(3,'Computer Engineering');
/*!40000 ALTER TABLE `catalognames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committeemapping`
--

DROP TABLE IF EXISTS `committeemapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `committeemapping` (
  `memberSubject` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `memberId` int(11) NOT NULL,
  `idTitle` int(11) NOT NULL,
  PRIMARY KEY (`memberSubject`,`memberId`,`idTitle`),
  KEY `memberIdFKmapping_idx` (`memberId`),
  CONSTRAINT `memberIdFKmapping` FOREIGN KEY (`memberId`) REFERENCES `graduatecommittee` (`memberId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Contains information regarding which committee members serve on committees for different subjects\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committeemapping`
--

LOCK TABLES `committeemapping` WRITE;
/*!40000 ALTER TABLE `committeemapping` DISABLE KEYS */;
INSERT INTO `committeemapping` VALUES ('Computer Science',67,2),('Computer Science',68,1),('Computer Science',69,2),('Electrical Engineering',70,3),('Computer Science',71,2),('Electrical Engineering',72,2),('Computer Science',73,2),('Electrical Engineering',74,2),('Computer Science',75,2),('Electrical Engineering',76,2);
/*!40000 ALTER TABLE `committeemapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committeetitles`
--

DROP TABLE IF EXISTS `committeetitles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `committeetitles` (
  `idTitle` int(11) NOT NULL AUTO_INCREMENT,
  `titleName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idTitle`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table contains all the titles that a committee member may hold';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committeetitles`
--

LOCK TABLES `committeetitles` WRITE;
/*!40000 ALTER TABLE `committeetitles` DISABLE KEYS */;
INSERT INTO `committeetitles` VALUES (1,'Director'),(2,'Member'),(3,'Chairperson');
/*!40000 ALTER TABLE `committeetitles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursemappingoverride`
--

DROP TABLE IF EXISTS `coursemappingoverride`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coursemappingoverride` (
  `idObjects` int(11) NOT NULL,
  `idCourses` int(11) NOT NULL,
  `maxCount` int(11) DEFAULT NULL,
  `minGrade` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minHours` int(11) DEFAULT NULL,
  `maxHours` int(11) DEFAULT NULL,
  PRIMARY KEY (`idObjects`,`idCourses`),
  CONSTRAINT `idCoursesFKcoursemapping` FOREIGN KEY (`idObjects`) REFERENCES `courses` (`idCourses`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `idObjectsFKcoursemapping` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table allows programs to override the rules for specific courses. The default application action applies the minimum grade requirement in the objects table to all courses in that object''s catalogs. This allows the catalog rules to be overwritten such as if a grade needs to be more or less strict or if the hour requirements change.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursemappingoverride`
--

LOCK TABLES `coursemappingoverride` WRITE;
/*!40000 ALTER TABLE `coursemappingoverride` DISABLE KEYS */;
INSERT INTO `coursemappingoverride` VALUES (2,10,NULL,NULL,6,NULL),(3,11,NULL,'B',3,NULL),(7,64,NULL,NULL,6,NULL),(10,38,NULL,'B',24,NULL),(11,38,NULL,'B',24,NULL),(16,64,NULL,NULL,6,NULL),(17,65,NULL,'B',NULL,NULL),(18,104,NULL,NULL,24,NULL),(19,104,NULL,NULL,24,NULL),(20,104,NULL,NULL,24,NULL),(21,38,NULL,NULL,24,NULL),(22,104,NULL,NULL,24,NULL),(23,104,NULL,NULL,24,NULL),(24,104,NULL,NULL,24,NULL);
/*!40000 ALTER TABLE `coursemappingoverride` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `idCourses` int(11) NOT NULL AUTO_INCREMENT,
  `coursePrefix` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `courseNumber` int(11) NOT NULL,
  `courseHoursLow` int(11) NOT NULL,
  `courseHoursHigh` int(11) NOT NULL,
  `courseName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idCourses`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Contains all information regarding courses. Includes course title, prefix, etc.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'COSC',425,3,3,'Machine Learning'),(2,'COSC',440,4,4,'Formal Foundations of Software Engineering'),(3,'COSC',456,3,3,'Computer Graphics'),(4,'COSC',461,3,3,'Compilers'),(5,'COSC',462,3,3,'Parallel Programming'),(6,'COSC',471,3,3,'Numerical Analysis'),(7,'COSC',472,3,3,'Numerical Algebra'),(8,'COSC',481,3,3,'Theory of Computation'),(9,'COSC',494,1,3,'Special Topics in Computer Science'),(10,'COSC',500,1,15,'Thesis'),(11,'COSC',501,3,3,'Project in Lieu of Thesis'),(12,'COSC',502,1,3,'Registration for Use of Facilities'),(13,'COSC',505,3,3,'Introduction to Programming for Scientists and Engineers'),(14,'COSC',521,3,3,'Computational Cognitive Neuroscience'),(15,'COSC',526,3,3,'Introduction to Data Mining'),(16,'COSC',527,3,3,'Biologically-Inspired Computation'),(17,'COSC',528,3,3,'Introduction to Machine Learning'),(18,'COSC',529,3,3,'Autonomous Mobile Robots'),(19,'COSC',530,3,3,'Computer Systems Organization'),(20,'COSC',534,3,3,'Network Security'),(21,'COSC',545,3,3,'Fundamentals of Digital Archeology'),(22,'COSC',554,3,3,'Markov Chains in Computer Science'),(23,'COSC',556,3,3,'Computer Graphics'),(24,'COSC',557,3,3,'Visualization'),(25,'COSC',560,3,3,'Software Systems'),(26,'COSC',565,3,3,'Databases and Scripting Languages'),(27,'COSC',566,3,3,'Web Security'),(28,'COSC',571,3,3,'Numerical Mathematics I'),(29,'COSC',572,3,3,'Numerical Mathematics II'),(30,'COSC',580,3,3,'Foundations'),(31,'COSC',581,3,3,'Algorithms'),(32,'COSC',583,3,3,'Applied Cryptography'),(33,'COSC',592,1,1,'Off-campus Study'),(34,'COSC',594,1,3,'Independent Study'),(35,'COSC',594,1,3,'Special Topics in Computer Science'),(38,'COSC',600,3,15,'Doctoral Research and Dissertation'),(39,'COSC',620,1,6,'Advanced Topics in Intelligent Systems'),(40,'COSC',650,1,6,'Advanced Topics in Pattern/Image Analysis'),(41,'COSC',660,1,6,'Advanced Topics in Software Systems'),(42,'COSC',670,1,6,'Advanced Topics in Scientific Computing'),(43,'COSC',680,1,6,'Advanced Topics in Theory and Foundations'),(44,'COSC',690,1,6,'Advanced Topics in Computer Science'),(45,'ECE',415,3,3,'Automatic Control Systems'),(46,'ECE',416,3,3,'Digital Control Systems'),(47,'ECE',417,3,3,'Honors: Computer Control Systems'),(48,'ECE',421,3,3,'Electric Energy Systems'),(49,'ECE',422,3,3,'Power System Operations and Planning'),(50,'ECE',427,3,3,'Honors: Electric Energy Systems'),(51,'ECE',431,3,3,'Operational Amplifier Circuits'),(52,'ECE',432,3,3,'Electronic Amplifiers'),(53,'ECE',441,3,3,'Modern Communication Systems'),(54,'ECE',442,3,3,'Communication System Design'),(55,'ECE',451,3,3,'Computer Systems Architecture'),(56,'ECE',457,3,3,'Honors: Computer Systems Architecture'),(57,'ECE',461,3,3,'Introduction to Computer Security'),(58,'ECE',462,3,3,'Cyber-Physical Systems Security'),(59,'ECE',463,3,3,'Introduction to Datacenters'),(60,'ECE',481,3,3,'Power Electronics'),(61,'ECE',482,3,3,'Power Electronic Circuits'),(62,'ECE',487,3,3,'Honors: Power Electronics'),(63,'ECE',491,1,3,'Special Topics'),(64,'ECE',500,1,15,'Thesis'),(65,'ECE',501,3,3,'Project in Lieu of Thesis'),(66,'ECE',502,1,15,'Registration for Use of Facilities'),(67,'ECE',504,3,3,'Random Process Theory for Engineers'),(68,'ECE',505,3,3,'Digital Signal Processing'),(69,'ECE',506,3,3,'Real-time Digital Signal Processing'),(70,'ECE',511,3,3,'Linear Systems Theory'),(71,'ECE',512,3,3,'Multivariable Linear Control System Design'),(72,'ECE',521,3,3,'Power Systems Analysis I'),(73,'ECE',522,3,3,'Power Systems Analysis II'),(74,'ECE',525,3,3,'Alternative Energy Sources'),(75,'ECE',529,3,3,'Application of Linear Algebra in Engineering Systems'),(76,'ECE',531,3,3,'Semiconductor Devices'),(77,'ECE',532,3,3,'Intro to Analog Integrated Circuit Design'),(78,'ECE',533,3,3,'Advanced MOS Concepts and VLSI Design'),(79,'ECE',541,3,3,'Electromagnets I'),(80,'ECE',545,3,3,'Microwave Circuits I'),(81,'ECE',546,3,3,'Advanced Antenna Arrays'),(82,'ECE',547,3,3,'Monolithic Microwave Integrated Circuit (MMICs)'),(83,'ECE',551,3,3,'Digital System Design I'),(84,'ECE',553,3,3,'Computer Networks'),(85,'ECE',554,3,3,'Computer Security and Forensics'),(86,'ECE',555,3,3,'Embedded Systems'),(87,'ECE',559,3,3,'Secure and Trustworthy Computer Hardware Design'),(88,'ECE',563,3,3,'Introduction to Fire Protection Engineering'),(89,'ECE',564,3,3,'Enclosure Fire Dynamics'),(90,'ECE',567,3,3,'Forensic Engineering'),(91,'ECE',569,3,3,'Mobile and Embedded Systems Security'),(92,'ECE',571,3,3,'Pattern Recognition'),(93,'ECE',572,3,3,'Digital Image Processing'),(94,'ECE',573,3,3,'3D Methods in Robot Sensing, Vision and Visualization'),(95,'ECE',574,3,3,'Advanced Computer Vision'),(96,'ECE',575,3,3,'High Performance Computer Modeling and Visualization'),(97,'ECE',581,3,3,'High Frequency Power Electronics'),(98,'ECE',582,3,3,'Power Electronic Circuits'),(99,'ECE',583,3,3,'Modeling and Control of AC Three-phase PWM Converters'),(100,'ECE',592,1,1,'Off-Campus Study'),(101,'ECE',593,1,6,'Independent Study'),(102,'ECE',598,1,1,'Graduate Seminar'),(103,'ECE',599,1,3,'Special Topics'),(104,'ECE',600,3,15,'Doctoral Research and Dissertation'),(105,'ECE',605,3,3,'Advanced Topics in Signal Processing'),(106,'ECE',611,3,3,'Convex Optimization'),(107,'ECE',612,3,3,'Discrete Optimization'),(108,'ECE',613,3,3,'Nonlinear Systems Theory'),(109,'ECE',616,3,3,'Nonlinear Programming'),(110,'ECE',617,3,3,'Special Topics in Systems Theory I'),(111,'ECE',618,3,3,'Special Topics in Systems Theory II'),(112,'ECE',619,3,3,'Application of Contrained Optimization'),(113,'ECE',620,3,3,'Ultra-Wide-Area Resilient Electrical Energy Transmission Networks'),(114,'ECE',622,3,3,'Power System Economics'),(115,'ECE',625,3,3,'Utility Applications of Power Electronics'),(116,'ECE',627,3,3,'Wide Area Synchronous Measurements and Applications'),(117,'ECE',628,3,3,'Power System Transients'),(118,'ECE',631,3,3,'Advanced Topics in Mixed-Signal Integrated Circuit Design'),(119,'ECE',632,3,3,'Advanced Topics in High-Speed Integrated Circuit Design'),(120,'ECE',635,3,3,'Advanced Semiconductor Devices'),(121,'ECE',641,3,3,'Electromagnetics II'),(122,'ECE',642,3,3,'Wireless Communications'),(123,'ECE',643,3,3,'Detection and Estimation Theory'),(124,'ECE',644,3,3,'Coding and Information Theory'),(125,'ECE',645,3,3,'Phased Array Antennas'),(126,'ECE',651,3,3,'Computer-Aided Design of VLSI Systems'),(127,'ECE',653,3,3,'Advanced Computer Networks'),(128,'ECE',671,3,3,'Image Processing and Robotics I'),(129,'ECE',672,3,3,'Image Processing and Robotics II'),(130,'ECE',673,3,3,'Image Processing and Robotics III'),(131,'ECE',681,3,3,'Power Electronics Technologies I'),(132,'ECE',682,3,3,'Power Electronics Technologies II'),(133,'ECE',683,3,3,'Electric Drive System Control and Converter Design'),(134,'ECE',686,3,3,'Solid State Power Semiconductors'),(135,'ECE',691,1,1,'Advanced Graduate Seminar'),(136,'ECE',692,1,3,'Special Topics'),(137,'COSC',0,0,0,''),(138,'COSC',0,0,0,''),(139,'COSC',8,0,0,''),(140,'COSC',8,0,0,''),(141,'COSC',4,0,0,''),(142,'COSC',0,0,0,''),(143,'COSC',0,0,0,''),(144,'COSC',0,0,0,''),(145,'COSC',0,0,0,'');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `globalrequirements`
--

DROP TABLE IF EXISTS `globalrequirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `globalrequirements` (
  `idTypes` int(11) NOT NULL,
  `minGrade` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minGPA` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`idTypes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table contains information regarding any minimum global requirements that affect all objects of a certain type. Objects will not be allowed to set a value for a requirement below that listed in this table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `globalrequirements`
--

LOCK TABLES `globalrequirements` WRITE;
/*!40000 ALTER TABLE `globalrequirements` DISABLE KEYS */;
INSERT INTO `globalrequirements` VALUES (2,'B',3.00000),(5,'C',0.00000),(6,'C',3.00000),(7,'C',3.00000),(8,'B',2.00000);
/*!40000 ALTER TABLE `globalrequirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graduatecommittee`
--

DROP TABLE IF EXISTS `graduatecommittee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `graduatecommittee` (
  `memberId` int(11) NOT NULL AUTO_INCREMENT,
  `memberFirstName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `memberLastName` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`memberId`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table contains the information for members of any graduate committees';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graduatecommittee`
--

LOCK TABLES `graduatecommittee` WRITE;
/*!40000 ALTER TABLE `graduatecommittee` DISABLE KEYS */;
INSERT INTO `graduatecommittee` VALUES (67,'Michael','Berry'),(68,'Jens','Gregor'),(69,'Brad','Vander Zanden'),(70,'Jinyuan','Sun'),(71,'James','Plank'),(72,'Hairong','Qi'),(73,'Benjamin','Blalock'),(74,'Mongi','Abidi'),(75,'Micah','Beck'),(76,'Mark','Dean');
/*!40000 ALTER TABLE `graduatecommittee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoursbylevel`
--

DROP TABLE IF EXISTS `hoursbylevel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoursbylevel` (
  `idObjects` int(11) NOT NULL,
  `hours` decimal(10,5) NOT NULL,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `cap` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `hourLevel` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idObjects`,`hourLevel`,`cap`),
  CONSTRAINT `idObjectsFKhoursbylevel` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='this allows for hour restrictions to be set by level. For example an hourLevel may be 400 with a type variable, an hours 0.333 and a cap minimum. This will be enforced on the application by enforcing a minimum hour requirement of 1/3 of the total hours applied to the program. A type fixed interprets the hours as a fixed number (such as 3 hours) while a type variable interprets the hours as a percentage of the total hours. ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoursbylevel`
--

LOCK TABLES `hoursbylevel` WRITE;
/*!40000 ALTER TABLE `hoursbylevel` DISABLE KEYS */;
INSERT INTO `hoursbylevel` VALUES (1,0.33333,'variable','maximum','400'),(1,6.00000,'fixed','maximum','Outside'),(2,10.00000,'fixed','maximum','400'),(2,6.00000,'fixed','maximum','Outside'),(3,0.33333,'variable','maximum','400'),(3,6.00000,'fixed','maximum','Outside'),(10,12.00000,'fixed','maximum','400'),(10,6.00000,'fixed','minimum','600'),(10,15.00000,'fixed','minimum','PhDOnly'),(11,6.00000,'fixed','maximum','400'),(11,6.00000,'fixed','minimum','600'),(11,24.00000,'fixed','minimum','PhDOnly'),(15,0.33333,'variable','maximum','400'),(15,6.00000,'fixed','minimum','Outside'),(16,0.33333,'variable','maximum','400'),(16,6.00000,'fixed','minimum','Outside'),(17,0.33333,'variable','maximum','400'),(17,6.00000,'fixed','minimum','Outside'),(18,12.00000,'fixed','maximum','400'),(18,6.00000,'fixed','minimum','600'),(18,39.00000,'fixed','minimum','PhDOnly'),(19,6.00000,'fixed','maximum','400'),(19,6.00000,'fixed','minimum','600'),(19,15.00000,'fixed','minimum','PhDOnly'),(20,6.00000,'fixed','maximum','400'),(20,6.00000,'fixed','minimum','600'),(20,24.00000,'fixed','minimum','PhDOnly'),(21,6.00000,'fixed','maximum','400'),(21,6.00000,'fixed','minimum','600'),(21,24.00000,'fixed','minimum','PhDOnly'),(22,12.00000,'fixed','maximum','400'),(22,6.00000,'fixed','minimum','600'),(22,39.00000,'fixed','minimum','PhDOnly'),(23,6.00000,'fixed','maximum','400'),(23,6.00000,'fixed','minimum','600'),(23,15.00000,'fixed','minimum','PhDOnly'),(24,6.00000,'fixed','maximum','400'),(24,6.00000,'fixed','minimum','600'),(24,24.00000,'fixed','minimum','PhDOnly');
/*!40000 ALTER TABLE `hoursbylevel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `numberofrequiredcourses`
--

DROP TABLE IF EXISTS `numberofrequiredcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `numberofrequiredcourses` (
  `idObjects` int(11) NOT NULL,
  `numCourses` int(11) NOT NULL,
  PRIMARY KEY (`idObjects`),
  CONSTRAINT `idObjectsFKnumrequired` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table allows the required course functionality to be expanded to set the minimum number of required courses that must be taken. For example the Computer Science minor requires that at least 2 of the4 required courses be taken. ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `numberofrequiredcourses`
--

LOCK TABLES `numberofrequiredcourses` WRITE;
/*!40000 ALTER TABLE `numberofrequiredcourses` DISABLE KEYS */;
INSERT INTO `numberofrequiredcourses` VALUES (12,2);
/*!40000 ALTER TABLE `numberofrequiredcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objectcatalogs`
--

DROP TABLE IF EXISTS `objectcatalogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objectcatalogs` (
  `idObjects` int(11) NOT NULL,
  `idCatalog` int(11) NOT NULL,
  PRIMARY KEY (`idCatalog`,`idObjects`),
  KEY `idObjectsFK_idx` (`idObjects`),
  CONSTRAINT `idObjectsFKcatalogs` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table allows objects to be mapped to catalogs. For example an object of idObjects 1 could be mapped to idCatalog 2.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objectcatalogs`
--

LOCK TABLES `objectcatalogs` WRITE;
/*!40000 ALTER TABLE `objectcatalogs` DISABLE KEYS */;
INSERT INTO `objectcatalogs` VALUES (1,1),(1,2),(2,1),(2,2),(3,1),(3,2),(4,1),(4,2),(5,1),(5,2),(6,1),(6,2),(7,1),(7,2),(8,1),(8,2),(9,1),(9,2),(10,1),(10,2),(11,1),(11,2),(12,1),(12,2),(13,1),(13,2),(15,1),(15,2),(16,1),(16,2),(17,1),(17,2),(18,1),(18,2),(19,1),(19,2),(20,1),(20,2),(21,1),(21,2),(22,1),(22,2),(23,1),(23,2),(24,1),(24,2);
/*!40000 ALTER TABLE `objectcatalogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objectmapping`
--

DROP TABLE IF EXISTS `objectmapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objectmapping` (
  `idObjectDegree` int(11) NOT NULL,
  `idObjects` int(11) NOT NULL,
  PRIMARY KEY (`idObjectDegree`,`idObjects`),
  CONSTRAINT `idObjectsFK` FOREIGN KEY (`idObjectDegree`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table allows objects to be mapped into a program. The intent of the main application is to load in degree programs and this mapping table allows other objects such as minors or certificates to be mapped to those degree programs.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objectmapping`
--

LOCK TABLES `objectmapping` WRITE;
/*!40000 ALTER TABLE `objectmapping` DISABLE KEYS */;
INSERT INTO `objectmapping` VALUES (1,4),(1,5),(1,9),(2,4),(2,5),(2,9),(3,4),(3,5),(3,9),(6,4),(6,5),(6,9),(6,12),(7,4),(7,5),(7,9),(7,12),(8,4),(8,5),(8,9),(8,12),(10,5),(10,13),(11,5),(11,13),(15,4),(15,5),(16,4),(16,5),(17,4),(17,5),(18,5),(18,13),(19,5),(19,13),(20,5),(20,13),(21,5),(21,13),(22,5),(22,13),(23,5),(23,13),(24,5),(24,13);
/*!40000 ALTER TABLE `objectmapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objects` (
  `idObjects` int(11) NOT NULL AUTO_INCREMENT,
  `idTypes` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `subject` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `requiredHours` int(11) DEFAULT NULL,
  `minGrade` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minGPA` decimal(10,5) DEFAULT NULL,
  PRIMARY KEY (`idObjects`,`name`,`subject`,`idTypes`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Stores minimum required information for a degree program object (such as "Masters" or "Certificate")';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` VALUES (1,7,'Non-Thesis Courses Only','Computer Science',30,'C',NULL),(2,7,'Thesis','Computer Science',30,'C',3.00000),(3,7,'Non-Thesis Project','Computer Science',30,'C',NULL),(4,2,'Admission to Candidacy Masters','Computer Science',NULL,NULL,NULL),(5,5,'Fire Protection Engineering Certificate','Electrical Engineering',12,'C',0.00000),(6,7,'Non-Thesis Courses Only','Electrical Engineering',30,NULL,NULL),(7,7,'Thesis','Electrical Engineering',30,NULL,NULL),(8,7,'Non-Thesis Project','Electrical Engineering',30,NULL,NULL),(9,6,'Interdisciplinary Graduate Minor in Computational Science','Computational Science',9,NULL,NULL),(10,8,'BS to PhD','Computer Science',72,'B',NULL),(11,8,'MS to PhD (MS from UT)','Computer Science',15,'B',NULL),(12,6,'Computer Science Minor','Computer Science',9,'C',3.00000),(13,2,'Admission to Candidacy PhD','Computer Science',NULL,NULL,NULL),(15,7,'Non-Thesis Courses Only','Computer Engineering',30,'C',NULL),(16,7,'Thesis','Computer Engineering',30,'C',3.00000),(17,7,'Non-Thesis Project','Computer Engineering',30,'C',NULL),(18,8,'BS to PhD','Computer Engineering',72,'B',NULL),(19,8,'MS to PhD (MS from UT)','Computer Engineering',48,'B',NULL),(20,8,'MS to PhD (MS not from UT)','Computer Engineering',48,'B',NULL),(21,8,'MS to PhD (MS not from UT)','Computer Science',48,'B',NULL),(22,8,'BS to PhD','Electrical Engineering',72,'B',NULL),(23,8,'MS to PhD (MS from UT)','Electrical Engineering',48,'B',NULL),(24,8,'MS to PhD (MS not from UT)','Electrical Engineering',48,'B',NULL);
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requiredcourses`
--

DROP TABLE IF EXISTS `requiredcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `requiredcourses` (
  `idObjects` int(11) NOT NULL,
  `idCourses` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idObjects`,`idCourses`),
  CONSTRAINT `idObjectsFKrequiredcourses` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='allows required courses to be set for objects.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requiredcourses`
--

LOCK TABLES `requiredcourses` WRITE;
/*!40000 ALTER TABLE `requiredcourses` DISABLE KEYS */;
INSERT INTO `requiredcourses` VALUES (1,'19'),(1,'25'),(1,'30'),(2,'10'),(2,'19'),(2,'25'),(2,'30'),(3,'19'),(3,'25'),(3,'30'),(5,'88'),(5,'89'),(5,'90'),(5,'96'),(7,'64'),(10,'19'),(10,'25'),(10,'30'),(10,'38'),(11,'19'),(11,'25'),(11,'30'),(11,'38'),(12,'19'),(12,'25'),(12,'30'),(12,'31'),(15,'126'),(15,'127'),(15,'19'),(15,'83'),(15,'84'),(15,'85'),(15,'86'),(15,'92'),(15,'94'),(16,'126'),(16,'127'),(16,'19'),(16,'64'),(16,'83'),(16,'84'),(16,'85'),(16,'86'),(16,'92'),(16,'94'),(17,'126'),(17,'127'),(17,'19'),(17,'65'),(17,'83'),(17,'84'),(17,'85'),(17,'86'),(17,'92'),(17,'94'),(18,'104'),(19,'104'),(20,'104'),(21,'19'),(21,'25'),(21,'30'),(21,'38'),(22,'104'),(23,'104'),(24,'104');
/*!40000 ALTER TABLE `requiredcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restrictedobjectcourses`
--

DROP TABLE IF EXISTS `restrictedobjectcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restrictedobjectcourses` (
  `idObjects` int(11) NOT NULL,
  `idCourses` int(11) NOT NULL,
  PRIMARY KEY (`idObjects`,`idCourses`),
  CONSTRAINT `idObjectsFKrestrictedcourses` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='This table will allow objects of non degree program types (such as minors) to limit the courses within a catalog that apply to that object. Only the courses within this table will apply towards completing the objects requirements. For example if an object of type Minor is mapped to a course of Id 1, then only the course of Id 1 can be applied to that Minor.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restrictedobjectcourses`
--

LOCK TABLES `restrictedobjectcourses` WRITE;
/*!40000 ALTER TABLE `restrictedobjectcourses` DISABLE KEYS */;
INSERT INTO `restrictedobjectcourses` VALUES (9,13),(9,15),(9,16),(9,17),(9,19),(9,24),(9,26),(9,28),(9,75),(9,96),(12,1),(12,2),(12,3),(12,4),(12,5),(12,6),(12,7),(12,8),(12,9),(12,10),(12,11),(12,12),(12,13),(12,14),(12,15),(12,16),(12,17),(12,18),(12,19),(12,20),(12,21),(12,22),(12,23),(12,24),(12,25),(12,26),(12,27),(12,28),(12,29),(12,30),(12,31),(12,32),(12,33),(12,34),(12,35),(12,38),(12,39),(12,40),(12,41),(12,42),(12,43),(12,44);
/*!40000 ALTER TABLE `restrictedobjectcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `substitutablecourses`
--

DROP TABLE IF EXISTS `substitutablecourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `substitutablecourses` (
  `idObjects` int(11) NOT NULL,
  `idCourses` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `idSubCourse` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idObjects`,`idCourses`,`idSubCourse`),
  CONSTRAINT `idObjectsFKsubcourses` FOREIGN KEY (`idObjects`) REFERENCES `objects` (`idObjects`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Allows required courses to have substitutable courses. This is helpful in instances where one of a sequence of courses must be taken to fufill a requirement.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `substitutablecourses`
--

LOCK TABLES `substitutablecourses` WRITE;
/*!40000 ALTER TABLE `substitutablecourses` DISABLE KEYS */;
INSERT INTO `substitutablecourses` VALUES (1,'30','31'),(2,'30','31'),(3,'30','31'),(10,'30','31'),(11,'30','31'),(21,'30','31');
/*!40000 ALTER TABLE `substitutablecourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `types` (
  `idTypes` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`idTypes`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='These are the types of objects that an object may be. Such as "Certificate" or "Minor"';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES (1,'Degree Program'),(2,'Form'),(5,'Certificate'),(6,'Minor'),(7,'Masters'),(8,'PhD');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-17 19:00:44

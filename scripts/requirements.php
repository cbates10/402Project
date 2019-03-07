<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = $_POST["idObjects"];

/* Build the array for all objects to retrieve for the degree program */
$sqlObjects = "SELECT idObjects, type, name FROM objectmapping NATURAL JOIN objects NATURAL JOIN types WHERE idObjectDegree = ?";
$stmtObjects = $mysqli->prepare($sqlObjects);
if(!$stmtObjects) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmtObjects->bind_param("i", $degreeOption)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmtObjects->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmtObjects->bind_result($idObjects, $type, $name);

$objects = array();
$object = new stdClass();
$object->idObjects = $degreeOption;
$object->type = "Degree Program";
array_push($objects, $object);

while($stmtObjects->fetch()) {
	$object = new stdClass();
	$object->idObjects = $idObjects;
	$object->type = $type;
	$object->name = $name;
	array_push($objects, $object);
}
$stmtObjects->close();

/* SQL statements */
$sqlCourses = "SELECT idCourses FROM requiredcourses WHERE idObjects = ?";
$stmtCourses = $mysqli->prepare($sqlCourses);
if(!$stmtCourses) {
	die("Could not prepare statement $mysqli->error");
}

$sqlSubCourses = "SELECT idCourses, idSubCourse FROM substitutablecourses WHERE idObjects = ?";
$stmtSubCourses = $mysqli->prepare($sqlSubCourses);
if(!$stmtSubCourses) {
	die("Could not prepare statement $mysqli->error");
}

$sqlHours = "SELECT requiredHours, minGrade, 400Hours, 500Hours FROM objects NATURAL LEFT JOIN 400hours NATURAL LEFT JOIN 500hours WHERE idObjects = ?";
$stmtHours = $mysqli->prepare($sqlHours);
if(!$stmtHours) {
	die("Could not prepare statement $mysqli->error");
}

$sqlCourseOverride = "SELECT idCourses, maxCount, minGrade, minHours FROM coursemappingoverride WHERE idObjects = ?";
$stmtCourseOverride = $mysqli->prepare($sqlCourseOverride);
if(!$stmtCourseOverride) {
	die("Could not prepare statement $myslqi->error");
}

/* Initialize requirements */
$requirements = array();
$sqlTypes = "SELECT type FROM types";
$result = $mysqli->query($sqlTypes);
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$field = $row["type"];
		if($field !== "Degree Program") {
			$requirements[$field] = array();
		}
	}
}


for($x = 0; $x < count($objects); $x++) {
	if(!$stmtCourses->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not bind parameters $stmtCourses->error");
	}
	
	$rc = $stmtCourses->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtCourses->error");
	}
	$stmtCourses->bind_result($requiredCourse);

	$objectRequirements = new stdClass();

	$objectRequirements->requiredCourses = array();

	while($stmtCourses->fetch()) {
		$objectRequirements->requiredCourses[$requiredCourse] = array();
	}
	$stmtCourses->free_result();
	
	if(!$stmtSubCourses->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not bind parameters $stmtSubCourses->error");
	}
	$rc = $stmtSubCourses->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtSubCourses->error");
	}
	$stmtSubCourses->bind_result($requiredCourse, $substitutableCourse);

	while($stmtSubCourses->fetch()) {
		array_push($objectRequirements->requiredCourses[$requiredCourse], $substitutableCourse);
	}
	$stmtSubCourses->free_result();
	
	if(!$stmtHours->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not bind parameters $stmtSubCourses->error");
	}

	$rc = $stmtHours->execute();
	if(false === $rc) {
		die("Could not execute statement $stmt->error");
	}
	$stmtHours->bind_result($requiredHours, $minGrade, $hours400, $hours500);

	if($stmtHours->fetch()) {
		$objectRequirements->requiredHours = $requiredHours;
		$objectRequirements->hours400 = $hours400;
		$objectRequirements->hours500 = $hours500;
		$objectRequirements->minGrade = $minGrade;
	}
	$stmtHours->free_result();
	
	if(!$stmtCourseOverride->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not bind parameters $stmtCourseOverride->error");
	}
	$rc = $stmtCourseOverride->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtCourseOverride->error");
	}
	$stmtCourseOverride->bind_result($idCourse, $maxCount, $minGrade, $minHours);
	
	$objectRequirements->courseOverride = array();
	while($stmtCourseOverride->fetch()) {
		$courseOverride = new stdClass();
		$courseOverride->maxCount = $maxCount;
		$courseOverride->minGrade = $minGrade;
		$courseOverride->minHours = $minHours;
		$objectRequirements->courseOverride[$idCourse] = $courseOverride;
	}
	$stmtCourseOverride->free_result();
	
	$field = $objects[$x]->type;
	if($field !== "Degree Program") {
		$objectRequirements->name = $objects[$x]->name;
		array_push($requirements[$field], $objectRequirements);
	} else {
		$requirements[$field] = $objectRequirements;
	}
}

$stmtCourses->close();
$stmtHours->close();
$stmtSubCourses->close();
$stmtCourseOverride->close();
$mysqli->close();

$requirements = json_encode($requirements);
echo $requirements;

?>

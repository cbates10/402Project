<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

session_start();

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = $_SESSION["idObjects"];

/* Build the array for all objects to retrieve for the degree program */
$sqlObjects = "SELECT idObjects, type FROM objectmapping NATURAL JOIN objects NATURAL JOIN types WHERE idObjectDegree = ?";
$stmtObjects = $mysqli->prepare($sqlObjects);
if(!$stmtObjects) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmtObjects->bind_param("i", $degreeOption)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmtObjects->execute();
if(false === $rc) {
	echo 1;
	die("Could not execute statement $stmt->error");
}
$stmtObjects->bind_result($idObjects, $type);
$objects = array();
$types = array();
array_push($objects, $degreeOption);
array_push($types, "Degree Program");

while($stmtObjects->fetch()) {
	array_push($objects, $idObjects);
	array_push($types, $type);
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

$sqlHours = "SELECT requiredHours, 400Hours, 500Hours FROM objects NATURAL LEFT JOIN 400hours NATURAL LEFT JOIN 500hours WHERE idObjects = ?";
$stmtHours = $mysqli->prepare($sqlHours);
if(!$stmtHours) {
	die("Could not prepare statement $mysqli->error");
}

/* Initialize requirements */
$requirements = new stdClass();
$sqlTypes = "SELECT type FROM types";
$result = $mysqli->query($sqlTypes);
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$field = $row["type"];
		$requirements->$field = array();
	}
}


for($x = 0; $x < count($objects); $x++) {
	if(!$stmtCourses->bind_param("i", $objects[$x])) {
		die("Could not bind parameters $stmtCourses->error");
	}
	
	$rc = $stmtCourses->execute();
	if(false === $rc) {
		echo 2;
		die("Could not execute statement $stmtCourses->error");
	}
	$stmtCourses->bind_result($requiredCourse);

	$objectRequirements = new stdClass();

	$objectRequirements->requiredCourses = array();

	while($stmtCourses->fetch()) {
		$objectRequirements->requiredCourses[$requiredCourse] = array();
	}
	$stmtCourses->free_result();
	
	if(!$stmtSubCourses->bind_param("i", $objects[$x])) {
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
	
	if(!$stmtHours->bind_param("i", $objects[$x])) {
		die("Could not bind parameters $stmtSubCourses->error");
	}

	$rc = $stmtHours->execute();
	if(false === $rc) {
		die("Could not execute statement $stmt->error");
	}
	$stmtHours->bind_result($requiredHours, $hours400, $hours500);

	if($stmtHours->fetch()) {
		$objectRequirements->requiredHours = $requiredHours;
		$objectRequirements->hours400 = $hours400;
		$objectRequirements->hours500 = $hours500;
	}
	$stmtHours->free_result();
	
	$field = $types[$x];
	array_push($requirements->$field, $objectRequirements);
}

$stmtCourses->close();
$stmtHours->close();
$stmtSubCourses->close();
$mysqli->close();

$requirements = json_encode($requirements);
echo $requirements;

?>

<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = $_POST["idObjects"];

/* Get the global requirements for the object types */
$sqlGlobalRequirements = "SELECT type, minGrade, minGPA FROM globalrequirements NATURAL JOIN types";

$result = $mysqli->query($sqlGlobalRequirements);

$globalRequirements = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$globalRequirements[$row["type"]] = new stdClass();
		$globalRequirements[$row["type"]]->minGrade = $row["minGrade"];
		$globalRequirements[$row["type"]]->minGPA = floatval($row["minGPA"]);
	}
}

/* Build the array for all objects to retrieve for the degree program */
$sqlObjects = "SELECT idObjects, type, name FROM objectmapping NATURAL JOIN objects NATURAL JOIN types WHERE idObjectDegree = ? UNION SELECT idObjects, type, name FROM objects NATURAL JOIN types WHERE idObjects = ?";
$stmtObjects = $mysqli->prepare($sqlObjects);
if(!$stmtObjects) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmtObjects->bind_param("ii", $degreeOption, $degreeOption)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmtObjects->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmtObjects->bind_result($idObjects, $type, $name);

$objects = array();

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

$sqlHours = "SELECT requiredHours, minGrade, minGPA FROM objects WHERE idObjects = ?";
$stmtHours = $mysqli->prepare($sqlHours);
if(!$stmtHours) {
	die("Could not prepare statement $mysqli->error");
}

$sqlHoursByLevel = "SELECT hours, type, cap, hourLevel FROM hoursbylevel WHERE idObjects = ?";
$stmtHoursByLevel = $mysqli->prepare($sqlHoursByLevel);
if(!$stmtHoursByLevel) {
	die("Could not prepare statement $mysqli->error");
}

$sqlCourseOverride = "SELECT idCourses, maxCount, minGrade, minHours, maxHours FROM coursemappingoverride WHERE idObjects = ?";
$stmtCourseOverride = $mysqli->prepare($sqlCourseOverride);
if(!$stmtCourseOverride) {
	die("Could not prepare statement $myslqi->error");
}

$sqlApplicableCourses = "SELECT idCourses FROM restrictedobjectcourses WHERE idObjects = ?";
$stmtApplicableCourses = $mysqli->prepare($sqlApplicableCourses);
if(!$stmtApplicableCourses) {
	die("Could not prepare statement $myslqi->error");
}

$sqlCatalogs = "SELECT catalogName FROM objectcatalogs NATURAL JOIN catalognames WHERE idObjects = ?";
$stmtCatalogs = $mysqli->prepare($sqlCatalogs);
if(!$stmtCatalogs) {
	die("Could not prepare statement $mysqli->error");
}

$sqlNumberRequired = "SELECT numCourses FROM numberofrequiredcourses WHERE idObjects = ?";
$stmtNumberRequired = $mysqli->prepare($sqlNumberRequired);
if(!$stmtNumberRequired) {
	die("Could not prepare statement $mysqli->error");
}

/* Initialize requirements */
$requirements = array();
$sqlTypes = "SELECT type FROM objectmapping NATURAL JOIN objects NATURAL JOIN types WHERE idObjectDegree = ?";
$stmtTypes = $mysqli->prepare($sqlTypes);
if(!$stmtTypes) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmtTypes->bind_param("i", $degreeOption)) {
	die("Could not execute statement $stmtTypes->error");
}
$rc = $stmtTypes->execute();
if(false === $rc) {
	die("Could not execute statement $stmtTypes->error");
}
$stmtTypes->bind_result($field);

while($stmtTypes->fetch()) {
	$requirements[$field] = array();
}
$stmtTypes->close();

if(!$stmtCatalogs->bind_param("i", $degreeOption)) {
	die("Could not bind parameters $stmtCourse->error");
}
$rc = $stmtCatalogs->execute();
if(false === $rc) {
	die("Could not execute statement $stmtCatalogs->error");
}
$stmtCatalogs->bind_result($catalogName);
$requirements["Catalogs"] = array();
while($stmtCatalogs->fetch()) {
	array_push($requirements["Catalogs"], $catalogName);
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
		die("Could not execute statement $stmtHours->error");
	}
	$stmtHours->bind_result($requiredHours, $minGrade, $minGPA);

	if($stmtHours->fetch()) {
		$objectRequirements->requiredHours = $requiredHours;
		// If there is no value set for the object requirement for minGrade or minGPA then set these values to those in the globalRequirements
		if(!$minGrade && isset($globalRequirements[$objects[$x]->type])) {
			$objectRequirements->minGrade = $globalRequirements[$objects[$x]->type]->minGrade;
		} else {
			$objectRequirements->minGrade = $minGrade;
		}
		if(!$minGPA && isset($globalRequirements[$objects[$x]->type])) {
			$objectRequirements->minGPA = $globalRequirements[$objects[$x]->type]->minGPA;
		} else {
			$objectRequirements->minGPA = floatval($minGPA);
		}
	}
	$stmtHours->free_result();
	
	
	if(!$stmtHoursByLevel->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not bind parameters $stmtSubCourses->error");
	}

	$rc = $stmtHoursByLevel->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtHoursByLevel->error");
	}
	$stmtHoursByLevel->bind_result($requiredHours, $hoursType, $hoursCap, $hourLevel);

	while($stmtHoursByLevel->fetch()) {
		$hourLevel = "hours" . $hourLevel;
		if(!property_exists($objectRequirements, $hourLevel)) {
			$objectRequirements->$hourLevel = new stdClass();
		}
		if(!property_exists($objectRequirements->$hourLevel, $hoursCap)) {
			$objectRequirements->$hourLevel->$hoursCap = new stdClass();
		}
		$objectRequirements->$hourLevel->$hoursCap->type = $hoursType;
		$objectRequirements->$hourLevel->$hoursCap->hours = $requiredHours;
	}
	$stmtHoursByLevel->free_result();
	
	
	if(!$stmtCourseOverride->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not bind parameters $stmtCourseOverride->error");
	}
	$rc = $stmtCourseOverride->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtCourseOverride->error");
	}
	$stmtCourseOverride->bind_result($idCourse, $maxCount, $minGrade, $minHours, $maxHours);
	
	$objectRequirements->courseOverride = array();
	while($stmtCourseOverride->fetch()) {
		$courseOverride = new stdClass();
		$courseOverride->maxCount = $maxCount;
		$courseOverride->minGrade = $minGrade;
		$courseOverride->minHours = $minHours;
		$courseOverride->maxHours = $maxHours;
		$objectRequirements->courseOverride[$idCourse] = $courseOverride;
	}
	$stmtCourseOverride->free_result();
	
	if(!$stmtApplicableCourses->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not execture statement $stmtApplicableCourses->error");
	}
	$rc = $stmtApplicableCourses->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtApplicableCourses->error");
	}
	$stmtApplicableCourses->bind_result($idCourse);
	
	$objectRequirements->applicableCourses = array();
	while($stmtApplicableCourses->fetch()) {
		array_push($objectRequirements->applicableCourses, $idCourse);
	}
	$stmtApplicableCourses->free_result();
	
	if(!$stmtNumberRequired->bind_param("i", $objects[$x]->idObjects)) {
		die("Could not execture statement $stmtNumberRequired->error");
	}
	$rc = $stmtNumberRequired->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtNumberRequired->error");
	}
	$stmtNumberRequired->bind_result($countRequired);
	
	if($stmtNumberRequired->fetch()) {
		$objectRequirements->countRequiredCourses = $countRequired;
	}
	$stmtNumberRequired->free_result();
	
	$objectRequirements->id = $objects[$x]->idObjects;
	$field = $objects[$x]->type;
	if($field !== "Masters" && $field !== "PhD") {
		$objectRequirements->name = $objects[$x]->name;
		array_push($requirements[$field], $objectRequirements);
	} else {
		$requirements["Degree Program"] = $objectRequirements;
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

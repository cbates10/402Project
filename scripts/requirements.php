<?php

/**
 * This script is used to retrieve all the requirements for a database object.
 *
 * Given an object Id this script will retrieve all information regarding any requirements assigned to the program as
 * well as the requirements for any objects that may be mapped to the object. For example if a minor is mapped to a degree 
 * program then the requirements for the minor will be included as well.
 */

include 'DatabaseInfo.php';

/**
 * Method used to compare letter grades.
 * @param $grade1, the first grade to be compared against
 * @param $grade2, the second grade to be compared against
 *
 * $grade1 and $grade2 will be compared. The input parameters are assumed to be strings that match the regular expression 
 * [A-Z]{1}[-+]{0,1}. The return value is the same as strcmp, i.e., 1 if $grade1 is less than $grade2, 0 if the same, -1 if greater than
 */
function compareGrades($grade1, $grade2) {
	$grade1Length = strlen($grade1);
	$grade2Length = strlen($grade2);
	if($grade1Length == $grade2Length) {
		return strcmp($grade1, $grade2);
	} else if($grade1Length == 1) {
		if(strcmp($grade1, substr($grade2, 0, 1) == 0)) {
			$grade2sign = substr($grade2, 1, 1);
			if($grade2sign == "+") {
				return 1;
			} else {
				return -1;
			}
		} else {
			return strcmp($grade1, substr($grade2, 0, 1));
		}
	} else { // Otherwise Grade 2 length is 1
		if(strcmp($grade2, substr($grade1, 0, 1) == 0)) {
			$grade1sign = substr($grade1, 1, 1);
			if($grade1sign == "+") {
				return -1;
			} else {
				return 1;
			}
		} else {
			return strcmp($grade2, substr($grade1, 0, 1));
		}
	}
}

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = $_POST["idObjects"];

/* Retrieve global requirement information. This will be used to override any degree requirements that are below the global requirements */
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

/* Build the array for all objects to retrieve for the degree program, retrieve all object ids that are mapped to the given Id*/
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
/* These object Ids are pushed onto an array that will be iterated over later when retrieving all requirements */
while($stmtObjects->fetch()) {
	$object = new stdClass();
	$object->idObjects = $idObjects;
	$object->type = $type;
	$object->name = $name;
	array_push($objects, $object);
}
$stmtObjects->close();

/* SQL statements */
/* statement for required courses */
$sqlCourses = "SELECT idCourses FROM requiredcourses WHERE idObjects = ?";
$stmtCourses = $mysqli->prepare($sqlCourses);
if(!$stmtCourses) {
	die("Could not prepare statement $mysqli->error");
}

/* statement for substitutable courses for required courses */
$sqlSubCourses = "SELECT idCourses, idSubCourse FROM substitutablecourses WHERE idObjects = ?";
$stmtSubCourses = $mysqli->prepare($sqlSubCourses);
if(!$stmtSubCourses) {
	die("Could not prepare statement $mysqli->error");
}

/* statement to retrieve required hours, minimum grade, and minimum GPA */
$sqlHours = "SELECT requiredHours, minGrade, minGPA FROM objects WHERE idObjects = ?";
$stmtHours = $mysqli->prepare($sqlHours);
if(!$stmtHours) {
	die("Could not prepare statement $mysqli->error");
}

/* statement to retrieve all hour restrictions by level, such as 400, 500, 600 level hours */
$sqlHoursByLevel = "SELECT hours, type, cap, hourLevel FROM hoursbylevel WHERE idObjects = ?";
$stmtHoursByLevel = $mysqli->prepare($sqlHoursByLevel);
if(!$stmtHoursByLevel) {
	die("Could not prepare statement $mysqli->error");
}

/* statement to retrieve course override information */
$sqlCourseOverride = "SELECT idCourses, maxCount, minGrade, minHours, maxHours FROM coursemappingoverride WHERE idObjects = ?";
$stmtCourseOverride = $mysqli->prepare($sqlCourseOverride);
if(!$stmtCourseOverride) {
	die("Could not prepare statement $myslqi->error");
}

/* statment to retrieve applicable courses for an object. these courses are used to restrict the catalog courses that are applied to an object */
$sqlApplicableCourses = "SELECT idCourses FROM restrictedobjectcourses WHERE idObjects = ?";
$stmtApplicableCourses = $mysqli->prepare($sqlApplicableCourses);
if(!$stmtApplicableCourses) {
	die("Could not prepare statement $myslqi->error");
}

/* statement to retrieve all catalogs mapped to a specific object */
$sqlCatalogs = "SELECT catalogName FROM objectcatalogs NATURAL JOIN catalognames WHERE idObjects = ?";
$stmtCatalogs = $mysqli->prepare($sqlCatalogs);
if(!$stmtCatalogs) {
	die("Could not prepare statement $mysqli->error");
}

/* statement to retrieve the number of required courses needed to fufill the required course restriction */
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

/* Iterate over all object ids for the requested object as well as any objects mapped to the requested object */
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

	/* Process required courses into the object */
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

	/* Attack substitutable courses to any required courses. All required course ids are set as an array and any substitutable courses are pushed onto that array */
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
	/* Retrieve required hours, minimum GPA, and minimum Grade, this information will be checked against global requirements and will be overriden if the requirements are below the global requirements */
	$stmtHours->bind_result($requiredHours, $minGrade, $minGPA);

	if($stmtHours->fetch()) {
		$objectRequirements->requiredHours = $requiredHours;
		// If there is no value set for the object requirement for minGrade or minGPA then set these values to those in the globalRequirements
		if(!$minGrade) {
			if(isset($globalRequirements[$objects[$x]->type])) {
				$objectRequirements->minGrade = $globalRequirements[$objects[$x]->type]->minGrade;
			} else { 
				$objectRequirements->minGrade = $minGrade;
			}	
		} else {
			if(isset($globalRequirements[$objects[$x]->type])) {
				if(!is_null($globalRequirements[$objects[$x]->type]->minGrade)) {
					if(compareGrades($minGrade, $globalRequirements[$objects[$x]->type]->minGrade) > 0) {
						$objectRequirements->minGrade = $globalRequirements[$objects[$x]->type]->minGrade;
					} else {
						$objectRequirements->minGrade = $minGrade;
					}
				}
			} else {
				$objectRequirements->minGrade = $minGrade;
			}
		}
		
		if(!$minGPA) {
			if(isset($globalRequirements[$objects[$x]->type])) {
				$objectRequirements->minGPA = floatval($globalRequirements[$objects[$x]->type]->minGPA);
			} else {
				$objectRequirements->minGPA = $minGPA;
			}
		} else {
			if(isset($globalRequirements[$objects[$x]->type])) {
				if(!is_null($globalRequirements[$objects[$x]->type]->minGPA)) {
					if($minGPA < $globalRequirements[$objects[$x]->type]->minGPA) {
						$objectRequirements->minGPA= floatval($globalRequirements[$objects[$x]->type]->minGPA);
					} else {
						$objectRequirements->minGPA = floatval($minGPA);
					}
				}
			} else {
				$objectRequirements->minGPA = floatval($minGPA);
			}
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
	
	/* Retrieve hours by level (such as 400 level). An object is set for each hour level and minimum and maximum fields are set if there is a requirement for these hour levels in the database */
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
	
	/* Course override information is retrieved */
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
	
	/* Process applicable course information */
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
	/* Process the number of required courses */
	if($stmtNumberRequired->fetch()) {
		$objectRequirements->countRequiredCourses = $countRequired;
	}
	$stmtNumberRequired->free_result();
	
	$objectRequirements->id = $objects[$x]->idObjects;
	$field = $objects[$x]->type;
	if($field !== "Masters" && $field !== "PhD" && isset($requirements[$field])) {
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

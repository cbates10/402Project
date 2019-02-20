<?php

$servername = "216.96.149.200";
$database = "formscentral";
$sqlusername = "Casey3724";
$sqlpassword = "Imbroglio3724";
$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

session_start();

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = $_SESSION["idMajorOptions"];

$sql = "SELECT idCourses FROM requiredcourses WHERE idMajorOptions = ?";
$stmt = $mysqli->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmt->bind_param("s", $degreeOption)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmt->bind_result($requiredCourse);

$requirements = new stdClass();

$requirements->requiredCourses = array();

//$requiredCourses = array();

while($stmt->fetch()) {
	$requirements->requiredCourses[$requiredCourse] = array();
}

$stmt->close();

$sql = "SELECT idCourses, idSubCourse FROM substitutablecourses WHERE idMajorOptions = ?";

$stmt = $mysqli->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmt->bind_param("s", $degreeOption)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmt->bind_result($requiredCourse, $substitutableCourse);

while($stmt->fetch()) {
	array_push($requirements->requiredCourses[$requiredCourse], $substitutableCourse);
}

$stmt->close();

$sql = "SELECT requiredHours, 500LevelHours, outsideHours FROM majoroptions WHERE idMajorOptions = ?";

$stmt = $mysqli->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmt->bind_param("s", $degreeOption)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmt->bind_result($requiredHours, $graduateHours, $outsideHours);

if($stmt->fetch()) {
	$requirements->requiredHours = $requiredHours;
	$requirements->graduateHours = $graduateHours;
	$requirements->outsideHours = $outsideHours;
}

$stmt->close();

$mysqli->close();

$requirements = json_encode($requirements);
echo $requirements;

function sanitizeInput($data) {
	$data = trim($data);
	$data = htmlspecialchars($data);
	return $data;
}

?>

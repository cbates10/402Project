<?php

$servername = "localhost";
$database = "graduatecentral";
$sqlusername = "root";
$sqlpassword = "Imbroglio3724";
$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

session_start();

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = $_SESSION["idObjects"];

$sql = "SELECT idCourses FROM requiredcourses WHERE idObjects = ?";
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

while($stmt->fetch()) {
	$requirements->requiredCourses[$requiredCourse] = array();
}

$stmt->close();

$sql = "SELECT idCourses, idSubCourse FROM substitutablecourses WHERE idObjects = ?";

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

$sql = "SELECT requiredHours, 400Hours, 500Hours FROM objects NATURAL LEFT JOIN 400hours NATURAL LEFT JOIN 500hours WHERE idObjects = ?";

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
$stmt->bind_result($requiredHours, $hours400, $hours500);

if($stmt->fetch()) {
	$requirements->requiredHours = $requiredHours;
	$requirements->hours400 = $hours400;
	$requirements->hours500 = $hours500;
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

<?php

$servername = "216.96.149.200";
$database = "graduateformscentral";
$sqlusername = "root";
$sqlpassword = "Imbroglio3724!";

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = sanitizeInput($argv[1]);

$sql = "SELECT idCourses, substitutionId FROM requiredcourses where idMajorOptions = ?";
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

$requiredCourses = array();

while($stmt->fetch()) {
	$coursePair = (object) [
		"courseId" => $requiredCourse,
		"substituteCourse" => $substitutableCourse,
	];
	array_push($requiredCourses, $coursePair);
}

$mysqli->close();

$requiredCourses = json_encode($requiredCourses);
echo $requiredCourses;

function sanitizeInput($data) {
	$data = trim($data);
	$data = htmlspecialchars($data);
	return $data;
}

?>

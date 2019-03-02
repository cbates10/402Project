<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "select idCourses, coursePrefix, courseNumber, courseHoursLow, courseHoursHigh, courseName from catalogmapping natural join catalognames natural join courses where catalogName = ?";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("s", $_POST["catalogName"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$stmt->bind_result($idCourses, $coursePrefix, $courseNumber, $courseHoursLow, $courseHoursHigh, $courseName);

$courses = array();

while($stmt->fetch()) {
	$courses[$idCourses] = new stdClass();
	$courses[$idCourses]->prefix = $coursePrefix;
	$courses[$idCourses]->number = $courseNumber;
	$courses[$idCourses]->lowHours = $courseHoursLow;
	$courses[$idCourses]->highHours = $courseHoursHigh;
	$courses[$idCourses]->name = $courseName;
}

$stmt->close();
$con->close();

$courses = json_encode($courses);
echo ($courses);


?>

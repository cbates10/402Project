<?php

$servername = "216.96.149.200";
$database = "graduateformscentral";
$sqlusername = "root";
$sqlpassword = "Imbroglio3724!";

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM courses";

$result = $mysqli->query($sql);

$courses = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$courses[$row["courseNumber"]] = new stdClass();
		$courses[$row["courseNumber"]]->hours = $row["courseHours"];
		$courses[$row["courseNumber"]]->name = $row["courseName"];
	}
}

$mysqli->close();

$courses = json_encode($courses);
echo $courses;

?>

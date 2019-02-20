<?php

$servername = "216.96.149.200";
$database = "formscentral";
$sqlusername = "Casey3724";
$sqlpassword = "Imbroglio3724";

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM courses";

$result = $con->query($sql);

$courses = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$courses[$row["idCourses"]] = new stdClass();
		$courses[$row["idCourses"]]->prefix = $row["coursePrefix"];
		$courses[$row["idCourses"]]->number = $row["courseNumber"];
		$courses[$row["idCourses"]]->hours = $row["courseHours"];
		$courses[$row["idCourses"]]->name = $row["courseName"];
	}
}

$con->close();

$courses = json_encode($courses);
echo ($courses);


?>

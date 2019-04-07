<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT minGrade, minGPA FROM globalrequirements NATURAL JOIN types WHERE type = ?";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("s", $_POST["typeName"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$stmt->bind_result($minGrade, $minGPA);

$requirements = new stdClass();

if($stmt->fetch()) {
	$requirements->minGrade = $minGrade;
	$requirements->minGPA = floatval($minGPA);
}

$stmt->close();
$con->close();

echo json_encode($requirements);

?>

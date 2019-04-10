<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}
if($_POST["requiredHours"] == "") {
	$_POST["requiredHours"] = null;
}
if($_POST["minGrade"] == "") {
	$_POST["minGrade"] = null;
}
if($_POST["minGPA"] == "") {
	$_POST["minGPA"] = null;
}

// Remove the required courses
$sql = "UPDATE objects SET requiredHours = ?, minGrade = ?, minGPA = ? WHERE idObjects = ?";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}

if(!$stmt->bind_param("isdi", $_POST["requiredHours"], $_POST["minGrade"], $_POST["minGPA"], $_POST["objectId"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmt->free_result();


$stmt->close();

$con->close();

echo json_encode("success");

?>

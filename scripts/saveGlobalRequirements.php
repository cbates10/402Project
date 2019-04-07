<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

// Get the idType for the typeName
$sql = "SELECT idTypes FROM types WHERE type = ?";

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

$stmt->bind_result($id);

$stmt->fetch();

$idTypes = $id;

$stmt->close();

// If the Grade or GPA is empty then the value will be set to null
if($_POST["Grade"] == "") {
	$_POST["Grade"] = null;
}
if($_POST["GPA"] == "") {
	$POST["GPA"] = null;
}

// Update the requirements
$sql = "UPDATE globalrequirements SET minGrade = ?, minGPA = ? WHERE idTypes = ?";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("sii", $_POST["Grade"], $_POST["GPA"], $idTypes)) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$stmt->close();
$con->close();

echo json_encode("success");

?>

<?php
	
include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$name = $_POST["name"];
$subject = $_POST["subject"];
$typeName = $_POST["typeName"];

$sqlTypeId = "SELECT idTypes FROM types WHERE type = ?";
$stmtTypeId = $mysqli->prepare($sqlTypeId);
if(!$stmtTypeId) {
	die("Could not prepare statement $mysqli->error");
}

if(!$stmtTypeId->bind_param("s", $typeName)) {
	die("Could not bind parameters $stmtTypeId->error");
}

$rc = $stmtTypeId->execute();
if(false === $rc) {
	die("Could not execute statement $stmtTypeId->error");
}
$stmtTypeId->bind_result($idTypes);

$stmtTypeId->fetch();

$stmtTypeId->close();

$sqlInsert = "INSERT INTO objects (idTypes, name, subject) VALUES (?, ?, ?)";
$stmtInsert = $mysqli->prepare($sqlInsert);
if(!$stmtInsert) {
	die("Could not prepare statement $mysqli->error");
}

if(!$stmtInsert->bind_param("iss", $idTypes, $name, $subject)) {
	die("Could not bind parameters $stmtInsert->error");
}

$rc = $stmtInsert->execute();
if(false === $rc) {
	die("Could not execute statement $stmtInsert->error");
}
?>
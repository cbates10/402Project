<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$subject = sanitizeInput("degreeName");
$option = sanitizeInput("degreeOption");

$sql = "SELECT idObjects FROM objects WHERE subject = ? AND name = ?";

$stmt = $mysqli->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $mysqli->error");
}
if(!$stmt->bind_param("ss", $subject, $option)) {
	die("Could not bind parameters $mysqli->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$stmt->bind_result($idMajorOptions);

if($stmt->fetch()) {
	setcookie("programId", $idMajorOptions, 0, '/402Project/routes');
	header("Location: ../routes/degreeRequirements.html");
	die();	
} else {
	header("Location: ../routes/degrees.html");
	die();
}

$stmt->close();
$mysqli->close();

function sanitizeInput($field) {
	if(!isset($_POST[$field])) {
		$data = "";
	} else {
		$data = trim($_POST[$field]);
		$data = htmlspecialchars($data);
	}
	return $data;
}

?>

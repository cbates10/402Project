<?php

$servername = "216.96.149.200";
$database = "formscentral";
$sqlusername = "Casey3724";
$sqlpassword = "Imbroglio3724";

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$degreeOption = sanitizeInput("idMajorOption");

$sql = "SELECT * FROM majoroptions WHERE idMajorOptions = ?";

$stmt = $mysqli->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $mysqli->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$stmt->store_result();

if($stmt_num_rows === 1) {
	session_start();
	$_SESSION["idMajorOption"] = $degreeOption;
	echo "success";
	die();
}

$stmt->close();
$mysqli->close();

function sanitizeInput($field) {
	if(!isset($_POST[$field])) {
		echo "value is not set for $field";
		$data = "";
	} else {
		$data = trim($_POST[$field]);
		$data = htmlspecialchars($data);
	}
	return $data;
}

?>

<?php

$servername = "localhost";
$database = "graduatecentral";
$sqlusername = "root";
$sqlpassword = "Imbroglio3724";

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$subject = sanitizeInput("username");
$option = sanitizeInput("password");

$sql = "SELECT accountId FROM accounts WHERE username = ? AND password = ?";

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

$stmt->bind_result($accountId);

if($stmt->fetch()) {
	session_start();
	$_SESSION["accountId"] = $accountId; 
	echo "success";
	$stmt->close();
	$mysqli->close();
	die();	
} else {
	$stmt->close();
	$mysqli->close();
	die();
}

function sanitizeInput($field) {
	if(!isset($_POST[$field])) {
		$data = "";
	} else {
		$data = trim($_POST[$field]);
		$data = htmlspecialchars($data);
	}
	return $data;
}

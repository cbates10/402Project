<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$insertId;
if(isset($_POST["id"])) {
	$insertId = $_POST["id"];
}
if(isset($_POST["newMember"]) && $_POST["newMember"] != "false") {
	$sql = "INSERT INTO graduatecommittee (memberFirstName, memberLastName) VALUES (? , ?)";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	if(!$stmt->bind_param("ss", $_POST["firstName"], $_POST["lastName"])) {
		die("Could not bind parameters $stmt->error");
	}
	$rc = $stmt->execute();
	if(false === $rc) {
		die("Could not execute statement $stmt->error");
	}
	$insertId = $con->insert_id;
	$stmt ->close();
}

$sql = "INSERT INTO committeemapping (memberSubject, memberId, idTitle) VALUES (? , ?, ?)";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("sii", $_POST["subject"], $insertId, $_POST["title"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}
$insertId = $con->insert_id;
$stmt ->close();

$con->close();

echo (json_encode($insertId));

?>

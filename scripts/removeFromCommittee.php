<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "DELETE FROM committeemapping WHERE memberId = ? AND subjectName = ? AND idTitle = ?";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("isi", $_POST["id"], $_POST["committee"], $_POST["title"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$stmt->close();

// If the memberId now belongs to no committees then delete the committee member
$sql = "SELECT * FROM committeemapping NATURAL JOIN graduatecommittee WHERE memberId = ?";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("i", $_POST["id"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$delete = true;
if($stmt->fetch()) {
	$delete = false;
}

$stmt->close();

// Delete the committee member if it belongs to no committees
if($delete) {
	$sql = "DELETE FROM graduatecommittee WHERE memberId = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	if(!$stmt->bind_param("i", $_POST["id"])) {
		die("Could not bind parameters $stmt->error");
	}
	$rc = $stmt->execute();
	if(false === $rc) {
		die("Could not execute statement $stmt->error");
	}
	$stmt->close();
}

$con->close();

echo json_encode("success");

?>

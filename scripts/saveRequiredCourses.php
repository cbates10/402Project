<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

if(isset($_POST["removedRequiredCourses"])) {
	// Remove the required courses
	$sql = "DELETE FROM requiredcourses WHERE idObjects = ? AND idCourses = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["removedRequiredCourses"] as $courseId) {
		if(!$stmt->bind_param("ii", $_POST["objectId"], $courseId)) {
			die("Could not bind parameters $stmt->error");
		}
		$rc = $stmt->execute();
		if(false === $rc) {
			die("Could not execute statement $stmt->error");
		}
		$stmt->free_result();
	}

	$stmt->close();
}

if(isset($_POST["addedRequiredCourses"])) {
	// Insert the required courses
	$sql = "INSERT INTO requiredcourses (idObjects, idCourses) VALUES (?, ?)";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["addedRequiredCourses"] as $courseId) {
		if(!$stmt->bind_param("ii", $_POST["objectId"], $courseId)) {
			die("Could not bind parameters $stmt->error");
		}
		$rc = $stmt->execute();
		if(false === $rc) {
			die("Could not execute statement $stmt->error");
		}
		$stmt->free_result();
	}

	$stmt->close();
}
$con->close();

echo json_encode("success");

?>

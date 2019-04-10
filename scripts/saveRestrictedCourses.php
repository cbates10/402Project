<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

if(isset($_POST["removedCourses"])) {
	// Remove the catalogs from the object 
	$sql = "DELETE FROM restrictedobjectcourses WHERE idObjects = ? AND idCourses = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["removedCourses"] as $courseId) {
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

if(isset($_POST["addedCourses"])) {
	// Remove the catalogs from the object 
	$sql = "INSERT INTO restrictedobjectcourses (idObjects, idCourses) VALUES (?, ?)";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["addedCourses"] as $courseId) {
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

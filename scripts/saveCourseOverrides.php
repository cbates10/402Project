<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

if(isset($_POST["removedCourseOverrides"])) {
	// Remove the catalogs from the object 
	$sql = "DELETE FROM coursemappingoverride WHERE idObjects = ? AND idCourses = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["removedCourseOverrides"] as $courseId) {
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

if(isset($_POST["addedCourseOverrides"])) {
	// Insert the catalogs 
	$sql = "INSERT INTO coursemappingoverride (idObjects, idCourses, maxCount, minGrade, minHours, maxHours) VALUES (?, ?, ?, ?, ?, ?)";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["addedCourseOverrides"] as $overrideInfo) {
		if(!$stmt->bind_param("iiisii", $_POST["objectId"], $overrideInfo["courseId"], $overrideInfo["timesCountable"], $overrideInfo["minGrade"], $overrideInfo["minHours"], $overrideInfo["maxHours"])) {
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

if(isset($_POST["modifiedOverrides"])) {
	// Update the modified course overrides
	$sql = "UPDATE coursemappingoverride SET maxCount = ?, minGrade = ?, minHours = ?, maxHours = ? WHERE idObjects = ? AND idCourses = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["modifiedOverrides"] as $overrideInfo) {
		if(!$stmt->bind_param("isiiii", $overrideInfo["timesCountable"], $overrideInfo["minGrade"], $overrideInfo["minHours"], $overrideInfo["maxHours"], $_POST["objectId"], $overrideInfo["courseId"])) {
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

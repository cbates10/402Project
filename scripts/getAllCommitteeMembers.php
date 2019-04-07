<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM graduatecommittee";

$result = $mysqli->query($sql);

$members = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$memberInformation = new stdClass();
		$memberInformation->id = $row["memberId"];
		$memberInformation->firstName = $row["memberFirstName"];
		$memberInformation->lastName = $row["memberLastName"];
		array_push($members, $memberInformation);
	}
}

$mysqli->close();

echo json_encode($members);

?>

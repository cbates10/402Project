<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT idTitle, titleName FROM committeetitles";

$result = $mysqli->query($sql);

$titleStruct = new stdClass();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$id = $row["idTitle"];
		$titleStruct->$id = $row["titleName"];
	}
}

$mysqli->close();

echo json_encode($titleStruct);

?>

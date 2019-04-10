<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT idObjects, name, subject FROM objects NATURAL JOIN types WHERE type = 'Form'";

$result = $mysqli->query($sql);

$forms = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$forms[$row["idObjects"]] = new stdClass();
		$forms[$row["idObjects"]]->name = $row["name"];
		$forms[$row["idObjects"]]->subject = $row["subject"];
	}
}

$mysqli->close();

$forms = json_encode($forms);
echo $forms;

?>
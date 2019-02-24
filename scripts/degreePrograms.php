<?php

$servername = "localhost";
$database = "graduatecentral";
$sqlusername = "root";
$sqlpassword = "Imbroglio3724";

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM objects NATURAL JOIN types WHERE type = 'Degree Program' ORDER BY subject";

$result = $mysqli->query($sql);

$degrees = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		if(!isset($degrees[$row["subject"]])) {
			$degrees[$row["subject"]] = new stdClass();
			$degrees[$row["subject"]]->option = array();
		} 
		$degrees[$row["subject"]]->option[$row["name"]] = $row["requiredHours"];
	}
}

$mysqli->close();

$degrees = json_encode($degrees);
echo $degrees;

?>

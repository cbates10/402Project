<?php

$servername = "216.96.149.200";
$database = "graduateformscentral";
$sqlusername = "root";
$sqlpassword = "Imbroglio3724!";

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM majoroptions ORDER BY optionSubject";

$result = $mysqli->query($sql);

$degrees = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		if(!isset($degrees[$row["optionSubject"]])) {
			$degrees[$row["optionSubject"]] = new stdClass();
			$degrees[$row["optionSubject"]]->option = array();
		} 
		$degrees[$row["optionSubject"]]->option[$row["optionName"]] = $row["optionHours"];
	}
}

$mysqli->close();

$degrees = json_encode($degrees);
echo $degrees;

?>

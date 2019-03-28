<?php
    /* Database connection start */
	include 'DatabaseInfo.php';

    $mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    if($mysqli->connect_errno) {
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }

?>
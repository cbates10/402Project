<?php
    /* Database connection start */
	include 'DatabaseInfo.php';

    $mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    if($mysqli->connect_errno) {
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }

    $dataObj = $_POST['dataObj'];
    $dataObjChange = $_POST['dataObjChange'];
    $dataObjID = $_POST['idObject'];

    //Simple test to see how saving work
    $sql = "UPDATE hoursbylevel SET hours='6' WHERE idObjects=dataObjID AND type='fixed'";

    if (mysqli_query($mysqli, $sql)) {
        echo "Admin Record updated successfully.";
    } else {
        echo "Admin Error updating record: " . mysqli_error($mysqli);
    }
    
    mysqli_close($mysqli);
?>
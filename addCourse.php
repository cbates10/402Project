<?php
    
    $servername = "216.96.149.200";
    $database = "formscentral";
    $sqlusername = "Casey3724";
    $sqlpassword = "Imbroglio3724";
    
    $con = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    
    if($con->connect_errno){
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }
    
    $sql = "INSERT INTO courses (coursePrefix, courseNumber, courseHours, courseName)
    VALUES (?,?,?,?)";
    
    $stmt = mysqli_prepare($sql);
    if(!stmt){
        die("Could not bind parameters $mysqli->error");
    }
    $stmt->bind_param("sss", $_POST['coursePrefix'], $_POST['courseNumber'], $_POST['courseHours'], $_POST['courseName']);
    
    $stmt->execute();
    
    $stmt->close();
    $con->close();
    
?>

    

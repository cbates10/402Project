<?php
    
include 'DatabaseInfo.php';
    
$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    
if($con->connect_errno){
   die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}
    
$sql = "INSERT INTO courses (courseNumber, courseHours, courseName) VALUES (?,?,?)";
    
$stmt = mysqli_prepare($sql);
if(!stmt){
   die("Could not bind parameters $mysqli->error");
}
$stmt->bind_param("sss", $_POST['courseNumber'], $_POST['courseHours'], $_POST['courseName']);
    
$stmt->execute();
    
$stmt->close();
$con->close();
    
?>

    

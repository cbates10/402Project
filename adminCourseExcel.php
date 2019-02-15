<!DOCTYPE html>
<html>
<body>

<?php
$servername = "216.96.149.200";
$database = "formscentral";
$sqlusername = "Casey3724";
$sqlpassword = "Imbroglio3724";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM courses";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "<tr>\n<td>". $row["idCourses"]. "</td><td>". $row["coursePrefix"]. "</td><td>" . $row["courseNumber"] . "</td><td>" . $row["courseName"] . "</td><td>" . $row["courseHours"] . "</td>\n</tr>\n";
    }
} else {
    echo "0 results";
}

$conn->close();
?> 

</body>
</html>
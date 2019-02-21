<?php

/* Database connection start */
$servername = "216.96.149.200";
$database = "formscentral";
$username = "Casey3724";
$password = "Imbroglio3724";
    
$conn = mysqli_connect($servername, $username, $password, $database) or die("Connection failed: " . mysqli_connect_error());
    
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
    
$sql = "SELECT * FROM courses";
$queryRecords = mysqli_query($conn, $sql) or die("error to fetch course data");
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
</head>
<body>
<div class="container" style="padding:50px 250px;">
<div id="msg" class="alert"></div>
<table id="course_grid" class="table table-condensed table-hover table-striped bootgrid-table" width="60%" cellspacing="0">
   <thead>
      <tr>
         <th>Prefix</th>
         <th>Number</th>
         <th>Course</th>
         <th>Hours</th>
      </tr>
   </thead>
   <tbody id="_editable_table">
      <?php foreach($queryRecords as $res) :?>
      <tr value="<?php echo $res['idCourses'];?>">
         <td class="editable-col" contenteditable="true" col-index='0' oldVal ="<?php echo $res['coursePrefix'];?>" value="coursePrefix"><?php echo $res['coursePrefix'];?></td>
         <td class="editable-col" contenteditable="true" col-index='1' oldVal ="<?php echo $res['courseNumber'];?>" value="courseNumber"><?php echo $res['courseNumber'];?></td>
         <td class="editable-col" contenteditable="true" col-index='2' oldVal ="<?php echo $res['courseName'];?>" value="courseName"><?php echo $res['courseName'];?></td>
        <td class="editable-col" contenteditable="true" col-index='3' oldVal ="<?php echo $res['courseHours'];?>" value="courseHours"><?php echo $res['courseHours'];?></td>
      </tr>
	  <?php endforeach;?>
   </tbody>
</table>
</div>
</body>
</html>
<script type="text/javascript">
$(document).ready(function(){
	$('td.editable-col').on('focusout', function() {
        data = {};
		data["val"] = $(this).text();
        console.log($(this).text());
        data["idCourses"] = $(this).parent().attr("value");
                            console.log("idCourses = " + data["idCourses"]);
        data["field"] = $(this).attr("value");
                            console.log("This is the field " + data["field"]);
        console.log($(this).attr('col-index'));
                            if($(this).attr('oldVal') === data['val']) {
                            console.log("NO");
                            return false;
                            }
                            
		$.ajax({   
				  
					type: "POST",  
					url: "editCourse.php",
					data: data,
					dataType: "json",
					success: function(response)  
					{
                        console.log(response);
						//$("#loading").hide();
						if(!response.error) {
							$("#msg").removeClass('alert-danger');
							$("#msg").addClass('alert-success').html(response.msg);
						} else {
							$("#msg").removeClass('alert-success');
							$("#msg").addClass('alert-danger').html(response.msg);
						}
					}   
				});
	});
});

</script>

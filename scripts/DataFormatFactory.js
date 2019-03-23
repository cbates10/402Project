class DataFormatFactory {
	
	static formatData(programLevel) {
		if(programLevel === "Masters") {
			return this.formatMastersData();
		} else if(programLevel === "PhD") {
			return this.formatPhDData();
		}
	}
	
	static formatCookieInformation(data) {
		data["FirstName"] = getCookie("firstName");
		data["LastName"] = getCookie("lastName");
		data["MiddleName"] = getCookie("middleName");
		data["Email"] = getCookie("email");
		data["StudentID"] = getCookie("studentID");
		data["Major"] = getCookie("program");
		data["ThesisType"] = getCookie("option");
		data["FormName"] = requirements["Form"][0].name;
		return data;
	}
	
	static formatMastersData() {
		var data = [];
		var courseCounter = 1;
		data = this.formatCookieInformation(data);
		$("#courseTableBody tr.courseEntry").each(function() {
			var courseId = $(this).attr("id");
			data["MajorGrade" + courseCounter] = $(this).find("#grade").text();
			data["MajorCourseHours" + courseCounter] = $(this).find("#hours").text();
			data["MajorCourseYear" + courseCounter] = $(this).find("#year").text() + "/" + $(this).find("#term").text();
			data["MajorCourseNamePrefix" + courseCounter] = courseCatalog[courseId].prefix;
			data["MajorCourseNumber" + courseCounter] = courseCatalog[courseId].number;
			data["MajorCourseTitle" + (courseCounter++)] = courseCatalog[courseId].name;
		});
		return data;
	}
	
	static formatPhDData() {
		var data = [];
		var courseCounter = 1;
		var courseCounterPhD = 1;
		data = this.formatCookieInformation(data);
		$("#courseTableBody tr.courseEntry").each(function() {
			var courseId = $(this).attr("id");
			if($(this).attr("type") === "PhD") {
				data["MajorGrade" + courseCounter] = $(this).find("#grade").text();
				data["MajorCourseHours" + courseCounter] = $(this).find("#hours").text();
				data["MajorCourseYear" + courseCounter] = $(this).find("#year").text() + "/" + $(this).find("#term").text();
				data["MajorCourseNamePrefix" + courseCounter] = courseCatalog[courseId].prefix;
				data["MajorCourseNumber" + courseCounter] = courseCatalog[courseId].number;
				data["MajorCourseTitle" + (courseCounter++)] = courseCatalog[courseId].name;
			} else {
				data["MasterGrade" + courseCounterPhD] = $(this).find("#grade").text();
				data["MasterCourseHours" + courseCounterPhD] = $(this).find("#hours").text();
				data["MasterCourseYear" + courseCounterPhD] = $(this).find("#year").text() + "/" + $(this).find("#term").text();
				data["MasterCourseNamePrefix" + courseCounterPhD] = courseCatalog[courseId].prefix;
				data["MasterCourseNumber" + courseCounterPhD] = courseCatalog[courseId].number;
				data["MasterCourseTitle" + (courseCounterPhD++)] = courseCatalog[courseId].name;
			}
		});
		return data;
	}
}
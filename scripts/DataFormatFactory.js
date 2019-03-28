class DataFormatFactory {
	
	static formatData(programLevel, requirements) {
		this.requirements = requirements;
		if(programLevel === "Masters") {
			return this.formatMastersData();
		} else if(programLevel === "PhD") {
			return this.formatPhDData();
		}
	}
	
	static formatMajorData(data, counter, fieldPrefix, courseEntry) {
		data[fieldPrefix + "Grade" + counter] = courseEntry.grade;
		data[fieldPrefix + "CourseHours" + counter] = courseEntry.hours;
		data[fieldPrefix + "CourseYear" + counter] = courseEntry.year + "/" + courseEntry.term;
		data[fieldPrefix + "CourseNamePrefix" + counter] = courseEntry.prefix;
		data[fieldPrefix + "CourseNumber" + counter] = courseEntry.number;
		data[fieldPrefix + "CourseTitle" + counter] = courseEntry.name;
		if(courseEntry.flags.length > 0) {
			data[fieldPrefix + "Flag" + counter] = "*";
		}
		return data;
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
		var transferCounter = 1;
		data = this.formatCookieInformation(data);
		var degreeProgram = this.requirements.find(function(requirement) {
			return requirement.getRequirementType() == requirementType.DEGREE;
		});
		if(!degreeProgram) {
			return data;
		}
		var appliedCourses = degreeProgram.getAppliedCourses();
		Object.keys(appliedCourses).forEach(function(courseId) {
			if(appliedCourses[courseId].flags.includes(ruleFlags.HOURSTRANSFER)) {
				data = this.formatMajorData(data, transferCounter, "Transfer", appliedCourses[courseId]);
				transferCounter++;
			} else {
				data = this.formatMajorData(data, courseCounter, "Major", appliedCourses[courseId]);
				courseCounter++;
			}
		}, this);
		var minor = this.requirements.find(function(requirement) {
			return requirement.getRequirementType() == requirementType.MINOR && requirement.fufillsRequirements();
		});
		if(!minor) {
			return data;
		}
		appliedCourses = minor.getAppliedCourses();
		courseCounter = 1;
		Object.keys(appliedCourses).forEach(function(courseId) {
			data = this.formatMajorData(data, courseCounter, "Minor", appliedCourses[courseId]);
			courseCounter++;
		}, this);
		return data;
	}
	
	static formatPhDData() {
		var data = [];
		var courseCounter = 1;
		var courseCounterPhD = 1;
		data = this.formatCookieInformation(data);
		var degreeProgram = this.requirements.find(function(requirement) {
			return requirement.getRequirementType() == requirementType.DEGREE;
		});
		var appliedCourses = degreeProgram.getAppliedCourses();
		
		Object.keys(appliedCourses).forEach(function(courseId) {
			if(appliedCourses[courseId].types.includes("PhD")) {
				data = this.formatMajorData(data, courseCounter, "Major", appliedCourses[courseId]);
				courseCounter++;
			} else {
				data = this.formatMajorData(data, courseCounterPhD, "Master", appliedCourses[courseId]);
				courseCounterPhD++;
			}
		}, this);
		return data;
	}
}
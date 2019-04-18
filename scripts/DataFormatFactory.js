class DataFormatFactory {
	
	static getCommitteeMembers(subject, callback) {
		$.ajax({
			type: "POST",
			url: "../scripts/getCommitteeMembersBySubject.php",
			data: { subject: subject },
			dataType: "json",
			async: false,
			success: function(json) {
				callback(json);
			},
			error: function(xhr, ajaxOptions, thrownError) {
				(thrownError);
				callback({});
			}
		});
	}
	
	static formatData(programLevel, subject, requirements, transferInstitution, committeeMembers) {
		this.committeeMembers = committeeMembers;
		this.transferInstitution = transferInstitution;
		this.requirements = requirements;
		this.subject = subject;
		this.violatedRules = [];
		if(programLevel === "Masters") {
			return this.formatMastersData();
		} else if(programLevel === "PhD") {
			return this.formatPhDData();
		}
	}
	
	static formatCommitteeMembers(data) {
		for(var i = 0; i < this.committeeMembers.length; i++) {
			data["Committee" + (i + 1)] = this.committeeMembers[i];
		}
		return data;
	}
	
	static formatMajorData(data, counter, fieldPrefix, courseEntry) {
		data[fieldPrefix + "Grade" + counter] = courseEntry.grade;
		data[fieldPrefix + "CourseHours" + counter] = courseEntry.hours;
		data[fieldPrefix + "CourseYear" + counter] = courseEntry.year + "/" + courseEntry.term;
		data[fieldPrefix + "CourseNamePrefix" + counter] = courseEntry.prefix;
		data[fieldPrefix + "CourseNumber" + counter] = courseEntry.number;
		data[fieldPrefix + "CourseTitle" + counter] = courseEntry.name;
		if(courseEntry.flags.length > 0) {
			(courseEntry.flags);
			for(var i = 0; i < courseEntry.flags.length; i++) {
				if(!this.violatedRules.includes(courseEntry.flags[i])) {
					this.violatedRules.push(courseEntry.flags[i]);
				}
			}
			data[fieldPrefix + "Flag" + counter] = "*";
		}
		return data;
	}
	
	static formatCookieInformation(data) {
		data["FirstName"] = getCookie("firstName");
		data["LastName"] = getCookie("lastName");
		data["StudentName"] = data["FirstName"] + " " + data["LastName"];
		data["MiddleName"] = getCookie("middleName");
		data["Email"] = getCookie("email");
		data["StudentID"] = getCookie("studentID");
		data["StudentIDpage2"] = data["StudentID"];
		data["Major"] = getCookie("program");
		data["ThesisType"] = getCookie("option");
		data["FormName"] = requirements["Form"][0].name;
		return data;
	}
	
	static formatFlagLegend(data) {
		if(this.violatedRules.length > 0) {
			data["FlagLegend"] = "The Following Hour Rules Are Violated On This Form: ";
			data["FlagLegend1"] = this.violatedRules[0] + " ";
		}
		for(var i = 1; i < this.violatedRules.length; i++) {
			data["FlagLegend1"] += this.violatedRules[i] + " ";
		}
		return data;
	}
	
	static formatMastersData() {
		var data = [];
		var courseCounter = 1;
		var transferCounter = 1;
		data = this.formatCookieInformation(data);
		data = this.formatCommitteeMembers(data);
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
		if(minor) {
			appliedCourses = minor.getAppliedCourses();
			data["Minor"] = minor.getName();
			courseCounter = 1;
			Object.keys(appliedCourses).forEach(function(courseId) {
				data = this.formatMajorData(data, courseCounter, "Minor", appliedCourses[courseId]);
				courseCounter++;
			}, this);
		}
		this.getCommitteeMembers(this.subject, function(members) {
			var chairMembers = [];
			var directorMembers = [];
			for(var index in members) {
				(members[index].title);
				if(members[index].title == "Director") {
					directorMembers.push(members[index].firstName + " " + members[index].lastName);
				} else if(members[index].title == "Chairperson") {
					chairMembers.push(members[index].firstName + " " + members[index].lastName);
				}
			}
			if(directorMembers.length > 0) {
				data["GraduateProgramDirector"] = directorMembers[0];
			}
			if(chairMembers.length > 0) {
				data["ChairPerson"] = chairMembers[0];
			}
		});
		if(this.transferInstitution) {
			data["TransferInstitution"] = this.transferInstitution;
		}
		data = this.formatFlagLegend(data)
		return data;
	}
	
	static formatPhDData() {
		var data = [];
		var courseCounter = 1;
		var courseCounterPhD = 1;
		data = this.formatCookieInformation(data);
		data = this.formatCommitteeMembers(data);
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
		this.getCommitteeMembers(this.subject, function(members) {
			var chairMembers = [];
			var directorMembers = [];
			for(var index in members) {
				if(members[index].title == "Director") {
					directorMembers.push(members[index].firstName + " " + members[index].lastName);
				}  else if(members[index].title == "Chairperson") {
					chairMembers.push(members[index].firstName + " " + members[index].lastName);
				}
			}
			if(directorMembers.length > 0) {
				data["GraduateProgramDirector"] = directorMembers[0];
			}
			if(chairMembers.length > 0) {
				data["ChairPerson"] = chairMembers[0];
			}
		});
		if(this.transferInstitution) {
			data["TransferInstitution"] = this.transferInstitution;
		}
		data = this.formatFlagLegend(data)
		return data;
	}
}
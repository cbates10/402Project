
/* There are two types of hour interpretations by the requirements object. A fixed type only allows an immutable number of hours to be set,
while a variable type will interpret the number of hours as a percentage of the total hours applied to the degree */
const hourType = {
	FIXED: "fixed",
	VARIABLE: "variable"
}

const requirementType = {
	DEGREE: "degree",
	MINOR: "minor",
	CERTIFICATE: "certificate"
}

const hourCapType = {
	MINIMUM: "Min",
	MAXIMUM: "Max"
}

const ruleFlags = {
	HOURS400MAX: "400Max",
	HOURS500MAX: "500Max",
	HOURS600MAX: "600Max",
	HOURSOUTSIDEMAX: "OutsideMax",
	HOURSTRANSFERMAX: "TransferMax",
	HOURSOUTSIDE: "Outside",
	HOURSTRANSFER: "Transfer",
	GRADEVIOLATION: "Grade",
	LOWHOURSVIOLATION: "LowHours",
	HIGHHOURSVIOLATION: "HighHours",
	NOCATALOG: "NoCatalog"
}

class Requirements {

	constructor() {
		
		this.requirementType = null;
		this.applicableCourseIds = []; // An array of all courseIds that should count towards to requirement
		this.applicableCourseEvents = {};
		this.courseActions = {};
		this.coursesTaken = {};
		this.courseValidationOperations = {};
		this.requiredCourses = {};
		this.countRequiredCourses = 0;
		this.subCourses = {};
		this.fufilledOperation = function() { return false; }
		this.fufilledNotification = false;
		this.gradeRestriction = null;
		this.gradeAction = null;
		this.gradeOverrides = {};
		this.lowHourOverrides = {};
		this.lowHourOverrideAction = null;
		this.highHourOverrides = {};
		this.highHourOverrideAction = null;
		this.requiredHours = 0;
		this.currentHours = 0;
		this.hoursAction = null;
		this.hours400Min = null;
		this.hours400MinAction = null;
		this.hours400MinNotification = false;
		this.hours400MinType = hourType.FIXED; // Initialized to fixed by default
		this.hours400Max = null;
		this.hours400MaxAction = null;
		this.hours400MaxNotification = false;
		this.hours400MaxType = hourType.FIXED;
		this.currentHours400 = 0;
		this.hours500Min = null;
		this.hours500MinAction = null;
		this.hours500MinNotification = false;
		this.hours500MinType = hourType.FIXED;
		this.hours500Max = null;
		this.hours500MaxAction = null;
		this.hours500MaxNotification = false;
		this.hours500MaxType = hourType.FIXED;
		this.currentHours500 = 0;
		this.hours600Min = null;
		this.hours600MinAction = null;
		this.hours600MinNotification = false;
		this.hours600MinType = hourType.FIXED;
		this.hours600Max = null;
		this.hours600MaxAction = null;
		this.hours600MaxNotification = false;
		this.hours600MaxType = hourType.FIXED;
		this.currentHours600 = 0;
		this.hoursPhDMin = null;
		this.hoursPhDMinAction = null;
		this.hoursPhDMinNotification = false;
		this.hoursPhDMinType = hourType.FIXED;
		this.currentHoursPhD = 0;
		this.hoursTransferMax = null;
		this.hoursTransferMaxAction = null;
		this.hoursTransferMaxNotification = false;
		this.hoursTransferMaxType = hourType.FIXED;
		this.currentHoursTransfer = 0;
		this.hoursOutsideMax = null;
		this.hoursOutsideMaxAction = null;
		this.hoursOutsideMaxNotification = false;
		this.hoursOutsideMaxType = hourType.FIXED;
		this.currentHoursOutside = 0;
	}
	
	getAppliedCourses() {
		return this.coursesTaken;
	}
	
	getUnfufilledRequirements() {
		var unfufilledHours = [];
		var hourCap;
		if(this.hours400Min) {
			if(this.hours400MinType === hourType.VARIABLE) {
				hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Min + 0.001)) : (Math.floor(this.currentHours * this.hours400Min + 0.001));
			} else {
				hourCap = this.hours400Min;
			}
			if(this.currentHours400 < hourCap) {
				unfufilledHours.push(400);
			}
		}
		if(this.hours500Min) {
			if(this.hours500MinType === hourType.VARIABLE) {
				hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Min + 0.001)) : (Math.floor(this.currentHours * this.hours500Min + 0.001));
			} else {
				hourCap = this.hours500Min;
			}
			if(this.currentHours500 < hourCap) {
				unfufilledHours.push(500);
			}
		}
		if(this.hours600Min) {
			if(this.hours600MinType === hourType.VARIABLE) {
				hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Min + 0.001)) : (Math.floor(this.currentHours * this.hours600Min + 0.001));
			} else {
				hourCap = this.hours600Min;
			}
			if(this.currentHours600 < hourCap) {
				unfufilledHours.push(600);
			}
		}
		if(this.hoursPhDMin) {
			if(this.hoursPhDMinType === hourType.VARIABLE) {
				hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursPhDMin + 0.001)) : (Math.floor(this.currentHours * this.hoursPhDMin + 0.001));
			} else {
				hourCap = this.hoursPhDMin;
			}
			if(this.currentHoursPhD < hourCap) {
				unfufilledHours.push("PhD");
			}
		}
	}
	
	setRequirementType(type) {
		this.requirementType = type;
	}
	
	setCountRequiredCourses(count) {
		this.countRequiredCourses = count;
	}
	
	setApplicableCourseEvent(courseId, courseEvent) {
		this.applicableCourseEvents[courseId] = courseEvent;
	}
	
	setApplicableCourse(courseId) {
		if(!this.applicableCourseIds.includes(courseId)) {
			this.applicableCourseIds.push(courseId);
		}
	}
	
	setGradeRestriction(grade, gradeAction) {
		this.gradeRestriction = grade;
		this.gradeAction = gradeAction;
	}
	
	setGradeOverride(courseId, grade) {
		this.gradeOverrides[courseId] = grade;
	}
	
	setHighHourOverrideEvent(hourOverrideAction) {
		this.highHourOverrideAction = hourOverrideAction;
	}
	
	setLowHourOverrideEvent(hourOverrideAction) {
		this.lowHourOverrideAction = hourOverrideAction;
	}
	
	setLowHourOverride(courseId, hours) {
		this.lowHourOverrides[courseId] = hours;
	}
	
	setHighHourOverride(courseId, hours) {
		this.highHourOverrides[courseId] = hours;
	}
	
	set400MinLevelHours(hours, hourType, hoursAction) {
		this.hours400MinType = hourType;
		this.hours400Min = parseFloat(hours);
		if(hoursAction) {
			this.hours400MinAction = hoursAction;
		}
	}
	
	set500MinLevelHours(hours, hourType, hoursAction) {
		this.hours500MinType = hourType;
		this.hours500Min = hours;
		if(hoursAction) {
			this.hours500MinAction = hoursAction;
		}
	}
	
	set600MinLevelHours(hours, hourType, hoursAction) {
		this.hours600MinType = hourType;
		this.hours600Min = hours;
		if(hoursAction) {
			this.hours600MinAction = hoursAction;
		}
	}
	
	setPhDMinHours(hours, hourType, hoursAction) {
		this.hoursPhDMinType = hourType;
		this.hoursPhDMin = hours;
		if(hoursAction) {
			this.hoursPhDMinAction = hoursAction;
		}
	}
	
	set400MaxLevelHours(hours, hourType, hoursAction) {
		this.hours400MaxType = hourType;
		this.hours400Max = parseFloat(hours);
		if(hoursAction) {
			this.hours400MaxAction = hoursAction;
		}
	}
	
	set500MaxLevelHours(hours, hourType, hoursAction) {
		this.hours500MaxType = hourType;
		this.hours500Max = hours;
		if(hoursAction) {
			this.hours500MaxAction = hoursAction;
		}
	}
	
	set600MaxLevelHours(hours, hourType, hoursAction) {
		this.hours600MaxType = hourType;
		this.hours600Max = hours;
		if(hoursAction) {
			this.hours600MaxAction = hoursAction;
		}
	}
	
	setTransferMaxLevelHours(hours, hourType, hoursAction) {
		this.hoursTransferMaxType = hourType;
		this.hoursTransferMax = hours;
		if(hoursAction) {
			this.hoursTransferMaxAction = hoursAction;
		}
	}
	
	setOutsideMaxLevelHours(hours, hourType, hoursAction) {
		this.hoursOutsideMaxType = hourType;
		this.hoursOutsideMax = hours;
		if(hoursAction) {
			this.hoursOutsideMaxAction = hoursAction;
		}
	}
	
	setRequiredHours(hours, hoursAction) {
		this.requiredHours = hours;
		if(hoursAction) {
			this.hoursAction = hoursAction;
		}
	}
	
	addRequiredCourse(courseId, courseAction) {
		this.countRequiredCourses++;
		if(!this.applicableCourseIds.includes(courseId)) {
			this.applicableCourseIds.push(courseId);
		}
		this.requiredCourses[courseId] = false;
		this.courseActions[courseId] = courseAction;
	}
	
	setSubstitutableCourses(courseId, subId) {
		if(this.subCourses[courseId] === undefined) {
			this.subCourses[courseId] = [];
			this.subCourses[courseId].push(subId);
		} else {
			this.subCourses[courseId].push(subId);
		}
		if(this.subCourses[subId] === undefined) {
			this.subCourses[subId] = [];
			this.subCourses[subId].push(courseId);
		} else {
			this.subCourses[subId].push(courseId);
		}
	}
	
	popValidationExpression(func) {
		this.validationExpressions = this.validationExpressions.filter((exp) => exp !== func);
	}
	
	violatesGradeRestriction(courseId, grade) {
		var requiredGrade = (this.gradeOverrides[courseId]) ? this.gradeOverrides[courseId] : this.gradeRestriction;
		if(requiredGrade.length === 1 && grade.length === 1) {
			return grade > requiredGrade;
		} else if(requiredGrade.length === 2 && grade.length === 1) {
			return ((grade >= requiredGrade) && (requiredGrade.charAt(1) === "-"));
		} else if(requiredGrade.length === 1 && grade.length === 2) {
			return ((grade >= requiredGrade) && (grade.charAt(1) === "-"));
		} else {
			return ((grade >= requiredGrade) && (grade.charAt(1) >= requiredGrade.charAt(1)));
		}
	}
	
	addCourse(course, catalogEntry, grade, hours, types, validationOperation) {
		console.log(types);
		console.log("Adding course " + course);
		var hourCap;
		if(!this.applicableCourseIds.includes(course)) {
			if(this.requirementType !== requirementType.DEGREE) {
				return;
			}
		}
		if(this.applicableCourseEvents[course]) {
			console.log("Applicable course event");
			this.applicableCourseEvents[course](true);
		}
		this.courseValidationOperations[course] = validationOperation;
		this.coursesTaken[course] = catalogEntry;
		this.coursesTaken[course].valid = true;
		this.coursesTaken[course].hours = hours;
		this.coursesTaken[course].types = types;
		this.coursesTaken[course].flags = [];
		this.currentHours += hours;
		
		if(this.gradeRestriction) {
			if(this.violatesGradeRestriction(course, grade)) {
				var requiredGrade = (this.gradeOverrides[course]) ? this.gradeOverrides[course] : this.gradeRestriction;
				this.gradeAction(requiredGrade);
				this.coursesTaken[course].flags.push(ruleFlags.GRADEVIOLATION);
				//validationOperation(this.coursesTaken[course].flags);
			}
		}
		if(this.lowHourOverrides[course]) {
			if(hours < this.lowHourOverrides[course]) {
				this.lowHourOverrideAction(this.lowHourOverrides[course]);
				this.coursesTaken[course].flags.push(ruleFlags.LOWHOURSVIOLATION);
				//validationOperation(this.coursesTaken[course].flags);
			}
		}
		if(this.highHourOverrides[course]) {
			if(hours > this.highHourOverrides[course]) {
				this.highHourOverrideAction(this.highHourOverrides[course]);
				this.coursesTaken[course].flags.push(ruleFlags.HIGHHOURSVIOLATION);
				//validationOperation(this.coursesTaken[course].flags);
			}
		}
		
		if(catalogEntry.number < 500)  {
			this.currentHours400 += hours;
			if(this.hours400MaxAction) {
				if(this.hours400MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Max + 0.001)) : (Math.floor(this.currentHours * this.hours400Max + 0.001));
				} else {
					hourCap = this.hours400Max;
				}
				if(this.currentHours400 > hourCap && !this.hours400MaxNotification) {
					this.hours400MaxNotification = true;
					this.hours400MaxAction();
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURS400MAX);
					//validationOperation(this.coursesTaken[course].flags);
				} else if(this.hours400MaxNotification) {
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURS400MAX);
					//validationOperation(this.coursesTaken[course].flags);
				}
			}
			if(this.hours400MinAction) {
				if(this.hours400MinType === hourType.VARIABLE) {
					// TODO separate out the ternary conditional and only call min action if the hourCap changes
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Min + 0.001)) : (Math.floor(this.currentHours * this.hours400Min + 0.001));
					this.hours400MinAction(this.currentHours400, hourCap);
				} else {
					hourCap = this.hours400Min;
					this.hours400MinAction(this.currentHours400);
				}
			}
			
			// If adding a course exceeds the required hour count then the fraction of hours that can be 500 or 600 hours may have changed. Check to see if any previously invalid 500 and 600 hour
			// courses are now valid after the addition of a course
			if(this.currentHours > this.requiredHours) {
				if(this.hours500Max && this.hours500MaxNotification && this.hours500MaxType === hourType.VARIABLE) {
					hourCap500 = Math.floor(this.currentHours * this.hours500Max + 0.001);
					this.hours500MaxNotification = this.setValidCourses(500, hourCap500, hourCapType.MAXIMUM); 
				}
				if(this.hours500Min && this.hours500MinType === hourType.VARIABLE) {
					hourCap500 = Math.floor(this.currentHours * this.hours500Min + 0.001);
					this.hours500MinAction(this.currentHours500, hourCap500);
					this.hours500MinNotification = this.setValidCourses(500, hourCap500, hourCapType.MINIMUM); 
				}
				if(this.hours600Max && this.hours600MaxNotification && this.hours600MaxType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Max + 0.001);
					this.hours600MaxNotification = this.setValidCourses(600, hourCap600, hourCapType.MAXIMUM); 
				}
				if(this.hours600Min && this.hours600MinType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Min + 0.001);
					this.hours600MinAction(this.currentHours600, hourCap600);
					this.hours600MinNotification = this.setValidCourses(600, hourCap600, hourCapType.MINIMUM); 
				}
			}
			
		} else if(catalogEntry.number < 600) {
			this.currentHours500 += hours;
			if(this.hours500MaxAction) {
				if(this.hours500MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Max + 0.001)) : (Math.floor(this.currentHours * this.hours500Max + 0.001));
				} else {
					hourCap = this.hours500Max;
				}
				if(this.currentHours500 > hourCap && !this.hours500MaxNotification) {
					this.hours500MaxNotification = true;
					this.hours500MaxAction();
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURS500MAX);
					//validationOperation(false, "500");
				} else if(this.hours500MaxNotification) {
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURS500MAX);
					//validationOperation(false, "500");
				}
			}
			if(this.hours500MinAction) {
				if(this.hours500MinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Min + 0.001)) : (Math.floor(this.currentHours * this.hours500Min + 0.001));
					this.hours500MinAction(this.currentHours500, hourCap);
				} else {
					hourCap = this.hours500Min;
					this.hours500MinAction(this.currentHours500);
				}
			}
			
			if(this.currentHours > this.requiredHours) {
				if(this.hours400Max && this.hours400MaxNotification && this.hours400MaxType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Max + 0.001);
					this.hours400MaxNotification = !this.setValidCourses(400, hourCap400, hourCapType.MAXIMUM); 
				}
				if(this.hours400Min && this.hours400MinType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Min + 0.001);
					this.hours400MinAction(this.currentHours400, hourCap400);
					this.hours400MinNotification = !this.setValidCourses(400, hourCap400, hourCapType.MINIMUM); 
				}
				if(this.hours600Max && this.hours600MaxNotification && this.hours600MaxType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Max + 0.001);
					this.hours600MaxNotification = !this.setValidCourses(600, hourCap600, hourCapType.MAXIMUM); 
				}
				if(this.hours600Min && this.hours600MinType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Min + 0.001);
					this.hours600MinAction(this.currentHours600, hourCap600);
					this.hours600MinNotification = !this.setValidCourses(600, hourCap600, hourCapType.MINIMUM); 
				}
			}
		} else {
			this.currentHours600 += hours;
			if(this.hours600MaxAction) {
				if(this.hours600MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Max + 0.001)) : (Math.floor(this.currentHours * this.hours600Max + 0.001));
				} else {
					hourCap = this.hours600Max;
				}				
				if(this.currentHours600 > hourCap && !this.hours600MaxNotification) {
					this.hours600MaxNotification = true;
					this.hours600MaxAction();
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURS600MAX);
					//validationOperation(false, "600");
				} else if(this.hours600MaxNotification) {
					this.coursesTaken[course].valid == false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURS600MAX);
					//validationOperation(false, "600");
				}
			}
			if(this.hours600MinAction) {
				if(this.hours600MinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Min + 0.001)) : (Math.floor(this.currentHours * this.hours600Min + 0.001));
					this.hours600MinAction(this.currentHours600, hourCap);
				} else {
					hourCap = this.hours600Min;
					this.hours600MinAction(this.currentHours600);
				}				
			}
			
			if(this.currentHours > this.requiredHours) {
				if(this.hours400Max && this.hours400MaxNotification && this.hours400MaxType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Max + 0.001);
					this.hours400MaxNotification = !this.setValidCourses(400, hourCap400, hourCapType.MAXIMUM); 
				}
				if(this.hours400Min && this.hours400MinType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Min + 0.001);
					this.hours400MinAction(this.currentHours400, hourCap400);
					this.hours400MinNotification = !this.setValidCourses(400, hourCap400, hourCapType.MINIMUM); 
				}
				if(this.hours500Max && this.hours500MaxNotification && this.hours500MaxType === hourType.VARIABLE) {
					var hourCap500 = Math.floor(this.currentHours * this.hours500Max + 0.001);
					this.hours500MaxNotification = !this.setValidCourses(500, hourCap500, hourCapType.MAXIMUM); 
				}
				if(this.hours500Min && this.hours500MinType === hourType.VARIABLE) {
					var hourCap500 = Math.floor(this.currentHours * this.hours500Min + 0.001);
					this.hours500MinAction(this.currentHours500, hourCap500);
					this.hours500MinNotification = !this.setValidCourses(500, hourCap500, hourCapType.MINIMUM); 
				}
			}
		}
		// Process if PhD hours are set
		if(types.includes("PhD")) {
			this.currentHoursPhD += hours;
			if(this.hoursPhDMinAction) {
				if(this.hoursPhDMinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursPhDMin + 0.001)) : (Math.floor(this.currentHours * this.hoursPhDMin + 0.001));
					this.hoursPhDMinAction(this.currentHoursPhD, hourCap);
				} else {
					hourCap = this.hoursPhDMin;
					this.hoursPhDMinAction(this.currentHoursPhD);
				}				
			}
		}
		// The course may be labeled as either transfer or outside. These options have a maximum value rule so see if the maximum threshold has been broken
		if(types.includes("Transfer")) {
			this.currentHoursTransfer += hours;
			this.coursesTaken[course].flags.push(ruleFlags.HOURSTRANSFER);
			if(this.hoursTransferMaxAction) {
				if(this.hoursTransferMaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursTransferMax + 0.001)) : (Math.floor(this.currentHours * this.hoursTransferMax + 0.001));
				} else {
					hourCap = this.hoursTransferMax;
				}
				if(this.currentHoursTransfer > hourCap && !this.hoursTransferMaxNotification) {
					this.hoursTransferMaxAction();
					this.hoursTransferMaxNotification = true;
					//validationOperation(false, "Transfer");
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURSTRANSFERMAX);
				} else if(this.hoursTransferMaxNotification) {
					//validationOperation(false, "Transfer");
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURSTRANSFERMAX);
				}
			}
		}
		if(types.includes("Outside")) {
			this.currentHoursOutside += hours;
			this.coursesTaken[course].flags.push(ruleFlags.HOURSOUTSIDE);
			if(this.hoursOutsideMaxAction) {
				if(this.hoursOutsideMaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursOutsideMax + 0.001)) : (Math.floor(this.currentHours * this.hoursOutsideMax + 0.001));
				} else {
					hourCap = this.hoursOutsideMax;
				}
				if(this.currentHoursOutside > hourCap && !this.hoursOutsideMaxNotification) {
					this.hoursOutsideMaxAction();
					this.hoursOutsideMaxNotification = true;
					//validationOperation(false, "Outside");
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURSOUTSIDEMAX);
				} else if(this.hoursOutsideMaxNotification) {
					//validationOperation(false, "Outside");
					this.coursesTaken[course].valid = false;
					this.coursesTaken[course].flags.push(ruleFlags.HOURSOUTSIDEMAX);
				}
			}
		}
		if(types.includes("NoCatalog")) {
			this.coursesTaken[course].flags.push(ruleFlags.NOCATALOG);
		}
		
		validationOperation(this.coursesTaken[course].flags);
		if(this.requiredCourses[course] !== undefined) {
			this.requiredCourses[course] = true;
			if(this.courseActions[course] !== undefined) {
				this.courseActions[course](true);
			}
		}
		
		if(this.hoursAction) {
			this.hoursAction(this.currentHours);
		}
		if(!this.fufilledNotification && this.fufillsRequirements()) {
			this.fufilledNotification = true;
			this.fufilledOperation(true);
		}
	}
	
	
	removeCourse(course, hours) {
		var hourCap;
		console.log(course);
		console.log(this.coursesTaken)
		if(!this.applicableCourseIds.includes(course)) {
			if(this.requirementType !== requirementType.DEGREE) {
				return;
			}
		}
		if(this.applicableCourseEvents[course]) {
			this.applicableCourseEvents[course](false);
		}
		var catalogEntry = this.coursesTaken[course];
		delete this.coursesTaken[course];
		var beforeRemovalHours = this.currentHours;
		this.currentHours -= hours;
		this.hoursAction(this.currentHours);
		if(this.requiredCourses[course] !== undefined) {
			this.requiredCourses[course] = false;
			if(this.courseActions[course] !== undefined) {
				this.courseActions[course](false);
			}
		}
		if(catalogEntry.number < 500) {
			this.currentHours400 -= hours;
			if(this.hours400MaxNotification) {
				if(this.hours400MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Max + 0.001)) : (Math.floor(this.currentHours * this.hours400Max + 0.001));
				} else {
					hourCap = this.hours400Max;
				}
				console.log("Checking maximum with an hour cap of " + hourCap);
				this.setValidCourses(400, hourCap, hourCapType.MAXIMUM);
				console.log("Done checking maximum");
				
				if(this.currentHours400 <= hourCap) {
					this.hours400MaxNotification = false;
				}
			}
			if(this.hours400MinAction) {
				this.hours400MinAction(this.currentHours400);
			}
			
			// Removing the 400 level course may affect the hourCap for other course levels, check to see if the removal event makes other courses invalid
			if(this.hours500Max && this.hours500MaxType === hourType.VARIABLE) {
				var hourCap500 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Max + 0.001)) : (Math.floor(this.currentHours * this.hours500Max + 0.001));
				if(this.setInvalidCourses(400, hourCap400)) {
					if(!this.hours500MaxNotification) {
						this.hours500MaxNotification = true;
						this.hours500MaxAction();
					}
				}
			}
			if(this.hours600Max && this.hours600MaxType === hourType.VARIABLE) {
				var hourCap600 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Max + 0.001)) : (Math.floor(this.currentHours * this.hours600Max + 0.001));
				if(this.setInvalidCourses(600, hourCap600)) {
					if(!this.hours600MaxNotification) {
						this.hours600MaxNotification = true;
						this.hours600MaxAction();
					}
				}
			}
			// The minimum hour cap may change as well, in which case the progress bar will need to be updated.
			if(this.hours500Min && this.hours500MinType === hourType.VARIABLE) {
				var hourCap500 = Math.floor(this.currentHours * this.hours500Min + 0.001);
				this.hours500MinAction(this.currentHours500, hourCap500);
				this.hours500MinNotification = !this.setValidCourses(500, hourCap500, hourCapType.MINIMUM); 
			}
			if(this.hours600Min && this.hours600MinType === hourType.VARIABLE) {
				var hourCap600 = Math.floor(this.currentHours * this.hours600Min + 0.001);
				this.hours600MinAction(this.currentHours600, hourCap600);
				this.hours600MinNotification = !this.setValidCourses(600, hourCap600, hourCapType.MINIMUM); 
			}
		} else if(catalogEntry.number < 600) {
			this.currentHours500 -= hours;
			if(this.hours500MaxNotification) {
				if(this.hours500MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Max + 0.001)) : (Math.floor(this.currentHours * this.hours500Max + 0.001));
				} else {
					hourCap = this.hours500Max;
				}
				// A valid 500 level course may have been removed. In which case an invalid 500 level course may need to be marked as valid
				this.setValidCourses(500, hourCap, hourCapType.MAXIMUM);
				
				if(this.currentHours500 <= hourCap) {
					this.hours500MaxNotification = false;
				}
			}
			if(this.hours500MinAction) {
				this.hours500MinAction(this.currentHours500);
			}
			
			
			// Removing the 500 level course may affect the hourCap for other course levels, check to see if the removal event makes other courses invalid
			if(this.hours400Max && this.hours400MaxType === hourType.VARIABLE) {
				var hourCap400 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Max + 0.001)) : (Math.floor(this.currentHours * this.hours400Max + 0.001));
				if(this.setInvalidCourses(400, hourCap400)) {
					if(!this.hours400MaxNotification) {
						this.hours400MaxNotification = true;
						this.hours400MaxAction();
					}
				}
			}
			if(this.hours600Max && this.hours600MaxType === hourType.VARIABLE) {
				var hourCap600 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Max + 0.001)) : (Math.floor(this.currentHours * this.hours600Max + 0.001));
				if(this.setInvalidCourses(600, hourCap600)) {
					if(!this.hours600MaxNotification) {
						this.hours600MaxNotification = true;
						this.hours600MaxAction();
					}
				}
			}
			if(this.hours400Min && this.hours400MinType === hourType.VARIABLE) {
				var hourCap400 = Math.floor(this.currentHours * this.hours400Min + 0.001);
				this.hours400MinAction(this.currentHours400, hourCap400);
				this.hours400MinNotification = !this.setValidCourses(400, hourCap400, hourCapType.MINIMUM); 
			}
			if(this.hours600Min && this.hours600MinType === hourType.VARIABLE) {
				var hourCap600 = Math.floor(this.currentHours * this.hours600Min + 0.001);
				this.hours600MinAction(this.currentHours600, hourCap600);
				this.hours600MinNotification = !this.setValidCourses(600, hourCap600, hourCapType.MINIMUM); 
			}
		} else {
			this.currentHours600 -= hours;
			if(this.hours600MaxNotification) {
				if(this.hours600MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Max + 0.001)) : (Math.floor(this.currentHours * this.hours600Max + 0.001));
				} else {
					hourCap = this.hours600Max;
				}
				this.setValidCourses(600, hourCap, hourCapType.MAXIMUM);
				
				if(this.currentHours600 <= hourCap) {
					this.hours600MaxNotification = false;
				}
			}
			if(this.hours600MinAction) {
				this.hours600MinAction(this.currentHours600);
			}
			
			// Removing the 600 level course may affect the hourCap for other course levels, check to see if the removal event makes other courses invalid
			if(this.hours500Max && this.hours500MaxType === hourType.VARIABLE) {
				var hourCap500 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Max + 0.001)) : (Math.floor(this.currentHours * this.hours500Max + 0.001));
				if(this.setInvalidCourses(500, hourCap500)) {
					if(!this.hours500MaxNotification) {
						this.hours500MaxNotification = true;
						this.hours500MaxAction();
					}
				}
			}
			if(this.hours400Max && this.hour400MaxType === hourType.VARIABLE) {
				var hourCap400 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Max + 0.001)) : (Math.floor(this.currentHours * this.hours400Max + 0.001));
				if(this.setInvalidCourses(400, hourCap400)) {
					if(!this.hours600MaxNotification) {
						this.hours400MaxNotification = true;
						this.hours400MaxAction();
					}
				}
			}
			if(this.hours400Min && this.hours400MinType === hourType.VARIABLE) {
				var hourCap400 = Math.floor(this.currentHours * this.hours400Min + 0.001);
				this.hours400MinAction(this.currentHours400, hourCap400);
				this.hours400MinNotification = !this.setValidCourses(400, hourCap400, hourCapType.MINIMUM); 
			}
			if(this.hours500Min && this.hours500MinType === hourType.VARIABLE) {
				var hourCap500 = Math.floor(this.currentHours * this.hours500Min + 0.001);
				this.hours500MinAction(this.currentHours500, hourCap500);
				this.hours500MinNotification = !this.setValidCourses(500, hourCap500, hourCapType.MINIMUM); 
			}
		}
		// Check to see if PhD hours now become below the minimum required
		if(catalogEntry.types.includes("PhD")){
			this.currentHoursPhD -= hours;
			if(this.hoursPhDMinAction) {
				if(this.hoursPhDMinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursPhDMin + 0.001)) : (Math.floor(this.currentHours * this.hoursPhDMin + 0.001));
					this.hoursPhDMinAction(this.currentHoursPhD, hourCap);
				} else {
					hourCap = this.hoursPhDMin;
					this.hoursPhDMinAction(this.currentHoursPhD);
				}			
			}
		}
		// Tranfer or outside credit may now have reduced below the maximum, if the maximum event has been triggered then courses will need to be checked to see if a removal event
		// changes the validity of the course
		if(catalogEntry.types.includes("Transfer")) {
			this.currentHoursTransfer -= hours;
		}
		if(catalogEntry.types.includes("Outside")) {
			this.currentHoursOutside -= hours;
		}

		if(this.hoursTransferMaxNotification && this.hoursTransferMax) {
			if(this.hoursTransferMaxType === hourType.VARIABLE) {
				hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursTransferMax + 0.001)) : (Math.floor(this.currentHours * this.hoursTransferMax + 0.001));
			} else {
				hourCap = this.hoursTransferMax;
			}
			this.hoursTransferMaxNotification = !this.setValidCoursesType(ruleFlags.HOURSTRANSFERMAX, hourCap);
		}
		if(this.hoursOutsideMaxNotification && this.hoursOutsideMax) {
			if(this.hoursOutsideMaxType === hourType.VARIABLE) {
				hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursOutsideMax + 0.001)) : (Math.floor(this.currentHours * this.hoursOutsideMax + 0.001));
			} else {
				hourCap = this.hoursOutsideMax;
			}
			this.hoursOutsideMaxNotification = !this.setValidCoursesType(ruleFlags.HOURSOUTSIDEMAX, hourCap);
		}
		
		// If the requirement fufillment criteria was previously met but removing a course breaks the criteria, then update the events
		if(this.fufilledNotification && !this.fufillsRequirements()) {
			this.fufilledNotification = false;
			this.fufilledOperation(false);
		}
	}
	
	/*
	This function is similar to setValidCourses except that the course type is checked against the specified type 
	*/
	setValidCoursesType(courseType, hourCap) {
		console.log("Inside set valid course type " + courseType);
		console.log(this.coursesTaken);
		var hourCount = 0;
		var containsAllValid = true;
		/* Removing a course may cause another course to need to be marked as valid (such as if a valid course is removed making an invalid course valid). Determine
		if any invalid courses need to be marked valid. Order user inputted courses is important so use forEach instead of for in */
		Object.keys(this.coursesTaken).forEach(function(courseId) {
			console.log(this.coursesTaken[courseId].types);
			if(this.coursesTaken[courseId].flags.includes(courseType)) {
				hourCount += this.coursesTaken[courseId].hours;
				if(hourCount <= hourCap) {
					console.log(this.coursesTaken[courseId].flags);
					this.coursesTaken[courseId].flags = this.coursesTaken[courseId].flags.filter(function(flag) {
						console.log("The flag" + flag + " is being compared to " + courseType);
						return flag !== courseType;
					});
					console.log(this.coursesTaken[courseId].flags);
					this.courseValidationOperations[courseId](this.coursesTaken[courseId].flags);
				} else {
					containsAllValid = false;
				}
			}
		}, this);
		return containsAllValid;
	}
	
	/*
	This function will check to see if any courses at the given course level are now valid. This could occur in response to a course removal event adjusting the total number of hours counted
	towards the requirement object.
	*/
	setValidCourses(courseLevel, hourCap, cap) {
		console.log("The cap is " + cap + " hour level is " + courseLevel);
		console.log(this.coursesTaken);
		var flagCheck = courseLevel.toString() + cap;
		var hourCount = 0;
		var containsAllValid = true;
		/* Removing a course may cause another course to need to be marked as valid (such as if a valid course is removed making an invalid course valid). Determine
		if any invalid courses need to be marked valid. Order user inputted courses is important so use forEach instead of for in */
		Object.keys(this.coursesTaken).forEach(function(courseId) {
			if(this.coursesTaken[courseId].number < (courseLevel + 100) && this.coursesTaken[courseId].number >= courseLevel) {
				hourCount += this.coursesTaken[courseId].hours;
				if(hourCount <= hourCap) {
					console.log(this.coursesTaken[courseId].flags);
					this.coursesTaken[courseId].flags = this.coursesTaken[courseId].flags.filter(function(flag) {
						console.log("The flag" + flag + " is being compared to " + flagCheck);
						return flag !== flagCheck;
					});
					console.log(this.coursesTaken[courseId].flags);
					this.courseValidationOperations[courseId](this.coursesTaken[courseId].flags);
				} else {
					containsAllValid = false;
				}
			}
		}, this);
		return containsAllValid;
	}
	
	/* 
	This function will check to see if any courses at a given course level are now invalid. This could occur in response to a course removal event adjusting the total number of hours counted
	towards the requirement object.
	*/
	setInvalidCourses(courseLevel, hourCap, cap) {
		var hourCount = 0;
		var changed = false;
		Object.keys(this.coursesTaken).forEach(function(courseId) {
			if(this.coursesTaken[courseId].number < (courseLevel + 100) && this.coursesTaken[courseId].number >= courseLevel) {
				hourCount += this.coursesTaken[courseId].hours;
				if(hourCount > hourCap) {
					this.coursesTaken[courseId].flags.push(courseLevel.toString() + cap);
					this.courseValidationOperations[courseId](this.coursesTaken[courseId].flags);
					this.coursesTaken[courseId].valid = false;
					changed = true;
				}
			}
		}, this);
		return changed;
	}
	
	setFufilledOperation(func) {
		this.fufilledOperation = func;
	}
	
	fufillsRequirements() {
		var hourCap;
		var countRequiredCourses = 0;
		if(this.currentHours < this.requiredHours) {
			return false;
		}
		for(var key in this.requiredCourses) {
			if(!this.requiredCourses[key]) {
				if(this.subCourses[key] !== undefined) {
					var fufillsArray = this.subCourses[key].filter(function(courseId) {
						return this.requiredCourses[courseId];
					}, this);
					if(fufillsArray.length !== 0) {
						countRequiredCourses++;
					}
				} 
			} else {
				countRequiredCourses++;
			}			
		};
		if(this.countRequiredCourses === countRequiredCourses) {
			if(this.hours400Min) {
				if(this.hours400MinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400Min + 0.001)) : (Math.floor(this.currentHours * this.hours400Min + 0.001));
				} else { 
					hourCap = this.hours400Min;
				}
				if(this.currentHours400 < hourCap) {
					return false;
				}
			}
			if(this.hours500Min) {
				if(this.hours500MinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Min + 0.001)) : (Math.floor(this.currentHours * this.hours500Min + 0.001));
				} else { 
					hourCap = this.hours500Min;
				}
				if(this.currentHours500 < hourCap) {
					return false;
				}
			}
			if(this.hours600Min) {
				if(this.hours600MinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Min + 0.001)) : (Math.floor(this.currentHours * this.hours600Min + 0.001));
				} else { 
					hourCap = this.hours600Min;
				}
				if(this.currentHours600 < hourCap) {
					return false;
				}
			}
			if(this.hoursPhDMin) {
				if(this.hoursPhDMinType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hoursPhDMin + 0.001)) : (Math.floor(this.currentHours * this.hoursPhDMin + 0.001));
				} else { 
					hourCap = this.hoursPhDMin;
				}
				if(this.currentHoursPhD < hourCap) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
}


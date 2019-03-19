
/* There are two types of hour interpretations by the requirements object. A fixed type only allows an immutable number of hours to be set,
while a variable type will interpret the number of hours as a percentage of the total hours applied to the degree */
const hourType = {
	FIXED: "fixed",
	VARIABLE: "variable"
}

class Requirements {

	constructor() {
		this.applicableCourseIds = []; // An array of all courseIds that should count towards to requirement
		this.applicableCourseEvents = {};
		this.courseActions = {};
		this.coursesTaken = {};
		this.courseValidationOperations = {};
		this.requiredCourses = {};
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
	
	setRequiredHours(hours, hoursAction) {
		this.requiredHours = hours;
		if(hoursAction) {
			this.hoursAction = hoursAction;
		}
	}
	
	addRequiredCourse(courseId, courseAction) {
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
	
	addCourse(course, catalogEntry, grade, hours, validationOperation) {
		var hourCap;
		if(!this.applicableCourseIds.includes(course)) {
			return;
		}
		if(this.applicableCourseEvents[course]) {
			console.log("Applicable course event");
			this.applicableCourseEvents[course](true);
		}
		this.courseValidationOperations[course] = validationOperation;
		this.coursesTaken[course] = catalogEntry;
		this.coursesTaken[course].valid = true;
		this.coursesTaken[course].hours = hours;
		this.currentHours += hours;
		
		if(this.gradeRestriction) {
			if(this.violatesGradeRestriction(course, grade)) {
				var requiredGrade = (this.gradeOverrides[course]) ? this.gradeOverrides[course] : this.gradeRestriction;
				this.gradeAction(requiredGrade);
				validationOperation(false);
			}
		}
		if(this.lowHourOverrides[course]) {
			if(hours < this.lowHourOverrides[course]) {
				this.lowHourOverrideAction(this.lowHourOverrides[course]);
				validationOperation(false);
			}
		}
		if(this.highHourOverrides[course]) {
			if(hours > this.highHourOverrides[course]) {
				this.highHourOverrideAction(this.highHourOverrides[course]);
				validationOperation(false);
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
					validationOperation(false);
				} else if(this.hours400MaxNotification) {
					this.coursesTaken[course].valid = false;
					validationOperation(false);
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
				if(this.currentHours400 > hourCap && !this.hours400MinNotification) {
					this.hours400MinNotification = true;
					this.hours400MinAction();
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				} else if(this.hours400MinNotification) {
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				}
			}
			
			// If adding a course exceeds the required hour count then the fraction of hours that can be 500 or 600 hours may have changed. Check to see if any previously invalid 500 and 600 hour
			// courses are now valid after the addition of a course
			if(this.currentHours > this.requiredHours) {
				if(this.hours500Max && this.hours500MaxNotification && this.hours500MaxType === hourType.VARIABLE) {
					hourCap500 = Math.floor(this.currentHours * this.hours500Max + 0.001);
					this.hours500MaxNotification = this.setValidCourses(500, hourCap500); 
				}
				if(this.hours500Min && this.hours500MinNotification && this.hours500MinType === hourType.VARIABLE) {
					hourCap500 = Math.floor(this.currentHours * this.hours500Min + 0.001);
					this.hours500MinNotification = this.setValidCourses(500, hourCap500); 
				}
				if(this.hours600Max && this.hours600MaxNotification && this.hours600MaxType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Max + 0.001);
					this.hours600MaxNotification = this.setValidCourses(600, hourCap600); 
				}
				if(this.hours600Min && this.hours600MinNotification && this.hours600MinType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Min + 0.001);
					this.hours600MinNotification = this.setValidCourses(600, hourCap600); 
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
					validationOperation(false);
				} else if(this.hours500MaxNotification) {
					this.coursesTaken[course].valid = false;
					validationOperation(false);
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
				if(this.currentHours500 > hourCap && !this.hours500MinNotification) {
					this.hours500MinNotification = true;
					this.hours500MinAction();
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				} else if(this.hours500MinNotification) {
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				}
			}
			
			if(this.currentHours > this.requiredHours) {
				if(this.hours400Max && this.hours400MaxNotification && this.hours400MaxType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Max + 0.001);
					this.hours400MaxNotification = !this.setValidCourses(400, hourCap400); 
				}
				if(this.hours400Min && this.hours400MinNotification && this.hours400MinType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Min + 0.001);
					this.hours400MinNotification = !this.setValidCourses(400, hourCap400); 
				}
				if(this.hours600Max && this.hours600MaxNotification && this.hours600MaxType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Max + 0.001);
					this.hours600MaxNotification = !this.setValidCourses(600, hourCap600); 
				}
				if(this.hours600Min && this.hours600MinNotification && this.hours600MinType === hourType.VARIABLE) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600Min + 0.001);
					this.hours600MinNotification = !this.setValidCourses(600, hourCap600); 
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
					validationOperation(false);
				} else if(this.hours600MaxNotification) {
					this.coursesTaken[course].valid == false;
					validationOperation(false);
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
				if(this.currentHours600 > hourCap && !this.hours600MinNotification) {
					this.hours600MinNotification = true;
					this.hours600MinAction();
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				} else if(this.hours600MinNotification) {
					this.coursesTaken[course].valid == false;
					validationOperation(false);
				}
			}
			
			if(this.currentHours > this.requiredHours) {
				if(this.hours400Max && this.hours400MaxNotification && this.hours400MaxType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Max + 0.001);
					this.hours400MaxNotification = !this.setValidCourses(400, hourCap400); 
				}
				if(this.hours400Min && this.hours400MinNotification && this.hours400MinType === hourType.VARIABLE) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400Min + 0.001);
					this.hours400MinNotification = !this.setValidCourses(400, hourCap400); 
				}
				if(this.hours500Max && this.hours500MaxNotification && this.hours500MaxType === hourType.VARIABLE) {
					var hourCap500 = Math.floor(this.currentHours * this.hours500Max + 0.001);
					this.hours500MaxNotification = !this.setValidCourses(500, hourCap500); 
				}
				if(this.hours500Min && this.hours500MinNotification && this.hours500MinType === hourType.VARIABLE) {
					var hourCap500 = Math.floor(this.currentHours * this.hours500Min + 0.001);
					this.hours500MinNotification = !this.setValidCourses(500, hourCap500); 
				}
			}
			
		}
		if(this.requiredCourses[course] !== undefined) {
			this.requiredCourses[course] = true;
			console.log("Is a required course");
			if(this.courseActions[course] !== undefined) {
				console.log("Has an action attached");
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
		if(!this.applicableCourseIds.includes(course)) {
			return;
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
				this.setValidCourses(400, hourCap);
				
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
		} else if(catalogEntry.number < 600) {
			this.currentHours500 -= hours;
			if(this.hours500MaxNotification) {
				if(this.hours500MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500Max + 0.001)) : (Math.floor(this.currentHours * this.hours500Max + 0.001));
				} else {
					hourCap = this.hours500Max;
				}
				// A valid 500 level course may have been removed. In which case an invalid 500 level course may need to be marked as valid
				this.setValidCourses(500, hourCap);
				
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
			
		} else {
			this.currentHours600 -= hours;
			if(this.hours600MaxNotification) {
				if(this.hours600MaxType === hourType.VARIABLE) {
					hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600Max + 0.001)) : (Math.floor(this.currentHours * this.hours600Max + 0.001));
				} else {
					hourCap = this.hours600Max;
				}
				this.setValidCourses(600, hourCap);
				
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
		}
		
		// If the requirement fufillment criteria was previously met but removing a course breaks the criteria, then update the events
		if(this.fufilledNotification && !this.fufillsRequirements()) {
			this.fufilledNotification = false;
			this.fufilledOperation(false);
		}
	}
	
	/*
	This function will check to see if any courses at the given course level are now valid. This could occur in response to a course removal event adjusting the total number of hours counted
	towards the requirement object.
	*/
	setValidCourses(courseLevel, hourCap) {
		var hourCount = 0;
		var containsAllValid = true;
		console.log("Inside set valid courses at level " + courseLevel + " hour cap is " + hourCap);
		/* Removing a course may cause another course to need to be marked as valid (such as if a valid course is removed making an invalid course valid). Determine
		if any invalid courses need to be marked valid. Order user inputted courses is important so use forEach instead of for in */
		Object.keys(this.coursesTaken).forEach(function(courseId) {
			if(this.coursesTaken[courseId].number < (courseLevel + 100) && this.coursesTaken[courseId].number >= courseLevel) {
				hourCount += this.coursesTaken[courseId].hours;
				if(hourCount <= hourCap) {
					this.courseValidationOperations[courseId](true);
				} else {
					containsAllValid = false;
				}
			}
		}, this);
		return containsAllValid;
	}
	
	/* 
	This function will check to see if any courses at a given course level are no invalid. This could occur in response to a course removal event adjusting the total number of hours counted
	towards the requirement object.
	*/
	setInvalidCourses(courseLevel, hourCap) {
		console.log("inside set invalid with a courseLevel of " + courseLevel + " and an hourCap of " + hourCap);
		var hourCount = 0;
		var changed = false;
		Object.keys(this.coursesTaken).forEach(function(courseId) {
			if(this.coursesTaken[courseId].number < (courseLevel + 100) && this.coursesTaken[courseId].number >= courseLevel) {
				hourCount += this.coursesTaken[courseId].hours;
				if(hourCount > hourCap) {
					this.courseValidationOperations[courseId](false);
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
		if(this.currentHours < this.requiredHours) {
			return false;
		}
		for(var key in this.requiredCourses) {
			if(!this.requiredCourses[key]) {
				if(this.subCourses[key] !== undefined) {
					var fufillsArray = this.subCourses[key].filter(function(courseId) {
						return this.requiredCourses[courseId];
					}, this);
					if(fufillsArray.length == 0) {
						return false;
					}
				} else {
					return false;
				}
			} 
		};
		return true;
	}
	
}


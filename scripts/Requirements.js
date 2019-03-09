class Requirements {

	constructor() {
		this.courseActions = {};
		this.coursesTaken = {};
		this.courseRows = {};
		this.requiredCourses = {};
		this.subCourses = {};
		this.fufilledOperation = function() { return false; }
		this.fufilledNotification = false;
		this.gradeRestriction = null;
		this.requiredHours = 0;
		this.currentHours = 0;
		this.hoursAction = null;
		this.hours400 = null;
		this.hours400Action = null;
		this.hours400Notification = false;
		this.currentHours400 = 0;
		this.hours500 = null;
		this.hours500Action = null;
		this.hours500Notification = false;
		this.currentHours500 = 0;
		this.hours600 = null;
		this.hours600Action = null;
		this.hours600Notification = false;
		this.currentHours600 = 0;
	}
	
	set400LevelHours(hours, hoursAction) {
		this.hours400 = parseFloat(hours);
		if(hoursAction) {
			this.hours400Action = hoursAction;
		}
	}
	
	set500LevelHours(hours, hoursAction) {
		this.hours500 = hours;
		if(hoursAction) {
			this.hours500Action = hoursAction;
		}
	}
	
	set600LevelHours(hours, hoursAction) {
		this.hours600 = hours;
		if(hoursAction) {
			this.hours600Action = hoursAction;
		}
	}
	
	setRequiredHours(hours, hoursAction) {
		this.requiredHours = hours;
		if(hoursAction) {
			this.hoursAction = hoursAction;
		}
	}
	
	addRequiredCourse(courseId, courseAction) {
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
	
	addCourse(course, catalogEntry, hours) {
		this.coursesTaken[course] = catalogEntry;
		this.currentHours += hours;
		if(catalogEntry.number < 500)  {
			this.currentHours400 += hours;
			if(this.hours400Action) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.ceil(this.requiredHours * this.hours400)) : (Math.ceil(this.currentHours * this.hours400));
				console.log("The hour cap is " + hourCap);
				if(this.currentHours400 > hourCap && !this.hours400Notification) {
					this.hours400Notification = true;
					this.hours400Action();
				}
			}
		} else if(catalogEntry.number < 600) {
			this.currentHours500 += hours;
			if(this.hours500Action) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.ceil(this.requiredHours * this.hours500)) : (Math.ceil(this.currentHours * this.hours500)); 
				if(this.currentHours500 > hourCap && !this.hours500Notification) {
					this.hours500Notification = true;
					this.hours500Action();
				}
			}
		} else {
			this.currentHours600 += hours;
			if(this.hours600Action) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.ceil(this.requiredHours * this.hours600)) : (Math.ceil(this.currentHours * this.hours600)); 
				if(this.currentHours600 > hourCap && !this.hours600Notification) {
					this.hours600Notification = true;
					this.hours600Action();
				}
			}
		}
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
	
	// TODO check for flagged courses that were invalid but may be valid now after an hour change
	removeCourse(course, hours) {
		console.log("remove course event, course is " + course + " with hours " + hours);
		var catalogEntry = this.coursesTaken[course];
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
			if(this.hours400Notification) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.ceil(this.requiredHours * this.hours400)) : (Math.ceil(this.currentHours * this.hours400));
				if(this.currentHours400 <= hourCap) {
					this.hours400Notification = false;
				}
			}
		} else if(catalogEntry.number < 600) {
			this.currentHours500 -= hours;
			if(this.hours500Notification) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.ceil(this.requiredHours * this.hours500)) : (Math.ceil(this.currentHours * this.hours500));
				if(this.currentHours500 <= hourCap) {
					this.hours500Notification = false;
				}
			}
		} else {
			this.currentHours600 -= hours;
			if(this.hours600Notification) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.ceil(this.requiredHours * this.hours600)) : (Math.ceil(this.currentHours * this.hours600));
				if(this.currentHours600 <= hourCap) {
					this.hours500Notification = false;
				}
			}
		}
		if(this.fufilledNotification && !this.fufillsRequirements()) {
			this.fufilledNotification = false;
			this.fufilledOperation(false);
		}
		this.coursesTaken[course] = null;
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


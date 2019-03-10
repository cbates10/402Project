class Requirements {

	constructor() {
		this.courseActions = {};
		this.coursesTaken = {};
		this.courseValidationOperations = {};
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
	
	addCourse(course, catalogEntry, hours, validationOperation) {
		this.courseValidationOperations[course] = validationOperation;
		this.coursesTaken[course] = catalogEntry;
		this.coursesTaken[course].valid = true;
		this.coursesTaken[course].hours = hours;
		this.currentHours += hours;
		if(catalogEntry.number < 500)  {
			this.currentHours400 += hours;
			if(this.hours400Action) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400 + 0.001)) : (Math.floor(this.currentHours * this.hours400 + 0.001));
				if(this.currentHours400 > hourCap && !this.hours400Notification) {
					this.hours400Notification = true;
					this.hours400Action();
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				} else if(this.hours400Notification) {
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				}
			}
			
			// If adding a course exceeds the required hour count then the fraction of hours that can be 500 or 600 hours may have changed. Check to see if any previously invalid 500 and 600 hour
			// courses are now valid after the addition of a course
			if(this.currentHours > this.requiredHours) {
				if(this.hours500 && this.hours500Notification) {
					var hourCap500 = Math.floor(this.currentHours * this.hours500 + 0.001);
					this.hours500Notification = this.setValidCourses(500, hourCap500); 
				}
				if(this.hours600 && this.hours600Notification) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600 + 0.001);
					this.hours600Notification = this.setValidCourses(600, hourCap600); 
				}
			}
			
		} else if(catalogEntry.number < 600) {
			this.currentHours500 += hours;
			if(this.hours500Action) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500 + 0.001)) : (Math.floor(this.currentHours * this.hours500 + 0.001)); 
				if(this.currentHours500 > hourCap && !this.hours500Notification) {
					this.hours500Notification = true;
					this.hours500Action();
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				} else if(this.hours500Notification) {
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				}
			}
			
			if(this.currentHours > this.requiredHours) {
				if(this.hours400 && this.hours400Notification) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400 + 0.001);
					this.hours400Notification = this.setValidCourses(400, hourCap400); 
				}
				if(this.hours600 && this.hours600Notification) {
					var hourCap600 = Math.floor(this.currentHours * this.hours600 + 0.001);
					this.hours600Notification = this.setValidCourses(600, hourCap600); 
				}
			}
			
		} else {
			this.currentHours600 += hours;
			if(this.hours600Action) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600 + 0.001)) : (Math.floor(this.currentHours * this.hours600 + 0.001)); 
				if(this.currentHours600 > hourCap && !this.hours600Notification) {
					this.hours600Notification = true;
					this.hours600Action();
					this.coursesTaken[course].valid = false;
					validationOperation(false);
				} else if(this.hours600Notification) {
					this.coursesTaken[course].valid == false;
					validationOperation(false);
				}
			}
			
			if(this.currentHours > this.requiredHours) {
				if(this.hours400 && this.hours400Notification) {
					var hourCap400 = Math.floor(this.currentHours * this.hours400 + 0.001);
					this.hours400Notification = this.setValidCourses(400, hourCap400); 
				}
				if(this.hours500 && this.hours500Notification) {
					var hourCap500 = Math.floor(this.currentHours * this.hours500 + 0.001);
					this.hours500Notification = this.setValidCourses(500, hourCap500); 
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
	
	
	removeCourse(course, hours) {
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
			if(this.hours400Notification) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400 + 0.001)) : (Math.floor(this.currentHours * this.hours400 + 0.001));
				
				this.setValidCourses(400, hourCap);
				
				if(this.currentHours400 <= hourCap) {
					this.hours400Notification = false;
				}
			}
			// Removing the 400 level course may affect the hourCap for other course levels, check to see if the removal event makes other courses invalid
			if(this.hours500) {
				var hourCap500 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400 + 0.001)) : (Math.floor(this.currentHours * this.hours400 + 0.001));
				if(this.setInvalidCourses(400, hourCap400)) {
					this.hours400Notification = true;
					this.hours400Action();
				}
			}
			if(this.hours600) {
				var hourCap600 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600 + 0.001)) : (Math.floor(this.currentHours * this.hours600 + 0.001));
				if(this.setInvalidCourses(600, hourCap600)) {
					this.hours600Notification = true;
					this.hours600Action();
				}
			}
		} else if(catalogEntry.number < 600) {
			this.currentHours500 -= hours;
			if(this.hours500Notification) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500 + 0.001)) : (Math.floor(this.currentHours * this.hours500 + 0.001));
				
				// A valid 500 level course may have been removed. In which case an invalid 500 level course may need to be marked as valid
				this.setValidCourses(500, hourCap);
				
				if(this.currentHours500 <= hourCap) {
					this.hours500Notification = false;
				}
			}
			// Removing the 500 level course may affect the hourCap for other course levels, check to see if the removal event makes other courses invalid
			if(this.hours400) {
				var hourCap400 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400 + 0.001)) : (Math.floor(this.currentHours * this.hours400 + 0.001));
				if(this.setInvalidCourses(400, hourCap400)) {
					this.hours400Notification = true;
					this.hours400Action();

				}
			}
			if(this.hours600) {
				var hourCap600 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600 + 0.001)) : (Math.floor(this.currentHours * this.hours600 + 0.001));
				if(this.setInvalidCourses(600, hourCap600)) {
					this.hours600Notification = true;
					this.hours600Action();
				}
			}
			
		} else {
			this.currentHours600 -= hours;
			if(this.hours600Notification) {
				var hourCap = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours600 + 0.001)) : (Math.floor(this.currentHours * this.hours600 + 0.001));
				
				this.setValidCourses(600, hourCap);
				
				if(this.currentHours600 <= hourCap) {
					this.hours600Notification = false;
				}
			}
			// Removing the 600 level course may affect the hourCap for other course levels, check to see if the removal event makes other courses invalid
			if(this.hours500) {
				var hourCap500 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours500 + 0.001)) : (Math.floor(this.currentHours * this.hours500 + 0.001));
				if(this.setInvalidCourses(500, hourCap500)) {
					this.hours500Notification = true;
					this.hours500Action();

				}
			}
			if(this.hours400) {
				var hourCap400 = (this.requiredHours > this.currentHours) ? (Math.floor(this.requiredHours * this.hours400 + 0.001)) : (Math.floor(this.currentHours * this.hours400 + 0.001));
				if(this.setInvalidCourses(400, hourCap400)) {
					this.hours400Notification = true;
					this.hours400Action();
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


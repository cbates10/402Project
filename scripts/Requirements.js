class Requirements {

	constructor() {
		this.courseActions = {};
		this.courses = {};
		this.subCourses = {};
		this.fufilledOperation = function() { return false; }
	}
	
	addRequiredCourse(courseId, courseAction) {
		this.courses[courseId] = false;
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
	
	addCourse(course) {
		if(this.courses[course] !== undefined) {
			this.courses[course] = true;
			if(this.courseActions[course] !== undefined) {
				this.courseActions[course]();
			}
			if(this.fufillsRequirements()) {
				this.fufilledOperation();
			}
		}
	}
	
	setFufilledOperation(func) {
		this.fufilledOperation = func;
	}
	
	fufillsRequirements() {
		for(var key in this.courses) {
			if(!this.courses[key]) {
				if(this.subCourses[key] !== undefined) {
					var fufillsArray = this.subCourses[key].filter(function(courseId) {
						return this.courses[courseId];
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


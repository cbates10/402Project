class CourseObserver {
	constructor() {
		this.addObservers = [];
		this.removeObservers = [];
	}
	
	subscribeRemoveCourse(func) {
		this.removeObservers.push(func);
	}
	
	unsubscribeRemoveCourse(func) {
		this.removeObservers = this.removeObservers.filter((subscriber) => subscriber !== func);
	}
	
	broadcastRemoveEvent(courseId, isPhD, hours) {
		this.removeObservers.forEach((subscriber) => subscriber(courseId, isPhD, hours));
	}
	
	subscribeAddCourse(func) {
		this.addObservers.push(func);
	}
	
	unsubscribeAddCourse(func) {
		this.addObservers = this.addObservers.filter((subscriber) => subscriber !== func);
	}
	
	broadcastAddEvent(courseId, catalogEntry, grade, hours, isPhD, validationOperation) {
		this.addObservers.forEach((subscriber) => subscriber(courseId, catalogEntry, grade, hours, isPhD, validationOperation));
	}
}
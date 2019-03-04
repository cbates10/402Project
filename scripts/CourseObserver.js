class CourseObserver {
	constructor() {
		this.observers = [];
	}
	
	subscribe(func) {
		this.observers.push(func);
	}
	
	unsubscribe(func) {
		this.observers = this.observers.filter((subscriber) => subscriber !== func);
	}
	
	broadcast(courseId, hours) {
		this.observers.forEach((subscriber) => subscriber(courseId, hours));
	}
}
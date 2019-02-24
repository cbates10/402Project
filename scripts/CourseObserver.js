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
	
	broadcast(data) {
		this.observers.forEach((subscriber) => subscriber(data));
	}
}
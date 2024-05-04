export const Modes = {
	Graphs: "Graph",
	Markings: "Markings",
	Blueprint: "Blueprint",
	Cars: "Cars",
	Play: "Play",
	Pause: "Pause",
}

export const States = {
	Play: "Play",
	Pause: "Pause"
}

export const Colors = {
	Green: "Green",
	Yellow: "Yellow",
	Red: "Red",
}

export const Markings = {
	Stop : "Stop",
	Crossing : "Crossing",
	Traffic : "Traffic",
	Car : "Car",
	Start : "Start",
	End : "End",
}
export var selectedMarking = null;
export function setSelectedMarking(newMarking) {  selectedMarking = newMarking;  }

export const Blueprints = {
	Roundabout : "Roundabout",
	Intersection : "Intersection",
	Clover: "Clover",
	Diamond: "Diamond",
}
export var selectedBlueprint = null;
export function setSelectedBlueprint(newBlueprint) {  selectedBlueprint = newBlueprint;  }

export const Vehicles = {
	Car : "Car",
	Bus : "Bus",
	Bicycle : "Bicycle",
	Lorry : "Lorry",
	Bike : "Bike",
	Police : "Police",
}
export var selectedVehicle = null;
export function setSelectedVehicle(newVehicle) {  selectedVehicle = newVehicle;  }

export var selectedStart = null;
export function setSelectedStart(newStart) {  selectedStart = newStart;  }

export var displayTrail = true;
export function toggleTrail() {  displayTrail = !displayTrail;  }

export var displaySensors = false;
export function toggleSensors() {  displaySensors = !displaySensors;  }

export const roadWidth = 100;
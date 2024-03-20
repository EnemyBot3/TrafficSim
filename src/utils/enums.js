export const Modes = {
	Graphs: "Graph",
	Markings: "Markings",
	Cars: "Cars",
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

export const roadWidth = 100;
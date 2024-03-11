export const Modes = {
	Graphs: "Graph",
	Markings: "Markings",
	Cars: "winter",
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

export function setSelectedMarking(newMarking) { 
	selectedMarking = newMarking; 
}
export const roadWidth = 100;
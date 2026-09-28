const roomRoot = document.querySelector("#root");

const room = {
	harbor: {
		name: "Moonlit Harbor",
		description: "Silver waves lap against the docks. A narrow trail climbs toward the lighthouse. The market square is just to your right, down a cobbled street.",
		linkedRooms: [
			{label: "Go to the market square", destination: "market"}
		]
	},
	trail: {
		name: "Lighthouse Trail",
		description: "Wind bends the grass along this steep path. The harbor glimmers below. A lighthouse stands at the end of the trail, but the way is blocked by a gate.",
		linkedRooms: [
			 {label: "Visit the lighthouse", destination: "lighthouse", requires: "brass key"},
             {label: "Return to the market square", destination: "market"}
		]
	},
	market: {
		name: "Market Square",
		description: "Empty stalls surround a dry fountain. A single star chart lies on the ground, its edges curled. A trail leads to the cliff above, where a lighthouse stands.",
		linkedRooms: [
			{label: "Take the trail", destination: "trail"},
            {label: "Return to the harbor", destination: "harbor"},
            {label: "Pick up the star chart", destination: "market", action: "pickup-chart"
            },
            {label: "Search through the stalls", destination: "market", action: "pickup-key"}
		]
	},
	lighthouse: {
		name: "Lighthouse",
		description: "An old lighthouse stands at the end of the trail. Its beam cuts through the night. The door is locked, but a keypad awaits a password.",
		linkedRooms: [
			{label: "Enter lighthouse", destination: "insidelighthouse", action: "password"},
            {label: "Return to the trail", destination: "trail"}

		]
	},
    insidelighthouse: {
        name: "Inside the Lighthouse",
        description: "The lighthouse is filled with nautical charts and a telescope. A journal lies on a table, open to a page with a constellation drawn on it.",
        linkedRooms: [
            {label: "Read the journal", destination: "insidelighthouse", action: "read-journal"},
            {label: "Exit the lighthouse", destination: "lighthouse"}
        ]
    }
};

let currentRoom = room["harbor"];
let inventory = [];

const itemDescriptions = {
	"brass key": "A small brass key, left by the harbor keeper.",
	"star chart": "A star chart showing the constellations. Written on the back is a note that says 'moonlight.'"
};

function addItem(item) {
	if (inventory.indexOf(item) === -1) inventory.push(item);
	renderRoom(currentRoom);
}

function ButtonClicked(e) {
	const destination = e.target.dataset.destination;
    const action = e.target.dataset.action;
    const requires = e.target.dataset.requires;

	if (requires && !inventory.includes(requires)) {
		showMessage(`You need a key to unlock the gate.`);
		return;
	}

	if (action === "pickup-chart") {
		if (inventory.includes("star chart")) {
			showMessage("You already picked up the star chart.");
		} else {
			addItem("star chart");
			showMessage("You picked up the star chart.");
		}
		return;
	}
	if (action === "pickup-key") {
		if (inventory.includes("brass key")) {
			showMessage("You already searched the stalls and found the key.");
		} else {
			addItem("brass key");
			showMessage("You search the stalls and find a brass key.");
		}
		return;
	}
	if (action === "password") {

        if (!inventory.includes("star chart")) {
			showMessage("The keypad asks for a password, what could it be?");
		}
        else {
		    showMessage("The keypad asks for a password. What items could help you figure it out? Perhaps the star chart you found in the market square has a clue.");
        }

        const passwordInput = document.createElement("input");
		passwordInput.type = "text";
		passwordInput.setAttribute("aria-label", "Password");
		const submitButton = document.createElement("button");
		submitButton.textContent = "Unlock";
		submitButton.addEventListener("click", () => {
			if (passwordInput.value === "moonlight") {
				currentRoom = room[destination];
				renderRoom(currentRoom);
			} else {
				showMessage("The keypad rejects that password.");
			}
		});
		roomRoot.append(passwordInput, submitButton);
		return;
	}
	if (action === "read-journal") {
		showMessage("The journal describes the constellations, written down by the lighthouse keeper. The information may be useful for navigating the night sky.");
		return;
	}
	currentRoom = room[destination];
	renderRoom(currentRoom);
}

function showMessage(message) {
	let messageElement = document.createElement("p");
    messageElement.textContent = message;
	roomRoot.append(messageElement);
}

function renderRoom(room) {
	roomRoot.innerHTML = "";

	const title = document.createElement("h1");
	title.innerHTML = "Adventure Game";
	roomRoot.append(title);

	let heading = document.createElement("h2");
	heading.innerHTML = room.name;
	roomRoot.append(heading);

	let description = document.createElement("p");
	description.innerHTML = room.description;
	roomRoot.append(description);

	const inventoryHeading = document.createElement("h3");
	inventoryHeading.textContent = "Inventory";
	roomRoot.append(inventoryHeading);

	const inventoryList = document.createElement("ul");
	if (inventory.length === 0) {
		const emptyItem = document.createElement("li");
		emptyItem.textContent = "Empty";
		inventoryList.append(emptyItem);
	} else {
		for (const item of inventory) {
			const listItem = document.createElement("li");
			listItem.append(document.createTextNode(item));
			const useButton = document.createElement("button");
			useButton.textContent = "Inspect";
			useButton.addEventListener("click", () => {
				showMessage(itemDescriptions[item]);
			});
			listItem.append(useButton);
			inventoryList.append(listItem);
		}
	}
	roomRoot.append(inventoryList);

    for (let i = 0; i < room.linkedRooms.length; i++) {
        let button = document.createElement("button");
        button.innerHTML = room.linkedRooms[i].label;
		button.dataset.destination = room.linkedRooms[i].destination;
		if (room.linkedRooms[i].action) button.dataset.action = room.linkedRooms[i].action;
		if (room.linkedRooms[i].requires) button.dataset.requires = room.linkedRooms[i].requires;
        button.addEventListener("click", ButtonClicked);
        roomRoot.append(button);
    }
}

renderRoom(currentRoom);
// choose a move, basic info, choose pokemon, basic info
// see type effectiveness X

// compare pokemon, stats, use animated sprite !!!

let p1 = null;
let p2 = null;

// let pokemonData;
// test to make loading screen
let loading = false;

// let gifUrl;
// let gif;

async function setup() {
    createCanvas(800, 420);
}


// when user clicks button, fetch value from pokemon1 and 2 inputs
async function comparePokemon() {
    let name1 = document.getElementById("pokemon1").value.trim();
    let name2 = document.getElementById("pokemon2").value.trim();

    // if either input is empty, show an error and return
    if (!name1 || !name2) {
        alert("Please enter two Pokémon names or IDs!");
        return;
    }

    // loading state and reset pokemon data
    loading = true;
    p1 = null;
    p2 = null;

    try {
    // fetch both pokemon data and sprites, -> p1 or 2
    // with error handling
    p1 = await getPokemon(name1);
    p2 = await getPokemon(name2);
    } catch (err) {
        console.error("Error fetching Pokémon data:", err);
    } finally {
        loading = false;
    }
}

/*async function setup() {
    createCanvas(800, 420);

    // await getPokemon(id);
    // console.log("data fetched");
}*/

// fetch helper: get api data, types, loads animated sprite
// make sure handle upper/lower case
// uses name1 or name 2
async function getPokemon(query) {
        let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        // if response fail, show error
        if (!res.ok) {
            alert("Failed to fetch Pokémon data!");
            return null;
        }

        let data = await res.json();
        // extract types from data
        let types = data.types.map(t => t.type.name);

        // get showdown animated sprite from pokeapi (or fallback to front_default)
        let gifUrl = data.sprites.other.showdown.front_default ||
             data.sprites.front_default; // Static fallback

        // load animated sprite with p5
        let gif = await loadImage(gifUrl);
        
        // else load static 
        // uneeded?
        /* if (gifUrl) {
            gif = await loadImage(gifUrl);
            console.log("gif loaded");
        } else {
            console.log("no gif found, static sprite");
        }*/

        return { data, gif, types };
    }


// runs about 60 times a second, forever.
function draw() {
    // clear the background
    background(255);

    // loading screen centered
    if (loading) {
        fill(100);
        textSize(18);
        textAlign(CENTER, CENTER);
        text("Loading...", width / 2, height / 2);
        return;
    }

    // if both inputs filled
    if (p1 && p2) {
        // Draw the Pokémon data
        drawPokemon(p1, 200);
        drawPokemon(p2, 600);
        drawStat();
    } else {
        // basic screen
        fill(120);
        textSize(16);
        textAlign(CENTER, CENTER);
        text("Enter two Pokemon above!", width / 2, height / 2);
    }

    /* if image is not yet loaded, show loading text
    if (!gif) {
        fill(100);
        text("Loading...", 10, 30);
        return;
    }

     // draw pokemon gif
    image(gif, 100, 100 ,150, 150);*/

}

// draw individual pokemon sprite, name, types, stats
// arguments: pokemon data, x-coord
function drawPokemon(p, x) {
    textAlign(CENTER, CENTER);
    
    // draw pokemon gif
    if (p.gif) {
        imageMode(CENTER);
        image(p.gif, x, 80, 90, 90);
    }

    // draw pokemon name and types
    fill(0);
    textSize(20);
    textStyle(BOLD);
    text(p.data.name.toUpperCase(), x, 150);

    textSize(12);
    textStyle(NORMAL);
    fill(100);
    // handle multiple types
    text(`Types: ${p.types.join(" / ").toUpperCase()}`, x, 170);
}

// draw stat comparison 
function drawStat() {
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(14);
    textStyle(BOLD);
    text("BASE STATS", width / 2, 170);

    // fetch pokemon stats array
    let stats1 = p1.data.stats;
    let stats2 = p2.data.stats;
    let y = 205;

    // loop through stats array
    // find each name, remove spaces and capitalize
    // find each value base_stat
    for (let i = 0; i < stats1.length; i++) {
        let name = stats1[i].stat.name.replace("-", " ").toUpperCase();
        let v1 = stats1[i].base_stat;
        let v2 = stats2[i].base_stat;

        // draw stat name
        textAlign(CENTER, CENTER);
        fill(80);
        textSize(11);
        textStyle(BOLD);
        text(name, width / 2, y);

        /*// p1 value; left side
        textAlign(RIGHT,CENTER);
        text(v1, 200, y);
        // p2 value; right side
        textAlign(LEFT,CENTER);
        text(v2, 600, y);*/

        // testing rect, bar stats?
        // change color of text comparing higher value

        // p1 value and bar
        fill(v1 >= v2 ? "green" : "red");
        textAlign(RIGHT,CENTER);
        text(v1, 335, y);

        // rectange, grows leftwards based on stat value
        fill (100, 150, 240);
        rect(300, y - 5, -v1, 10);

        // p2 value and bar
        fill(v2 >= v1 ? "green" : "red");
        textAlign(LEFT,CENTER);
        text(v2, 465, y);

        // rect, grow rightwards 
        fill(240, 120, 100);
        rect(500, y - 5, v2, 10);

        // make each line move downwards
        y += 26;
    }
}
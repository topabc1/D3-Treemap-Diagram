document.addEventListener("DOMContentLoaded", () => {

    let dataID = 0;
    async function Fetch() {
        let data;
        
        let res = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json");
        let vgData = await res.json();
        
        res = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json");
        let mData = await res.json();
        
        res = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json");
        let kData = await res.json();
        
        let totalValue = 0;
        if(dataID == 0) {
            data = vgData;
            data.name = "Video Game Sales";
            data.description = "Top 100 Most Sold Video Games Grouped By Platform";
        } else if(dataID == 1) {
            data = mData;
            data.name = "Movie Sales";
            data.description = "Top 100 Highest Grossing Movies Grouped By Genre";
        } else if(dataID == 2) {
            data = kData;
            data.name = "Kickstarter Pledges";
            data.description = "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category";
        }
        
    /* START *****************************/
        document.querySelector("#container").innerHTML = `<a href="#">Video Game Data Set</a> |
        <a href="#">Movies Data Set</a> |
        <a href="#">Kickstarter Data Set</a>
        
        <h1 id='title'>${data.name}</h1>
        <h2 id='description'>${data.description}</h2>
        
        <div id="legend"></div>`;
        
    /* UPDATE *****************************/
        const colors = {
            "Wii": "#6291C2",
            "GB": "#DFCB97",
            "PS2": "#7E2E2E",
            "SNES": "#CDA7DE",
            "GBA": "#C868CC",
            "2600": "#B2B2B2",
            "DS": "#8FABCD",
            "PS3": "#58A14A",
            "3DS": "#E39292",
            "PS": "#5B321C",
            "XB": "#E2B4DA",
            "PSP": "#C5A656",
            "X360": "#DA9228",
            "NES": "#92D17F",
            "PS4": "#87479C",
            "N64": "#7E7556",
            "PC": "#626262",
            "XOne": "#C1B97A",
            /*******************/
            "Action": "#6291C2",
            "Drama": "#DFCB97",
            "Biography": "#7E2E2E",
            "Adventure": "#8FABCD",
            "Animation": "#58A14A",
            "Comedy": "#DA9228",
            "Family": "#92D17F",
            /********************/
            "Product Design": "#6291C2",
            "Technology": "#DFCB97",
            "Gaming Hardware": "#7E2E2E",
            "Television": "#CDA7DE",
            "Food": "#C868CC",
            "Apparel": "#B2B2B2",
            "Tabletop Games": "#8FABCD",
            "Hardware": "#58A14A",
            "Narrative Film": "#E39292",
            "Web": "#5B321C",
            "Games": "#E2B4DA",
            "Art": "#C5A656",
            "Video Games": "#DA9228",
            "Sound": "#92D17F",
            "3D Printing": "#87479C",
            "Wearables": "#7E7556",
            "Sculpture": "#626262",
            "Gadgets": "#C1B97A"
        }
        
        const w = 1000; // canvas width
        const h = 500; // canvas height
        
        const svg = d3.select("#container")
                                    .append("svg")
                                    .attr("height", h)
                                    .attr("width", w)
                                    
        const treemap = d3.treemap()
                                            .size([w, h])
        
        const root = d3.hierarchy(data)
                                        .sum((d) => d.value)
                                        .sort((a, b) => b.value - a.value);
    
        treemap(root);
    
        svg
            .selectAll(".tile")
            .data(root.leaves())
            .enter().append("rect")
            .attr("class", (d, i) => `tile ${d.data.name.split(" ").join("-")}`)
            .attr("stroke", "white")
            .style("stroke-width", "0.1rem")
            .attr("x", (d) => d.x0)
            .attr("y", (d) => d.y0)
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("fill", (d) => colors[d.data.category])
        
        svg
            .selectAll(".label")
            .data(root.leaves())
            .enter().append("text")
            .attr("class", "label")
            .attr("x", (d) => d.x0 + 5)
            .attr("y", (d) => d.y0 + 12)
            .text((d) => d.data.name)
        
        svg
            .select(".tooltip")
            .data(root.leaves())
            .enter().append("div")
            .attr("class", (d, i) => `tooltip tooltip-${i}`)
        
        const tile = Array.from(document.querySelectorAll(".tile"));
        
        let mouseX;
        let mouseY;
        tile.forEach((item, index) => {
            for(let i = 0; i < data.children.length; i++) {
                for(let a = 0; a < data.children[i].children.length; a++) {
                    if(item.classList.contains(data.children[i].children[a].name.split(" ").join("-"))) {
                        document.querySelector(`.tooltip-${index}`).innerHTML = `Name: ${data.children[i].children[a].name}<br />Category: ${data.children[i].children[a].category}<br />Value: ${data.children[i].children[a].value}`;
                        break;
                    }
                }
            }
            
            item.addEventListener("mouseenter", (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
                document.querySelector(`.tooltip-${index}`).style.left = `${event.clientX + 10}px`;
                document.querySelector(`.tooltip-${index}`).style.top = `${event.clientY - 10}px`;
                document.querySelector(`.tooltip-${index}`).style.display = "block";
            });
            
            item.addEventListener("mousemove", (event) => {
                document.querySelector(`.tooltip-${index}`).style.left = `${mouseX + event.clientX - mouseX + 10}px`;
                document.querySelector(`.tooltip-${index}`).style.top = `${mouseY + event.clientY - mouseY - 10}px`;
            });
            
            item.addEventListener("mouseleave", () => {
                document.querySelector(`.tooltip-${index}`).style.display = "none";
            });
        });
    
        for(let i = 0; i < root.children.length; i++) {
            document.querySelector("#legend").innerHTML += `<div><div class='legend-square legend-square-${i}'></div>${root.children[i].data.name}</div>`;
        }
        
        const anchor = Array.from(document.querySelectorAll("a"));
        anchor.forEach(item => {
            item.addEventListener("click", () => {
                if(item.innerText === "Video Game Data Set") {
                    dataID = 0;
                } else if(item.innerText === "Movies Data Set") {
                    dataID = 1;
                } else if(item.innerText === "Kickstarter Data Set") {
                    dataID = 2;
                }
                document.querySelector("#container").innerHTML = "";
                Fetch();
            });
        });
    }
    Fetch();

})
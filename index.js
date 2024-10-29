function generate_dates(data) {
    var out = {};
    var selected = [];
    var left = [];

    for (let day in data) {
        if (data[day][0].length > data[day][2]) {
            let shuffled = data[day][0].sort(() => 0.5 - Math.random());
            out[day] = shuffled.slice(0, data[day][2]);
        }
        else {
            out[day] = data[day][0];
        }

        data[day][2] -= out[day].length;
        selected = selected.concat(out[day]);

        left = left.concat(data[day][1]);
    }

    for (let day in data) {
        if (data[day][2] > 0) {
            let n_d = data[day][1].filter((name) => !selected.includes(name));
            let l = 0;
            if (n_d.length > data[day][2]) {
                let shuffled = n_d.sort(() => 0.5 - Math.random());
                out[day] = out[day].concat(shuffled.slice(0, data[day][2]));
                l = data[day][2];
            } else {
                out[day] = out[day].concat(n_d);
                l = n_d.length;
            }

            data[day][2] -= l;
            selected = selected.concat(n_d);
        }
    }

    left = left.filter((name) => !selected.includes(name));

    let shuffled = left.sort(() => 0.5 - Math.random());

    for (let day in data) {
        if (data[day][2] > 0) {
            out[day] = out[day].concat(shuffled.splice(0, data[day][2]));
        }
    }

    return out;
}

var test_data = {
    "1" : [["Dave","Pippo"], [], 1],
    "2" : [["Ludo", "Pasquale"], ["Franco", "Dave"], 2],
    "3" : [["jonny"], ["francesco", "Pasquale"], 1],
    "4" : [["Beppe", "Franco"], ["Pasquale", "Beppe"], 2],
    "5": [["francesco"], ["Pippo", "jonny"], 2]
}


function add_date() {
    let grid = document.getElementById("date-grid");

    let new_element = document.createElement("div");

    new_element.className = "date";

    let elements = `<div class="date-heading">
    <input class="in-name" type="date" data-date="" data-date-format="DD/MM" value="2024-10-12">
        <div>
            <p>Numero di interrogati:</p>
            <input type="number" value="2" min="0">
        </div>
    </div>
    <ul>
        <button onclick="add_preference(this)" class="add-preference">+</button>
    </ul>
    <ul>
        <button onclick="add_preference(this)" class="add-preference">+</button>
    </ul>
</div>`;

    new_element.innerHTML = elements;

    grid.appendChild(new_element);

    document.getElementsByTagName("ul");
}

function delete_name(element) {
    element.parentElement.remove()
}

function add_preference(element) {
    let divisor = document.createElement("div");
    divisor.className = "single-name"

    let icon = document.createElement("span");
    icon.onclick = function(elem) { delete_name(elem.currentTarget) };
    icon.className = "material-symbols-outlined";
    icon.innerHTML = "delete";

    let new_element = document.createElement("h1");
    new_element.type = "text";
    new_element.innerHTML = "Name";
    new_element.className = "in-name";

    divisor.appendChild(icon);
    divisor.appendChild(new_element);

    element.parentElement.insertBefore(divisor, element);
}

function openNav() {
    document.getElementById("side-nav").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("side-nav").style.width = "0";
    //document.getElementById("main").style.marginLeft = "0";
}

function generate() {
    let grid = document.getElementById("date-grid");

    let data = {};

    for (let date in [...Array(grid.childNodes.length -1).keys()]) {
        let elem = document.getElementsByClassName("date").item(date);
        data[elem.children[0].children[0].value] = [[], [], Number(elem.children[0].children[1].children[1].value)];

        for (let i in [...Array(elem.children[1].children.length - 1).keys()]) {
            data[elem.children[0].children[0].value][0].push(elem.children[1].children[i].value);
        }

        for (let i in [...Array(elem.children[2].children.length - 1).keys()]) {
            data[elem.children[0].children[0].value][1].push(elem.children[2].children[i].value);
        }
    }

    let dates = generate_dates(data);

    let code =  ``;

    for (let date in dates) {
        code += `<div class="output-date">
    <h1>` + new Intl.DateTimeFormat('it-IT', {
        dateStyle: "long",
    }).format(new Date(date)) + `</h1>
        <div class="name-space">`;

        for (let name of dates[date]) {
            code += "<p>" + name + "</p>";
        }
        
        code += `   </div>
</div>`;
    }

    document.getElementById("output-code").innerHTML = code;

    document.getElementById("add-date").style.display = "none";
    document.getElementById("generate").style.display = "none";

    document.getElementById("output").style.display = "block"
    document.getElementById("main").style.display = "none"
}

$(document).on("dblclick", ".in-name", function(){

    var current = $(this).text();
    $(this).attr("id", "current-selected-name")
    $(this).html('<input class="in-name" id="newcont" value="'+current+'">');
    $("#newcont").focus();
    
    $("#newcont").focus(function() {
        console.log('in');
    }).blur(function() {
         var newcont = $("#newcont").val();
         let c = $("#current-selected-name");
         c.text(newcont);
         c.attr("id", "");
    });

})

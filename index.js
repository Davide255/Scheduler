const TODAY = new Date();

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

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

    let new_element = document.createElement("li");

    let elements = `<div class="date"><div class="date-heading list-group-item">
    <input class="in-name" type="date" data-date="" data-date-format="DD/MM" value=`+TODAY.toDateInputValue()+`>
        <div>
            <p>Numero di interrogati:</p>
            <input type="number" value="2" min="1" pattern="[0-9]*">
        </div>
        <span class="material-symbols-outlined handle" style="color: white;">
        drag_indicator
        </span>
    </div>
    <h4>First preference</h4>
    <h4>Second preference</h4>
    <ul>
        <button onclick="add_preference(this)" class="add-preference">+</button>
    </ul>
    <ul>
        <button onclick="add_preference(this)" class="add-preference">+</button>
    </ul>
</div></div>`;

    new_element.innerHTML = elements;

    grid.appendChild(new_element)
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
    let elem = document.getElementById("side-nav");
    elem.style.transition = "all 0.5s ease";
    elem.style.transform = "translateX(0)";
}

function closeNav() {
    document.getElementById("side-nav").style.transform = "translateX(-250px)";
}

function generate() {
    let grid = document.getElementById("date-grid");

    let data = {};

    for (let date in [...Array(grid.childNodes.length -1).keys()]) {
        let elem = document.getElementsByClassName("date").item(date);
        data[elem.children[0].children[0].value] = [[], [], Number(elem.children[0].children[1].children[1].value)];

        for (let i in [...Array(elem.children[3].children.length - 1).keys()]) {
            data[elem.children[0].children[0].value][0].push(elem.children[3].children[i].children[1].innerHTML);
        }

        for (let i in [...Array(elem.children[4].children.length - 1).keys()]) {
            data[elem.children[0].children[0].value][1].push(elem.children[4].children[i].children[1].innerHTML);
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

function delete_zone_confirm() {
    $("#delete-zone div ul").empty();
}

$(document).on("dblclick", ".in-name", function(){

    var current = $(this).text();
    $(this).attr("id", "current-selected-name")
    $(this).html('<input class="in-name" id="newcont" value="'+current+'">');
    $("#newcont").focus();
    $("#newcont").select();
    
    $("#newcont").focus(function() {
        console.log('in');
    }).blur(function() {
         var newcont = $("#newcont").val();
         let c = $("#current-selected-name");
         c.text(newcont);
         c.attr("id", "");
    });

})

$(document).ready(function() {
    new Sortable(
        document.getElementById("date-grid"),
        {
            group:"content-shared",
            handle: ".handle",
            animation: 150,
            onChoose: function(evt) {
                $("#delete-zone").addClass("active");
                $(".floating-button").addClass("active");
            },
            onUnchoose: function(evt) {
                $("#delete-zone").removeClass("active");
                $(".floating-button").removeClass("active");
                delete_zone_confirm();
            }
        });

    new Sortable(
        document.getElementById("delete-zone").children[0].children[1], 
        {
            group: "content-shared"
        }
    );

    document.getElementById('file-input')
  .addEventListener('change', queryFile, false);
});

function data_to_html(data) {
    let grid = document.getElementById("date-grid");

    for (let date in data) {
        let new_element = document.createElement("li");
        var fp = "";
        var sp = "";

        for (const p of data[date][0]) {
            fp += '<div class="single-name"><span class="material-symbols-outlined">delete</span><h1 class="in-name">'+ p +'</h1></div>\n';
        }

        for (const p of data[date][1]) {
            sp += '<div class="single-name"><span class="material-symbols-outlined">delete</span><h1 class="in-name">'+ p +'</h1></div>\n';
        }

        var d = new Date(date.split("/").reverse().join('/'));
        if (d.getFullYear() < TODAY.getFullYear()) {
            d.setFullYear(TODAY.getFullYear());
        }
        
        let elements = `<div class="date"><div class="date-heading list-group-item">
    <input class="in-name" type="date" data-date="" data-date-format="DD/MM" value=`+d.toDateInputValue()+`>
        <div>
            <p>Numero di interrogati:</p>
            <input type="number" value="2" min="1" pattern="[0-9]*">
        </div>
        <span class="material-symbols-outlined handle" style="color: white;">
        drag_indicator
        </span>
    </div>
    <h4>First preference</h4>
    <h4>Second preference</h4>
    <ul>
        `+fp+`
        <button onclick="add_preference(this)" class="add-preference">+</button>
    </ul>
    <ul>
        `+sp+`
        <button onclick="add_preference(this)" class="add-preference">+</button>
    </ul>
</div></div>`;

        new_element.innerHTML = elements;

        grid.appendChild(new_element);
    }
}

function loadData() {
    closeNav();
    document.getElementById("choose-file-dialog").style.display = "flex";
}

function queryFile(e) {
    var reader = new FileReader();
    reader.onload = function(e) {
        let content = reader.result;
        let lines = content.split('\n').slice(1);

        var result = {};
        
        for (const line of lines) {
            const [submitTime, name, firstPreference, secondPreference] = line.trim().split(',');

            // Ensure the date exists in the result object and initialize lists if not present
            if (!result[firstPreference]) result[firstPreference] = [[], [], 2];
            if (!result[secondPreference]) result[secondPreference] = [[], [], 2];

            // Add the name to the appropriate lists based on preferences
            result[firstPreference][0].push(name);
            result[secondPreference][1].push(name);
        }

        data_to_html(result);
    }
    reader.readAsText(e.target.files[0]);

    document.getElementById("choose-file-dialog").style.display = "none";
}
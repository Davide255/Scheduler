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

function generate() {
    let grid = document.getElementById("date-grid");

    let data = {};

    for (let date in [...Array(grid.childNodes.length -1).keys()]) {
        let elem = document.getElementsByClassName("date").item(date);
        data[elem.children[0].children[0].value] = [[], [], Number(elem.children[0].children[1].children[1].value)];

        for (let i in [...Array(elem.children[3].children.length - 1).keys()]) {
            data[elem.children[0].children[0].value][0].push(elem.children[3].children[i].children[1].innerHTML.trim().capitalize());
        }

        for (let i in [...Array(elem.children[4].children.length - 1).keys()]) {
            data[elem.children[0].children[0].value][1].push(elem.children[4].children[i].children[1].innerHTML.trim().capitalize());
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

    let add_date = document.getElementById("add-date");
    add_date.style.transition = "all 0.6s ease";
    add_date.style.transform = "translateY(200px)";

    let generate = document.getElementById("generate");
    generate.style.transition = "all 0.6s ease";
    generate.style.transform = "translateY(200px)";

    document.getElementById("delete-zone").style.display = "none";

    let output = document.getElementById("output");
    output.style.transition = "all 0.6s ease";
    output.style.transform = "translateX(0)";

    let main = document.getElementById("main");
    main.style.transition = "all 0.6s ease";
    main.style.transform = "translateX(-100vw)";
}

function delete_zone_confirm() {
    $("#delete-zone div ul").empty();
}

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

        const d_m = date.split("/");

        var d = new Date();
        
        if (d_m.length == 3) {
            d = new Date(Number(d_m[2]), Number(d_m[1])-1, Number(d_m[0])+1);
        }else {
            d = new Date(TODAY.getFullYear(), Number(d_m[1])-1, Number(d_m[0])+1);
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
    closeNav();
    var reader = new FileReader();
    reader.onload = function(event) {
        let content = reader.result;

        if (e.target.files[0].type == "text/csv") {
            let lines = content.replace(/"/g, '').split('\n').slice(1);

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
        } else if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            const nc = new Uint8Array(content);
            
            const workbook = XLSX.read(nc, {type: "array"});

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1}).slice(1);

            var result = {};
            
            for (const line of raw_data) {
                const [submitTime, name, firstPreference, secondPreference] = line;

                // Ensure the date exists in the result object and initialize lists if not present
                if (!result[firstPreference]) result[firstPreference] = [[], [], 2];
                if (!result[secondPreference]) result[secondPreference] = [[], [], 2];

                // Add the name to the appropriate lists based on preferences
                result[firstPreference][0].push(name);
                result[secondPreference][1].push(name);
            }
        }
        const ordered_dates = Object.keys(result).sort(function(a,b) {
            return new Date(a) - new Date(b);
        }).reduce(
            (obj, key) => {
              obj[key] = result[key]; 
              return obj;
            }, 
            {}
          );

        data_to_html(ordered_dates);
    }
    if (e.target.files[0].type == "text/csv") {
        reader.readAsText(e.target.files[0]);
    } else if (e.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        reader.readAsArrayBuffer(e.target.files[0])
    }

}

function back() {

    closeNav();

    let add_date = document.getElementById("add-date");
    add_date.style.transition = "all 0.6s ease";
    add_date.style.transform = "translateY(0)";

    let generate = document.getElementById("generate");
    generate.style.transition = "all 0.6s ease";
    generate.style.transform = "translateY(0)";

    document.getElementById("delete-zone").style.display = "flex";

    let output = document.getElementById("output");
    output.style.transition = "all 0.6s ease";
    output.style.transform = "translateX(100vw)";

    let main = document.getElementById("main");
    main.style.transition = "all 0.6s ease";
    main.style.transform = "translateX(0)";
}

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
            group: "content-shared",
        }
    );

    document.getElementById('file-input')
        .addEventListener('change', queryFile, false);

    document.getElementById("names-list-wrap").addEventListener("click", function(event) {
        if (!document.getElementById('names-list').contains(event.target) && !document.getElementById('date-picker-popup').contains(event.target)) {
            closeExcludes();
            resetHasPopupOpen();
            document.getElementById('date-picker-popup').style.display = 'none';
        } else if (document.getElementById('names-list').contains(event.target) && !document.getElementById('date-picker-popup').contains(event.target)) {
            resetHasPopupOpen();
            document.getElementById('date-picker-popup').style.display = 'none';
        }
    });

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
    
    $(document).on('dblclick', '.single-exclude-date', function() {
        $(this).remove();
    });
});
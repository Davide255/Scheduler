const TODAY = new Date();
var EXCLUDES = {};
var PRIORITY = [];
var DATES = [];

var RESULT = {};

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);

    console.log(this.toDateString())

    return local.toISOString().slice(0,10);
});

String.prototype.capitalize = (function() {
    return this[0].toUpperCase() + this.substring(1);
});

function generate_dates(data) {
    var out = {};
    var selected = [];
    var left = [];

    var priority = PRIORITY;

    for (let day in data) {
        if (data[day][0].length > data[day][2]) {
            out[day] = [];

            if (priority.length > 0) {
                let intersect = data[day][0].filter(value => priority.includes(value));
                if (intersect.length > 0){
                    if (intersect.length <= data[day][2]) {
                        out[day] = out[day].concat(intersect);
                    } else if (intersect > data[day][2]) {
                        out[day] = out[day].concat(priority.sort(() => 0.5 - Math.random()).slice(0, data[day][2]));
                    }

                    data[day][0] = data[day][0].filter(value => !out[day].includes(value));
                }
            }

            data[day][0] = data[day][0].sort(() => 0.5 - Math.random());
            out[day] = out[day].concat(data[day][0].slice(0, data[day][2] - out[day].length));
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
                n_d = n_d.sort(() => 0.5 - Math.random()).slice(0, data[day][2]);
                out[day] = out[day].concat(n_d);
                l = data[day][2];
            } else {
                out[day] = out[day].concat(n_d);
                l = n_d.length;
            }

            data[day][2] -= l;
            selected = selected.concat(n_d);
        }
    }

    left = left.filter((name) => !selected.includes(name)).sort(() => 0.5 - Math.random());

    const left_dates = DATES.filter(date => data[date][2] > 0);

    const intersect = Object.keys(EXCLUDES).filter(name => (EXCLUDES[name].length > 0 && left.includes(name)));

    if (intersect.length > 0) {
        for (const name of intersect) {
            let aviables = left_dates.filter(date => !EXCLUDES[name].includes(date)).sort(() => 0.5 - Math.random());

            out[aviables[0]].push(name);
            data[aviables[0]][2] -= 1;
        }
        left = left.filter(name => !intersect.includes(name));
    }

    for (let day in data) {
        if (data[day][2] > 0) {
            out[day] = out[day].concat(left.splice(0, data[day][2]));
        }

        out[day] = out[day].sort();
    }

    const ordered_dates = Object.keys(out).sort(function(a,b) {
        return new Date(a) - new Date(b);
    }).reduce(
        (obj, key) => { 
          obj[key] = out[key]; 
          return obj;
        }, 
        {}
      );

    RESULT = ordered_dates;

    return ordered_dates;
}

function excludes() {
    let grid = document.getElementById("date-grid");

    for (let date in [...Array(grid.childNodes.length -1).keys()]) {
        let elem = document.getElementsByClassName("date").item(date);

        DATES.push(elem.children[0].children[0].value);

        for (let i in [...Array(elem.children[3].children.length - 1).keys()]) {
            if (!(elem.children[3].children[i].children[1].innerHTML in Object.keys(EXCLUDES))) {
                EXCLUDES[elem.children[3].children[i].children[1].innerHTML.trim().capitalize()] = [];
            }
        }
    }
}
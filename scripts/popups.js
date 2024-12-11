function openExcludes() {
    if (Object.keys(EXCLUDES).length == 0) {
        excludes();

        var elementHTML = "";

        for (const name of Object.keys(EXCLUDES)) {
            elementHTML += 
            `<div><span onclick="markPriority(this)" class="material-symbols-outlined mark-placeholder">exclamation</span>
            <p>`+name.trim().capitalize()+`</p>
            <button class="fqlgEG-l">+</button></div>`;
        }

        document.getElementById("names-list-content").innerHTML = elementHTML;
        generate_popup(DATES);
    }

    document.getElementById("names-list-wrap").style.display = "flex";
}

function markPriority(elem) {
    let name = $(elem).parent().children('p').eq(0).text();

    if (PRIORITY.includes(name)) {
        PRIORITY.splice(PRIORITY.indexOf(name), 1);
        elem.style.color = 'black';
    } else {
        PRIORITY.push(name);
        elem.style.color = 'orange';
    }
}

function closeExcludes() {
    document.getElementById("names-list-wrap").style.display = "none";
}

function resetHasPopupOpen() {
    $('#names-list-content').children().each(function(){
        $(this).data('has-open-popup', 'false');
    });
}

function generate_popup(dates) {
    var excludes_popups = document.getElementById('date-picker-popup');
    for (const date of dates) {
        var k = document.createElement('div');
        k.className = 'date-picker-popup-single-date';
        k.innerHTML = date.split('-').slice(1).reverse().join('/');
        let jk = $(k);
        jk.data('real-date', date);
        excludes_popups.appendChild(jk[0]);
    }
}

$(document).on('click', '.fqlgEG-l', function() {
    let pos = $(this).position();

    let popup = document.getElementById('date-picker-popup');
    popup.style.top = pos.top + $(this).height() + 'px';
    popup.style.left = String(pos.left - DATES.length*$(popup).width()) + 'px';

    let key = $(this).parent().children('p').eq(0).text();

    $('#date-picker-popup').children().each(function(){
        let elem = $(this);

        if (EXCLUDES[key].includes(elem.data('real-date'))) {
            elem.addClass('selected')
        } else {
            elem.removeClass('selected')
        }
    });

    popup.style.display = 'flex';
    
    $(this).parent().data('has-open-popup', 'true');
});

$(document).on('click', '.date-picker-popup-single-date', function() {
    let self_text = $(this).data('real-date');
    
    $('#names-list-content').children().each(function(){
        let elem = $(this);
        if (elem.data('has-open-popup') == 'true') {
            let name = elem.children('p').eq(0).text();
            if (elem.hasClass('selected')) {
                EXCLUDES[name].splice(EXCLUDES[name].indexOf(self_text), 1);
            } else {
                EXCLUDES[name].push(self_text);
            }
        }
    });

    console.log(EXCLUDES);

    $(this).toggleClass('selected');
});

/*$(document).ready(function() {
    $('.popup-btn').click(function(e) {
      $('.popup-wrap').fadeIn(500);
      $('.popup-box').removeClass('transform-out').addClass('transform-in');
    });
  
    $('.popup-close').click(function(e) {
      $('.popup-wrap').fadeOut(500);
      $('.popup-box').removeClass('transform-in').addClass('transform-out');
  
      e.preventDefault();
    });
});*/
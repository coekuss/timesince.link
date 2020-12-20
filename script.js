window.onload = function () {
    if (window.location.search == "") {
        document.getElementById("content").innerHTML = `
                <form method="GET">
                    <p><label for="event">What happened?</label></p>
                    <p><textarea class="userText" id="userEvent" rows="2" name="e" required></textarea></p>
                    <p><label for="timesince">When did it happen?</label></p>
                    <p><input class="userText" id="userDate" type="text" autocomplete="off" pattern="[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}" placeholder="M-D-YYYY" name="d" required></p>
                    <p><input id="generateLinkButton" type="submit" value="Generate Link"></p>
                </form>
                `;
    } else {
        document.getElementById("event").innerHTML = getQueryVariable("e").replace(/\+/g, " ");
        document.getElementById("timesince").innerHTML =
            timeSinceDate(getQueryVariable("u"), getQueryVariable("d"), getQueryVariable("t"));

    }

    document.getElementById("fadeInWrapper").classList.add("fadein");
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function timeSinceDate(timeUnit, userDate, tenth) {
    if (timeUnit == false) {
        timeUnit = "days"
    }

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const oneWeek = oneDay * 7
    const oneYear = oneDay * 365
    const oneMonth = oneYear / 12

    const dateSplit = userDate.split("-")

    // subtract 1 because Date() function has 0-indexed months
    var userMonth = dateSplit[0] - 1
    var userDay = dateSplit[1]
    var userYear = dateSplit[2]
    var firstDate = new Date(userYear, userMonth, userDay);
    var secondDate = Date.now();

    var diffDays = Math.abs((firstDate - secondDate) / oneDay);

    var unitPlural
    switch (timeUnit) {
        case "days":
            if (tenth) {
                return roundTenth(diffDays) + " days"
            } else {
                var num = Math.round(diffDays)
                if (num == 1) {
                    unitPlural = " day"
                } else {
                    unitPlural = " days"
                }
                return num + unitPlural
            }
        case "weeks":
            if (tenth) {
                return roundTenth(diffDays / 7) + " weeks"
            } else {
                var num = Math.round(diffDays / 7)
                if (num == 1) {
                    unitPlural = " week"
                } else {
                    unitPlural = " weeks"
                }
                return num + unitPlural
            }
        case "months":
            if (tenth) {
                return roundTenth(diffDays / 30) + " months"
            } else {
                var num = Math.round(diffDays / 30)
                if (num == 1) {
                    unitPlural = " month"
                } else {
                    unitPlural = " months"
                }
                return num + unitPlural
            }
        case "years":
            if (tenth) {
                return roundTenth(diffDays / 365) + " years"
            } else {
                var num = Math.round(diffDays / 365)
                if (num == 1) {
                    unitPlural = " year"
                } else {
                    unitPlural = " years"
                }
                return num + unitPlural
            }
    }
}
function toggleAbout() {
    if (document.getElementById("about").classList.contains("show")) {
        document.getElementById("about").classList.remove("show")
    } else {
        document.getElementById("about").classList.add("show")
    }
}

function roundTenth(number) {
    var rounded = Math.round(number * 10) / 10
    return rounded.toFixed(1)
}

function cycleUnit(leftOrRight) {
    var unit = getQueryVariable("u");
    var allUnits = ["days", "weeks", "months", "years"];

    var unitIndex;
    allUnits.forEach(function (item, index, arr) {
        if (unit == item) {
            unitIndex = index;
        } else if (unit == false) {
            unitIndex = 0;
        }
    })

    if (leftOrRight == "left") {
        var newUnitIndex;
        if (unitIndex == 0) {
            newUnitIndex = 3;
        } else {
            newUnitIndex = unitIndex - 1;
        }
    } else if (leftOrRight == "right") {
        var newUnitIndex;
        if (unitIndex == 3) {
            newUnitIndex = 0;
        } else {
            newUnitIndex = unitIndex + 1;
        }
    }

    var newUnit = allUnits[newUnitIndex];

    var newQueryString = "?e=" + getQueryVariable("e") +
        "&d=" + getQueryVariable("d") +
        "&u=" + newUnit;

    if (getQueryVariable("t")) {
        newQueryString += "&t=t"
    }

    history.replaceState(null, '', '/' + newQueryString)

    document.getElementById("timesince").innerHTML =
        timeSinceDate(newUnit, getQueryVariable("d"), getQueryVariable("t"));

}

function cycleDecimal() {
    if (!getQueryVariable("t") || !getQueryVariable("t") == "f") {
        var newQueryString = window.location.search + "&t=t";
        history.replaceState(null, '', '/' + newQueryString)

        document.getElementById("timesince").innerHTML =
            timeSinceDate(getQueryVariable("u"), getQueryVariable("d"), "t");

    } else {
        var newQueryString = window.location.search.replace("&t=t", "");
        history.replaceState(null, '', '/' + newQueryString)

        document.getElementById("timesince").innerHTML =
            timeSinceDate(getQueryVariable("u"), getQueryVariable("d"), false);
    }

}
/*CONFIG START:*/
/*Internet-Speed in kbit/s*/
const upSpeed = 10;
const downSpeed = 50;
const testDelay = 4;

/*Your Server's URL and the Port the Backend runs on*/
const baseUrl = "http://www.example.org:8080";
/*CONFIG END*/

var ping = document.getElementById("pingChart");
var down = document.getElementById("downChart");
var up = document.getElementById("upChart");

var dumpArr = [];

var pingChart = new Chart(ping, {
    type: 'line',
    data: {
        datasets: [
            {
                label: 'Ping in ms',
                backgroundColor: 'RGBA(76,187,0,0.5)',
                borderColor: 'RGBA(76,187,0,1)',
                borderWidth: 1
            }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var downChart = new Chart(down, {
    type: 'line',
    data: {
        datasets: [{
            label: 'My Speed in Mbit/s',
            backgroundColor: 'rgba(167,0,0,0.2)',
            borderColor: 'rgba(167,0,0,0.5)',
            borderWidth: 1
        },
        {
            label: downSpeed + ' Mbit/s',
            backgroundColor: 'rgba(255,0,0,0.2)',
            borderColor: 'rgba(255,0,0,1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var upChart = new Chart(up, {
    type: 'line',
    data: {
        datasets: [{
            label: 'My Speed in Mbit/s',
            backgroundColor: 'rgba(12,101,255,0.2)',
            borderColor: 'rgba(12,101,255,1)',
            borderWidth: 1
        },
        {
            label: upSpeed + ' Mbit/s',
            backgroundColor: 'rgba(113,209,255,0.5)',
            borderColor: 'rgba(113,209,255,1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

function addData(chart, label, data, compareData) {
    //Push empty set if there is a time-diff:
    var pastDate = new Date(dumpArr[dumpArr.length - 1]);
    var thisDate = new Date(label);

    var measureDiff = thisDate - pastDate;

    //Just in case the internet is absolute shit, stop adding placeholders after 100 tries
    var max = 100;
    var i = 0;
    if (dumpArr.length > 0) {
        while (measureDiff > (((testDelay * 60) + 30) * 1000)) {
            pastDate = new Date(dumpArr[dumpArr.length - 1]);
            measureDiff = thisDate - pastDate;

            var emptyDate = new Date(pastDate);
            emptyDate.setMinutes(emptyDate.getMinutes() + testDelay);

            dumpArr.push(emptyDate);

            chart.data.labels.push(makeDateTimeString(emptyDate));
            chart.data.datasets[0].data.push(0);
            if (compareData != null) {
                chart.data.datasets[1].data.push(compareData);
            }
            //console.log(thisDate.toLocaleTimeString(), pastDate.toLocaleTimeString(), measureDiff, (((testDelay * 60) + 30) * 1000));
            i++;
            if (i > max) return;
        }
    }
    dumpArr.push(label);

    chart.data.labels.push(makeDateTimeString(label));
    chart.data.datasets[0].data.push(data);
    if (compareData != null) {
        chart.data.datasets[1].data.push(compareData);
    }
    chart.update();
}

function addPingData(val, date) {
    addData(pingChart, date, val, null);
}

function addUpData(val, date) {
    addData(upChart, date, val, upSpeed);
}

function addDownData(val, date) {
    addData(downChart, date, val, downSpeed);
}


function paddZero(toPad, length) {
    toPad += "";
    if (toPad.length >= length) {
        return toPad;
    } else {
        var padAmount = parseInt(length) - parseInt(toPad.length);
        var pad = "";
        for (var i = 0; i < padAmount; i++) {
            pad += "0";
        }
        toPad = pad + toPad;
        return toPad;
    }
}

function makeDateTimeString(measureTime) {
    var dt = new Date(measureTime);
    var dateTimeString = dt.toLocaleString();
    return dateTimeString;
}

function getLastWeek() {
    var d = new Date();
    //var lastWeek = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, d.getHours(), d.getMinutes(), d.getSeconds());
    var lastWeek = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7, d.getHours(), d.getMinutes(), d.getSeconds());

    var now = paddZero(d.getFullYear(), 4) + "-" + paddZero((d.getMonth() + 1), 2) + "-" + paddZero(d.getDate(), 2) + " " + paddZero(d.getHours(), 2) + ":" + paddZero(d.getMinutes(), 2) + ":" + paddZero(d.getSeconds(), 2);
    var lw = paddZero(lastWeek.getFullYear(), 4) + "-" + paddZero((lastWeek.getMonth() + 1), 2) + "-" + paddZero(lastWeek.getDate(), 2) + " " + paddZero(lastWeek.getHours(), 2) + ":" + paddZero(lastWeek.getMinutes(), 2) + ":" + paddZero(lastWeek.getSeconds(), 2);



    $.ajax({
        type: 'GET',
        url: baseUrl + "/getDown",
        headers: {
            "start": lw,
            "end": now
        }
    }).done(function (data) {
        //console.log(data);
        data.forEach(function (element) {
            addDownData(element.dat, element.measureTime);
        });
    });

    $.ajax({
        type: 'GET',
        url: baseUrl + "/getUp",
        headers: {
            "start": lw,
            "end": now
        }
    }).done(function (data) {
        //console.log(data);
        data.forEach(function (element) {
            addUpData(element.dat, element.measureTime);
        });
    });

    $.ajax({
        type: 'GET',
        url: baseUrl + "/getPing",
        headers: {
            "start": lw,
            "end": now
        }
    }).done(function (data) {
        //console.log(data);
        data.forEach(function (element) {
            addPingData(element.dat, element.measureTime);
        });
    });
}
getLastWeek();

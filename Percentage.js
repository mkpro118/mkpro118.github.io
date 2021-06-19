var percentage = NaN
var centered = false

function calculate() {
    var inputs = document.getElementsByTagName('input')
    for (var i = 0; i < inputs.length; i++) {
        if (isNaN(parseInt(inputs[i].value))) {
            return
        }
    }

    // 10th Grade
    var tenth = calculate10()*0.3

    // 11th Grade
    var eleventh = calculate11()*0.3

    // 12th Grade Practicals
    var practical = calculatepr()

    // 12th Grade Unit Test
    var unittest = calculateut()

    // 12th Grade Midterm Exam
    var midterm = calculatemt()

    //12th Grade Pre-Board Exams
    var preboard = calculatepb()

    var twelfth = ((practical + unittest + midterm + preboard) / 4) * 0.4

    var final_marks = (tenth + eleventh + twelfth)
    var marks = document.getElementsByTagName('h2')[0]
    final_marks = Math.round(final_marks * 1000) / 1000
    percentage = final_marks
    marks.innerHTML = "Your Percentage is: " + final_marks + " %"
}

function calculate10() {
    var first10 = parseInt(document.getElementById('first10').value, 10)
    var second10 = parseInt(document.getElementById('second10').value, 10)
    var third10 = parseInt(document.getElementById('third10').value, 10)
    var tenth = (first10 + second10 + third10) / 3
    return tenth
}

function calculate11() {
    var first11 = parseInt(document.getElementById('first11').value, 10)
    var second11 = parseInt(document.getElementById('second11').value, 10)
    var third11 = parseInt(document.getElementById('third11').value, 10)
    var fourth11 = parseInt(document.getElementById('fourth11').value, 10)
    var fifth11 = parseInt(document.getElementById('fifth11').value, 10)
    var eleventh = ((first11 + second11 + third11 + fourth11 + fifth11) / 5.0)
    return eleventh
}

function calculatepr() {
    var firstpr12 = parseInt(document.getElementById('firstpr12').value, 10)
    var secondpr12 = parseInt(document.getElementById('secondpr12').value, 10)
    var thirdpr12 = parseInt(document.getElementById('thirdpr12').value, 10)
    var fourthpr12 = parseInt(document.getElementById('fourthpr12').value, 10)
    var fifthpr12 = parseInt(document.getElementById('fifthpr12').value, 10)
    var practical = ((firstpr12 + secondpr12 + thirdpr12 + fourthpr12 + fifthpr12) / 1.3)
    return practical
}

function calculateut() {
    var firstut12 = parseInt(document.getElementById('firstut12').value, 10)
    var secondut12 = parseInt(document.getElementById('secondut12').value, 10)
    var thirdut12 = parseInt(document.getElementById('thirdut12').value, 10)
    var fourthut12 = parseInt(document.getElementById('fourthut12').value, 10)
    var fifthut12 = parseInt(document.getElementById('fifthut12').value, 10)
    var unittest = ((firstut12 + secondut12 + thirdut12 + fourthut12 + fifthut12) / 1.85)
    return unittest
}

function calculatemt() {
    var firstmt12 = parseInt(document.getElementById('firstmt12').value, 10)
    var secondmt12 = parseInt(document.getElementById('secondmt12').value, 10)
    var thirdmt12 = parseInt(document.getElementById('thirdmt12').value, 10)
    var fourthmt12 = parseInt(document.getElementById('fourthmt12').value, 10)
    var fifthmt12 = parseInt(document.getElementById('fifthmt12').value, 10)
    var midterm = ((firstmt12 + secondmt12 + thirdmt12 + fourthmt12 + fifthmt12) / 3.7)
    return midterm
}

function calculatepb() {
    var firstpb12 = parseInt(document.getElementById('firstpb12').value, 10)
    var secondpb12 = parseInt(document.getElementById('secondpb12').value, 10)
    var thirdpb12 = parseInt(document.getElementById('thirdpb12').value, 10)
    var fourthpb12 = parseInt(document.getElementById('fourthpb12').value, 10)
    var fifthpb12 = parseInt(document.getElementById('fifthpb12').value, 10)
    var preboard = ((firstpb12 + secondpb12 + thirdpb12 + fourthpb12 + fifthpb12) / 3.7)
    return preboard
}

function check10(Id) {
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 100) {
        document.getElementById(Id).value = ''
        alert('10th Grade Marks must be lesser than 100')
    }
    calculate()
    display('tenth')
}

function check11(Id) {
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 100) {
        document.getElementById(Id).value = ''
        alert('11th Grade Marks must be lesser than 100')
    }
    calculate()
    display('eleventh')
}

function check12_70(Id) {
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 70) {
        document.getElementById(Id).value = ''
        alert('There must be 3 subjects graded out of 70 and 2 subjects graded out of 80 in 11th & 12th Grade Exams')
    }
    calculate()
    if (Id.includes('mt')) {
        display('midterm')
    }
    else if (Id.includes('pb')){
        display('preboard')
    }
}

function check12_80(Id) {
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 80) {
        document.getElementById(Id).value = ''
        alert('There must be 3 subjects graded out of 70 and 2 subjects graded out of 80 in 11th & 12th Grade Exams')
    }
    calculate()
    if (Id.includes('mt')) {
        display('midterm')
    }
    else if (Id.includes('pb')){
        display('preboard')
    }
}

function check12ut_35(Id){
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 35) {
        document.getElementById(Id).value = ''
        alert('There must be 3 subjects graded out of 35 and 2 subjects graded out of 40 in 12th Grade Unit Test')
    }
    calculate()
    display('unittest')
}

function check12ut_40(Id){
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 40) {
        document.getElementById(Id).value = ''
        alert('There must be 3 subjects graded out of 35 and 2 subjects graded out of 40 in 12th Grade Unit Test')
    }
    calculate()
    display('unittest')
}

function check12pr20(Id) {
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 20) {
        document.getElementById(Id).value = ''
        alert('There must be 3 subjects graded out of 30 and 2 subjects graded out of 20 in 12th Grade Practical Exam')
    }
    calculate()
    display('practical')
}

function check12pr30(Id) {
    var f = parseInt(document.getElementById(Id).value, 10)
    if (isNaN(f)) {
        if (document.getElementById(Id).value != '') {
            alert('Please enter numbers only')
            document.getElementById(Id).value = ''
            return
        }
    }
    if (f > 30) {
        document.getElementById(Id).value = ''
        alert('There must be 3 subjects graded out of 30 and 2 subjects graded out of 20 in 12th Grade Practical Exam')
    }
    calculate()
    display('practical')
}

function display(what){
    var msg = ''
    var marks = 0
    if (what == 'tenth') {
        msg = 'Your 10<sup>th</sup> Grade Board Exam Percentage is: '
        marks = Math.round(calculate10()*1000) / 1000
        if (!isNaN(marks)) {
          document.getElementsByTagName('h2')[0].style.color = '#EA4A86'
        }
    }
    else if (what == 'eleventh') {
        msg = 'Your 11<sup>th</sup> Grade Final Exam Percentage is: '
        marks = Math.round(calculate11()*1000) / 1000
        if (!isNaN(marks)) {
          document.getElementsByTagName('h2')[0].style.color = '#61892F'
        }
    }
    else if (what == 'practical') {
        msg = 'Your 12<sup>th</sup> Grade Practical Exam Percentage is: '
        marks = Math.round(calculatepr()*1000) / 1000
        if (!isNaN(marks)) {
          document.getElementsByTagName('h2')[0].style.color = '#007CC7'
        }
    }
    else if (what == 'unittest') {
        msg = 'Your 12<sup>th</sup> Grade Unit Test Percentage is: '
        marks = Math.round(calculateut()*1000) / 1000
        if (!isNaN(marks)) {
          document.getElementsByTagName('h2')[0].style.color = '#E27D60'
        }
    }
    else if (what == 'midterm') {
        msg = 'Your 12<sup>th</sup> Grade MidTerm Exam Percentage is: '
        marks = Math.round(calculatemt()*1000) / 1000
        if (!isNaN(marks)) {
          document.getElementsByTagName('h2')[0].style.color = '#557A95'
        }
    }
    else if (what == 'preboard') {
        msg = 'Your 12<sup>th</sup> Grade Pre-Board Exam Percentage is: '
        marks = Math.round(calculatepb()*1000) / 1000
        if (!isNaN(marks)) {
          document.getElementsByTagName('h2')[0].style.color = '#8860D0'
        }
    }
    if (!isNaN(marks)) {
        document.getElementsByTagName('h2')[0].innerHTML = msg + marks + '%'
    }
}


function revert() {
    document.getElementsByTagName('h2')[0].style.color = '#A3A3A3'
    if (!isNaN(percentage)) {
        document.getElementsByTagName('h2')[0].innerHTML = "Your 12<sup>th</sup> Grade Board Exam Percentage is: " + percentage + " %"
    }
    else {
        document.getElementsByTagName('h2')[0].innerHTML ='Your 12<sup>th</sup> Grade Board Exam Percentage is: --.--%'
    }
    document.activeElement.blur();
}

function highlight(Id, status) {
    var label = document.getElementById(Id)
    if (status == 'enter') {
        label.style.opacity = '1.0'
        label.style.color = '#FEFEFE'
    }
    else if (status == 'exit') {
        label.style.opacity = '0.85'
        label.style.color = '#A5A5A5'
    }
}

function center(Id) {
    revert_center()
    centered = true
    var fieldset = document.getElementById(Id)
    console.log(fieldset)
    console.log(fieldset.style.borderColor)
    fieldset.className = fieldset.className +" center"+fieldset.className
    // fieldset.style.background = 'none'
    var fieldsets = document.getElementsByTagName('fieldset')
    for (var i = 0; i < fieldsets.length; i++) {
        if (fieldsets[i].id != Id){
            fieldsets[i].style.opacity = '0.3'
        }
    }
}

function revert_center() {
    if (centered) {
        var fieldsets = document.getElementsByTagName('fieldset')
        for (var i = 0; i < fieldsets.length; i++) {
            fieldsets[i].style.opacity = '1.0'
            fieldsets[i].className = fieldsets[i].className.split(" ")[0]
        }
        centered = false
    }
}

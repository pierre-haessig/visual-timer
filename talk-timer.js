var svgDoc;
var needle;
var needleRotation;

var pie;
var pieSegList;
var running=false;

var startTime;
var duration = 60*15; //s
var dt=0.05 // animaation timeste (s)


function startup() {
    /* body onload event */
    
    // Init all variables
    svgDoc = document.getElementById('embedSVG').getSVGDocument()
    root = svgDoc.rootElement
    needle = svgDoc.getElementById('gNeedle')
    pie =  svgDoc.getElementById('pathTimePie')
    
    duration = readDuration()
    
    // Clear the transformations of the needle
    needle.transform.baseVal.clear()
    needleRotation = root.createSVGTransform()
    needleRotation.setRotate(45,150,150)
    needle.transform.baseVal.appendItem(needleRotation)
    // Get the path segment corresponding to the arc:
    pieSegList = pie.pathSegList
    
    // Reset the appearance of the timer
    initTimerAppearance()
}


function initTimerAppearance() {
    setTimeAngle(0)

    tE = svgDoc.getElementById('textElaps')
    tE.textContent = ':'
    
    tR = svgDoc.getElementById('textRemain')
    tR.textContent = ':'
}


function setTimeAngle(angle) {
    /*Moves the time indicator*/
    //console.log(angle)
    
    // 1) move the needle
    needleRotation.setRotate(angle,150,150)

    // 2) move the pie
    theta = (90 - angle)/180*Math.PI
    r = 150-10
    x = 150+r*Math.cos(theta)
    y = 150-r*Math.sin(theta)
    largeArc = (angle%360)>180
    arc = pie.createSVGPathSegArcAbs(x, y, r, r, 0, largeArc, true);
    pieSegList.replaceItem(arc, 1)
}


function setTimeColor(fraction) {
    /*change the color from blue to orange as the time passes*/
    c = 'rgb('+ Math.floor(fraction*255) +', '+ 187 +', '+ Math.floor((1-fraction)*255) +')'
    //console.log(c)
    pie.style.fill = c
}


function formatTime(t) {
    /* format time t (should be rounded) into "hh:mm:ss" String */
    t = Math.round(t)
    // H,M,S separation:
    s = t % 60
    m = Math.floor(t/60) % 60
    h = Math.floor(t/3600)
    // String formating    
    var str = '';
    if (duration > 3600 ) {
        h = ('0'+h.toString()).slice(-2);
        str += h+':';
    }
    // compensate some bad minute truncatios:
    if (duration == 60*60 & h ==1){
    m += 60
    }
    if (duration > 60 ) {
        m = ('0'+m.toString()).slice(-2);
        str += m+':';
    }
    // compensate some bad minute truncatios:
    if (duration == 60 & m ==1){
    s += 60
    }    
    s = ('0'+s.toString()).slice(-2);
    str += s;
    return str
}


function startTimer() {
    // reset the start time
    startTime = Date.now();
    
    // start counting
    if(!running) {
        running = true;
        
        // launch the animation loop
        animate()
        startBtn = document.getElementById('startBtn')
        startBtn.value = 'restart'
    }
    
    scrollToTimer()
}


function scrollToTimer() {
    emb = document.getElementById('embedSVG')
    window.scrollBy(0, emb.getBoundingClientRect().top)
}


function animate() {
    /*animation loop*/
    if (!running) return
    timeChanged()
    window.setTimeout("animate()",dt*1000)
}


function timeChanged() {
    var date = Date.now();
    var elapTime = (date - startTime)/1000 // in seconds
    // Saturate the values
    if(elapTime > duration) {
        elapTime = duration
    }
    
    var remTime = duration - elapTime
    //console.log(elapTime)
    
    //1) moves the time indicator
    setTimeAngle(elapTime/duration*360)
    //setTimeColor(elapTime/duration)
    
    // 2) Sets the hour:min:sec strings:
    elapTime = Math.floor(elapTime) // round down
    remTime = Math.ceil(remTime) // round up

    tE = svgDoc.getElementById('textElaps')
    tE.textContent = formatTime(elapTime)
    
    tR = svgDoc.getElementById('textRemain')
    tR.textContent = formatTime(remTime)
    
    // stop the counter at the end of the talk:
    if (elapTime+dt > duration) {
        running = false;
        setTimeAngle(359.9)
        startBtn = document.getElementById('startBtn')
        startBtn.value = 'start'
    }
}


function readDuration() {
    /*Read the duration from the duration input fields
    and do some validation*/
    var duration = 0;
    
    form = document.forms.namedItem('timerParams')
    
    m = Math.round(form.duraMin.value)
    s = Math.round(form.duraSec.value)
    
    // update the duration (global variable)
    duration = 60*m + s // in seconds
    if (duration>=5){
        duration=60*m + s;
        return duration
    }
    else {return false}
}


function durationChange() {
    /*update the duration from the duration input fields*/
    var dur = readDuration()
    
    if (!dur){
        alert('duration should be at least 5 seconds!')
        return
    }
    else {
        duration = dur
    }
    
    // Attempt at padding zeros to the "duraSec" input
    // (doesn't work with firefox)
    form = document.forms.namedItem('timerParams')
    s = Math.round(form.duraSec.value)
    s00 = ('0'+s.toString()).slice(-2)
    console.log(s00)
    form.duraSec.value = s00
}


import Qt 4.7

Item {
    id: clock
    width: 300; height: 300

    property int hours
    property int minutes
    property int seconds
    
    property int hoursRem
    property int minutesRem
    property int secondsRem
    
    property real duration
    property real startTime // int creates overflow !!
    property real elapsedFraction

    function startClock() {
        console.log('time start')
        startTime = Date.now();
        // start counting
        counter.running = true;
        
    }
    
    function timeChanged() {
        var date = Date.now();
        //hours = shift ? date.getUTCHours() + Math.floor(clock.shift) : date.getHours()
        //night = ( hours < 7 || hours > 19 )
        //minutes = shift ? date.getUTCMinutes() + ((clock.shift % 1) * 60) : date.getMinutes()
        //var delta = Date() - startTime
        var delta = (date - startTime)/1000 // in seconds
        //console.log(delta)
        elapsedFraction = delta/duration;
        seconds = delta % 60
        minutes = Math.floor(delta/60) % 60
        hours = Math.floor(delta/3600)
        
        var remTime = duration - delta
        secondsRem = remTime % 60
        minutesRem = Math.floor(remTime/60) % 60
        hoursRem = Math.floor(remTime/3600)
        // stop the counter at the end
        if (delta+0.1 > duration) {
            counter.running = false;
            elapsedFraction = 1
        }
    }
    
    function formatTime(h,m,s) {
        // format time h,m,s (3 integers) into "hh:mm:ss" String
        var str = '';
        if (duration > 3600 ) {
            h = ('0'+h.toString()).slice(-2);
            str += h+':';
        }
        if (duration > 60 ) {
            m = ('0'+m.toString()).slice(-2);
            str += m+':';
        }
        s = ('0'+s.toString()).slice(-2);
        str += s;
        return str
    }
    
    Timer { id: counter;
        interval: 100; running: false; repeat: true;
        onTriggered: clock.timeChanged()
    }
    
//    // Animation starter counter
//    Timer {
//        interval: 1000; running: true; repeat: false;
//        onTriggered: clock.startClock()
//    }
    
    Image { id: background; source: "back.png"; }

    Image {
        x: 0; y: 0
        source: "needle.png"
        smooth: true
        transform: Rotation {
            id: secondRotation
            origin.x: 150; origin.y: 150;
            angle: clock.elapsedFraction * 360
            Behavior on angle {
                RotationAnimation{ }
            }
        }
    }
    

    Image {
        source: "front.png";
        MouseArea { // click to restart
            anchors.centerIn: parent;
            width:100; height: 100;
            onClicked: clock.startClock();
        }
    }
    
    
    Text {
        y: 100; anchors.horizontalCenter: parent.horizontalCenter
        color: "#555"
        font.bold: false;
        font.pointSize: duration < 3600 ? 28 : 20 //smaller font when hours are displayed
        text: formatTime(hours, minutes, seconds);
    }
    
    Text {
        y: 150; anchors.horizontalCenter: parent.horizontalCenter
        color: "#AAA"
        font.bold: false;
        font.pointSize: duration < 3600 ? 28 : 20 //smaller font when hours are displayed
        text: formatTime(hoursRem, minutesRem, secondsRem);
    }

}

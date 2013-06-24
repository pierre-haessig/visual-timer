/****************************************************************************
** Timer for talks
****************************************************************************/

import Qt 4.7
import "qml_content"

Rectangle {
    width: 300*4+40; height: 340
    color: "#646464"

    Row {
        anchors.centerIn: parent
        Clock { duration: 10 } // 10 seconds
        Clock { duration: 1*60 } // 1 minute
        Clock { duration: 2*60 }
        Clock { duration: 1.5*60*60 } // 1.5 hour
    }
}

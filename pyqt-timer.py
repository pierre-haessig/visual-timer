#!/usr/bin/python
# -*- coding: UTF-8 -*-
""" a Talk timer

QML based definition + Python binding code to make it a Qt widget

Pierre Haessig — June 2013
"""
import sys

from PyQt4.QtCore import QObject, QUrl
from PyQt4.QtGui import QApplication, QDialog, QSlider
from PyQt4.QtDeclarative import QDeclarativeView
from PyQt4 import QtCore, QtGui

class TalkTimer(QDeclarativeView):
    '''Talk timer widget (QML based)
    
    `setDuration` method is available to set the duration
    '''
    def __init__(self):
        super(TalkTimer, self).__init__()
        
        # Load the QML gauge
        self.setSource(QUrl.fromLocalFile(u'content/Clock.qml'))
        
        self.clock = self.rootObject()
        
        self.setDuration(60)
        #self.startClock()
        #self.setHeightMin(300)
        
    def setDuration(self, duration):
        '''sets the talk duration in minutes'''
        print("setting talk duration to {:d} minutes".format(duration))
        self.clock.setProperty('duration', duration*60)
    
    def startClock(self):
        '''starts the talk timer'''
        self.clock.startClock()

class TalkTimerDlg(QDialog):
    '''a simple control dialog to test the SpeedGauge widget'''
    
    def __init__(self, parent=None):
        super(TalkTimerDlg, self).__init__(parent)
        
        # Instantiate clock
        self.gauge = TalkTimer() 
        
        self.label = QtGui.QLabel()
        self.label.setStyleSheet('font-family:mono;')
        
        # Duration control slider:
        self.slider = QSlider(QtCore.Qt.Horizontal)
        self.slider.setTickPosition(QSlider.TicksBelow)
        self.slider.setTickInterval(5)
        self.slider.setMaximum(30) # 30 minutes
        self.slider.valueChanged.connect(self.gauge.setDuration)
        self.slider.valueChanged.connect(lambda value: self.label.setText('%2d min' % value))
        self.slider.setToolTip("Sets the talk duration")
        
        speedLayout = QtGui.QHBoxLayout()
        speedLayout.addWidget(self.slider)
        speedLayout.addWidget(self.label)
        
        startButton = QtGui.QPushButton('&Start')
        startButton.clicked.connect(self.gauge.startClock)
        startButton.setFocus()
        
        quitButton = QtGui.QPushButton('&Quit')
        quitButton.clicked.connect(self.accept)
        
        layout = QtGui.QVBoxLayout()
        layout.addWidget(self.gauge)
        layout.addLayout(speedLayout)
        layout.addWidget(startButton)
        layout.addWidget(quitButton)
        
        self.setLayout(layout)
        
        # Choose some value for demo
        self.slider.setValue(5) # minutes
        
        self.setWindowTitle('Talk Timer control dialog')
# end of GaugeControlDlg class

### Launch the program ####
app = QApplication(sys.argv)
app.setApplicationName('Talk Timer')


# Instantiate a gauge Dialog
dlg = TalkTimerDlg()
dlg.show()

app.exec_()

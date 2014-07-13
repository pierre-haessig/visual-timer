# Visual Talk Timer
# Pierre Haessig

### Upload webpages to remote server
push:
	rsync -avd talk-timer.html eole:www/timer/index.html
	rsync -avd timer.svg eole:www/timer/
	rsync -avd talk-timer.js eole:www/timer/
	rsync -avd style.css eole:www/timer/

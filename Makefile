# Visual Talk Timer
# Pierre Haessig

FILES = index.html timer.svg talk-timer.js style.css manifest.appcache images

### Upload webpages to remote server
push:
	rsync -avd $(FILES) eole:www/timer/

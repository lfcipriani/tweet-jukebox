# This script must to be executed everytime the raspberry pi restarts
# It will configure the pins with pull up resistors
#
# Install this first:
# git clone git://github.com/quick2wire/quick2wire-gpio-admin.git
# cd quick2wire-gpio-admin
# make
# sudo make install
# sudo adduser $USER gpio
#
gpio-admin export 16 pullup
gpio-admin export 18 pullup
gpio-admin export 20 pullup
gpio-admin export 23 pullup

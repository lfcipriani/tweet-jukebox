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
/usr/local/bin/gpio-admin export 16 pullup
/usr/local/bin/gpio-admin export 18 pullup
/usr/local/bin/gpio-admin export 20 pullup
/usr/local/bin/gpio-admin export 23 pullup

sudo systemctl stop gpsd.socket
sudo systemctl disable gpsd.socket

sudo gpsd /dev/ttySC1 -F /var/run/gpsd.sock

sudo systemctl enable gpsd.socket
sudo systemctl start gpsd.socket
cgps
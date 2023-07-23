# Simple HTTP Wrapper for node-smartcielo remote AC control API (MRCOOL)

by Nicholas Robinson

[![mit license](https://badgen.net/badge/license/MIT/red)](https://github.com/nicholasrobinson/node-smartcielo/blob/master/LICENSE)
[![npm](https://badgen.net/npm/v/node-smartcielo-http)](https://www.npmjs.com/package/node-smartcielo-http)
[![npm](https://badgen.net/npm/dt/node-smartcielo-http)](https://www.npmjs.com/package/node-smartcielo-http)

## NO LONGER MAINTAINED

THIS PROJECT IS DEPRECATED

> This project has been parked in favor of using MQTT and the excellent [SMARTLIGHT SLWF-01pro](https://smartlight.me/smart-home-devices/wifi-devices/wifi-dongle-air-conditioners-midea-idea-electrolux-for-home-assistant) ([alternate Link](https://www.tindie.com/products/smartlightme/wifi-dongle-for-air-conditioners-midea-electrolux/)). This achieves local network control with vastly improved reliability.
> A big thank you to all those that contributed to this software and reported issues.

## Overview

This simple HTTP server exposes APIs to facilitate automation of the MRCOOL DIY line of ACs via [node-smartcielo](https://github.com/nicholasrobinson/node-smartcielo). This could be used to integrate node-smartcielo with hass.io for example as described [here](https://community.home-assistant.io/t/nodejs-on-hass-io/27354).

## Installation

    $ npm install -g node-smartcielo-http
    $ node-smartcielo-http -l 6969 -u <username> -p <password> -i <ip_address>

### Sample Usage (and responses)

    # Get power state
    $ curl http://localhost:6969/power
    {"power":"off"}

    # Send power on
    $ curl http://localhost:6969/power/on
    {"success":true}

    # Get current mode
    $ curl http://localhost:6969/mode
    {"mode":"auto"}

    # Set mode to cool
    $ curl http://localhost:6969/mode/cool
    {"success":true}

    # Get current room temperature
    $ curl http://localhost:6969/roomTemperature
    {"roomTemperature":78}

    # Get current thermostat temperature
    $ curl http://localhost:6969/temperature
    {"temperature":"75"}

    # Set thermostat temperature tp 75
    $ curl http://localhost:6969/temperature/75
    {"success":true}

    # Get current fan speed
    $ curl http://localhost:6969/fanSpeed
    {"fanSpeed":"auto"}

    # Set fan speed to low
    $ curl http://localhost:6969/fanSpeed/low
    {"success":true}

    # Send power off
    $ curl http://localhost:6969/power/off
    {"success":true}

## References
    
* https://www.mrcool.com/
* https://www.smartcielo.com
* https://github.com/nicholasrobinson/node-smartcielo
* https://community.home-assistant.io/t/anyone-integrated-a-mr-cool-ductless-w-wifi/89514/18
* https://community.home-assistant.io/t/nodejs-on-hass-io/27354

## Notes

* This code is intended as an example only.

Please let me know if you find this useful or come up with any novel implementations.

Enjoy!

Nicholas Robinson

me@nicholassavilerobinson.com


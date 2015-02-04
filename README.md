tweet-jukebox
=============

[![Build Status](https://travis-ci.org/lfcipriani/tweet-jukebox.svg?branch=master)](https://travis-ci.org/lfcipriani/tweet-jukebox)

A jukebox powered by tweets on a Raspberry Pi.

                    +---------------------------------+
                    |                                 |
    Tweet           | Raspberry Pi                    |
    (music request) |                                 |
       +            | +-----------+      +----------+ |           \o/ Music powered by:
       |            | | Twitter   | +--> | Mopidy   | |             Spotify
       +--------------> Streaming |      | Server   +------------>  Youtube
         network    | | API       | <--+ |          | |  audio      Soundcloud
                    | +-----------+      +----------+ |
                    |                                 |
                    +---------------------------------+


The device:

![Tweet jukebox picture](docs/tweetjukebox.png)

## Resources needed

* Mopidy music server
* Mopidy Spotify, Youtube, Soundcloud plugins
* Node.js
* Twitter Streaming API
* Network

You can run on any device and OS that supports these softwares. I'm running everything on a Raspberry Pi

## Schematic

![Schematic](docs/schematic.png)

More instructions soon...

Copyright 2015 Luis Cipriani. Under Apache v2 License terms


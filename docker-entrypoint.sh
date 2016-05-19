#!/usr/bin/env bash


bash -c "sudo service collectd start"

bash -c "forever -c 'node --harmony' server.js"


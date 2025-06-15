#!/bin/bash

provengo -c mode=MODEL run REST-Tutorial/BookStoreDemo --before=REST-Tutorial/reset.sh |sed -E 's/(.*) Selected: \[.*description:"([^"]+).*/\1 Selected: [\2]/'

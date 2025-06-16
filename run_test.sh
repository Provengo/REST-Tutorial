#!/bin/bash

# Execute a single test using Provengo:
#  provengo              : The model-based testing tool
#  run                   : Run the test model
#  REST-Tutorial/BookStoreDemo : Location of the test model
#  --before=REST-Tutorial/reset.sh : Run reset.sh before each test to clean database
#  | sed ...            : Clean up output by extracting only the step description
provengo run REST-Tutorial/BookStoreDemo --before=REST-Tutorial/reset.sh | sed -E 's/(.*) Selected: \[.*description:"([^"]+).*/\1 Selected: [\2]/'

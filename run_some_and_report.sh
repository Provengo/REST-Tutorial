#!/bin/bash

# Step 1: Generate a set of test cases
#  sample         : Generate test cases from the model
#  --overwrite    : Replace any existing samples
#  --size 10      : Generate 10 different test cases
provengo sample --overwrite --size 10 REST-Tutorial/BookStoreDemo

# Check if sample generation was successful
if [ $? -eq 0 ]; then

    # Step 2: Execute the generated test cases
    #  run              : Execute test cases
    #  -s samples.json  : Use the previously generated samples
    #  --before=reset.sh: Clean database before each test
    #  | sed ...        : Clean up output formatting
    provengo run -s products/run-source/samples.json --before=REST-Tutorial/reset.sh REST-Tutorial/BookStoreDemo | sed -E 's/(.*) Selected: \[.*description:"([^"]+).*/\1 Selected: [\2]/'

    # Step 3: Generate an HTML report
    #  report        : Create test execution report
    #  --suites :last: Use results from the last test run
    provengo report --suites :last REST-Tutorial/BookStoreDemo/
else
    echo "Sample generation failed. Stopping execution." >&2
    exit 1
fi

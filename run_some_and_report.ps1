# First command - generate samples
provengo sample --overwrite --size 10 BookStoreDemo
if ($LASTEXITCODE -eq 0) {
    # Second command - run tests
    provengo run -s products\run-source\samples.json --before="python reset.py" BookStoreDemo | 
    ForEach-Object {
        if ($_ -match '(.*?) Selected: \[.*?"?description"?:"([^"]+)".*?\]') {
            "$($matches[1]) Selected: [`"$($matches[2])`"]"
        } else {
            $_
        }
    }
    
    # Third command - generate report
    provengo report --suites :last .\BookStoreDemo\
} else {
    Write-Error "Sample generation failed. Stopping execution."
    exit 1
}
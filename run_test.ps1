provengo run BookStoreDemo --before="python reset.py"  | ForEach-Object {
    if ($_ -match '(.*?) Selected: \[.*?"?description"?:"([^"]+)".*?\]') {
        "$($matches[1]) Selected: [`"$($matches[2])`"]"
    } else {
        $_
    }
} 
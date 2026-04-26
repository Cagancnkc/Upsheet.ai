$datasetPath = 'C:/Users/POWERLAB/Desktop/excel-ai/backend/rag/dataset.js'
$newEntriesPath = 'C:/Users/POWERLAB/Desktop/excel-ai/backend/rag/new_entries.js'

$dataset = [System.IO.File]::ReadAllText($datasetPath, [System.Text.Encoding]::UTF8)
$newEntries = [System.IO.File]::ReadAllText($newEntriesPath, [System.Text.Encoding]::UTF8).TrimStart([char]0xFEFF).Trim().TrimEnd(',')

# Remove partial first entry I added manually - find the comment line
$idx = $dataset.IndexOf("  // ")
if ($idx -ge 0) {
    $dataset = $dataset.Substring(0, $idx).TrimEnd()
}

# Remove module.exports if it ended up before ];
$modIdx = $dataset.LastIndexOf("module.exports")
if ($modIdx -ge 0) {
    $dataset = $dataset.Substring(0, $modIdx).TrimEnd()
}

$comment = "  // impossible_excel_dataset + ultra_excel_dataset"
$result = $dataset + "`n`n" + $comment + "`n" + $newEntries + "`n`n];" + "`n`nmodule.exports = { EXCEL_DATASET };`n"

[System.IO.File]::WriteAllText($datasetPath, $result, [System.Text.Encoding]::UTF8)
Write-Host "Done."

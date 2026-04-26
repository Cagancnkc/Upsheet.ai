$imp = Get-Content 'C:/Users/POWERLAB/Downloads/impossible_excel_dataset.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$ultra = Get-Content 'C:/Users/POWERLAB/Downloads/ultra_excel_dataset.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$all = @($imp) + @($ultra)

$lines = @()
foreach ($item in $all) {
    $uc = $item.user_command.Replace("'", "'")
    $logic = $item.logic.Replace("'", "'")
    $cat = $item.category
    $rep = $item.output.reply.Replace("'", "'")

    if ($item.output.formula) {
        $fml = $item.output.formula.Replace('\', '\\').Replace('"', '\"')
        $lines += "  { user_command: '$uc', logic: '$logic', category: '$cat', output: { action: 'formula', formula: `"$fml`", changes: [], reply: '$rep' } },"
    } else {
        $act = $item.output.action
        $lines += "  { user_command: '$uc', logic: '$logic', category: '$cat', output: { action: '$act', changes: [], reply: '$rep' } },"
    }
}

$content = $lines -join "`n"
[System.IO.File]::WriteAllText('C:/Users/POWERLAB/Desktop/excel-ai/backend/rag/new_entries.js', $content, [System.Text.Encoding]::UTF8)
Write-Host "Written $($lines.Count) entries"

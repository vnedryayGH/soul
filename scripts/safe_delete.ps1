Param(
	[Parameter(Mandatory=$true, Position=0, ValueFromRemainingArguments=$true)]
	[string[]]$Paths
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName Microsoft.VisualBasic

foreach($p in $Paths){
	$full = Resolve-Path -LiteralPath $p -ErrorAction SilentlyContinue
	if(-not $full){ continue }
	$fullPath = $full.Path
	[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($fullPath, 'OnlyErrorDialogs', 'SendToRecycleBin')
}

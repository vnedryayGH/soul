Param(
	[Parameter(Mandatory=$true, Position=0, ValueFromRemainingArguments=$true)]
	[string[]]$Dirs
)

$ErrorActionPreference = 'Stop'

$shell = New-Object -ComObject Shell.Application

foreach($d in $Dirs){
	$full = Resolve-Path -LiteralPath $d -ErrorAction SilentlyContinue
	if(-not $full){ continue }
	$item = $shell.Namespace((Split-Path $full.Path -Parent)).ParseName((Split-Path $full.Path -Leaf))
	if($item){
		# 0x00000100 = FOF_NOCONFIRMMKDIR, 0x00000400 = FOF_ALLOWUNDO (Recycle Bin), 0x00000010 = FOF_NOCONFIRMATION
		$FOF = 0x00000410
		$shell.Namespace(10).MoveHere($item, $FOF)
	}
}

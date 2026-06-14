$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$port = 4322

$env:ASTRO_TELEMETRY_DISABLED = "1"
$env:XDG_CONFIG_HOME = Join-Path $root ".wrangler-xdg"

$listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
foreach ($listener in $listeners) {
	$process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
	if ($null -eq $process) {
		continue
	}

	if ($process.ProcessName -eq "node") {
		Write-Host "Stopping old dev server on port $port (PID $($process.Id))..."
		Stop-Process -Id $process.Id -Force
		Start-Sleep -Milliseconds 700
		continue
	}

	throw "Port $port is being used by $($process.ProcessName) (PID $($process.Id)). Close that app and run npm run dev again."
}

$astro = Join-Path $root "node_modules\.bin\astro.cmd"
if (!(Test-Path $astro)) {
	throw "Astro binary was not found. Run npm install first."
}

& $astro dev --host 127.0.0.1 --port $port

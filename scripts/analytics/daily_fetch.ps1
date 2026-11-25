# Daily read-only YouTube fetch for Uq.cerita. Dedup in youtube_api.py makes reruns safe.
# Log: 05-DATA/analytics/daily_fetch.log
$ErrorActionPreference = "Continue"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repo
$log = Join-Path $repo "05-DATA\analytics\daily_fetch.log"
$jobs = @(
  @{ cid = "2026-11-002"; vid = "iOk68iitJu4" },
  @{ cid = "2026-11-003"; vid = "N5rrQ6IRqQk" }
)
foreach ($j in $jobs) {
  "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] fetch $($j.cid)" | Add-Content $log -Encoding utf8
  $env:PYTHONIOENCODING = "utf-8"
  python scripts/analytics/youtube_api.py fetch --content-id $j.cid --video-id $j.vid *>&1 | Add-Content $log -Encoding utf8
  "exit=$LASTEXITCODE" | Add-Content $log -Encoding utf8
}

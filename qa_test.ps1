$ErrorActionPreference = 'Stop'
$baseUrl = "https://civicpulse-d6a0.onrender.com/api"
$results = @()

function Test-Api {
    param ($Name, $Method, $Endpoint, $Headers, $Body, $ExpectedStatus, $IsMultipart)
    
    $uri = "$baseUrl$Endpoint"
    $status = 0
    $content = ""
    
    try {
        if ($IsMultipart) {
            # Use curl for multipart
            $headerStr = ""
            foreach ($key in $Headers.Keys) {
                $headerStr += "-H `"$key" + ":" + " $($Headers[$key])`" "
            }
            # Execute curl
            $cmd = "curl.exe -s -w `"\n%{http_code}`" -X $Method $headerStr -F `"title=Test Pothole`" -F `"category=ROAD`" -F `"locationAddress=123 Main St`" -F `"description=Bad pothole`" `"$uri`""
            $out = Invoke-Expression $cmd
            $status = [int]($out[-1])
            $content = ($out[0..($out.Length-2)] -join "`n")
        } else {
            $params = @{ Uri = $uri; Method = $Method; Headers = $Headers }
            if ($Body) {
                $params.Body = $Body
                if (-not $Headers.ContainsKey('Content-Type')) {
                    $params.Headers['Content-Type'] = 'application/json'
                }
            }
            $response = Invoke-WebRequest @params -UseBasicParsing
            $status = $response.StatusCode
            $content = $response.Content
        }
    } catch {
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
        } else {
            $status = 0
            $content = $_.ToString()
        }
    }

    $pass = $ExpectedStatus -contains $status
    $res = @{ Name = $Name; Status = if($pass){"PASS"}else{"FAIL"}; Code = $status; Content = $content }
    $global:results += $res
    if ($pass) { Write-Host "PASS: $Name ($status)" -ForegroundColor Green }
    else { Write-Host "FAIL: $Name ($status) - $content" -ForegroundColor Red }
    return $res
}

# 1. POST /api/auth/register
$registerBody = @{ fullName="Test Citizen"; email="testcitizen@gmail.com"; password="Test@1234"; phone="1234567890"; role="CITIZEN" } | ConvertTo-Json
$t1 = Test-Api "Register Citizen" "POST" "/auth/register" @{} $registerBody @(200, 201) $false

# 2. POST /api/auth/login (citizen)
$loginCitBody = @{ email="testcitizen@gmail.com"; password="Test@1234" } | ConvertTo-Json
$t2 = Test-Api "Login Citizen" "POST" "/auth/login" @{} $loginCitBody @(200) $false
$citToken = if($t2.Status -eq 'PASS'){ ($t2.Content | ConvertFrom-Json).token } else { "" }

# 3. POST /api/auth/login (admin)
$loginAdmBody = @{ email="admin@civicpulse.com"; password="Admin@123" } | ConvertTo-Json
$t3 = Test-Api "Login Admin" "POST" "/auth/login" @{} $loginAdmBody @(200) $false
$admToken = if($t3.Status -eq 'PASS'){ ($t3.Content | ConvertFrom-Json).token } else { "" }

$citHeaders = @{}; if($citToken){ $citHeaders['Authorization'] = "Bearer $citToken" }
$admHeaders = @{}; if($admToken){ $admHeaders['Authorization'] = "Bearer $admToken" }
$emptyHeaders = @{}

# 4-7. Analytics
$null = Test-Api "Analytics Summary" "GET" "/analytics/summary" $emptyHeaders "" @(200) $false
$null = Test-Api "Analytics By Category" "GET" "/analytics/by-category" $emptyHeaders "" @(200) $false
$null = Test-Api "Analytics By Status" "GET" "/analytics/by-status" $emptyHeaders "" @(200) $false
$null = Test-Api "Analytics Trends" "GET" "/analytics/trends" $emptyHeaders "" @(200) $false

# 8. POST /api/issues
$t8 = Test-Api "Create Issue" "POST" "/issues" $citHeaders "" @(200, 201) $true
$issueId = ""
if ($t8.Status -eq 'PASS') {
    try { $issueId = ($t8.Content | ConvertFrom-Json).id } catch {}
}
if (!$issueId) { $issueId = 1 } # fallback

# 9. GET /api/issues/my
$null = Test-Api "Get My Issues" "GET" "/issues/my" $citHeaders "" @(200) $false

# 10. GET /api/issues (Public)
$null = Test-Api "Get Public Issues" "GET" "/issues" $emptyHeaders "" @(200) $false

# 11. PUT /api/admin/issues/{id}/status
$statusBody = @{ status="IN_PROGRESS"; comment="Being reviewed" } | ConvertTo-Json
$null = Test-Api "Update Issue Status" "PUT" "/admin/issues/$issueId/status" $admHeaders $statusBody @(200) $false

# 12. PUT /api/admin/issues/{id}/priority
$prioBody = @{ priority="HIGH" } | ConvertTo-Json
$null = Test-Api "Update Issue Priority" "PUT" "/admin/issues/$issueId/priority" $admHeaders $prioBody @(200) $false

# 13. GET /api/notifications
$null = Test-Api "Get Notifications" "GET" "/notifications" $citHeaders "" @(200) $false

# 14. GET /api/admin/issues
$null = Test-Api "Get Admin Issues" "GET" "/admin/issues" $admHeaders "" @(200) $false

# 15. GET /api/issues/99999
$null = Test-Api "Get Invalid Issue" "GET" "/issues/99999" $emptyHeaders "" @(404) $false

# 16. GET /api/admin/issues (as Citizen)
$null = Test-Api "Admin Route as Citizen" "GET" "/admin/issues" $citHeaders "" @(401, 403) $false

$results | ConvertTo-Json -Depth 10 > d:\civic\qa_results.json
Write-Host "Tests Completed."

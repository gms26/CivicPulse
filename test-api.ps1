$body = @{
    fullName = 'Test Admin'
    email = 'testadmin@civicpulse.com'
    password = 'Admin@123'
    phone = '9999999999'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'https://civicpulse-d6a0.onrender.com/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body
    Write-Host "Success!"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error occurred:"
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host $errorBody
    } else {
        Write-Host $_.Exception.Message
    }
}

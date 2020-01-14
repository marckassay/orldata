function Find-RequiredPrograms {
  [CmdletBinding(
    PositionalBinding = $true
  )]
  Param(
    [Parameter(
      Mandatory = $true,
      Position = 0
    )]
    [string[]]$Programs
  )

  $Programs | ForEach-Object {
    Write-Verbose "Checking for '$_' command" -Verbose
    $DoesAZCommandExist = Get-Command $_ | Measure-Object
    if ($DoesAZCommandExist.Count -eq 0) {
      Write-Error "The program, '$_' must be installed for this PowerShell module to run. This can be installed afterwards if needed." -ErrorAction Continue
    }
    else {
      Write-Verbose "Checked '$_' command" -Verbose
    }
  }
}

Find-RequiredPrograms @('az', 'docker')

Write-Warning "HARDCODING 'XAZ' PATH TO IMPORT-MODULE. REMOVE AFTER TESTING!"
Import-Module 'E:\marckassay\XAz\XAz.psd1' 

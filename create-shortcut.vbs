Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.ExpandEnvironmentStrings("%USERPROFILE%\Desktop\UpNexxt Repository Tool.lnk")
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = oWS.CurrentDirectory & "\start-prompt-tool.bat"
oLink.IconLocation = "%SystemRoot%\System32\SHELL32.dll,70"
oLink.WorkingDirectory = oWS.CurrentDirectory
oLink.Description = "Start de UpNexxt Repository Tool"
oLink.Save 
# Debugging & Troubleshooting Guide

This guide contains useful commands and techniques for debugging the Smart Car Parking System.

## Capturing Application Logs

### Command
```powershell
mvn spring-boot:run > start_output.txt 2>&1
```

### Purpose
This command runs the Spring Boot application and captures **all output** (both standard output and errors) to a file named `start_output.txt`.

### Breakdown
- `mvn spring-boot:run` - Starts the Spring Boot application
- `>` - Redirects standard output to a file
- `start_output.txt` - The file where logs will be saved
- `2>&1` - Redirects error messages (stderr) to the same file as standard output

### When to Use
- ✅ Application crashes on startup and errors scroll too fast to read
- ✅ Need to search for specific error patterns across thousands of log lines
- ✅ Want to keep a record of startup issues for later analysis
- ✅ Debugging intermittent issues that require multiple runs to reproduce

### How to Debug Using This File

#### 1. Search for Errors
```powershell
Get-Content start_output.txt | Select-String -Pattern "ERROR", "Exception", "FAILURE"
```

#### 2. Find Specific Patterns
```powershell
# Find database connection issues
Get-Content start_output.txt | Select-String -Pattern "database", "connection"

# Find bean initialization errors
Get-Content start_output.txt | Select-String -Pattern "bean", "autowired"

# Find compilation errors
Get-Content start_output.txt | Select-String -Pattern "compilation", "cannot find symbol"
```

#### 3. View Last N Lines (Most Recent Errors)
```powershell
Get-Content start_output.txt | Select-Object -Last 50
```

#### 4. View with Context (Lines Before/After Match)
```powershell
Get-Content start_output.txt | Select-String -Pattern "ERROR" -Context 5,10
```
This shows 5 lines before and 10 lines after each ERROR.

## Other Useful Debugging Commands

### Capture Test Output
```powershell
mvn test > test_output.txt 2>&1
```

### Capture Build Output
```powershell
mvn clean install > build_output.txt 2>&1
```

### Run with Debug Logging
```powershell
mvn spring-boot:run -Dlogging.level.root=DEBUG > debug_output.txt 2>&1
```

## Cleanup
After debugging, you can safely delete these log files:
```powershell
Remove-Item *.txt -Exclude "projectDocumentationAndTaskSheet.txt"
```

## Pro Tips
1. **Use versioned filenames** if running multiple times: `start_output_v1.txt`, `start_output_v2.txt`
2. **Check file size** before opening large logs: `Get-Item start_output.txt | Select-Object Length`
3. **Use grep-style search** for faster analysis instead of opening the entire file
4. **Stop the app** before deleting its log file (file will be locked while app is running)

## Common Error Patterns to Search For

| Error Type | Search Pattern |
|------------|----------------|
| Database Issues | `SQLException`, `connection refused`, `database` |
| Bean/Dependency Issues | `NoSuchBeanDefinitionException`, `autowired`, `required a bean` |
| Port Conflicts | `Address already in use`, `port 8080` |
| Compilation Errors | `compilation failure`, `cannot find symbol` |
| Lombok Issues | `lombok`, `ExceptionInInitializerError` |
| Test Failures | `Tests run:`, `Failures:`, `Errors:` |

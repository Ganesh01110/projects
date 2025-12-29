# Maven Build System Guide

This guide explains Maven's build system and the `target/` folder for the Smart Car Parking System.

## Understanding the `target/` Folder

The `target/` directory is **Maven's build output folder** - it contains all compiled and generated files.

### Folder Structure
```
target/
├── classes/                    # Compiled .class files from src/main/java
│   ├── com/parking/system/    # Your compiled Java classes
│   └── application.yml        # Copied resources from src/main/resources
├── test-classes/              # Compiled test files from src/test/java
├── surefire-reports/          # Test execution reports (XML & TXT)
├── generated-sources/         # Auto-generated code (if any)
└── system-0.0.1-SNAPSHOT.jar  # Final packaged application (created by mvn package)
```

### What Creates the `target/` Folder?

| Maven Command | What It Creates |
|---------------|-----------------|
| `mvn compile` | `target/classes/` with compiled Java files |
| `mvn test` | `target/test-classes/` and `target/surefire-reports/` |
| `mvn package` | Everything above + the `.jar` file |
| `mvn spring-boot:run` | Uses `target/classes/` to run the application |

### Key Points

#### ✅ Auto-Generated
Maven creates this folder automatically during build/test/package operations. You never need to create it manually.

#### ✅ Safe to Delete
You can delete the entire `target/` folder anytime:
```powershell
mvn clean  # Deletes the entire target/ folder
```
Maven will recreate it on the next build.

#### ✅ Should Be in `.gitignore`
Never commit the `target/` folder to version control. It's build output, not source code.

#### ⚠️ Currently Active When App Runs
When your Spring Boot application is running (`mvn spring-boot:run`), Maven is actively using files from `target/classes/`. Don't delete it while the app is running!

## Common Maven Commands

### Build Commands
```powershell
# Compile source code only
mvn compile

# Run all tests
mvn test

# Package into JAR file
mvn package

# Clean + Package (recommended)
mvn clean package
```

### Run Commands
```powershell
# Run Spring Boot application
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Cleanup Commands
```powershell
# Delete target/ folder
mvn clean

# Clean + compile
mvn clean compile

# Clean + run tests
mvn clean test
```

## Troubleshooting

### "Class not found" errors?
Run `mvn clean compile` to rebuild everything.

### Tests failing after code changes?
Run `mvn clean test` to ensure test classes are recompiled.

### Old JAR file being used?
Run `mvn clean package` to rebuild the JAR from scratch.

### Want to see what's in the JAR?
```powershell
jar -tf target/system-0.0.1-SNAPSHOT.jar
```

## Best Practices

1. **Always clean before packaging**: `mvn clean package` ensures no stale files
2. **Don't edit files in `target/`**: Edit source files in `src/`, not compiled files
3. **Ignore in Git**: Add `target/` to `.gitignore`
4. **Use IDE build**: Most IDEs (IntelliJ, Eclipse) manage `target/` automatically

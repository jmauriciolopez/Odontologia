# Backup script for OdontoSaaS PostgreSQL database
# Running on Windows with Docker Compose

$BACKUP_DIR = "backups"
$CONTAINER_NAME = "odontologia-db-1" # Adjust if your container name is different
$DB_NAME = "odontologia"
$DB_USER = "postgres"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR\backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
    Write-Host "Created backup directory: $BACKUP_DIR"
}

Write-Host "Starting backup for database '$DB_NAME'..."

# Execute pg_dump inside the container and redirect output to a local file
# Note: Using --clean to include DROP commands in the backup
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup completed successfully: $BACKUP_FILE"
    
    # Optional: Compress the backup
    Compress-Archive -Path $BACKUP_FILE -DestinationPath "$BACKUP_FILE.zip"
    Remove-Item $BACKUP_FILE
    Write-Host "Backup compressed to: $BACKUP_FILE.zip"
    
    # Rotation: Keep last 7 backups
    $backups = Get-ChildItem "$BACKUP_DIR\*.zip" | Sort-Object LastWriteTime -Descending
    if ($backups.Count -gt 7) {
        $toDelete = $backups | Select-Object -Skip 7
        foreach ($file in $toDelete) {
            Remove-Item $file.FullName
            Write-Host "Deleted old backup: $($file.Name)"
        }
    }
} else {
    Write-Error "Backup failed with exit code $LASTEXITCODE"
}

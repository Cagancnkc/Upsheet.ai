@echo off
cd /d "c:\Users\POWERLAB\Desktop\excel-ai\backend"
node scripts/generate-dataset.js >> logs\dataset-$(date).log 2>&1
if %errorlevel% == 0 (
    cd /d "c:\Users\POWERLAB\Desktop\excel-ai"
    git add backend/rag/dataset.js
    git commit -m "feat: günlük 100 yeni dataset örneği [%date:~10,4%-%date:~7,2%-%date:~4,2%]"
    git push
)

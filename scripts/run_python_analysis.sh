#!/bin/bash

echo "=== Python文件分析脚本 ==="

if [ -f "scripts/cleanup_python.py" ]; then
    echo "运行Python文件分析..."
    python3 scripts/cleanup_python.py
    
    echo -e "\n生成的清理脚本已保存为: cleanup_python_files.sh"
    echo "请在确认Node.js版本功能正常后，手动执行清理脚本"
else
    echo "❌ 分析脚本不存在: scripts/cleanup_python.py"
    exit 1
fi

echo -e "\n=== 分析完成 ==="

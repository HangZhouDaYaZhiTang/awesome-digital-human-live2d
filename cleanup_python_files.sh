#!/bin/bash

echo "=== Python文件清理脚本 ==="
echo "基于分析结果，将删除75个Python文件，保留2个参考文件"

KEEP_FILES=(
    "./main.py"
    "./digitalHuman/protocol.py"
)

echo "保留的参考文件:"
for file in "${KEEP_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (不存在)"
    fi
done

echo -e "\n开始删除Python文件..."

find ./digitalHuman -name "*.py" ! -name "protocol.py" -type f -delete

if [ -d "./test" ]; then
    find ./test -name "*.py" -type f -delete
    echo "  ✓ 删除test目录下的Python文件"
fi

if [ -f "./requirements.txt" ]; then
    rm "./requirements.txt"
    echo "  ✓ 删除requirements.txt"
fi

find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null

find . -name "*.pyc" -type f -delete 2>/dev/null

echo -e "\n=== 清理完成 ==="

remaining_py_files=$(find . -name "*.py" | wc -l)
echo "剩余Python文件数量: $remaining_py_files"

echo -e "\n剩余的Python文件:"
find . -name "*.py" | sort

echo -e "\n清理验证:"
if [ $remaining_py_files -eq 2 ]; then
    echo "✅ 清理成功！只保留了2个参考文件"
else
    echo "⚠️  清理结果异常，预期保留2个文件，实际保留$remaining_py_files个"
fi

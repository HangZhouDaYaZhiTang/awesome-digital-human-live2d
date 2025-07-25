#!/usr/bin/env python3
"""
识别可以安全删除的Python文件
"""

import os
import sys

KEEP_FILES = [
    'main.py',
    'requirements.txt',
    'digitalHuman/protocol.py',
]

CONVERTED_DIRECTORIES = [
    'digitalHuman/agent/',
    'digitalHuman/server/',
    'digitalHuman/engine/',
    'digitalHuman/bin/',
    'digitalHuman/utils/',
    'digitalHuman/core/',
]

def analyze_python_files():
    """分析Python文件并生成清理建议"""
    python_files = []
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                python_files.append(filepath)
    
    print(f"发现 {len(python_files)} 个Python文件")
    
    keep = []
    can_remove = []
    
    for filepath in python_files:
        should_keep = False
        
        for keep_pattern in KEEP_FILES:
            if keep_pattern in filepath:
                should_keep = True
                break
        
        if should_keep:
            keep.append(filepath)
        else:
            can_remove.append(filepath)
    
    print(f"\n建议保留的文件 ({len(keep)} 个):")
    for f in sorted(keep):
        print(f"  {f}")
    
    print(f"\n可以删除的文件 ({len(can_remove)} 个):")
    for f in sorted(can_remove):
        print(f"  {f}")
    
    print(f"\n已转换的目录:")
    for directory in CONVERTED_DIRECTORIES:
        if os.path.exists(directory):
            file_count = sum(1 for root, dirs, files in os.walk(directory) 
                           for file in files if file.endswith('.py'))
            print(f"  {directory} - {file_count} 个Python文件")
    
    print(f"\n迁移状态总结:")
    print(f"  - 总Python文件: {len(python_files)}")
    print(f"  - 建议保留: {len(keep)}")
    print(f"  - 可以删除: {len(can_remove)}")
    print(f"  - 删除比例: {len(can_remove)/len(python_files)*100:.1f}%")
    
    return keep, can_remove

def generate_cleanup_script(can_remove):
    """生成清理脚本"""
    script_content = """#!/bin/bash

echo "开始清理已转换的Python文件..."

"""
    
    for filepath in can_remove:
        script_content += f'echo "删除: {filepath}"\n'
        script_content += f'# rm "{filepath}"\n\n'
    
    script_content += """
echo "清理完成！"
echo "注意: 文件删除命令已注释，请手动取消注释后执行"
"""
    
    with open('cleanup_python_files.sh', 'w') as f:
        f.write(script_content)
    
    print(f"\n已生成清理脚本: cleanup_python_files.sh")
    print("运行前请确保Node.js版本功能正常，然后取消注释删除命令")

if __name__ == '__main__':
    keep, can_remove = analyze_python_files()
    generate_cleanup_script(can_remove)

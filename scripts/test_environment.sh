#!/bin/bash

echo "=== 数字人系统环境测试脚本 ==="

echo "1. 检查Node.js环境..."
if command -v node &> /dev/null; then
    echo "✅ Node.js版本: $(node --version)"
else
    echo "❌ Node.js未安装"
    exit 1
fi

if command -v npm &> /dev/null; then
    echo "✅ npm版本: $(npm --version)"
else
    echo "❌ npm未安装"
    exit 1
fi

echo -e "\n2. 检查MongoDB连接..."
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB Shell已安装"
    if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
        echo "✅ MongoDB服务正在运行"
    else
        echo "❌ MongoDB服务未运行，请启动MongoDB"
    fi
else
    echo "⚠️  MongoDB Shell未安装，尝试使用mongo命令"
    if command -v mongo &> /dev/null; then
        if mongo --eval "db.runCommand('ping')" --quiet &> /dev/null; then
            echo "✅ MongoDB服务正在运行"
        else
            echo "❌ MongoDB服务未运行，请启动MongoDB"
        fi
    else
        echo "❌ MongoDB未安装"
    fi
fi

echo -e "\n3. 检查环境配置文件..."
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env 存在"
else
    echo "❌ backend/.env 不存在，请复制 backend/.env.example"
fi

if [ -f "backend/.env.example" ]; then
    echo "✅ backend/.env.example 存在"
else
    echo "❌ backend/.env.example 不存在"
fi

if [ -f "web/.env.local" ]; then
    echo "✅ web/.env.local 存在"
else
    echo "❌ web/.env.local 不存在"
fi

echo -e "\n4. 检查依赖安装..."
if [ -d "backend/node_modules" ]; then
    echo "✅ 后端依赖已安装"
else
    echo "❌ 后端依赖未安装，请运行: cd backend && npm install"
fi

if [ -d "web/node_modules" ]; then
    echo "✅ 前端依赖已安装"
else
    echo "❌ 前端依赖未安装，请运行: cd web && npm install"
fi

echo -e "\n5. 测试后端配置..."
cd backend
if [ -f "package.json" ]; then
    echo "✅ 后端package.json存在"
    if node -e "require('./src/index.js')" 2>/dev/null; then
        echo "✅ 后端代码语法正确"
    else
        echo "❌ 后端代码存在语法错误"
    fi
else
    echo "❌ 后端package.json不存在"
fi
cd ..

echo -e "\n6. 测试前端配置..."
cd web
if [ -f "package.json" ]; then
    echo "✅ 前端package.json存在"
    if [ -f "next.config.js" ]; then
        echo "✅ Next.js配置文件存在"
    else
        echo "❌ Next.js配置文件不存在"
    fi
else
    echo "❌ 前端package.json不存在"
fi
cd ..

echo -e "\n7. 检查API密钥配置..."
if [ -f "backend/.env" ]; then
    if grep -q "DASHSCOPE_API_KEY=sk-" backend/.env; then
        echo "✅ 阿里云百炼API密钥已配置"
    else
        echo "❌ 阿里云百炼API密钥未配置或格式错误"
    fi
    
    if grep -q "JWT_SECRET=" backend/.env; then
        echo "✅ JWT密钥已配置"
    else
        echo "❌ JWT密钥未配置"
    fi
    
    if grep -q "MONGODB_URI=" backend/.env; then
        echo "✅ MongoDB连接字符串已配置"
    else
        echo "❌ MongoDB连接字符串未配置"
    fi
fi

echo -e "\n=== 测试完成 ==="
echo "如果所有检查都通过，可以尝试启动服务："
echo "1. 启动后端: cd backend && npm start"
echo "2. 启动前端: cd web && npm run dev"
echo "3. 访问: http://localhost:3000"

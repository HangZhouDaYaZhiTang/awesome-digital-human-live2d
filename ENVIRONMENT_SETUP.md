# 环境配置指南

## 后端环境配置

### MongoDB 配置
1. 安装 MongoDB:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# macOS
brew install mongodb/brew/mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. 配置环境变量文件 `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/digital-human
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DASHSCOPE_API_KEY=sk-c7f36e6ce4ce4709962d1804ca0569c8
DASHSCOPE_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
PORT=8880
FRONTEND_URL=http://localhost:3000
```

### 前端环境配置
配置 `web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8880/api
NEXT_PUBLIC_WS_URL=http://localhost:8880
```

## 启动服务

### 后端启动
```bash
cd backend
npm install
npm start
```

### 前端启动
```bash
cd web
npm install
npm run dev
```

## 环境变量说明

### 后端环境变量
- `MONGODB_URI`: MongoDB数据库连接字符串
- `JWT_SECRET`: JWT令牌签名密钥，生产环境请使用强密码
- `DASHSCOPE_API_KEY`: 阿里云百炼平台API密钥
- `DASHSCOPE_API_URL`: 阿里云百炼平台API地址
- `PORT`: 后端服务端口号
- `FRONTEND_URL`: 前端应用地址，用于CORS配置

### 前端环境变量
- `NEXT_PUBLIC_API_URL`: 后端API地址
- `NEXT_PUBLIC_WS_URL`: WebSocket服务地址

## 数据库初始化

MongoDB会自动创建数据库和集合，无需手动初始化。首次运行时会自动创建：
- `users` 集合：存储用户信息
- `memories` 集合：存储对话记忆
- `conversations` 集合：存储对话会话

## 故障排除

### MongoDB连接失败
1. 确认MongoDB服务正在运行
2. 检查连接字符串是否正确
3. 确认防火墙设置允许27017端口

### API密钥错误
1. 确认阿里云百炼平台API密钥有效
2. 检查API密钥权限设置
3. 验证API地址是否正确

### 端口冲突
1. 修改backend/.env中的PORT设置
2. 同时更新web/.env.local中的API_URL
3. 重启服务

#!/bin/bash

echo "=== API兼容性测试脚本 ==="

BASE_URL="http://localhost:8880/api"

echo "1. 检查后端服务状态..."
if curl -s "$BASE_URL/common/v0/heartbeat" > /dev/null; then
    echo "✅ 后端服务正在运行"
else
    echo "❌ 后端服务未运行，请先启动: cd backend && npm start"
    exit 1
fi

echo -e "\n2. 测试ASR引擎API..."
echo "获取ASR引擎列表:"
curl -s "$BASE_URL/asr/v0/engine" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取默认ASR引擎:"
curl -s "$BASE_URL/asr/v0/engine/default" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取ASR引擎参数:"
curl -s "$BASE_URL/asr/v0/engine/bailian" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n3. 测试TTS引擎API..."
echo "获取TTS引擎列表:"
curl -s "$BASE_URL/tts/v0/engine" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取默认TTS引擎:"
curl -s "$BASE_URL/tts/v0/engine/default" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取TTS引擎参数:"
curl -s "$BASE_URL/tts/v0/engine/bailian" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n4. 测试Agent引擎API..."
echo "获取Agent引擎列表:"
curl -s "$BASE_URL/agent/v0/engine" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取默认Agent引擎:"
curl -s "$BASE_URL/agent/v0/engine/default" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取Agent引擎参数:"
curl -s "$BASE_URL/agent/v0/engine/multi-agent" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n5. 测试LLM引擎API..."
echo "获取LLM引擎列表:"
curl -s "$BASE_URL/llm/v0/engine" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取默认LLM引擎:"
curl -s "$BASE_URL/llm/v0/engine/default" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n获取LLM引擎参数:"
curl -s "$BASE_URL/llm/v0/engine/bailian" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n6. 测试心跳API..."
echo "心跳检测:"
curl -s "$BASE_URL/common/v0/heartbeat" | jq '.' 2>/dev/null || echo "JSON解析失败"

echo -e "\n=== API兼容性测试完成 ==="
echo "所有API端点已测试，请检查上述输出确认功能正常"

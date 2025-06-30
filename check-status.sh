#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"

echo "🔍 检查电池回收系统状态..."
echo ""

# 检查前端页面
echo "📖 检查前端页面..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080/battery/)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ 前端页面正常 (HTTP $FRONTEND_STATUS)"
else
    echo "❌ 前端页面异常 (HTTP $FRONTEND_STATUS)"
fi

# 检查API健康状态
echo "🔗 检查API接口..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080/battery/api/categories)
if [ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "401" ]; then
    echo "✅ API接口正常 (HTTP $API_STATUS)"
else
    echo "❌ API接口异常 (HTTP $API_STATUS)"
fi

# 检查nginx状态
echo "🔧 检查nginx状态..."
NGINX_STATUS=$(ssh $SERVER_USER@$SERVER_IP "systemctl is-active nginx")
if [ "$NGINX_STATUS" = "active" ]; then
    echo "✅ nginx服务正常"
else
    echo "❌ nginx服务异常: $NGINX_STATUS"
fi

# 检查后端服务
echo "⚙️  检查后端服务..."
BACKEND_STATUS=$(ssh $SERVER_USER@$SERVER_IP "ss -tlnp | grep :8036 | wc -l")
if [ "$BACKEND_STATUS" -gt 0 ]; then
    echo "✅ 后端服务正常 (端口8036已监听)"
else
    echo "❌ 后端服务异常 (端口8036未监听)"
fi

# 检查磁盘空间
echo "💾 检查磁盘空间..."
DISK_USAGE=$(ssh $SERVER_USER@$SERVER_IP "df -h /battery | tail -1 | awk '{print \$5}' | sed 's/%//'")
if [ "$DISK_USAGE" -lt 80 ]; then
    echo "✅ 磁盘空间充足 (使用率: ${DISK_USAGE}%)"
else
    echo "⚠️  磁盘空间不足 (使用率: ${DISK_USAGE}%)"
fi

# 检查最近的nginx错误日志
echo "📋 最近的nginx错误日志..."
ssh $SERVER_USER@$SERVER_IP "tail -5 /var/log/nginx/error.log 2>/dev/null | grep -v '^$' || echo '无错误日志'"

echo ""
echo "🎯 快速访问链接:"
echo "   前端: http://$SERVER_IP:8080/battery/"
echo "   API: http://$SERVER_IP:8080/battery/api/"
echo ""
echo "📊 状态总结:"
echo "   前端: $([ "$FRONTEND_STATUS" = "200" ] && echo "✅" || echo "❌")"
echo "   API: $([ "$API_STATUS" = "200" ] || [ "$API_STATUS" = "401" ] && echo "✅" || echo "❌")"
echo "   Nginx: $([ "$NGINX_STATUS" = "active" ] && echo "✅" || echo "❌")"
echo "   后端: $([ "$BACKEND_STATUS" -gt 0 ] && echo "✅" || echo "❌")"
echo ""
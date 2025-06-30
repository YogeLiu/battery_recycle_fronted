#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"
NGINX_CONF_PATH="/etc/nginx/conf.d/default.conf"
PROJECT_DIR="/battery"

echo "🚀 开始部署电池回收系统到测试环境..."

# 检查nginx配置文件是否存在
if [ ! -f "nginx-battery.conf" ]; then
    echo "❌ nginx-battery.conf 配置文件不存在！"
    exit 1
fi

# 构建测试环境版本
echo "📦 构建测试环境版本..."
npm run build:test

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "✅ 构建完成！"

# 创建服务器目录
echo "📁 创建服务器目录..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR/dist && chown -R www-data:www-data $PROJECT_DIR"

if [ $? -ne 0 ]; then
    echo "❌ 目录创建失败！"
    exit 1
fi

echo "✅ 目录创建完成！"

# 上传nginx配置文件
echo "🔧 上传nginx配置..."
scp nginx-battery.conf $SERVER_USER@$SERVER_IP:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ nginx配置上传失败！"
    exit 1
fi

# 备份并更新nginx配置
echo "💾 备份并更新nginx配置..."
ssh $SERVER_USER@$SERVER_IP "
    # 备份原配置
    cp $NGINX_CONF_PATH $NGINX_CONF_PATH.backup.\$(date +%Y%m%d_%H%M%S)
    
    # 应用新配置
    cp /tmp/nginx-battery.conf $NGINX_CONF_PATH
    
    # 测试nginx配置
    nginx -t
"

if [ $? -ne 0 ]; then
    echo "❌ nginx配置更新失败！"
    echo "🔄 正在恢复备份配置..."
    ssh $SERVER_USER@$SERVER_IP "cp $NGINX_CONF_PATH.backup.* $NGINX_CONF_PATH 2>/dev/null || true"
    exit 1
fi

echo "✅ nginx配置更新完成！"

# 上传前端文件
echo "📤 上传前端文件..."
scp -r dist/* $SERVER_USER@$SERVER_IP:$PROJECT_DIR/dist/

if [ $? -ne 0 ]; then
    echo "❌ 前端文件上传失败！"
    exit 1
fi

echo "✅ 前端文件上传完成！"

# 重新加载nginx
echo "🔄 重新加载nginx..."
ssh $SERVER_USER@$SERVER_IP "systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo "❌ nginx重新加载失败！"
    echo "🔍 检查nginx状态..."
    ssh $SERVER_USER@$SERVER_IP "systemctl status nginx"
    exit 1
fi

echo "✅ nginx重新加载完成！"

# 验证部署
echo "🔍 验证部署..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080/battery/)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 部署验证成功！"
else
    echo "⚠️  部署验证失败，HTTP状态码: $HTTP_STATUS"
fi

echo ""
echo "🎉 部署完成！"
echo "📖 前端地址: http://$SERVER_IP:8080/battery/"
echo "🔗 API地址: http://$SERVER_IP:8080/battery/api/"
echo "📋 日志查看: ssh $SERVER_USER@$SERVER_IP 'tail -f /var/log/nginx/error.log'"
echo ""

# 显示部署后的检查清单
echo "📝 部署后检查清单:"
echo "   □ 访问前端页面是否正常"
echo "   □ 登录功能是否正常"
echo "   □ API请求是否正常"
echo "   □ 检查nginx错误日志"
echo ""
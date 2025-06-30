#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"

echo "🔧 检查并修复nginx配置..."

# 检查nginx配置文件位置
echo "🔍 检查nginx配置文件..."
ssh $SERVER_USER@$SERVER_IP "
echo '=== 检查nginx配置文件位置 ==='
ls -la /etc/nginx/sites-available/ 2>/dev/null || echo '没有sites-available目录'
ls -la /etc/nginx/conf.d/ 2>/dev/null || echo '没有conf.d目录'
echo ''
echo '=== 检查当前活动配置 ==='
nginx -T 2>/dev/null | grep -A 5 -B 5 'server_name\|listen 8080' || echo '没有找到8080端口配置'
echo ''
echo '=== 检查nginx进程 ==='
ps aux | grep nginx
"

# 询问用户选择配置路径
echo ""
echo "请选择nginx配置文件路径："
echo "1) /etc/nginx/sites-available/default"
echo "2) /etc/nginx/conf.d/default.conf"
echo "3) 自定义路径"
read -r CHOICE

case $CHOICE in
    1)
        NGINX_CONF_PATH="/etc/nginx/sites-available/default"
        ;;
    2)
        NGINX_CONF_PATH="/etc/nginx/conf.d/default.conf"
        ;;
    3)
        echo "请输入nginx配置文件完整路径:"
        read -r NGINX_CONF_PATH
        ;;
    *)
        echo "❌ 无效选择！"
        exit 1
        ;;
esac

echo "📂 使用配置文件路径: $NGINX_CONF_PATH"

# 备份现有配置并应用新配置
echo "💾 备份并应用新配置..."
ssh $SERVER_USER@$SERVER_IP "
    # 备份现有配置
    if [ -f '$NGINX_CONF_PATH' ]; then
        cp '$NGINX_CONF_PATH' '$NGINX_CONF_PATH.backup.\$(date +%Y%m%d_%H%M%S)'
        echo '✅ 已备份现有配置'
    fi
    
    # 确保目录存在
    mkdir -p \$(dirname '$NGINX_CONF_PATH')
"

# 上传新配置
echo "📤 上传新配置..."
scp nginx-battery.conf $SERVER_USER@$SERVER_IP:/tmp/
ssh $SERVER_USER@$SERVER_IP "
    cp /tmp/nginx-battery.conf '$NGINX_CONF_PATH'
    echo '✅ 配置文件已更新'
"

# 创建项目目录
echo "📁 创建项目目录..."
ssh $SERVER_USER@$SERVER_IP "
    mkdir -p /battery/dist
    chown -R www-data:www-data /battery 2>/dev/null || chown -R nginx:nginx /battery 2>/dev/null || echo '⚠️  无法设置目录权限，请手动检查'
    echo '✅ 项目目录已创建'
"

# 测试nginx配置
echo "🧪 测试nginx配置..."
ssh $SERVER_USER@$SERVER_IP "nginx -t"

if [ $? -ne 0 ]; then
    echo "❌ nginx配置测试失败！"
    exit 1
fi

# 重新加载nginx
echo "🔄 重新加载nginx..."
ssh $SERVER_USER@$SERVER_IP "systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo "❌ nginx重新加载失败！"
    exit 1
fi

echo "✅ nginx配置修复完成！"

# 验证配置
echo "🔍 验证配置..."
sleep 2
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080/)

echo "HTTP状态码: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ]; then
    echo "✅ nginx配置验证成功！"
else
    echo "⚠️  nginx配置可能需要进一步调整"
fi

echo ""
echo "🎉 修复完成！现在请运行 ./deploy-test.sh 重新部署前端文件"
echo ""
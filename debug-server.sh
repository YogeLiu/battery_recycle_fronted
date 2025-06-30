#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"

echo "🔍 直接在服务器上排查问题..."

ssh $SERVER_USER@$SERVER_IP << 'EOF'
echo "=== 检查nginx配置和状态 ==="

# 1. 检查nginx进程和端口
echo "📡 检查nginx进程:"
ps aux | grep nginx

echo ""
echo "🔌 检查端口监听:"
ss -tlnp | grep :8080

echo ""
echo "📁 检查nginx配置文件位置:"
find /etc/nginx -name "*.conf" -type f | head -10

echo ""
echo "📄 检查主配置文件:"
if [ -f /etc/nginx/nginx.conf ]; then
    echo "nginx.conf 内容:"
    cat /etc/nginx/nginx.conf | grep -E "include|server|listen" -A 2 -B 2
fi

echo ""
echo "📂 检查sites-available目录:"
ls -la /etc/nginx/sites-available/ 2>/dev/null || echo "没有sites-available目录"

echo ""
echo "📂 检查conf.d目录:"
ls -la /etc/nginx/conf.d/ 2>/dev/null || echo "没有conf.d目录"

echo ""
echo "🔍 查找包含8080端口的配置:"
grep -r "8080" /etc/nginx/ 2>/dev/null || echo "没有找到8080端口配置"

echo ""
echo "📋 当前生效的nginx配置:"
nginx -T 2>/dev/null | grep -A 10 -B 5 "listen.*8080" || echo "没有8080端口配置"

echo ""
echo "📁 检查项目目录:"
ls -la /battery/ 2>/dev/null || echo "/battery 目录不存在"
ls -la /battery/dist/ 2>/dev/null || echo "/battery/dist 目录不存在"

echo ""
echo "📁 检查默认nginx根目录:"
ls -la /usr/share/nginx/html/ 2>/dev/null || echo "/usr/share/nginx/html 目录不存在"
ls -la /var/www/html/ 2>/dev/null || echo "/var/www/html 目录不存在"

echo ""
echo "📊 nginx错误日志最后20行:"
tail -20 /var/log/nginx/error.log 2>/dev/null || echo "无法读取错误日志"

echo ""
echo "📊 nginx访问日志最后10行:"
tail -10 /var/log/nginx/access.log 2>/dev/null || echo "无法读取访问日志"

echo ""
echo "🔄 测试nginx配置:"
nginx -t

EOF

echo ""
echo "🎯 排查完成！请检查上面的输出信息，然后告诉我："
echo "1. nginx主配置文件在哪里？"
echo "2. 哪个目录下有配置文件？(sites-available 还是 conf.d)"
echo "3. 是否有8080端口的配置？"
echo "4. /battery 目录是否存在？"
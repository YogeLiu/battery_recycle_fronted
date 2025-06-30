#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"

echo "🔧 修复nginx配置冲突..."

ssh $SERVER_USER@$SERVER_IP << 'EOF'

echo "=== 当前配置文件状态 ==="
echo "📁 conf.d目录:"
ls -la /etc/nginx/conf.d/

echo ""
echo "📁 sites-enabled目录:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "=== 备份现有配置 ==="
# 备份sites-enabled的配置（禁用它）
if [ -f /etc/nginx/sites-enabled/default ]; then
    mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.disabled
    echo "✅ 已禁用 sites-enabled/default"
fi

# 只保留一个主配置文件
echo ""
echo "=== 选择主配置文件 ==="
echo "现在我们将使用 /etc/nginx/conf.d/bitwsd.test.com.conf 作为主配置"
echo "备份并删除冲突的 default.conf"

if [ -f /etc/nginx/conf.d/default.conf ]; then
    mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.backup
    echo "✅ 已备份 default.conf"
fi

echo ""
echo "=== 更新主配置文件，添加battery配置 ==="

# 创建包含battery配置的完整配置
cat > /etc/nginx/conf.d/bitwsd.test.com.conf << 'CONFIG_EOF'
server {
    listen 8080;
    server_name _;
    
    # 根路径重定向到/doc_ai/
    location = / {
        return 301 /doc_ai/;
    }

    # 原有的doc_ai前端静态文件配置
    location /doc_ai/ {
        alias /doc_ai/dist/;
        try_files $uri $uri/ /doc_ai/index.html;
        index index.html;
    }
    
    # 新增：电池回收系统前端配置
    location /battery/ {
        alias /battery/dist/;
        try_files $uri $uri/ /battery/index.html;
        index index.html;
        
        # 启用gzip压缩
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
    
    # 新增：电池回收系统API代理
    location /battery/api/ {
        proxy_pass http://127.0.0.1:8036/jxc/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS设置
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
    
    # 日志配置
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
}
CONFIG_EOF

echo "✅ 已更新主配置文件"

echo ""
echo "=== 确保项目目录存在并有正确权限 ==="
mkdir -p /battery/dist
chown -R www-data:www-data /battery

echo ""
echo "=== 测试nginx配置 ==="
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx配置测试成功"
    echo ""
    echo "=== 重新加载nginx ==="
    systemctl reload nginx
    echo "✅ nginx已重新加载"
else
    echo "❌ nginx配置测试失败"
fi

EOF

echo ""
echo "🎉 冲突修复完成！"
echo ""
echo "现在重新部署前端文件..."
#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"

echo "🔧 修复SPA路由问题..."

ssh $SERVER_USER@$SERVER_IP << 'EOF'

echo "=== 备份当前配置 ==="
cp /etc/nginx/conf.d/bitwsd.test.com.conf /etc/nginx/conf.d/bitwsd.test.com.conf.backup.$(date +%Y%m%d_%H%M%S)

echo "=== 更新nginx配置以支持SPA路由 ==="

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
    
    # 电池回收系统前端配置 - 支持SPA路由
    location /battery/ {
        alias /battery/dist/;
        try_files $uri $uri/ /battery/index.html;
        index index.html;
        
        # 启用gzip压缩
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 电池回收系统API代理
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

echo "✅ nginx配置已更新"

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
    exit 1
fi

EOF

echo "🎉 SPA路由修复完成！"
echo ""
echo "📝 现在这些链接都应该可以直接访问了："
echo "   http://182.92.150.161:8080/battery/"
echo "   http://182.92.150.161:8080/battery/users"
echo "   http://182.92.150.161:8080/battery/categories"
echo "   http://182.92.150.161:8080/battery/inbound"
echo "   http://182.92.150.161:8080/battery/inventory"
echo ""
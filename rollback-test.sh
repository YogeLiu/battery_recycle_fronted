#!/bin/bash

# 配置变量
SERVER_IP="182.92.150.161"
SERVER_USER="root"
NGINX_CONF_PATH="/etc/nginx/conf.d/default.conf"

echo "🔙 开始回滚nginx配置..."

# 检查是否有备份文件
echo "🔍 查找备份文件..."
BACKUP_FILES=$(ssh $SERVER_USER@$SERVER_IP "ls -t $NGINX_CONF_PATH.backup.* 2>/dev/null | head -5")

if [ -z "$BACKUP_FILES" ]; then
    echo "❌ 没有找到备份文件！"
    exit 1
fi

echo "📋 找到以下备份文件:"
echo "$BACKUP_FILES" | nl

# 选择要回滚的备份
echo ""
echo "请选择要回滚到的备份文件编号 (1-5):"
read -r CHOICE

if ! [[ "$CHOICE" =~ ^[1-5]$ ]]; then
    echo "❌ 无效的选择！"
    exit 1
fi

# 获取选择的备份文件
SELECTED_BACKUP=$(echo "$BACKUP_FILES" | sed -n "${CHOICE}p")

if [ -z "$SELECTED_BACKUP" ]; then
    echo "❌ 无法获取备份文件！"
    exit 1
fi

echo "📂 选择的备份文件: $SELECTED_BACKUP"

# 确认回滚
echo ""
echo "⚠️  确认要回滚到这个配置吗？ (y/N)"
read -r CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "❌ 取消回滚操作"
    exit 0
fi

# 执行回滚
echo "🔄 执行回滚..."
ssh $SERVER_USER@$SERVER_IP "
    # 备份当前配置
    cp $NGINX_CONF_PATH $NGINX_CONF_PATH.before_rollback.\$(date +%Y%m%d_%H%M%S)
    
    # 恢复备份配置
    cp '$SELECTED_BACKUP' $NGINX_CONF_PATH
    
    # 测试nginx配置
    nginx -t
"

if [ $? -ne 0 ]; then
    echo "❌ nginx配置回滚失败！"
    exit 1
fi

# 重新加载nginx
echo "🔄 重新加载nginx..."
ssh $SERVER_USER@$SERVER_IP "systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo "❌ nginx重新加载失败！"
    exit 1
fi

echo "✅ nginx配置回滚完成！"

# 验证回滚
echo "🔍 验证回滚..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080/)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ]; then
    echo "✅ 回滚验证成功！"
else
    echo "⚠️  回滚验证失败，HTTP状态码: $HTTP_STATUS"
fi

echo ""
echo "🎉 回滚完成！"
echo "📖 访问地址: http://$SERVER_IP:8080/"
echo ""
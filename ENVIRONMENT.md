# 环境配置说明

## 环境类型

项目支持三种环境：

- **本地环境 (local)**: 本地开发使用
- **测试环境 (test)**: 测试服务器使用  
- **生产环境 (production)**: 生产服务器使用

## 环境配置文件

- `.env.local` - 本地开发环境配置
- `.env.test` - 测试环境配置
- `.env.production` - 生产环境配置

## 启动命令

### 开发模式

```bash
# 本地开发环境 (默认)
npm run dev

# 测试环境模式
npm run dev:test
```

### 构建命令

```bash
# 生产环境构建 (默认)
npm run build

# 测试环境构建
npm run build:test

# 本地环境构建
npm run build:local
```

### 预览命令

```bash
# 默认预览
npm run preview

# 测试环境预览
npm run preview:test
```

## API 地址配置

### 当前配置

- **本地环境**: `http://localhost:8036/jxc/v1`
- **测试环境**: `http://182.92.150.161:8036/jxc/v1`
- **生产环境**: `https://api.yourdomain.com/jxc/v1` (待配置)

### 修改API地址

编辑对应的环境文件，修改 `VITE_API_BASE_URL` 值：

```bash
# .env.production
VITE_API_BASE_URL=https://your-production-api.com/jxc/v1
```

## 环境指示器

非生产环境会在页面右上角显示环境标识：

- 🔵 **本地开发** - 蓝色标签
- 🟡 **测试环境** - 黄色标签
- 生产环境不显示任何标签

## 环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_APP_ENV` | 环境类型 | `local` / `test` / `production` |
| `VITE_API_BASE_URL` | API基础地址 | `http://localhost:8036/jxc/v1` |

## 自动环境检测

如果没有配置环境变量，系统会自动检测：

- 开发模式 (`vite dev`) → 本地环境
- 测试模式 (`vite --mode test`) → 测试环境  
- 构建模式 (`vite build`) → 生产环境

## 注意事项

1. 生产环境的API地址需要在部署前配置
2. 环境配置文件不要提交敏感信息
3. 本地开发建议使用 `.env.local` 配置个人设置
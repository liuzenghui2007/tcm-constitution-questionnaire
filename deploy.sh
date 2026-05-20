#!/bin/bash
# 构建并发布到远程服务器
# 用法: ./deploy.sh [端口号]
# 示例: ./deploy.sh       → 部署到 80 端口
#       ./deploy.sh 8080  → 部署到 8080 端口

set -e

PORT="${1:-80}"
REMOTE_USER="pt"
REMOTE_HOST="39.102.127.158"
REMOTE_DIR="tcm-constitution/${PORT}"
LOCAL_DIST="dist/spa"

echo "==> 构建项目..."
npx quasar build

echo "==> 部署到 ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR} (端口 ${PORT})"
ssh "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ~/${REMOTE_DIR}"
rsync -avz --delete "${LOCAL_DIST}/" "${REMOTE_USER}@${REMOTE_HOST}:~/${REMOTE_DIR}/"

echo "==> 部署完成！访问地址: http://${REMOTE_HOST}:${PORT}"

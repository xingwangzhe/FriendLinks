#!/bin/bash
# 遍历 YAML 文件，用 crwl 爬取友链页面并更新 friends
# 用法: bash scripts/update-links.sh [batch_size] [start_index]

set -e

BATCH_SIZE=${1:-10}
START=${2:-0}

YML_DIR="/home/xingwangzhe/桌面/前端项目/FriendLinks/links"
DONE_FILE="/tmp/links_done.txt"
touch "$DONE_FILE"

# 找到有 links 字段且不是 "/" 的 YAML
mapfile -t FILES < <(grep -l "^  links:" "$YML_DIR"/*.yml | grep -v "links: '/'\|links: \"\"" ) 

TOTAL=${#FILES[@]}
echo "共 $TOTAL 个有友链路由的 YAML 文件"

count=0
processed=0

for yml in "${FILES[@]}"; do
  # 跳过已处理的
  basename "$yml" | grep -qf "$DONE_FILE" && continue
  
  if ((count < START)); then
    ((count++))
    continue
  fi

  # 读取 URL 和 links 路径
  url=$(grep "^  url:" "$yml" | head -1 | sed 's/^  url: *"*\([^"]*\)"*/\1/')
  links_path=$(grep "^  links:" "$yml" | head -1 | sed 's/^  links: *"*\([^"]*\)"*/\1/')
  
  # 跳过无 URL 或 links_path 为 / 或空的
  [[ -z "$url" ]] && continue
  [[ "$links_path" == "/" || "$links_path" == "" ]] && continue
  
  # 构建友链页面完整 URL
  friend_url="${url%/}${links_path}"
  
  echo "[$((processed+1))/$BATCH_SIZE] $friend_url"
  
  # 用 crwl 爬取
  output=$(crwl "$friend_url" -o md 2>/dev/null) || { echo "  ✗ 爬取失败"; ((count++)); continue; }
  
  # 提取所有外部链接 (格式: [名称](URL))
  # 过滤: 不同域名、非 javascript、非图片
  host=$(echo "$url" | sed 's|https\?://||' | sed 's|/.*||')
  links=$(echo "$output" | grep -oP '\[([^\]]+)\]\(https?://[^)]+\)' | 
    grep -v "$host" | 
    grep -v 'javascript:' |
    sed 's/^\[\(.*\)\](\(.*\))/\1|\2/' |
    head -200)
  
  link_count=$(echo "$links" | grep -c '|' || echo 0)
  
  if (( link_count < 3 )); then
    echo "  ✗ 链接太少 ($link_count)"
    echo "$basename" >> "$DONE_FILE"
    ((count++))
    continue
  fi
  
  # 生成新的 friends 段
  new_friends=""
  while IFS='|' read -r name friend_url; do
    # 清理名称
    name=$(echo "$name" | sed 's/^ *//;s/ *$//')
    [[ -z "$name" || ${#name} -gt 60 ]] && continue
    [[ "$friend_url" == "$url"* ]] && continue
    new_friends+="    - name: $name\n      url: $friend_url\n"
  done < <(echo "$links")
  
  friend_total=$(echo -e "$new_friends" | grep -c "name:" || echo 0)
  
  if (( friend_total < 3 )); then
    echo "  ✗ 有效友链太少 ($friend_total)"
  else
    # 备份原文件
    cp "$yml" "${yml}.bak"
    
    # 替换 friends 段
    # 找到 friends: 行号
    friends_line=$(grep -n "^  friends:" "$yml" | head -1 | cut -d: -f1)
    if [[ -n "$friends_line" ]]; then
      head -n "$friends_line" "$yml" > "${yml}.tmp"
      echo -e "$new_friends" >> "${yml}.tmp"
      mv "${yml}.tmp" "$yml"
      echo "  ✓ 更新 $friend_total 条友链"
    fi
  fi
  
  echo "$basename" >> "$DONE_FILE"
  
  ((count++))
  ((processed++))
  
  if (( processed >= BATCH_SIZE )); then
    echo "--- 完成一批 $BATCH_SIZE ---"
    break
  fi
done

echo "处理完成: $processed 个文件"

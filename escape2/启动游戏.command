#!/bin/zsh

set -u

PROJECT_DIR="${0:A:h}"
PROJECT_KEY="$(print -rn -- "$PROJECT_DIR" | /usr/bin/shasum | /usr/bin/awk '{print substr($1, 1, 12)}')"
STATE_DIR="${TMPDIR:-/tmp}/escape-location-test-bridge-copy-2-launcher-${PROJECT_KEY}"
PID_FILE="${STATE_DIR}/server.pid"
PORT_FILE="${STATE_DIR}/server.port"
LOG_FILE="${STATE_DIR}/server.log"
START_PORT=43871
END_PORT=43920
STARTED_SERVER=0

mkdir -p "$STATE_DIR"

server_is_running() {
  [[ -f "$PID_FILE" && -f "$PORT_FILE" ]] || return 1

  local saved_pid saved_port
  saved_pid="$(<"$PID_FILE")"
  saved_port="$(<"$PORT_FILE")"

  [[ "$saved_pid" == <-> && "$saved_port" == <-> ]] || return 1
  kill -0 "$saved_pid" 2>/dev/null || return 1
  /usr/bin/curl --silent --fail --max-time 1 \
    "http://127.0.0.1:${saved_port}/index.html" >/dev/null 2>&1 || return 1

  PORT="$saved_port"
  return 0
}

find_available_port() {
  local candidate=$START_PORT
  while (( candidate <= END_PORT )); do
    if ! /usr/sbin/lsof -nP -iTCP:"$candidate" -sTCP:LISTEN >/dev/null 2>&1; then
      PORT="$candidate"
      return 0
    fi
    (( candidate += 1 ))
  done
  return 1
}

show_error() {
  /usr/bin/osascript -e "display alert \"无法启动游戏\" message \"$1\" as critical" >/dev/null 2>&1
}

if ! server_is_running; then
  if ! find_available_port; then
    show_error "没有找到可用的本地端口。"
    exit 1
  fi

  cd "$PROJECT_DIR" || exit 1
  SERVER_CODE=$'import functools\nimport sys\nfrom http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer\n\nclass NoCacheHandler(SimpleHTTPRequestHandler):\n    def end_headers(self):\n        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")\n        self.send_header("Pragma", "no-cache")\n        self.send_header("Expires", "0")\n        super().end_headers()\n\nport = int(sys.argv[1])\ndirectory = sys.argv[2]\nhandler = functools.partial(NoCacheHandler, directory=directory)\nThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()'
  nohup /usr/bin/python3 -c "$SERVER_CODE" "$PORT" "$PROJECT_DIR" \
    </dev/null >"$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  STARTED_SERVER=1
  print -r -- "$SERVER_PID" >| "$PID_FILE"
  print -r -- "$PORT" >| "$PORT_FILE"

  for _ in {1..20}; do
    if /usr/bin/curl --silent --fail "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1; then
      break
    fi
    /bin/sleep 0.1
  done

  if ! /usr/bin/curl --silent --fail "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1; then
    show_error "本地预览服务启动失败，请查看：${LOG_FILE}"
    exit 1
  fi
fi

LAUNCH_TOKEN="$(/bin/date +%s)"
GAME_URL="http://127.0.0.1:${PORT}/index.html?launch=${LAUNCH_TOKEN}"
if ! /usr/bin/open -a "Google Chrome" "$GAME_URL"; then
  /usr/bin/open "$GAME_URL"
fi

if (( STARTED_SERVER == 1 )); then
  print "游戏已在浏览器中打开，本地预览服务正在运行。"
  print "保留此终端窗口可继续刷新页面。"
  wait "$SERVER_PID"
fi

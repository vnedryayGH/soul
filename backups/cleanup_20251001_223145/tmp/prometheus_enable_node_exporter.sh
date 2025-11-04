#!/usr/bin/env bash
set -euo pipefail

CFG="/etc/prometheus/prometheus.yml"
RULE_PATH="/etc/prometheus/rules/rules_rs_actors.yml"

cp "$CFG" "$CFG.bak"

# Ensure rules file included
if ! grep -q "$RULE_PATH" "$CFG"; then
  # Insert after rule_files: line
  sed -i "/^rule_files:/a\  - $RULE_PATH" "$CFG"
fi

# Ensure node_exporter scrape job
if ! grep -q "job_name: node_exporter" "$CFG"; then
  awk '
    BEGIN{added=0}
    {print}
    /^scrape_configs:/ && added==0 {
      print "  - job_name: node_exporter";
      print "    static_configs:";
      print "      - targets: [\"127.0.0.1:9100\"]";
      added=1
    }
  ' "$CFG" > "$CFG.tmp" && mv "$CFG.tmp" "$CFG"
fi

systemctl restart prometheus
sleep 1
systemctl is-active prometheus

echo OK: prometheus updated


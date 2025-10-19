#!/usr/bin/env bash
set -euo pipefail

# Ensure node exporter with textfile collector is running

need_install=true
if systemctl list-unit-files | grep -q '^prometheus-node-exporter.service'; then
  need_install=false
fi

if $need_install; then
  apt-get update -y
  DEBIAN_FRONTEND=noninteractive apt-get install -y prometheus-node-exporter
fi

SVC="prometheus-node-exporter"
if ! systemctl list-unit-files | grep -q '^prometheus-node-exporter.service'; then
  if systemctl list-unit-files | grep -q '^node_exporter.service'; then
    SVC="node_exporter"
  fi
fi

BIN="/usr/bin/prometheus-node-exporter"
if [ "$SVC" = "node_exporter" ]; then
  BIN="$(command -v node_exporter || echo /usr/local/bin/node_exporter)"
else
  BIN="$(command -v prometheus-node-exporter || echo /usr/bin/prometheus-node-exporter)"
fi

mkdir -p /var/lib/node_exporter/textfile

mkdir -p "/etc/systemd/system/${SVC}.service.d"
cat > "/etc/systemd/system/${SVC}.service.d/override.conf" <<OVR
[Service]
ExecStart=
ExecStart=${BIN} --collector.textfile --collector.textfile.directory=/var/lib/node_exporter/textfile
OVR

systemctl daemon-reload
systemctl restart "$SVC"
sleep 1
systemctl is-active "$SVC"

# Seed metrics if missing
[ -s /var/lib/node_exporter/textfile/age_coverage.prom ] || echo "age_coverage_fraction 0" > /var/lib/node_exporter/textfile/age_coverage.prom
[ -s /var/lib/node_exporter/textfile/age_sync.prom ] || { echo "age_sync_lag_sec 0" > /var/lib/node_exporter/textfile/age_sync.prom; }

echo "OK: ${SVC} running with textfile collector"


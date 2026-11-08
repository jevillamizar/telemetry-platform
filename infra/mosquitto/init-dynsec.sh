#!/bin/sh
# Inicializa Mosquitto Dynamic Security en el primer arranque (idempotente).
# Si /mosquitto/data/dynamic-security.json ya existe, no se toca: se asume
# que el admin y el cliente de servicio ya fueron creados. Ver ADR 0004.
set -e

CONFIG_FILE="/mosquitto/data/dynamic-security.json"
MOSQUITTO_CONF="/mosquitto/config/mosquitto.conf"

if [ -f "$CONFIG_FILE" ]; then
  echo "init-dynsec: $CONFIG_FILE ya existe, no se modifica."
  exec mosquitto -c "$MOSQUITTO_CONF"
fi

: "${MOSQUITTO_ADMIN_USERNAME:?init-dynsec: falta MOSQUITTO_ADMIN_USERNAME}"
: "${MOSQUITTO_ADMIN_PASSWORD:?init-dynsec: falta MOSQUITTO_ADMIN_PASSWORD}"
: "${MQTT_SERVICE_USERNAME:?init-dynsec: falta MQTT_SERVICE_USERNAME}"
: "${MQTT_SERVICE_PASSWORD:?init-dynsec: falta MQTT_SERVICE_PASSWORD}"

echo "init-dynsec: creando $CONFIG_FILE con el admin \"$MOSQUITTO_ADMIN_USERNAME\"..."
mosquitto_ctrl dynsec init "$CONFIG_FILE" "$MOSQUITTO_ADMIN_USERNAME" "$MOSQUITTO_ADMIN_PASSWORD"
# mosquitto_ctrl corre como root y deja el archivo root:root 0640; el broker baja
# privilegios al usuario "mosquitto" por defecto (ver mosquitto.conf(5), opción "user"),
# así que sin este chown no puede releerlo.
chown mosquitto:mosquitto "$CONFIG_FILE"

echo "init-dynsec: arrancando broker temporal para crear el rol y el cliente de servicio..."
mosquitto -c "$MOSQUITTO_CONF" &
MOSQUITTO_PID=$!
trap 'kill "$MOSQUITTO_PID" 2>/dev/null || true' EXIT

ctrl() {
  mosquitto_ctrl -h 127.0.0.1 -p 1883 -u "$MOSQUITTO_ADMIN_USERNAME" -P "$MOSQUITTO_ADMIN_PASSWORD" dynsec "$@"
}

i=0
until ctrl listRoles >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "init-dynsec: el broker temporal no respondió a tiempo" >&2
    exit 1
  fi
  sleep 1
done

echo "init-dynsec: broker listo, creando rol \"service-subscriber\" y cliente de servicio..."
ctrl createRole "service-subscriber"
ctrl addRoleACL "service-subscriber" subscribeLiteral "devices/+/telemetry" allow
ctrl createClient "$MQTT_SERVICE_USERNAME" -p "$MQTT_SERVICE_PASSWORD"
ctrl addClientRole "$MQTT_SERVICE_USERNAME" "service-subscriber"

echo "init-dynsec: configuración inicial completa, deteniendo broker temporal..."
kill "$MOSQUITTO_PID"
wait "$MOSQUITTO_PID" 2>/dev/null || true
trap - EXIT

echo "init-dynsec: arrancando broker definitivo..."
exec mosquitto -c "$MOSQUITTO_CONF"

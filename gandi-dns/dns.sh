#!/bin/bash

CURRENT_IP=$(curl -s http://whatismyip.akamai.com/)

# Gandi livedn API KEY
API_KEY="...."

# Domain to update
DOMAIN="example.com"

# Dynamic Subdomains (space separated)
SUBDOMAINS=(test test2)

CURRENT_ZONE_HREF=$(curl -s -H "X-Api-Key: $API_KEY" https://dns.api.gandi.net/api/v5/domains/$DOMAIN | jq -r '.zone_records_href')

for SUBDOMAIN in ${SUBDOMAINS[*]}
do
    curl -D- -X PUT -H "Content-Type: application/json" \
        -H "X-Api-Key: $API_KEY" \
        -d "{\"rrset_name\": \"$SUBDOMAIN\",
             \"rrset_type\": \"A\",
             \"rrset_ttl\": 300,
             \"rrset_values\": [\"$CURRENT_IP\"]}" \
        $CURRENT_ZONE_HREF/$SUBDOMAIN/A
done

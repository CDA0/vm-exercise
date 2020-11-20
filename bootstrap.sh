#! /bin/bash

SUBSCRIPTION_ID="3a1e574b-7f7b-4062-ada1-1bb56dc589c3"
LOCATION="ukwest"
RG_NAME="rg-vmexample-core"

# Login and set subscription
az login
az account set --subscription="$SUBSCRIPTION_ID"

# Create a service principal
SP=$(az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$SUBSCRIPTION_ID")

# Create Resource Group
az group create --name $RG_NAME --location $LOCATION

# Create a storage account for remote state (Disabling the firewall is not great)
az storage account create \
  --name stg0nonprod0tfstate \
  --resource-group $RG_NAME \
  --location $LOCATION \
  --default-action Allow

# Create a keyvault and key to encrypt secrets
az keyvault create \
  --name kv-nonprod-secretkeys \
  --resource-group $RG_NAME \
  --location $LOCATION \
  --sku premium \
  --enable-soft-delete true \
  --default-action Allow

KEY=$(az keyvault key create \
  --vault-name kv-nonprod-secretkeys \
  --name nonprod \
  --protection hsm \
  --size 4096 \
  --ops encrypt decrypt)

# Write secrets to file
echo $SP $KEY | jq -s add | jq '{ clientId: .appId, clientSecret: .password, tenantId: .tenant, subscriptionId: "$SUBSCRIPTION_ID", keyId: .key.kid }' | envsubst > secrets.json

# Store secrets in a variable group (Not a secure way to do this!!)
VARIABLES=$(jq -r -M 'keys[] as $k | $k, .[$k]' secrets.json | xargs -n2 -d'\n' | sed 's/ /=/' | xargs -n5 -d'\n')

VG=$(az pipelines variable-group create \
  --name spcreds \
  --authorize true \
  --variables $VARIABLES \
  --org https://dev.azure.com/craiganderson0 \
  --project VM)

VG_ID=$(jq -r '.id' <<< $VG)

VARIABLE_NAMES=$(jq -r 'keys[]' secrets.json)

echo $VARIABLE_NAMES | xargs -n1 \
  az pipelines variable-group variable update \
  --org https://dev.azure.com/craiganderson0 \
  --project VM \
  --secret true \
  --group-id $VG_ID \
  --name

# Create container for remote state
STG_KEY=$(az storage account keys list --account-name stg0nonprod0tfstate --query '[0].value' --out tsv)
az storage container create --name terraform --account-name stg0nonprod0tfstate --auth-mode key --account-key $STG_KEY

az logout

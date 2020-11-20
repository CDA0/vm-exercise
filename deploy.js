#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Terrajs = require('@cda0/terrajs');

const terraformContainerName = 'terraform';
const terraformDir = path.join(__dirname, 'terraform');
const terraformStateKey = 'terraform.tfstate';
const terraformStorageAccountName = 'stg0nonprod0tfstate';
const terraformStorageAccountResourceGroupName = 'rg-vmexample-core';

const {
  ARM_CLIENT_ID: clientId,
  ARM_CLIENT_SECRET: clientSecret,
} = process.env;

const deploy = async () => {
  const tf = new Terrajs({ terraformDir });

  await tf.init({
    backendConfig: {
      containerName: terraformContainerName,
      key: terraformStateKey,
      resourceGroupName: terraformStorageAccountResourceGroupName,
      storageAccountName: terraformStorageAccountName,
    },
  });

  await tf.plan({
    out: 'terraform.tfplan',
    var: {
      identifier: 'containerexample',
      location: 'ukwest',
      clientId,
      clientSecret,
    },
  });

  await tf.apply({
    plan: 'terraform.tfplan',
  });

  const outputs = JSON.parse(await tf.output({ json: true }));

  fs.writeFileSync(path.join(process.cwd(), 'kubeconfig'), outputs.kube_config.value, 'utf8');
};

deploy()
  .then(() => process.exit())
  .catch((err) => {
    console.log(err); // eslint-disable-line no-console
    process.exit(1);
  });

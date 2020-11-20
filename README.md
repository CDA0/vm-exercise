# Azure Pipeline Exercise

## Bootstrapping

To start with a few things need to be in place.

We can assume that:
  * A subscription has been created in Azure and the ID sent to us.
  * Our user has contributor access to that subscription.
  * Our user has god rights in ADO and has a PAT token on the environment at `AZURE_DEVOPS_EXT_PAT`

We can then run the `bootstrap.sh` script that will create:
  * A Service Principal with Contributor access to the subscription
  * A Storage Account to hold terraform remote state
  * A Keyvault and Key which will be used to encrypt and decrypt secrets

For the purpose of this exercise it is assumed that no firewall is required on
any services built.

The script will then load the variables into a variable group (which would be
keyvault backed typically) and ensure that they are kept secret.

No effort has been made to make the script idempotent.

## ACR

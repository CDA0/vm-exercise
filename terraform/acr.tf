resource "azurerm_container_registry" "main" {
  name                = "acr0${var.identifier}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Premium"
  admin_enabled       = false

  network_rule_set {
    default_action = "Allow"
  }
}

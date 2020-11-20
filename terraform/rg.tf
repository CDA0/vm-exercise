resource "azurerm_resource_group" "main" {
  name     = "rg-${var.identifier}"
  location = var.location

  tags = {
    reason = "example"
  }
}

resource "azurerm_kubernetes_cluster" "main" {
  name                = "aks-${var.identifier}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  dns_prefix          = "vmexampleaks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  addon_profile {
    kube_dashboard {
      enabled = true
    }
  }

  tags = {
    Environment = "Production"
  }
}

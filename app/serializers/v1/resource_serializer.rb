module V1
  class ResourceSerializer < ActiveModel::Serializer
    attributes :id, :role, :name, :client_rate, :resource_rate
    def client_rate
      sprintf "$%.1f", object.client_rate.round(1)
    end

    def resource_rate
      sprintf "$%.1f", object.resource_rate.round(1)
    end
  end
end

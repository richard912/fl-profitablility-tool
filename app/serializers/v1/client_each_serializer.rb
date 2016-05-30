module V1
  class ClientEachSerializer < ActiveModel::Serializer

    attributes :id, :name, :industry, :location, :size, :project_types, :estimated_gross_info
    
    def project_types
      object.created.parent.project_types
    end

    def estimated_gross_info
      object.estimated_gross_info
    end
  end
end

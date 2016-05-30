module V1
  class ClientSerializer < ActiveModel::Serializer

    attributes :id, :name, :industry, :location, :size, :project_types
    has_many :projects, :serializer => ProjectEachSerializer

    def project_types
      object.created.parent.project_types
    end
  end
end

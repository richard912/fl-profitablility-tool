module V1
  class SessionSerializer < ActiveModel::Serializer

    attributes :id, :email, :token_type, :access_token, :name, :step, :organisation_name
    # has_one :assigned, :serializer => SessionSerializer

    def token_type
      'Bearer'
    end
    
  end
end

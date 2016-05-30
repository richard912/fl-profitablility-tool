class Resource < ActiveRecord::Base
	belongs_to :project

  before_save :validate_fields

	has_many :resource_timelines, -> { order 'resource_timelines.id ASC' }, dependent: :destroy

	# validates :store_username, :presence => true, :uniqueness => true

	validates :project_id, :presence => true
	scope :default, -> {order('created_at asc')}

  def validate_fields
    self.client_rate = 0 if self.client_rate.nil?
    self.resource_rate = 0 if self.resource_rate.nil?
  end
end

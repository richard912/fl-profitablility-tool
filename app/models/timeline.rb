class Timeline < ActiveRecord::Base

	belongs_to :project
  has_many :resource_timelines,  -> { order 'resource_timelines.id ASC' }, dependent: :destroy

	scope :default, -> {order('created_at asc')}
end

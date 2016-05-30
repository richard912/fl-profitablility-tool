class ResourceTimeline < ActiveRecord::Base
	belongs_to :resource
	belongs_to :timeline

	before_save :validate_fields

	def self.get_resource_time(timeline, resource)
		resource_timeline = ResourceTimeline.where(:resource_id => resource.id, :timeline_id => timeline.id).first
		if resource_timeline.blank?
			resource_timeline = ResourceTimeline.new(:resource_id => resource.id, :timeline_id => timeline.id)
			resource_timeline.save
		end
		resource_timeline
	end

	def validate_fields
    self.hours = 0 if self.hours.nil?
  end
end

class Project < ActiveRecord::Base

	belongs_to :client

	has_many :resources, -> { order 'resources.id ASC' }, dependent: :destroy
	has_many :timelines, -> { order 'timelines.id ASC' }, dependent: :destroy

  has_many :estimated_resources, -> { where(:is_estimated => true).order('id ASC') }, :class_name => "Resource", :foreign_key => "project_id"
  has_many :actual_resources, -> { where(:is_estimated => false).order('id ASC') }, :class_name => "Resource", :foreign_key => "project_id"

  has_many :estimated_timelines, -> { where(:is_estimated => true).order('id ASC') }, :class_name => "Timeline", :foreign_key => "project_id"
  has_many :actual_timelines, -> { where(:is_estimated => false).order('id ASC') }, :class_name => "Timeline", :foreign_key => "project_id"
	# enum project_type: {
	# 	web_app: 0,
	# 	mobile_app: 1,
	# 	web_production: 2
	# }

  def create_resource_timelines_by_timeline(timeline)
    self.resources.each do |resource|
      resource_timeline = ResourceTimeline.new(:resource_id => resource.id, :timeline_id => timeline.id)
      resource_timeline.save
    end
  end

  def create_resource_timelines_by_resource(resource)
    self.timelines.each do |timeline|
      resource_timeline = ResourceTimeline.new(:resource_id => resource.id, :timeline_id => timeline.id)
      resource_timeline.save
    end
  end

  def estimated_gross_info
    
    gross_revenue = gross_expense = gross_profit = gross_margin = 0.0
    self.estimated_resources.each do |resource|
      resource.resource_timelines.each do |resource_timeline|
        hours = resource_timeline.hours
        gross_revenue += hours * resource.client_rate
        gross_expense += hours * resource.resource_rate
        gross_profit += hours * (resource.client_rate - resource.resource_rate)
      end
    end
    gross_revenue = gross_revenue.round(2)
    gross_expense = gross_expense.round(2)
    gross_profit = gross_profit.round(2)
    if gross_revenue > 0
      gross_margin = (gross_profit / gross_revenue * 100).round(2)
    end
    {
      gross_revenue: gross_revenue,
      gross_expense: gross_expense,
      gross_profit: gross_profit,
      gross_margin: gross_margin,
    }
  end

  def actual_gross_info
    gross_revenue = gross_expense = gross_profit = gross_margin = 0.0
    self.actual_resources.each do |resource|
      resource.resource_timelines.each do |resource_timeline|
        hours = resource_timeline.hours
        gross_revenue += hours * resource.client_rate
        gross_expense += hours * resource.resource_rate
        gross_profit += hours * (resource.client_rate - resource.resource_rate)
      end
    end
    gross_revenue = gross_revenue.round(2)
    gross_expense = gross_expense.round(2)
    gross_profit = gross_profit.round(2)
    if gross_revenue > 0
      gross_margin = (gross_profit / gross_revenue * 100).round(2)
    end
    {
      gross_revenue: gross_revenue,
      gross_expense: gross_expense,
      gross_profit: gross_profit,
      gross_margin: gross_margin,
    }

  end
end

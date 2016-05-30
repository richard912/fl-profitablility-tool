class Client < ActiveRecord::Base

	belongs_to :created, :class_name => "User", :foreign_key => "created_by_id"
  belongs_to :primary_user, :class_name => "User", :foreign_key => "primary_user_id"

  has_many :projects, dependent: :destroy

	enum size: {
		client_size: 0, 
		mobile_app: 1,
		web_app: 2,
		website_production: 3
	}

  def estimated_gross_info
    gross_revenue = gross_expense = gross_profit = gross_margin = 0.0
    self.projects.each do |project|
      project_gross_info = project.estimated_gross_info
      gross_revenue += project_gross_info[:gross_revenue]
      gross_expense += project_gross_info[:gross_expense]
      gross_profit += project_gross_info[:gross_profit]
    end

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

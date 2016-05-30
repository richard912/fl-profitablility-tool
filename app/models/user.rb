class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  serialize :tags, Array

  has_many :project_types
  has_many :clients, :class_name => "Client", :foreign_key => "created_by_id"
  has_many :all_clients, :class_name => "Client", :foreign_key => "primary_user_id"

  has_many :children, :class_name => 'User', :foreign_key => 'created_by_id'
  belongs_to :owner, :class_name => 'User', :foreign_key => 'created_by_id'

  # belongs_to :parent, :class_name => "User", :foreign_key => "created_by_id"

  after_create :update_access_token!

  enum user_type: {
    normal: 0,
    admin: 1,
    super_amdin: 2
  }

  def parent
    self.created_by_id == 0 ? self : User.find(self.created_by_id)
  end

  def update_access_token!
    self.access_token = generate_access_token
    self.email = self.email.downcase
    save
  end

  def generate_access_token
    loop do
      token = "#{self.id}:#{Devise.friendly_token}"
      break token unless User.where(access_token: token).first
    end
  end

  # has_many 
end

module V1
	class ResourcesController < ApplicationApiController
		before_action :set_resource, only: [:show, :edit, :update, :destroy]
		before_action :set_project

		def new
		end

		def index
			@resources = @project.resources.default
			render json: @resources, each_serializer: ResourceSerializer
		end

		def create
			@resource = Resource.new(resource_params)
			@resource.project = @project
			if @resource.save
				# render json: @resource, serializer: ResourceSerializer
				@project.create_resource_timelines_by_resource(@resource)
				render json: @project, serializer: ProjectSerializer
			else
				render json: { error: 'create_resource_error', error_messages: 'There is a error while saving a resource' }, status: 401
			end
		end

		def update
			# @resource 
			@resource.role = params[:resource][:role]
			@resource.name = params[:resource][:name]
			@resource.client_rate = params[:resource][:client_rate].gsub(/[^0-9.]/, '')
			@resource.resource_rate = params[:resource][:resource_rate].gsub(/[^0-9.]/, '')
			if @resource.save
				render json: @resource, serializer: ResourceSerializer
				# render json: @project, serializer: ProjectSerializer
			else
				render json: { error: 'update_resource_error', error_messages: 'There is a error while saving a resource' }, status: 401
			end
		end

		def show
			render json: @resource, serializer: ResourceSerializer
		end

		def destroy
			@resource.destroy
			render json: @project, serializer: ProjectSerializer
		end

		private

			def set_project
				@project = Project.find(params[:project_id])
			end

			def set_resource
				@resource = Resource.find(params[:id])
			end

			def resource_params
				params.require(:resource).permit(:role, :name, :client_rate, :resource_rate, :is_estimated)
			end
			
	end
end
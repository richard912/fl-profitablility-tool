module V1
	class ProjectsController < ApplicationApiController
		before_action :set_project, only: [:show, :edit, :update, :destroy]

		def new
		end

		def index
			@client = Client.find(params[:client_id])
			@projects = @client.projects
			render json: @projects, each_serializer: ProjectSerializer
		end

		def create
			@client = Client.find(params[:client_id])
			@project = Project.new(project_params)
			@project.client_id = @client.id
			@project.created_by_id = current_user.id
			if @project.save
				# render json: @project, serializer: ProjectSerializer
				render json: @client, serializer: ClientSerializer
			else
				render json: { error: 'create_project_error', error_messages: 'There is a error while saving a project' }, status: 401
			end
		end

		def destroy
			@project.destroy
			render json: { success: 'success'}, status: 200
		end

		def update
			# @project 
			if @project.update_attributes(project_params)
				render json: @project, serializer: ProjectSerializer
			else
				render json: { error: 'update_project_error', error_messages: 'There is a error while saving a project' }, status: 401
			end
		end

		def show
			render json: @project, serializer: ProjectSerializer
		end

		private
			def project_params
				params.require(:project).permit(:name, :project_type)
			end

			def set_project
				@project = Project.find(params[:id])
			end
	end
end
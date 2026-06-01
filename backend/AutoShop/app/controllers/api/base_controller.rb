module Api
  class BaseController < ActionController::API
    include JwtAuthenticatable

    rescue_from ActionController::ParameterMissing, with: :render_bad_request
    rescue_from ActiveRecord::RecordNotFound,       with: :render_not_found

    private

    def render_error(error:, message:, status:)
      render json: { error: error, message: message }, status: status
    end

    def render_bad_request(exception)
      render_error(error: "bad_request", message: exception.message, status: :bad_request)
    end

    def render_not_found(_exception = nil)
      render_error(error: "not_found", message: "Ресурс не найден", status: :not_found)
    end
  end
end

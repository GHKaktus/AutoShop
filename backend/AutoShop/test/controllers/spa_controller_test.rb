require "test_helper"

class SpaControllerTest < ActionDispatch::IntegrationTest
  test "GET / returns html file when spa index exists" do
    get "/"

    assert_response :success
    assert_equal "text/html", response.media_type
  end
end

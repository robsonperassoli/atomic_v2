defmodule AtomicWeb.Router do
  use AtomicWeb, :router

  import AtomicWeb.UserAuth

  pipeline :browser do
    plug :fetch_current_user
  end

  pipeline :auth do
    plug Ueberauth
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_current_user
  end

  pipeline :graphql do
    plug AtomicWeb.Schema.Context
  end

  scope "/auth", AtomicWeb do
    pipe_through :browser

    get "/logout", AuthController, :logout

    scope "/" do
      pipe_through [:redirect_if_user_is_authenticated, :auth]

      get "/:provider", AuthController, :request
      get "/:provider/callback", AuthController, :callback
    end
  end

  scope "/api", AtomicWeb do
    pipe_through :api
  end

  scope "/api/graphql" do
    pipe_through :graphql

    forward "/", Absinthe.Plug, schema: AtomicWeb.Schema
  end

  if Mix.env() == :dev do
    scope "/graphiql" do
      pipe_through :graphql

      forward "/",
              Absinthe.Plug.GraphiQL,
              schema: AtomicWeb.Schema,
              interface: :playground,
              socket: AtomicWeb.Socket
    end
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: AtomicWeb.Telemetry
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
